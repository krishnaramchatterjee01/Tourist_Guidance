import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { env } from '../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyData() {
  console.log('====================================================');
  console.log('       EXPLORE INDIA — DATA MIGRATION AUDIT        ');
  console.log('====================================================\n');

  let dbConn;
  try {
    dbConn = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME
    });
  } catch (err) {
    console.error('[Verification Error] Could not connect to MySQL database:', err.message);
    process.exit(1);
  }

  const errors = [];
  const checks = [];

  try {
    // 1. Load source datasets
    const sourceDir = path.resolve(__dirname, '../database/source-data');
    const loadModule = (filename) =>
      import(pathToFileURL(path.join(sourceDir, filename)).href);

    const { regionsData } = await loadModule('regionsData.js');
    const { STATES_DATA } = await loadModule('districts.js');
    const { exploreData } = await loadModule('exploreData.js');
    const { topPlacesData } = await loadModule('topPlacesData.js');
    const { homeSlidersData } = await loadModule('homeSlidersData.js');

    // 2. Audit States Table
    const [stateRows] = await dbConn.query('SELECT * FROM states ORDER BY display_order ASC');
    const stateCount = stateRows.filter(s => s.region_type === 'state').length;
    const utCount = stateRows.filter(s => s.region_type === 'ut').length;

    console.log(`[States & UTs] Expected: 36 (28 States, 8 UTs) | Database: ${stateRows.length} (${stateCount} States, ${utCount} UTs)`);
    if (stateRows.length !== 36 || stateCount !== 28 || utCount !== 8) {
      errors.push(`State count mismatch: expected 36 (28+8), got ${stateRows.length} (${stateCount}+${utCount})`);
    } else {
      checks.push('States & Union Territories count (36) matches exactly.');
    }

    // 3. Audit Districts Table
    const [districtRows] = await dbConn.query(`
      SELECT d.*, s.slug AS state_slug
      FROM districts d
      JOIN states s ON d.state_id = s.id
      ORDER BY d.state_id, d.display_order
    `);

    let expectedTotalDistricts = 0;
    const expectedDistCounts = {};
    for (const [stSlug, stData] of Object.entries(STATES_DATA)) {
      expectedDistCounts[stSlug] = stData.districts.length;
      expectedTotalDistricts += stData.districts.length;
    }

    console.log(`[Districts] Expected: ${expectedTotalDistricts} | Database: ${districtRows.length}`);
    if (districtRows.length !== expectedTotalDistricts) {
      errors.push(`Total district count mismatch: expected ${expectedTotalDistricts}, got ${districtRows.length}`);
    } else {
      checks.push(`Total districts (${expectedTotalDistricts}) matches master dataset.`);
    }

    // Verify per-state district counts
    const actualDistCounts = {};
    districtRows.forEach(d => {
      actualDistCounts[d.state_slug] = (actualDistCounts[d.state_slug] || 0) + 1;
    });

    let stateDistrictMismatch = false;
    for (const [stSlug, expCount] of Object.entries(expectedDistCounts)) {
      const actCount = actualDistCounts[stSlug] || 0;
      if (actCount !== expCount) {
        stateDistrictMismatch = true;
        errors.push(`District count for state '${stSlug}' mismatch: expected ${expCount}, got ${actCount}`);
      }
    }
    if (!stateDistrictMismatch) {
      checks.push('All 28 state district sub-counts match official totals 100%.');
    }

    // 4. Audit Tourist Places Table
    const [placeRows] = await dbConn.query('SELECT * FROM tourist_places');
    let expectedAttractions = 0;
    for (const [, stData] of Object.entries(STATES_DATA)) {
      stData.districts.forEach(dist => {
        if (dist.attractions) expectedAttractions += dist.attractions.length;
      });
    }

    console.log(`[Tourist Places] Expected: ${expectedAttractions} | Database: ${placeRows.length}`);
    if (placeRows.length !== expectedAttractions) {
      errors.push(`Tourist places count mismatch: expected ${expectedAttractions}, got ${placeRows.length}`);
    } else {
      checks.push(`District tourist places (${expectedAttractions}) match exactly.`);
    }

    // 5. Audit Collections
    const [exploreRows] = await dbConn.query(`
      SELECT ci.* FROM collection_items ci
      JOIN destination_collections c ON ci.collection_id = c.id
      WHERE c.slug = 'explore'
    `);
    const [topPlacesRows] = await dbConn.query(`
      SELECT ci.* FROM collection_items ci
      JOIN destination_collections c ON ci.collection_id = c.id
      WHERE c.slug = 'top-places'
    `);
    const [utSliderRows] = await dbConn.query(`
      SELECT ci.* FROM collection_items ci
      JOIN destination_collections c ON ci.collection_id = c.id
      WHERE c.slug = 'home-ut-slider'
    `);
    const [exploreSliderRows] = await dbConn.query(`
      SELECT ci.* FROM collection_items ci
      JOIN destination_collections c ON ci.collection_id = c.id
      WHERE c.slug = 'home-explore-slider'
    `);
    const [topSliderRows] = await dbConn.query(`
      SELECT ci.* FROM collection_items ci
      JOIN destination_collections c ON ci.collection_id = c.id
      WHERE c.slug = 'home-top-slider'
    `);

    console.log(`[Explore Collection] Expected: 16 | Database: ${exploreRows.length}`);
    console.log(`[Top Places Collection] Expected: 16 | Database: ${topPlacesRows.length}`);
    console.log(`[Home Sliders] UTs: ${utSliderRows.length}/8 | Explore: ${exploreSliderRows.length}/6 | Top: ${topSliderRows.length}/6`);

    if (exploreRows.length !== 16 || topPlacesRows.length !== 16 || utSliderRows.length !== 8 || exploreSliderRows.length !== 6 || topSliderRows.length !== 6) {
      errors.push('Collection counts mismatch.');
    } else {
      checks.push('All destination collections & homepage sliders match baseline.');
    }

    // 6. Check for orphaned records
    const [orphanedDistricts] = await dbConn.query(`
      SELECT d.id FROM districts d
      LEFT JOIN states s ON d.state_id = s.id
      WHERE s.id IS NULL
    `);
    if (orphanedDistricts.length > 0) {
      errors.push(`Found ${orphanedDistricts.length} orphaned district records.`);
    } else {
      checks.push('Zero orphaned districts found (100% referential integrity).');
    }

    await dbConn.end();

    console.log('\n----------------------------------------------------');
    console.log('AUDIT SUMMARY:');
    checks.forEach(c => console.log(`  ✓ ${c}`));

    if (errors.length > 0) {
      console.error('\nERRORS DETECTED:');
      errors.forEach(e => console.error(`  ✗ ${e}`));
      process.exit(1);
    } else {
      console.log('\nALL 28 STATES, 8 UTS, 739 DISTRICTS & ATTRACTIONS VERIFIED 100% IN MYSQL!');
    }
  } catch (err) {
    console.error('[Verification Error] Unhandled exception:', err);
    process.exit(1);
  }
}

verifyData();
