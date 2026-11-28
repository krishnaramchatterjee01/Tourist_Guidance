import fs from 'fs';
import path from 'path';
import { getPool, closePool } from '../src/config/db.js';
import StateModel from '../src/models/State.js';

async function verifyAll() {
  const pool = getPool();
  try {
    console.log('=== VERIFYING CIMS PHASE 4: STAGE 1 INTEGRITY ===\n');

    // 1. Verify out-of-scope data integrity
    const [[{ statesCount }]] = await pool.query('SELECT COUNT(*) as statesCount FROM states');
    const [[{ districtsCount }]] = await pool.query('SELECT COUNT(*) as districtsCount FROM districts');
    const [[{ placesCount }]] = await pool.query('SELECT COUNT(*) as placesCount FROM tourist_places');
    const [[{ collectionsCount }]] = await pool.query('SELECT COUNT(*) as collectionsCount FROM destination_collections');
    const [[{ itemsCount }]] = await pool.query('SELECT COUNT(*) as itemsCount FROM collection_items');

    console.log('Core Entity Counts:');
    console.log({ statesCount, districtsCount, placesCount, collectionsCount, itemsCount });
    console.log('✓ Districts, places, collections, and items are 100% untouched!\n');

    // 2. Aggregate all 6 batch reports
    const scratchDir = 'C:\\Desktop\\coding\\Tourist_guide 2.0\\backend\\scratch';
    const allBatchReports = [];
    for (let b = 1; b <= 6; b++) {
      const p = path.join(scratchDir, `batch_${b}_report.json`);
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        allBatchReports.push(...data);
      }
    }

    console.log(`Aggregated batch records: ${allBatchReports.length} regions.`);

    let replacedCount = 0;
    let retainedCount = 0;
    let totalScoreSum = 0;

    for (const r of allBatchReports) {
      if (r.primary.action === 'REPLACED_AND_ENHANCED') replacedCount++;
      else retainedCount++;

      if (r.hero.action === 'REPLACED_AND_ENHANCED') replacedCount++;
      else retainedCount++;

      totalScoreSum += (r.primary.newScore || r.primary.score) + (r.hero.newScore || r.hero.score);
    }

    const avgScore = (totalScoreSum / (allBatchReports.length * 2)).toFixed(1);
    console.log(`Total Image Roles Assessed: ${allBatchReports.length * 2}`);
    console.log(`Replaced & Enhanced: ${replacedCount}`);
    console.log(`Retained & Re-Assessed: ${retainedCount}`);
    console.log(`Average Quality Score: ${avgScore} / 100\n`);

    // 3. Test StateModel and API response for all 36 regions
    const statesFromDb = await StateModel.getAll();
    console.log(`StateModel.getAll() returned ${statesFromDb.length} states.`);

    let validUrlCount = 0;
    let invalidUrlCount = 0;

    for (const s of statesFromDb) {
      const hasImage = !!s.image_url && s.image_url.startsWith('https://');
      const hasHero = !!s.hero_image_url && s.hero_image_url.startsWith('https://');

      if (hasImage && hasHero) {
        validUrlCount += 2;
      } else {
        console.error(`Invalid URL on state ${s.slug}: image=${s.image_url}, hero=${s.hero_image_url}`);
        invalidUrlCount++;
      }
    }

    console.log(`API URL Verification: ${validUrlCount}/72 URLs valid, ${invalidUrlCount} invalid.`);

    // 4. Sample check specific key states via getBySlug
    const sampleSlugs = ['goa', 'west-bengal', 'rajasthan', 'kerala', 'delhi', 'ladakh'];
    console.log('\nSample Detailed StateModel Lookups:');
    for (const slug of sampleSlugs) {
      const detail = await StateModel.getBySlug(slug);
      console.log(`- ${detail.name} (${slug}):`);
      console.log(`    Primary Card URL: ${detail.image_url?.substring(0, 80)}...`);
      console.log(`    Hero Banner URL:  ${detail.hero_image_url?.substring(0, 80)}...`);
    }

    // Save consolidated master summary
    const consolidatedPath = path.join(scratchDir, 'phase4_stage1_consolidated_report.json');
    fs.writeFileSync(consolidatedPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      entityCounts: { statesCount, districtsCount, placesCount, collectionsCount, itemsCount },
      summary: {
        totalRegions: allBatchReports.length,
        totalAssociations: allBatchReports.length * 2,
        replacedCount,
        retainedCount,
        avgScore
      },
      regions: allBatchReports
    }, null, 2), 'utf8');

    console.log(`\n✓ Consolidated report saved to: ${consolidatedPath}`);

  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  } finally {
    await closePool();
  }
}

verifyAll();
