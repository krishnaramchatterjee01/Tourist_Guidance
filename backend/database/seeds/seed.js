import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { env } from '../../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validates all loaded source datasets before any database operations.
 * Throws a descriptive error if any dataset is missing, corrupted, or malformed.
 */
function validateSourceDatasets(datasets) {
  const {
    regionsData,
    STATES_DATA,
    STATE_IMAGES,
    exploreData,
    topPlacesData,
    homeSlidersData,
    getDistrictImage,
    getDistrictHeroImage
  } = datasets;

  // 1. Validate regionsData
  if (!Array.isArray(regionsData) || regionsData.length !== 36) {
    throw new Error(
      `[Validation Failure] regionsData must be an array of exactly 36 items (28 states, 8 UTs). Found: ${
        Array.isArray(regionsData) ? regionsData.length : typeof regionsData
      }`
    );
  }

  for (let i = 0; i < regionsData.length; i++) {
    const r = regionsData[i];
    if (!r.name || typeof r.name !== 'string') {
      throw new Error(`[Validation Failure] regionsData item at index ${i} is missing a valid 'name' property.`);
    }
    if (r.category !== 'state' && r.category !== 'ut') {
      throw new Error(
        `[Validation Failure] regionsData item '${r.name}' has invalid category '${r.category}'. Expected 'state' or 'ut'.`
      );
    }
  }

  // 2. Validate STATES_DATA
  if (!STATES_DATA || typeof STATES_DATA !== 'object') {
    throw new Error('[Validation Failure] STATES_DATA must be a non-null object.');
  }

  const stateKeys = Object.keys(STATES_DATA);
  if (stateKeys.length !== 28) {
    throw new Error(
      `[Validation Failure] STATES_DATA must contain exactly 28 states. Found: ${stateKeys.length}`
    );
  }

  let totalDistrictsCount = 0;
  for (const [stSlug, stData] of Object.entries(STATES_DATA)) {
    if (!stData.state || !Array.isArray(stData.districts)) {
      throw new Error(
        `[Validation Failure] State '${stSlug}' in STATES_DATA is missing 'state' or 'districts' array.`
      );
    }
    const seenDistSlugs = new Set();
    for (let j = 0; j < stData.districts.length; j++) {
      const d = stData.districts[j];
      if (!d.name) {
        throw new Error(
          `[Validation Failure] District at index ${j} in state '${stSlug}' is missing a 'name'.`
        );
      }
      const distSlug = (d.slug || d.id || '').toLowerCase().trim();
      if (!distSlug) {
        throw new Error(
          `[Validation Failure] District '${d.name}' in state '${stSlug}' has empty slug/id.`
        );
      }
      if (seenDistSlugs.has(distSlug)) {
        throw new Error(
          `[Validation Failure] Duplicate district slug '${distSlug}' detected in state '${stSlug}'.`
        );
      }
      seenDistSlugs.add(distSlug);
      totalDistrictsCount++;
    }
  }

  // 3. Validate STATE_IMAGES and helper functions
  if (!STATE_IMAGES || typeof STATE_IMAGES !== 'object') {
    throw new Error('[Validation Failure] STATE_IMAGES must be an object.');
  }
  if (typeof getDistrictImage !== 'function' || typeof getDistrictHeroImage !== 'function') {
    throw new Error('[Validation Failure] District image helper functions are missing or not functions.');
  }

  // 4. Validate exploreData
  if (!Array.isArray(exploreData) || exploreData.length === 0) {
    throw new Error('[Validation Failure] exploreData must be a non-empty array.');
  }

  // 5. Validate topPlacesData
  if (!Array.isArray(topPlacesData) || topPlacesData.length === 0) {
    throw new Error('[Validation Failure] topPlacesData must be a non-empty array.');
  }

  // 6. Validate homeSlidersData
  if (!homeSlidersData || typeof homeSlidersData !== 'object') {
    throw new Error('[Validation Failure] homeSlidersData must be an object.');
  }
  if (!Array.isArray(homeSlidersData.unionTerritories) || homeSlidersData.unionTerritories.length !== 8) {
    throw new Error(
      `[Validation Failure] homeSlidersData.unionTerritories must be an array of 8 items. Found: ${homeSlidersData.unionTerritories?.length}`
    );
  }
  if (!Array.isArray(homeSlidersData.explore) || homeSlidersData.explore.length === 0) {
    throw new Error('[Validation Failure] homeSlidersData.explore must be a non-empty array.');
  }
  if (!Array.isArray(homeSlidersData.topPlaces) || homeSlidersData.topPlaces.length === 0) {
    throw new Error('[Validation Failure] homeSlidersData.topPlaces must be a non-empty array.');
  }

  console.log(`[Validation Passed] Verified all 7 datasets: 36 regions, 28 states, ${totalDistrictsCount} districts, ${exploreData.length} explore, ${topPlacesData.length} top places, 3 slider collections.`);
}

