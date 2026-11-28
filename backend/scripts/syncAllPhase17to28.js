import imageCollector from '../src/services/images/imageCollector.js';
import { getPool, closePool } from '../src/config/db.js';

const TARGET_STATES = [
  { slug: 'meghalaya', name: 'Meghalaya', method: 'collectMeghalayaPilot', expectedDistricts: 12 },
  { slug: 'mizoram', name: 'Mizoram', method: 'collectMizoramPilot', expectedDistricts: 11 },
  { slug: 'nagaland', name: 'Nagaland', method: 'collectNagalandPilot', expectedDistricts: 17 },
  { slug: 'odisha', name: 'Odisha', method: 'collectOdishaPilot', expectedDistricts: 30 },
  { slug: 'punjab', name: 'Punjab', method: 'collectPunjabPilot', expectedDistricts: 23 },
  { slug: 'rajasthan', name: 'Rajasthan', method: 'collectRajasthanPilot', expectedDistricts: 41 },
  { slug: 'sikkim', name: 'Sikkim', method: 'collectSikkimPilot', expectedDistricts: 6 },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', method: 'collectTamilNaduPilot', expectedDistricts: 38 },
  { slug: 'telangana', name: 'Telangana', method: 'collectTelanganaPilot', expectedDistricts: 33 },
  { slug: 'tripura', name: 'Tripura', method: 'collectTripuraPilot', expectedDistricts: 8 },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', method: 'collectUttarPradeshPilot', expectedDistricts: 75 },
  { slug: 'uttarakhand', name: 'Uttarakhand', method: 'collectUttarakhandPilot', expectedDistricts: 13 }
];

const BASELINE_STATE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 28];

async function getBaselineCount(pool) {
  const [rows] = await pool.query(`
    SELECT COUNT(*) as count 
    FROM entity_images ei
    LEFT JOIN districts d ON ei.district_id = d.id
    WHERE (ei.state_id IN (${BASELINE_STATE_IDS.join(',')}) OR d.state_id IN (${BASELINE_STATE_IDS.join(',')}))
      AND ei.is_active = TRUE
  `);
  return rows[0].count;
}

async function main() {
  console.log('============================================================');
  console.log('STARTING NATIONWIDE SYNC: PHASES 17 TO 28 (12 STATES)');
  console.log('============================================================\n');

  const pool = getPool();
  if (!pool) {
    console.error('Database connection failed.');
    process.exit(1);
  }

  // 1. Audit baseline before sync
  const initialBaselineCount = await getBaselineCount(pool);
  console.log(`[Baseline Audit] Initial active entity images for 16 baseline states: ${initialBaselineCount}`);
  if (initialBaselineCount !== 862) {
    console.warn(`[Warning] Expected 862 baseline images, found ${initialBaselineCount}`);
  }

  const results = [];
  let totalNewDistrictsCovered = 0;
  let totalNewBackups = 0;

  for (const s of TARGET_STATES) {
    console.log(`\n--- Syncing Phase: ${s.name} (${s.slug}) ---`);
    const fn = imageCollector[s.method].bind(imageCollector);
    const res = await fn();
    console.log(`  Result for ${s.name}:`, JSON.stringify(res));

    if (!res.success) {
      console.error(`FAILED syncing ${s.name}:`, res.error || res.message);
      process.exit(1);
    }

    if (res.districtsCovered !== s.expectedDistricts) {
      console.warn(`[Warning] Expected ${s.expectedDistricts} districts for ${s.name}, but covered ${res.districtsCovered}`);
    }

    totalNewDistrictsCovered += res.districtsCovered;
    totalNewBackups += (res.backupsConfigured || 0);
    results.push({ ...s, ...res });
  }

  // 2. Audit baseline after sync
  const finalBaselineCount = await getBaselineCount(pool);
  console.log(`\n[Baseline Audit] Final active entity images for 16 baseline states: ${finalBaselineCount}`);
  if (finalBaselineCount !== initialBaselineCount) {
    console.error(`CRITICAL FAILURE: Baseline state count changed from ${initialBaselineCount} to ${finalBaselineCount}!`);
    process.exit(1);
  } else {
    console.log('✓ BASELINE INTEGRITY 100% PRESERVED: Baseline states are frozen and intact.');
  }

  // 3. Verify total new entity images
  const targetStateIds = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
  const [newEntityRows] = await pool.query(`
    SELECT COUNT(*) as count 
    FROM entity_images ei
    LEFT JOIN districts d ON ei.district_id = d.id
    WHERE (ei.state_id IN (${targetStateIds.join(',')}) OR d.state_id IN (${targetStateIds.join(',')}))
      AND ei.is_active = TRUE
  `);
  console.log(`[Target Audit] Total active entity images for 12 target states: ${newEntityRows[0].count}`);

  console.log('\n============================================================');
  console.log('SYNC SUMMARY:');
  console.log(`  - Total States Synced: ${TARGET_STATES.length}`);
  console.log(`  - Total Districts Covered: ${totalNewDistrictsCovered} / 307`);
  console.log(`  - Total Backups Configured: ${totalNewBackups}`);
  console.log(`  - Baseline Active Images Preserved: ${finalBaselineCount}`);
  console.log('============================================================\n');

  await closePool();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Fatal sync error:', err);
  await closePool();
  process.exit(1);
});
