import imageCollector from '../src/services/images/imageCollector.js';
import { getPool, closePool } from '../src/config/db.js';

const TARGET_UTS = [
  { slug: 'andaman-and-nicobar-islands', name: 'Andaman and Nicobar Islands', method: 'collectAndamanAndNicobarIslandsPilot', expectedDistricts: 3 },
  { slug: 'chandigarh', name: 'Chandigarh', method: 'collectChandigarhPilot', expectedDistricts: 1 },
  { slug: 'dadra-and-nagar-haveli-and-daman-and-diu', name: 'Dadra and Nagar Haveli and Daman and Diu', method: 'collectDadraAndNagarHaveliAndDamanAndDiuPilot', expectedDistricts: 3 },
  { slug: 'delhi', name: 'Delhi', method: 'collectDelhiPilot', expectedDistricts: 11 },
  { slug: 'jammu-and-kashmir', name: 'Jammu and Kashmir', method: 'collectJammuAndKashmirPilot', expectedDistricts: 20 },
  { slug: 'ladakh', name: 'Ladakh', method: 'collectLadakhPilot', expectedDistricts: 2 },
  { slug: 'lakshadweep', name: 'Lakshadweep', method: 'collectLakshadweepPilot', expectedDistricts: 1 },
  { slug: 'puducherry', name: 'Puducherry', method: 'collectPuducherryPilot', expectedDistricts: 4 }
];

const BASELINE_STATE_IDS = Array.from({ length: 28 }, (_, i) => i + 1);
const TARGET_UT_IDS = [29, 30, 31, 32, 33, 34, 35, 36];

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

async function getUtActiveCount(pool) {
  const [rows] = await pool.query(`
    SELECT COUNT(*) as count 
    FROM entity_images ei
    LEFT JOIN districts d ON ei.district_id = d.id
    WHERE (ei.state_id IN (${TARGET_UT_IDS.join(',')}) OR d.state_id IN (${TARGET_UT_IDS.join(',')}))
      AND ei.is_active = TRUE
  `);
  return rows[0].count;
}

async function main() {
  console.log('============================================================');
  console.log('STARTING UNION TERRITORY SYNC: PHASES 29 TO 36 (8 UTs)');
  console.log('============================================================\n');

  const pool = getPool();
  if (!pool) {
    console.error('Database connection failed.');
    process.exit(1);
  }

  // 1. Audit baseline before sync
  const initialBaselineCount = await getBaselineCount(pool);
  console.log(`[Baseline Audit] Initial active entity images for 28 baseline states: ${initialBaselineCount}`);
  if (initialBaselineCount !== 1499) {
    console.warn(`[Warning] Expected 1499 baseline images, found ${initialBaselineCount}`);
  }

  const results = [];
  let totalNewDistrictsCovered = 0;
  let totalNewBackups = 0;

  for (const ut of TARGET_UTS) {
    console.log(`\n--- Syncing Phase: ${ut.name} (${ut.slug}) ---`);
    const fn = imageCollector[ut.method].bind(imageCollector);
    const res = await fn();
    console.log(`  Result for ${ut.name}:`, JSON.stringify(res));

    if (!res.success) {
      console.error(`FAILED syncing ${ut.name}:`, res.error || res.message);
      process.exit(1);
    }

    if (res.districtsCovered !== ut.expectedDistricts) {
      console.warn(`[Warning] Expected ${ut.expectedDistricts} districts for ${ut.name}, but covered ${res.districtsCovered}`);
    }

    totalNewDistrictsCovered += res.districtsCovered;
    totalNewBackups += (res.backupsConfigured || 0);
    results.push({ ...ut, ...res });
  }

  // 2. Audit baseline after sync
  const finalBaselineCount = await getBaselineCount(pool);
  console.log(`\n[Baseline Audit] Final active entity images for 28 baseline states: ${finalBaselineCount}`);
  if (finalBaselineCount !== initialBaselineCount) {
    console.error(`CRITICAL FAILURE: Baseline state count changed from ${initialBaselineCount} to ${finalBaselineCount}!`);
    process.exit(1);
  } else {
    console.log('✓ BASELINE INTEGRITY 100% PRESERVED: Baseline states (IDs 1-28) are frozen and intact.');
  }

  // 3. Verify total new entity images
  const finalUtActiveCount = await getUtActiveCount(pool);
  console.log(`[Target Audit] Total active entity images for 8 Union Territories: ${finalUtActiveCount}`);

  // 4. Verify total nationwide entity images
  const [totalNationwideRows] = await pool.query('SELECT COUNT(*) as count FROM entity_images WHERE is_active = TRUE');
  console.log(`[Nationwide Audit] Total active entity images across all 36 regions: ${totalNationwideRows[0].count}`);

  console.log('\n============================================================');
  console.log('SYNC SUMMARY:');
  console.log(`  - Total Union Territories Synced: ${TARGET_UTS.length}`);
  console.log(`  - Total UT Districts Covered: ${totalNewDistrictsCovered} / 45`);
  console.log(`  - Total UT Backups Configured: ${totalNewBackups} / 45`);
  console.log(`  - Baseline Active Images Preserved: ${finalBaselineCount}`);
  console.log(`  - UT Active Images: ${finalUtActiveCount}`);
  console.log(`  - Total Nationwide Active Images: ${totalNationwideRows[0].count}`);
  console.log('============================================================\n');

  await closePool();
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