/**
 * Main Database Seeder Function
 */
async function runSeed() {
  console.log('====================================================');
  console.log('       EXPLORE INDIA — DATABASE SEEDER (SAFE)       ');
  console.log('====================================================\n');

  let dbConn = null;
  let inTransaction = false;
  let exitCode = 0;

  try {
    // ----------------------------------------------------------
    // 1. Cross-Platform Source Dataset Loading (Windows ESM Safe)
    // ----------------------------------------------------------
    const sourceDir = path.resolve(__dirname, '../source-data');
    const loadModule = (filename) =>
      import(pathToFileURL(path.join(sourceDir, filename)).href);

    console.log(`Loading source datasets from: ${sourceDir}`);
    const { regionsData } = await loadModule('regionsData.js');
    const { STATES_DATA } = await loadModule('districts.js');
    const { STATE_IMAGES } = await loadModule('stateImages.js');
    const { getDistrictImage, getDistrictHeroImage } = await loadModule('districtImages.js');
    const { exploreData } = await loadModule('exploreData.js');
    const { topPlacesData } = await loadModule('topPlacesData.js');
    const { homeSlidersData } = await loadModule('homeSlidersData.js');

    // ----------------------------------------------------------
    // 2. Comprehensive Pre-Write Validation
    // ----------------------------------------------------------
    validateSourceDatasets({
      regionsData,
      STATES_DATA,
      STATE_IMAGES,
      exploreData,
      topPlacesData,
      homeSlidersData,
      getDistrictImage,
      getDistrictHeroImage
    });

    // ----------------------------------------------------------
    // 3. Connect to Database & Begin Transaction
    // ----------------------------------------------------------
    console.log(`Connecting to MySQL database '${env.DB_NAME}' at ${env.DB_HOST}:${env.DB_PORT} as user '${env.DB_USER}'...`);
    dbConn = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME
    });

    console.log('Starting atomic database transaction...');
    await dbConn.beginTransaction();
    inTransaction = true;

    // ----------------------------------------------------------
    // 4. Seed States & Union Territories (36 Regions)
    // ----------------------------------------------------------
    console.log('\n[Phase 1] Seeding States and Union Territories (36 regions)...');
    const stateIdMap = new Map(); // slug -> id

    for (let i = 0; i < regionsData.length; i++) {
      const r = regionsData[i];
      const slug = r.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');
      const stateData = STATES_DATA[slug];
      const isState = r.category === 'state';
      const regionType = isState ? 'state' : 'ut';
      const imageUrl = STATE_IMAGES[slug] || r.image || null;
      const heroImageUrl = `/images/${isState ? 'states' : 'union-territories'}/${slug}.jpg`;
      const totalDistricts = stateData?.districts?.length || 0;

      await dbConn.query(
        `INSERT INTO states (
          name, slug, region_type, capital, description, short_description,
          tagline, image_url, hero_image_url, total_districts, button_url,
          button_text, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          region_type = VALUES(region_type),
          capital = VALUES(capital),
          description = VALUES(description),
          short_description = VALUES(short_description),
          tagline = VALUES(tagline),
          image_url = VALUES(image_url),
          hero_image_url = VALUES(hero_image_url),
          total_districts = VALUES(total_districts),
          button_url = VALUES(button_url),
          button_text = VALUES(button_text),
          display_order = VALUES(display_order)`,
        [
          r.name,
          slug,
          regionType,
          r.capital || stateData?.capital || null,
          stateData?.description || r.desc || null,
          r.desc || stateData?.description || null,
          stateData?.tagline || `Discover the Beauty of ${r.name}`,
          imageUrl,
          heroImageUrl,
          totalDistricts,
          r.buttonUrl || r.url || `/states?state=${slug}`,
          r.buttonText || (isState ? `Explore ${totalDistricts} Districts` : 'Explore Union Territory'),
          i + 1
        ]
      );

      // Fetch persisted state ID
      const [rows] = await dbConn.query('SELECT id FROM states WHERE slug = ?', [slug]);
      if (rows && rows[0]) {
        stateIdMap.set(slug, rows[0].id);
      } else {
        throw new Error(`[Integrity Failure] Failed to retrieve persisted ID for state '${slug}'.`);
      }
    }
    console.log(`  ✓ Persisted ${stateIdMap.size} regions (28 states, 8 union territories).`);

    // Verify all 28 states in STATES_DATA have matching IDs in stateIdMap
    for (const stSlug of Object.keys(STATES_DATA)) {
      if (!stateIdMap.has(stSlug)) {
        throw new Error(`[Integrity Failure] State '${stSlug}' in STATES_DATA has no matching state in database.`);
      }
    }

    // ----------------------------------------------------------
    // 5. Seed Districts (739 districts across India)
    // ----------------------------------------------------------
    console.log('\n[Phase 2] Seeding Districts across 28 states...');
    let totalDistrictsSeeded = 0;
    const districtIdMap = new Map(); // `${stateSlug}/${districtSlug}` -> id

    for (const [stateSlug, stateData] of Object.entries(STATES_DATA)) {
      const stateId = stateIdMap.get(stateSlug);
      if (!stateId) {
        throw new Error(`[Relationship Failure] Missing state ID for '${stateSlug}'. Cannot seed districts.`);
      }

      for (let j = 0; j < stateData.districts.length; j++) {
        const d = stateData.districts[j];
        const distSlug = (d.slug || d.id || '').toLowerCase().trim();
        const distImage = getDistrictImage(d, stateData);
        const distHeroImage = getDistrictHeroImage(d, stateData);
        const knownForStr = Array.isArray(d.knownFor) ? d.knownFor.join(', ') : (d.knownFor || null);

        await dbConn.query(
          `INSERT INTO districts (
            state_id, name, slug, headquarters, division, tagline,
            short_description, full_description, image_url, hero_image_url,
            best_time_to_visit, known_for, display_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            headquarters = VALUES(headquarters),
            division = VALUES(division),
            tagline = VALUES(tagline),
            short_description = VALUES(short_description),
            full_description = VALUES(full_description),
            image_url = VALUES(image_url),
            hero_image_url = VALUES(hero_image_url),
            best_time_to_visit = VALUES(best_time_to_visit),
            known_for = VALUES(known_for),
            display_order = VALUES(display_order)`,
          [
            stateId,
            d.name,
            distSlug,
            d.headquarters || d.name || null,
            d.division || 'Official District',
            d.tagline || `Heart of ${stateData.state}`,
            d.shortDescription || `${d.name} is an officially recognized administrative district.`,
            d.fullDescription || d.shortDescription || null,
            distImage,
            distHeroImage,
            d.bestTimeToVisit || 'October to March',
            knownForStr,
            j + 1
          ]
        );

        const [distRows] = await dbConn.query(
          'SELECT id FROM districts WHERE state_id = ? AND slug = ?',
          [stateId, distSlug]
        );

        if (distRows && distRows[0]) {
          districtIdMap.set(`${stateSlug}/${distSlug}`, distRows[0].id);
        } else {
          throw new Error(`[Integrity Failure] Failed to retrieve ID for district '${distSlug}' in '${stateSlug}'.`);
        }
        totalDistrictsSeeded++;
      }
    }
    console.log(`  ✓ Persisted ${totalDistrictsSeeded} districts across all 28 states.`);

    // ----------------------------------------------------------
    // 6. Seed Tourist Attractions (172 spots across districts)
    // ----------------------------------------------------------
    console.log('\n[Phase 3] Seeding Tourist Places and District Attractions...');
    let totalAttractionsSeeded = 0;

    for (const [stateSlug, stateData] of Object.entries(STATES_DATA)) {
      const stateId = stateIdMap.get(stateSlug);

      for (const d of stateData.districts) {
        if (!d.attractions || d.attractions.length === 0) continue;
        const distSlug = (d.slug || d.id || '').toLowerCase().trim();
        const districtKey = `${stateSlug}/${distSlug}`;
        const districtId = districtIdMap.get(districtKey);

        if (!districtId) {
          throw new Error(`[Relationship Failure] Parent district ID missing for attraction in '${districtKey}'.`);
        }

        for (let k = 0; k < d.attractions.length; k++) {
          const spot = d.attractions[k];
          const spotSlug = (spot.name || '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');
          
          // Generate globally unique source ID constrained to VARCHAR(100)
          const rawSourceId = spot.id
            ? (spot.id.includes(stateSlug) ? spot.id : `${stateSlug}-${distSlug}-${spot.id}`)
            : `${stateSlug}-${distSlug}-${spotSlug || k}`;
          const sourceId = rawSourceId.length > 100 ? rawSourceId.slice(0, 100) : rawSourceId;

          const highlightsStr = Array.isArray(spot.highlights) ? spot.highlights.join(', ') : (spot.highlights || null);
          const mapQuery = spot.mapsQuery || spot.name || null;
          const mapUrl = spot.mapUrl || (mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : null);

          await dbConn.query(
            `INSERT INTO tourist_places (
              source_id, state_id, district_id, name, slug, category, location,
              description, image_url, map_query, map_url, highlights,
              best_time_to_visit, badge, display_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              state_id = VALUES(state_id),
              district_id = VALUES(district_id),
              name = VALUES(name),
              slug = VALUES(slug),
              category = VALUES(category),
              location = VALUES(location),
              description = VALUES(description),
              image_url = VALUES(image_url),
              map_query = VALUES(map_query),
              map_url = VALUES(map_url),
              highlights = VALUES(highlights),
              best_time_to_visit = VALUES(best_time_to_visit),
              badge = VALUES(badge),
              display_order = VALUES(display_order)`,
            [
              sourceId,
              stateId,
              districtId,
              spot.name,
              spotSlug,
              spot.category || 'Scenic Attraction',
              spot.location || `${d.name}, ${stateData.state}`,
              spot.description || null,
              spot.image || null,
              mapQuery,
              mapUrl,
              highlightsStr,
              spot.bestTimeToVisit || null,
              spot.badge || 'Attraction',
              k + 1
            ]
          );
          totalAttractionsSeeded++;
        }
      }
    }
    console.log(`  ✓ Persisted ${totalAttractionsSeeded} district tourist attractions.`);

    // ----------------------------------------------------------
    // 7. Seed Destination Collections (5 Collections)
    // ----------------------------------------------------------
    console.log('\n[Phase 4] Seeding Destination Collections...');
    const collections = [
      { slug: 'explore', title: 'Discover Your Next Adventure', subtitle: 'Curated Indian Travel Experiences' },
      { slug: 'top-places', title: "India's Most Loved Destinations", subtitle: 'Iconic Wonders and Sacred Shrines' },
      { slug: 'home-ut-slider', title: 'Wonders Across India', subtitle: '8 Union Territories' },
      { slug: 'home-explore-slider', title: 'Discover Your Next Adventure', subtitle: 'Featured Journeys' },
      { slug: 'home-top-slider', title: "India's Most Loved Destinations", subtitle: 'Iconic Wonders' }
    ];

    const colIdMap = new Map();
    for (const c of collections) {
      await dbConn.query(
        `INSERT INTO destination_collections (slug, title, subtitle)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), subtitle = VALUES(subtitle)`,
        [c.slug, c.title, c.subtitle]
      );
      const [rows] = await dbConn.query('SELECT id FROM destination_collections WHERE slug = ?', [c.slug]);
      if (rows && rows[0]) {
        colIdMap.set(c.slug, rows[0].id);
      } else {
        throw new Error(`[Integrity Failure] Failed to retrieve ID for collection '${c.slug}'.`);
      }
    }
    console.log(`  ✓ Persisted ${colIdMap.size} destination collection definitions.`);

    // ----------------------------------------------------------
    // 8. Non-Destructive Synchronization of Collection Items
    // ----------------------------------------------------------
    console.log('\n[Phase 5] Synchronizing Collection Items (Non-Destructive)...');

    async function syncCollectionItems(collectionSlug, items) {
      const colId = colIdMap.get(collectionSlug);
      if (!colId) {
        throw new Error(`[Relationship Failure] Collection ID not found for '${collectionSlug}'.`);
      }

      // Query existing items for this collection to enable in-place updates without deletions
      const [existingRows] = await dbConn.query(
        'SELECT id, destination_name, display_order FROM collection_items WHERE collection_id = ?',
        [colId]
      );

      const existingByName = new Map();
      for (const row of existingRows) {
        const normName = (row.destination_name || '').toLowerCase().trim();
        if (!existingByName.has(normName)) {
          existingByName.set(normName, row);
        }
      }

      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        const destName = item.name || item.destination || item.title;
        const normName = (destName || '').toLowerCase().trim();
        const existing = existingByName.get(normName);

        const params = [
          destName,
          item.state || null,
          item.category || null,
          item.badge || null,
          item.img || item.image || null,
          item.alt || destName || null,
          item.desc || item.description || null,
          item.location || null,
          item.best || null,
          item.highlights || null,
          item.mapQuery || null,
          item.buttonUrl || null,
          item.buttonText || null,
          idx + 1
        ];

        if (existing) {
          // In-place non-destructive update preserving existing primary key ID
          await dbConn.query(
            `UPDATE collection_items SET
              destination_name = ?,
              state_name = ?,
              category = ?,
              badge = ?,
              image_url = ?,
              alt_text = ?,
              description = ?,
              location = ?,
              best_time = ?,
              highlights = ?,
              map_query = ?,
              button_url = ?,
              button_text = ?,
              display_order = ?
            WHERE id = ?`,
            [...params, existing.id]
          );
        } else {
          // Insert new record without deleting existing rows
          await dbConn.query(
            `INSERT INTO collection_items (
              collection_id, destination_name, state_name, category, badge,
              image_url, alt_text, description, location, best_time,
              highlights, map_query, button_url, button_text, display_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [colId, ...params]
          );
        }
      }
    }

    await syncCollectionItems('explore', exploreData);
    await syncCollectionItems('top-places', topPlacesData);
    await syncCollectionItems('home-ut-slider', homeSlidersData.unionTerritories);
    await syncCollectionItems('home-explore-slider', homeSlidersData.explore);
    await syncCollectionItems('home-top-slider', homeSlidersData.topPlaces);

    console.log('  ✓ Synchronized all collection items non-destructively.');

    // ----------------------------------------------------------
    // 9. Commit Transaction
    // ----------------------------------------------------------
    console.log('\nCommitting atomic transaction to MySQL...');
    await dbConn.commit();
    inTransaction = false;

    console.log('\n====================================================');
    console.log('✓ DATABASE SEEDING COMPLETED SUCCESSFULLY WITH ZERO ERRORS');
    console.log('====================================================');
    console.log(`• States & Union Territories: ${stateIdMap.size} (28 States, 8 UTs)`);
    console.log(`• Total Districts:            ${totalDistrictsSeeded}`);
    console.log(`• Tourist Attractions:        ${totalAttractionsSeeded}`);
    console.log(`• Destination Collections:    ${colIdMap.size}`);
    console.log('====================================================\n');
  } catch (err) {
    exitCode = 1;
    console.error('\n====================================================');
    console.error('[SEED ERROR] Execution failed:');
    console.error(err.message || err);
    console.error('====================================================');

    if (dbConn && inTransaction) {
      try {
        console.log('Rolling back database transaction...');
        await dbConn.rollback();
        console.log('Transaction successfully rolled back. Database remains uncorrupted.');
      } catch (rbErr) {
        console.error('[Rollback Failure] Could not rollback transaction:', rbErr.message || rbErr);
      }
    }
  } finally {
    if (dbConn) {
      try {
        await dbConn.end();
        console.log('Database connection pool cleanly closed.');
      } catch (closeErr) {
        console.error('[Cleanup Warning] Error closing database connection:', closeErr.message || closeErr);
      }
    }
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  }
}

runSeed();
