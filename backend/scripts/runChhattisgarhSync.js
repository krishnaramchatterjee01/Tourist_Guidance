import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool, closePool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncChhattisgarh() {
  const jsonPath = path.join(__dirname, '../src/services/images/verifiedChhattisgarhDataset.json');
  const dataset = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [stateRows] = await conn.query("SELECT id, name, slug FROM states WHERE slug = 'chhattisgarh'");
    if (!stateRows.length) throw new Error('State chhattisgarh not found in states table');
    const stateId = stateRows[0].id;
    console.log(`Found State: ${stateRows[0].name} (ID: ${stateId})`);

    const [districtRows] = await conn.query('SELECT id, name, slug FROM districts WHERE state_id = ?', [stateId]);
    const districtMap = new Map();
    for (const d of districtRows) {
      districtMap.set(d.slug, d.id);
    }
    console.log(`Found ${districtRows.length} districts for Chhattisgarh in DB`);

    // Helper to insert or get existing image ID
    async function upsertImage(img) {
      if (!img || !img.originalUrl) return null;
      const [existing] = await conn.query(
        'SELECT id FROM images WHERE original_url = ? OR display_url = ? LIMIT 1',
        [img.originalUrl, img.displayUrl]
      );
      if (existing.length > 0) {
        return existing[0].id;
      }

      const photographer = (img.photographer || 'Wikimedia Contributor').substring(0, 150);
      const title = (img.title || 'Chhattisgarh Landscape').substring(0, 255);
      const license = (img.licenseName || 'CC BY-SA 4.0').substring(0, 100);

      const [res] = await conn.query(
        `INSERT INTO images (
          title, original_url, display_url, thumbnail_url,
          source_page_url, photographer_name, license_name, license_url,
          attribution_text, width, height, mime_type, is_landscape,
          location_description, verification_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified', NOW(), NOW())`,
        [
          title,
          img.originalUrl,
          img.displayUrl,
          img.thumbnailUrl,
          img.sourcePageUrl || null,
          photographer,
          license,
          img.licenseUrl || 'https://creativecommons.org/licenses/by-sa/4.0/',
          img.attribution || `${photographer} (${license}) via Wikimedia Commons`,
          img.width || null,
          img.height || null,
          img.mime || 'image/jpeg',
          img.isLandscape ? 1 : 0,
          img.locationDescription || null
        ]
      );
      return res.insertId;
    }

    // Helper to link entity_images
    async function linkEntity(entityType, stateId, districtId, role, imageId) {
      if (!imageId) return;
      await conn.query(
        `DELETE FROM entity_images
         WHERE entity_type = ? AND state_id = ?
           AND (district_id <=> ?) AND image_role = ?`,
        [entityType, stateId, districtId, role]
      );

      await conn.query(
        `INSERT INTO entity_images (
          entity_type, state_id, district_id, attraction_id,
          image_id, image_role, display_order, is_active, created_at
        ) VALUES (?, ?, ?, NULL, ?, ?, 0, 1, NOW())`,
        [entityType, stateId, districtId, imageId, role]
      );
    }

    // 1. State Hero & Card
    if (dataset.state.hero) {
      const heroId = await upsertImage(dataset.state.hero);
      await linkEntity('state', stateId, null, 'hero', heroId);
      console.log(`Linked state hero image: ID ${heroId}`);
    }
    if (dataset.state.card) {
      const cardId = await upsertImage(dataset.state.card);
      await linkEntity('state', stateId, null, 'primary', cardId);
      console.log(`Linked state card image: ID ${cardId}`);
    }

    // 2. Districts (33)
    let linkedPrimaries = 0;
    let linkedBackups = 0;

    for (const [slug, item] of Object.entries(dataset.districts)) {
      const districtId = districtMap.get(slug);
      if (!districtId) {
        console.warn(`District slug not found in DB: ${slug}`);
        continue;
      }

      if (item.primary) {
        const pId = await upsertImage(item.primary);
        await linkEntity('district', stateId, districtId, 'primary', pId);
        linkedPrimaries++;
      }

      if (item.backup) {
        const bId = await upsertImage(item.backup);
        await linkEntity('district', stateId, districtId, 'backup', bId);
        linkedBackups++;
      }
    }

    await conn.commit();
    console.log(`\nSynchronization successful for Chhattisgarh!`);
    console.log(`- Primaries linked: ${linkedPrimaries} / 33`);
    console.log(`- Backups linked: ${linkedBackups} / 33`);
  } catch (err) {
    await conn.rollback();
    console.error('Transaction rolled back due to error:', err);
    throw err;
  } finally {
    conn.release();
    await closePool();
  }
}

syncChhattisgarh().catch(err => {
  console.error(err);
  process.exit(1);
});
