import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASELINE_STATE_IDS = Array.from({ length: 28 }, (_, i) => i + 1);
const TARGET_UT_IDS = [29, 30, 31, 32, 33, 34, 35, 36];

async function getBaselineCount(pool) {
  const [rows] = await pool.query(`
    SELECT COUNT(*) as count 
    FROM entity_images ei
    LEFT JOIN districts d ON ei.district_id = d.id
    WHERE (ei.state_id IN (${BASELINE_STATE_IDS.join(',')}) OR d.state_id IN (${BASELINE_STATE_IDS.join(',')}))
      AND ei.is_active = TRUE
      AND ei.entity_type IN ('state', 'district')
  `);
  return rows[0].count;
}

async function getUtActiveCount(pool) {
  const [rows] = await pool.query(`
    SELECT COUNT(*) as count 
    FROM entity_images ei
    LEFT JOIN districts d ON ei.district_id = d.id
    WHERE (ei.state_id IN (${TARGET_UT_IDS.join(',')}) OR d.state_id IN (${TARGET_UT_IDS.join(',')}))
      AND ei.is_active = TRUE
      AND ei.entity_type IN ('state', 'district')
  `);
  return rows[0].count;
}

async function upsertImageRecord(conn, imgData, districtName = null, stateName = 'India') {
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

async function upsertEntityImageRecord(conn, { entityType, stateId = null, districtId = null, placeId = null, imageId, role = 'primary' }) {
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

async function main() {
  console.log('============================================================');
  console.log('CIMS PHASE 3: MASTER DATABASE SYNC & LOCAL ASSET MIGRATION');
  console.log('============================================================\n');

  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    // 1. Audit Baseline Before Sync
    const baselineBefore = await getBaselineCount(conn);
    const utBefore = await getUtActiveCount(conn);
    console.log(`[Baseline Audit Before Sync]`);
    console.log(`  - States 1-28 active images: ${baselineBefore} (Expected: 1499)`);
    console.log(`  - UTs 29-36 active images: ${utBefore} (Expected: 106)`);
    console.log(`  - Total baseline active entity images: ${baselineBefore + utBefore} (Expected: 1605)`);

    if (baselineBefore !== 1499 || utBefore !== 106) {
      throw new Error(`Baseline mismatch! States: ${baselineBefore}, UTs: ${utBefore}`);
    }

    // 2. Synchronize States raw image columns from existing CIMS entity_images
    console.log('\n--- 1. Synchronizing 36 State Image Columns from CIMS ---');
    const [allStates] = await conn.query('SELECT id, name, slug FROM states ORDER BY id');
    let stateUpdates = 0;
    for (const st of allStates) {
      const [imgs] = await conn.query(`
        SELECT ei.image_role, i.display_url
        FROM entity_images ei
        JOIN images i ON i.id = ei.image_id
        WHERE ei.entity_type = 'state' AND ei.state_id = ? AND ei.is_active = TRUE
        ORDER BY FIELD(ei.image_role, 'hero', 'card')
      `, [st.id]);

      let heroUrl = null;
      let cardUrl = null;
      for (const row of imgs) {
        if (row.image_role === 'hero') heroUrl = row.display_url;
        if (row.image_role === 'card') cardUrl = row.display_url;
      }
      const finalHero = heroUrl || cardUrl;
      const finalCard = cardUrl || heroUrl;

      if (finalHero && finalCard) {
        await conn.query('UPDATE states SET image_url = ?, hero_image_url = ? WHERE id = ?', [
          finalCard, finalHero, st.id
        ]);
        stateUpdates++;
      }
    }
    console.log(`  ✓ Updated ${stateUpdates} / 36 states with verified CIMS display URLs.`);

    // 3. Synchronize Districts raw image columns from existing CIMS entity_images
    console.log('\n--- 2. Synchronizing 784 District Image Columns from CIMS ---');
    const [allDistricts] = await conn.query('SELECT id, name, slug, state_id FROM districts ORDER BY id');
    let distUpdates = 0;
    for (const dist of allDistricts) {
      const [imgs] = await conn.query(`
        SELECT ei.image_role, i.display_url
        FROM entity_images ei
        JOIN images i ON i.id = ei.image_id
        WHERE ei.entity_type = 'district' AND ei.district_id = ? AND ei.is_active = TRUE
        ORDER BY FIELD(ei.image_role, 'primary', 'backup')
      `, [dist.id]);

      let primaryUrl = null;
      let backupUrl = null;
      for (const row of imgs) {
        if (row.image_role === 'primary') primaryUrl = row.display_url;
        if (row.image_role === 'backup') backupUrl = row.display_url;
      }

      if (primaryUrl) {
        await conn.query('UPDATE districts SET image_url = ?, hero_image_url = ? WHERE id = ?', [
          primaryUrl, backupUrl || primaryUrl, dist.id
        ]);
        distUpdates++;
      }
    }
    console.log(`  ✓ Updated ${distUpdates} / 784 districts with verified CIMS display URLs.`);

    // 4. Synchronize 5 Curated Collections (52 items)
    console.log('\n--- 3. Synchronizing 5 Curated Collections (52 items) ---');
    const collectionsDatasetPath = path.resolve(__dirname, '../src/services/images/verifiedCollectionsDataset.json');
    if (!fs.existsSync(collectionsDatasetPath)) {
      throw new Error(`Collections dataset not found at ${collectionsDatasetPath}`);
    }
    const collectionsDataset = JSON.parse(fs.readFileSync(collectionsDatasetPath, 'utf8'));

    // Map destination_name to curated object
    const exploreMapping = {
      'Udaipur': collectionsDataset.explore['udaipur'],
      'Rishikesh': collectionsDataset.explore['rishikesh'],
      'Hampi': collectionsDataset.explore['hampi'],
      'Munnar': collectionsDataset.explore['munnar'],
      'Andaman Islands': collectionsDataset.explore['andaman-islands'],
      'Leh Ladakh': collectionsDataset.explore['leh-ladakh'],
      'Darjeeling': collectionsDataset.explore['darjeeling'],
      'Goa': collectionsDataset.explore['goa'],
      'Varanasi': collectionsDataset.explore['varanasi'],
      'Manali': collectionsDataset.explore['manali'],
      'Jaipur': collectionsDataset.explore['jaipur'],
      'Alleppey': collectionsDataset.explore['alleppey'],
      'Amritsar': collectionsDataset.explore['amritsar'],
      'Shillong': collectionsDataset.explore['shillong'],
      'Jaisalmer': collectionsDataset.explore['jaisalmer'],
      'Gokarna': collectionsDataset.explore['gokarna']
    };

    const topPlacesMapping = {
      'Taj Mahal': collectionsDataset.topPlaces['taj-mahal'],
      'Golden Temple': collectionsDataset.topPlaces['golden-temple'],
      'India Gate': collectionsDataset.topPlaces['india-gate'],
      'Hawa Mahal': collectionsDataset.topPlaces['hawa-mahal'],
      'Dal Lake': collectionsDataset.topPlaces['dal-lake'],
      'Victoria Memorial': collectionsDataset.topPlaces['victoria-memorial'],
      'Qutub Minar': collectionsDataset.topPlaces['qutub-minar'],
      'Meenakshi Temple': collectionsDataset.topPlaces['meenakshi-temple'],
      'Gateway of India': collectionsDataset.topPlaces['gateway-of-india'],
      'Ajanta & Ellora Caves': collectionsDataset.topPlaces['ajanta-ellora'],
      'Konark Sun Temple': collectionsDataset.topPlaces['konark-sun-temple'],
      'Mysore Palace': collectionsDataset.topPlaces['mysore-palace'],
      'Varanasi Ghats': collectionsDataset.topPlaces['varanasi-ghats'],
      'Amber Fort': collectionsDataset.topPlaces['amber-fort'],
      'Pangong Tso Lake': collectionsDataset.topPlaces['pangong-tso'],
      'Dudhsagar Falls': collectionsDataset.topPlaces['dudhsagar-falls']
    };

    // Upsert images for explore
    for (const [destName, destData] of Object.entries(exploreMapping)) {
      if (destData && destData.image) {
        await upsertImageRecord(conn, destData.image, null, destData.state || 'India');
      }
    }
    // Upsert images for topPlaces
    for (const [placeName, placeData] of Object.entries(topPlacesMapping)) {
      if (placeData && placeData.image) {
        await upsertImageRecord(conn, placeData.image, null, placeData.location || 'India');
      }
    }

    // Update collection_items for explore and home-explore-slider
    const [exploreItems] = await conn.query(`
      SELECT ci.id, ci.destination_name, c.slug as col_slug
      FROM collection_items ci
      JOIN destination_collections c ON c.id = ci.collection_id
      WHERE c.slug IN ('explore', 'home-explore-slider')
    `);
    let exploreUpdates = 0;
    for (const item of exploreItems) {
      const match = exploreMapping[item.destination_name];
      if (match && match.image) {
        await conn.query('UPDATE collection_items SET image_url = ? WHERE id = ?', [
          match.image.displayUrl, item.id
        ]);
        exploreUpdates++;
      }
    }
    console.log(`  ✓ Updated ${exploreUpdates} / ${exploreItems.length} items in explore and home-explore-slider.`);

    // Update collection_items for top-places and home-top-slider
    const [topPlacesItems] = await conn.query(`
      SELECT ci.id, ci.destination_name, c.slug as col_slug
      FROM collection_items ci
      JOIN destination_collections c ON c.id = ci.collection_id
      WHERE c.slug IN ('top-places', 'home-top-slider')
    `);
    let topUpdates = 0;
    for (const item of topPlacesItems) {
      const match = topPlacesMapping[item.destination_name];
      if (match && match.image) {
        await conn.query('UPDATE collection_items SET image_url = ? WHERE id = ?', [
          match.image.displayUrl, item.id
        ]);
        topUpdates++;
      }
    }
    console.log(`  ✓ Updated ${topUpdates} / ${topPlacesItems.length} items in top-places and home-top-slider.`);

    // Update collection_items for home-ut-slider (8 UTs)
    const [utSliderItems] = await conn.query(`
      SELECT ci.id, ci.destination_name, c.slug as col_slug
      FROM collection_items ci
      JOIN destination_collections c ON c.id = ci.collection_id
      WHERE c.slug = 'home-ut-slider'
    `);
    let utUpdates = 0;
    for (const item of utSliderItems) {
      // Find UT state
      const [st] = await conn.query('SELECT id FROM states WHERE name = ? LIMIT 1', [item.destination_name]);
      if (st.length > 0) {
        const [stImg] = await conn.query(`
          SELECT i.display_url
          FROM entity_images ei
          JOIN images i ON i.id = ei.image_id
          WHERE ei.entity_type = 'state' AND ei.state_id = ? AND ei.is_active = TRUE
          ORDER BY FIELD(ei.image_role, 'card', 'hero')
          LIMIT 1
        `, [st[0].id]);
        if (stImg.length > 0) {
          await conn.query('UPDATE collection_items SET image_url = ? WHERE id = ?', [
            stImg[0].display_url, item.id
          ]);
          utUpdates++;
        }
      }
    }
    console.log(`  ✓ Updated ${utUpdates} / 8 items in home-ut-slider with verified UT card images.`);

    // 5. Synchronize 172 Tourist Places (Andhra Pradesh + West Bengal)
    console.log('\n--- 4. Synchronizing 172 Tourist Places Attractions ---');
    const touristPlacesDatasetPath = path.resolve(__dirname, '../src/services/images/verifiedTouristPlacesDataset.json');
    if (!fs.existsSync(touristPlacesDatasetPath)) {
      throw new Error(`Tourist places dataset not found at ${touristPlacesDatasetPath}`);
    }
    const touristPlacesDataset = JSON.parse(fs.readFileSync(touristPlacesDatasetPath, 'utf8'));

    const [allPlaces] = await conn.query(`
      SELECT tp.id, tp.name, tp.district_id, d.name as district_name, d.state_id, s.name as state_name
      FROM tourist_places tp
      JOIN districts d ON d.id = tp.district_id
      JOIN states s ON s.id = d.state_id
      ORDER BY tp.id
    `);

    let placesSynced = 0;
    for (const p of allPlaces) {
      const entry = touristPlacesDataset.places[p.id];
      if (entry && entry.image) {
        const imgId = await upsertImageRecord(conn, entry.image, p.district_name, p.state_name);
        await upsertEntityImageRecord(conn, {
          entityType: 'tourist_place',
          stateId: p.state_id,
          districtId: p.district_id,
          placeId: p.id,
          imageId: imgId,
          role: 'primary'
        });
        await conn.query('UPDATE tourist_places SET image_url = ? WHERE id = ?', [
          entry.image.displayUrl, p.id
        ]);
        placesSynced++;
      }
    }
    console.log(`  ✓ Successfully synced ${placesSynced} / ${allPlaces.length} tourist places into CIMS.`);

    // 6. Post-Sync Baseline Verification
    console.log('\n--- 5. Post-Sync Baseline & Integrity Auditing ---');
    const baselineAfter = await getBaselineCount(conn);
    const utAfter = await getUtActiveCount(conn);
    console.log(`  - States 1-28 active district/state images: ${baselineAfter} (Must equal 1499)`);
    console.log(`  - UTs 29-36 active district/state images: ${utAfter} (Must equal 106)`);

    if (baselineAfter !== 1499 || utAfter !== 106) {
      throw new Error(`CRITICAL INTEGRITY FAILURE: Baseline changed! States: ${baselineAfter}, UTs: ${utAfter}`);
    }
    console.log('  ✓ 100% BASELINE INTEGRITY PRESERVED: Exactly 1605 baseline entity images untouched.');

    // Count tourist_place entity images
    const [tpActive] = await conn.query(`
      SELECT COUNT(*) as count FROM entity_images WHERE entity_type = 'tourist_place' AND is_active = TRUE
    `);
    console.log(`  - Tourist place active entity images: ${tpActive[0].count} (Expected: 172)`);

    // Verify local image paths remaining
    const [localCol] = await conn.query("SELECT COUNT(*) as count FROM collection_items WHERE image_url LIKE '%/images/%'");
    const [localTp] = await conn.query("SELECT COUNT(*) as count FROM tourist_places WHERE image_url LIKE '%/images/%' OR image_url LIKE '%unsplash.com%'");
    const [localSt] = await conn.query("SELECT COUNT(*) as count FROM states WHERE image_url LIKE '%/images/%' OR hero_image_url LIKE '%/images/%'");
    const [localDist] = await conn.query("SELECT COUNT(*) as count FROM districts WHERE image_url LIKE '%/images/%' OR hero_image_url LIKE '%/images/%'");

    console.log(`\n--- Verification of Remaining Legacy Paths ---`);
    console.log(`  - Collection items with /images/: ${localCol[0].count} (Expected: 0)`);
    console.log(`  - Tourist places with /images/ or Unsplash: ${localTp[0].count} (Expected: 0)`);
    console.log(`  - States with /images/: ${localSt[0].count} (Expected: 0)`);
    console.log(`  - Districts with /images/: ${localDist[0].count} (Expected: 0)`);

    if (localCol[0].count === 0 && localTp[0].count === 0 && localSt[0].count === 0 && localDist[0].count === 0) {
      console.log('\n🏆 ALL TOURISM IMAGE DEPENDENCIES ARE 100% CIMS DATABASE-DRIVEN!');
    } else {
      console.warn('\n⚠️ Some legacy paths remain! Please inspect details above.');
    }

  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
