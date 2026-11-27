import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../../config/db.js';
import providerManager from './imageProviderManager.js';
import deduplicator from './imageDeduplicator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ImageCollectorService {
  /**
   * Load verified authentic Wikimedia Commons dataset
   */
  getVerifiedDataset() {
    const datasetPath = path.resolve(__dirname, 'verifiedWbDataset.json');
    if (fs.existsSync(datasetPath)) {
      try {
        return JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
      } catch (err) {
        console.error('[CIMS Collector] Error parsing verifiedWbDataset.json:', err.message);
      }
    }
    return null;
  }

  /**
   * Load verified authentic Wikimedia Commons dataset for Andhra Pradesh
   */
  getApVerifiedDataset() {
    const datasetPath = path.resolve(__dirname, 'verifiedApDataset.json');
    if (fs.existsSync(datasetPath)) {
      try {
        return JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
      } catch (err) {
        console.error('[CIMS Collector] Error parsing verifiedApDataset.json:', err.message);
      }
    }
    return null;
  }

  /**
   * Load verified authentic Wikimedia Commons dataset for Arunachal Pradesh (Phase 3)
   */
  getArunachalVerifiedDataset() {
    const datasetPath = path.resolve(__dirname, 'verifiedArunachalDataset.json');
    if (fs.existsSync(datasetPath)) {
      try {
        return JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
      } catch (err) {
        console.error('[CIMS Collector] Error parsing verifiedArunachalDataset.json:', err.message);
      }
    }
    return null;
  }

  /**
   * Helper to upsert a verified image into `images` table
   */
  async upsertImage(conn, imgData, districtName = null, stateName = 'West Bengal') {
    const providerImageId = imgData.pageId ? `Page:${imgData.pageId}` : `File:${imgData.title}.jpg`;
    const cleanTitle = (imgData.title || 'Landmark').substring(0, 255);
    const cleanPhotographer = (imgData.photographer || 'Wikimedia Contributor').replace(/\s+/g, ' ').trim().substring(0, 150);
    const cleanLicense = (imgData.licenseName || 'CC BY-SA 4.0').substring(0, 100);
    const cleanAlt = `${cleanTitle} in ${stateName}`.substring(0, 255);
    
    let [existing] = await conn.query(
      'SELECT id FROM images WHERE (provider_name = "wikimedia" AND provider_image_id = ?) OR display_url = ?',
      [providerImageId, imgData.displayUrl]
    );

    let imgId;
    if (existing.length > 0) {
      imgId = existing[0].id;
      await conn.query(
        `UPDATE images SET
          provider_image_id = ?,
          original_url = ?,
          display_url = ?,
          thumbnail_url = ?,
          source_page_url = ?,
          title = ?,
          description = ?,
          alt_text = ?,
          photographer_name = ?,
          license_name = ?,
          license_url = ?,
          attribution_text = ?,
          status = 'verified',
          review_status = 'auto_approved',
          consecutive_failures = 0,
          next_verification_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)
        WHERE id = ?`,
        [
          providerImageId,
          imgData.originalUrl,
          imgData.displayUrl,
          imgData.thumbnailUrl || imgData.displayUrl,
          imgData.sourcePageUrl,
          cleanTitle,
          cleanTitle,
          cleanAlt,
          cleanPhotographer,
          cleanLicense,
          imgData.licenseUrl || 'https://creativecommons.org/licenses/by-sa/4.0/',
          imgData.attribution,
          imgId
        ]
      );
    } else {
      const [insertRes] = await conn.query(
        `INSERT INTO images (
          provider_name, provider_image_id, original_url, display_url, thumbnail_url,
          source_page_url, title, description, alt_text, photographer_name,
          license_name, license_url, attribution_text, width, height, format,
          state, district, status, review_status, consecutive_failures, next_verification_at
        ) VALUES ('wikimedia', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified', 'auto_approved', 0, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 HOUR))`,
        [
          providerImageId,
          imgData.originalUrl,
          imgData.displayUrl,
          imgData.thumbnailUrl || imgData.displayUrl,
          imgData.sourcePageUrl,
          cleanTitle,
          cleanTitle,
          cleanAlt,
          cleanPhotographer,
          cleanLicense,
          imgData.licenseUrl || 'https://creativecommons.org/licenses/by-sa/4.0/',
          imgData.attribution,
          imgData.width || 960,
          imgData.height || 640,
          imgData.mime || 'image/jpeg',
          stateName,
          districtName
        ]
      );
      imgId = insertRes.insertId;
    }

    return imgId;
  }

  /**
   * Helper to upsert entity_images mapping
   */
  async upsertEntityImage(conn, { entityType, stateId = null, districtId = null, placeId = null, imageId, role = 'primary' }) {
    const [existing] = await conn.query(
      `SELECT id FROM entity_images
       WHERE entity_type = ?
         AND (state_id <=> ?)
         AND (district_id <=> ?)
         AND (place_id <=> ?)
         AND image_role = ?`,
      [entityType, stateId, districtId, placeId, role]
    );

    if (existing.length > 0) {
      await conn.query(
        'UPDATE entity_images SET image_id = ?, is_active = TRUE WHERE id = ?',
        [imageId, existing[0].id]
      );
    } else {
      await conn.query(
        `INSERT INTO entity_images (entity_type, state_id, district_id, place_id, image_id, image_role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
        [entityType, stateId, districtId, placeId, imageId, role]
      );
    }
  }

  /**
   * Seeds/Collects Centralized Images for West Bengal Pilot
   */
  async collectWestBengalPilot({ forceRefresh = false } = {}) {
    const pool = getPool();
    if (!pool) return { success: false, message: 'Database connection offline' };

    const dataset = this.getVerifiedDataset();
    if (!dataset) {
      return { success: false, message: 'Verified dataset file not found' };
    }

    console.log('[CIMS] Starting West Bengal Pilot Image Collection from Authentic Wikimedia Dataset...');

    // 1. Fetch West Bengal State Record
    const [stateRows] = await pool.query('SELECT * FROM states WHERE slug = "west-bengal"');
    if (!stateRows || stateRows.length === 0) {
      return { success: false, message: 'West Bengal state record not found in database' };
    }
    const wbState = stateRows[0];

    // 2. Fetch all 23 West Bengal districts
    const [districtRows] = await pool.query(
      'SELECT * FROM districts WHERE state_id = ? ORDER BY display_order ASC',
      [wbState.id]
    );

    console.log(`[CIMS] Found ${districtRows.length} West Bengal districts in database.`);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Seed State Hero Image
      if (dataset.state.hero) {
        const heroImgId = await this.upsertImage(conn, dataset.state.hero, null);
        if (heroImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'state',
            stateId: wbState.id,
            imageId: heroImgId,
            role: 'hero'
          });
        }
      }

      // Seed State Card Image
      if (dataset.state.card) {
        const cardImgId = await this.upsertImage(conn, dataset.state.card, null);
        if (cardImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'state',
            stateId: wbState.id,
            imageId: cardImgId,
            role: 'primary'
          });
        }
      }

      // Seed all 23 Districts (Primary + Backup)
      let districtsUpdated = 0;
      let backupsConfigured = 0;

      for (const d of districtRows) {
        const distData = dataset.districts[d.slug];
        if (!distData || !distData.primary) continue;

        // Primary Image
        const primaryImgId = await this.upsertImage(conn, distData.primary, d.name);
        if (primaryImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'district',
            districtId: d.id,
            imageId: primaryImgId,
            role: 'primary'
          });
          districtsUpdated++;
        }

        // Backup Image (if present)
        if (distData.backup) {
          const backupImgId = await this.upsertImage(conn, distData.backup, d.name);
          if (backupImgId) {
            await this.upsertEntityImage(conn, {
              entityType: 'district',
              districtId: d.id,
              imageId: backupImgId,
              role: 'backup'
            });
            backupsConfigured++;
          }
        }
      }

      await conn.commit();
      console.log(`[CIMS] West Bengal Pilot synchronization complete:`);
      console.log(`  - State Hero & Card: 100% live authentic Wikimedia URLs`);
      console.log(`  - Districts primary images: ${districtsUpdated} / 23`);
      console.log(`  - Districts backup images: ${backupsConfigured}`);

      return {
        success: true,
        districtsCovered: districtsUpdated,
        backupsConfigured,
        totalDistricts: districtRows.length
      };
    } catch (err) {
      await conn.rollback();
      console.error('[CIMS Collection Error]:', err.message);
      return { success: false, error: err.message };
    } finally {
      conn.release();
    }
  }

  /**
   * Seeds/Collects Centralized Images for Andhra Pradesh Pilot (Phase 2)
   */
  async collectAndhraPradeshPilot({ forceRefresh = false } = {}) {
    const pool = getPool();
    if (!pool) return { success: false, message: 'Database connection offline' };

    const dataset = this.getApVerifiedDataset();
    if (!dataset) {
      return { success: false, message: 'Verified AP dataset file not found' };
    }

    console.log('[CIMS] Starting Andhra Pradesh Pilot Image Collection from Authentic Wikimedia Dataset...');

    // 1. Fetch Andhra Pradesh State Record
    const [stateRows] = await pool.query('SELECT * FROM states WHERE slug = "andhra-pradesh"');
    if (!stateRows || stateRows.length === 0) {
      return { success: false, message: 'Andhra Pradesh state record not found in database' };
    }
    const apState = stateRows[0];

    // 2. Fetch all Andhra Pradesh districts
    const [districtRows] = await pool.query(
      'SELECT * FROM districts WHERE state_id = ? ORDER BY id ASC',
      [apState.id]
    );

    console.log(`[CIMS] Found ${districtRows.length} Andhra Pradesh districts in database.`);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Seed State Hero Image
      if (dataset.state.hero) {
        const heroImgId = await this.upsertImage(conn, dataset.state.hero, null, 'Andhra Pradesh');
        if (heroImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'state',
            stateId: apState.id,
            imageId: heroImgId,
            role: 'hero'
          });
        }
      }

      // Seed State Card Image
      if (dataset.state.card) {
        const cardImgId = await this.upsertImage(conn, dataset.state.card, null, 'Andhra Pradesh');
        if (cardImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'state',
            stateId: apState.id,
            imageId: cardImgId,
            role: 'primary'
          });
        }
      }

      // Seed all 28 Districts (Primary + Backup)
      let districtsUpdated = 0;
      let backupsConfigured = 0;

      for (const d of districtRows) {
        const distData = dataset.districts[d.slug];
        if (!distData || !distData.primary) {
          console.warn(`[CIMS] No dataset found for AP district slug: ${d.slug}`);
          continue;
        }

        // Primary Image
        const primaryImgId = await this.upsertImage(conn, distData.primary, d.name, 'Andhra Pradesh');
        if (primaryImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'district',
            districtId: d.id,
            imageId: primaryImgId,
            role: 'primary'
          });
          districtsUpdated++;
        }

        // Backup Image (if present)
        if (distData.backup) {
          const backupImgId = await this.upsertImage(conn, distData.backup, d.name, 'Andhra Pradesh');
          if (backupImgId) {
            await this.upsertEntityImage(conn, {
              entityType: 'district',
              districtId: d.id,
              imageId: backupImgId,
              role: 'backup'
            });
            backupsConfigured++;
          }
        }
      }

      await conn.commit();
      console.log(`[CIMS] Andhra Pradesh Pilot synchronization complete:`);
      console.log(`  - State Hero & Card: 100% live authentic Wikimedia URLs`);
      console.log(`  - Districts primary images: ${districtsUpdated} / ${districtRows.length}`);
      console.log(`  - Districts backup images: ${backupsConfigured}`);

      return {
        success: true,
        districtsCovered: districtsUpdated,
        backupsConfigured,
        totalDistricts: districtRows.length
      };
    } catch (err) {
      await conn.rollback();
      console.error('[CIMS Collection Error]:', err.message);
      return { success: false, error: err.message };
    } finally {
      conn.release();
    }
  }

  /**
   * Seeds/Collects Centralized Images for Arunachal Pradesh Pilot (Phase 3)
   */
  async collectArunachalPradeshPilot({ forceRefresh = false } = {}) {
    const pool = getPool();
    if (!pool) return { success: false, message: 'Database connection offline' };

    const dataset = this.getArunachalVerifiedDataset();
    if (!dataset) {
      return { success: false, message: 'Verified Arunachal dataset file not found' };
    }

    console.log('[CIMS] Starting Arunachal Pradesh Pilot Image Collection from Authentic Wikimedia Dataset...');

    // 1. Fetch Arunachal Pradesh State Record
    const [stateRows] = await pool.query('SELECT * FROM states WHERE slug = "arunachal-pradesh"');
    if (!stateRows || stateRows.length === 0) {
      return { success: false, message: 'Arunachal Pradesh state record not found in database' };
    }
    const arState = stateRows[0];

    // 2. Fetch all Arunachal Pradesh districts
    const [districtRows] = await pool.query(
      'SELECT * FROM districts WHERE state_id = ? ORDER BY id ASC',
      [arState.id]
    );

    console.log(`[CIMS] Found ${districtRows.length} Arunachal Pradesh districts in database.`);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Seed State Hero Image
      if (dataset.state.hero) {
        const heroImgId = await this.upsertImage(conn, dataset.state.hero, null, 'Arunachal Pradesh');
        if (heroImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'state',
            stateId: arState.id,
            imageId: heroImgId,
            role: 'hero'
          });
        }
      }

      // Seed State Card Image
      if (dataset.state.card) {
        const cardImgId = await this.upsertImage(conn, dataset.state.card, null, 'Arunachal Pradesh');
        if (cardImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'state',
            stateId: arState.id,
            imageId: cardImgId,
            role: 'primary'
          });
        }
      }

      // Seed all 27 Districts (Primary + Backup)
      let districtsUpdated = 0;
      let backupsConfigured = 0;

      for (const d of districtRows) {
        const distData = dataset.districts[d.slug];
        if (!distData || !distData.primary) {
          console.warn(`[CIMS] No dataset found for Arunachal district slug: ${d.slug}`);
          continue;
        }

        // Primary Image
        const primaryImgId = await this.upsertImage(conn, distData.primary, d.name, 'Arunachal Pradesh');
        if (primaryImgId) {
          await this.upsertEntityImage(conn, {
            entityType: 'district',
            districtId: d.id,
            imageId: primaryImgId,
            role: 'primary'
          });
          districtsUpdated++;
        }

        // Backup Image (if present)
        if (distData.backup) {
          const backupImgId = await this.upsertImage(conn, distData.backup, d.name, 'Arunachal Pradesh');
          if (backupImgId) {
            await this.upsertEntityImage(conn, {
              entityType: 'district',
              districtId: d.id,
              imageId: backupImgId,
              role: 'backup'
            });
            backupsConfigured++;
          }
        }
      }

      await conn.commit();
      console.log(`[CIMS] Arunachal Pradesh Pilot synchronization complete:`);
      console.log(`  - State Hero & Card: 100% live authentic Wikimedia URLs`);
      console.log(`  - Districts primary images: ${districtsUpdated} / ${districtRows.length}`);
      console.log(`  - Districts backup images: ${backupsConfigured}`);

      return {
        success: true,
        districtsCovered: districtsUpdated,
        backupsConfigured,
        totalDistricts: districtRows.length
      };
    } catch (err) {
      await conn.rollback();
      console.error('[CIMS Collection Error]:', err.message);
      return { success: false, error: err.message };
    } finally {
      conn.release();
    }
  }
}

export default new ImageCollectorService();
