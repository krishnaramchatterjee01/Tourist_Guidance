import { getPool, closePool } from '../src/config/db.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pool = getPool();
  if (!pool) {
    console.error('Cannot connect to database.');
    process.exit(1);
  }

  console.log('============================================================');
  console.log('AUDITING DATABASE BASELINE FOR PHASE 3');
  console.log('============================================================\n');

  // 1. List all tables
  const [tables] = await pool.query('SHOW TABLES');
  const tableNames = tables.map(t => Object.values(t)[0]);
  console.log('Tables in explore_india:', tableNames);

  // 2. States count
  const [stateRows] = await pool.query('SELECT COUNT(*) as count FROM states');
  console.log('Total states in `states` table:', stateRows[0].count);

  // 3. Districts count
  const [districtRows] = await pool.query('SELECT COUNT(*) as count FROM districts');
  console.log('Total districts in `districts` table:', districtRows[0].count);

  // 4. Attractions count
  let attractionCount = 0;
  if (tableNames.includes('attractions')) {
    const [attRows] = await pool.query('SELECT COUNT(*) as count FROM attractions');
    attractionCount = attRows[0].count;
    console.log('Total attractions in `attractions` table:', attractionCount);
  }

  // 5. Collections & Collection Items count
  if (tableNames.includes('collections')) {
    const [colRows] = await pool.query('SELECT COUNT(*) as count FROM collections');
    console.log('Total collections in `collections` table:', colRows[0].count);
  }
  if (tableNames.includes('collection_items')) {
    const [colItemRows] = await pool.query('SELECT COUNT(*) as count FROM collection_items');
    console.log('Total items in `collection_items` table:', colItemRows[0].count);
    const [sampleItems] = await pool.query('SELECT id, collection_id, destination_name, image_url FROM collection_items LIMIT 5');
    console.log('Sample collection items:', sampleItems);
  }

  // 6. Entity Images baseline
  const [totalEntityImages] = await pool.query('SELECT COUNT(*) as count FROM entity_images WHERE is_active = TRUE');
  console.log('Total active entity_images:', totalEntityImages[0].count);

  // 7. Breakdown of entity_images:
  // States (Phases 1-28)
  const [state1to28Images] = await pool.query(`
    SELECT COUNT(*) as count FROM entity_images ei
    LEFT JOIN districts d ON ei.district_id = d.id
    WHERE (ei.state_id BETWEEN 1 AND 28 OR d.state_id BETWEEN 1 AND 28)
      AND ei.is_active = TRUE
  `);
  console.log('  - Active entity_images for States 1-28 (Baseline Phase 1):', state1to28Images[0].count);

  // UTs (Phases 29-36)
  const [utImages] = await pool.query(`
    SELECT COUNT(*) as count FROM entity_images ei
    LEFT JOIN districts d ON ei.district_id = d.id
    WHERE (ei.state_id BETWEEN 29 AND 36 OR d.state_id BETWEEN 29 AND 36)
      AND ei.is_active = TRUE
  `);
  console.log('  - Active entity_images for UTs 29-36 (Baseline Phase 2):', utImages[0].count);

  // Total district entity_images
  const [districtEntityImages] = await pool.query(`
    SELECT COUNT(*) as count FROM entity_images WHERE entity_type = 'district' AND is_active = TRUE
  `);
  console.log('  - Total district entity_images:', districtEntityImages[0].count);

  // Total state entity_images
  const [stateEntityImages] = await pool.query(`
    SELECT COUNT(*) as count FROM entity_images WHERE entity_type = 'state' AND is_active = TRUE
  `);
  console.log('  - Total state entity_images (hero & card):', stateEntityImages[0].count);

  // Other entity_images (e.g. attraction, place, collection)
  const [otherEntityImages] = await pool.query(`
    SELECT entity_type, COUNT(*) as count FROM entity_images WHERE entity_type NOT IN ('district', 'state') GROUP BY entity_type
  `);
  console.log('  - Other entity_images:', otherEntityImages);

  // Save baseline snapshot to disk for strict verification
  const baselineSnapshot = {
    timestamp: new Date().toISOString(),
    statesCount: stateRows[0].count,
    districtsCount: districtRows[0].count,
    activeEntityImagesTotal: totalEntityImages[0].count,
    states1to28ActiveImages: state1to28Images[0].count,
    uts29to36ActiveImages: utImages[0].count,
    districtEntityImages: districtEntityImages[0].count,
    stateEntityImages: stateEntityImages[0].count
  };

  fs.writeFileSync('docs/CIMS_PROTECTED_BASELINE.json', JSON.stringify(baselineSnapshot, null, 2), 'utf8');
  console.log('\n✓ Baseline snapshot written to docs/CIMS_PROTECTED_BASELINE.json');

  await closePool();
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
