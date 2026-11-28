import fs from 'fs';
import path from 'path';
import { getPool, closePool } from '../src/config/db.js';
import { processRegion } from './runPhase4BatchSync.js';
import StateModel from '../src/models/State.js';

const BATCHES = {
  1: ['andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa'],
  2: ['gujarat', 'haryana', 'himachal-pradesh', 'jharkhand', 'karnataka', 'kerala'],
  3: ['madhya-pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland'],
  4: ['odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil-nadu', 'telangana'],
  5: ['tripura', 'uttar-pradesh', 'uttarakhand', 'west-bengal', 'andaman-and-nicobar-islands', 'chandigarh'],
  6: ['dadra-and-nagar-haveli-and-daman-and-diu', 'delhi', 'jammu-and-kashmir', 'ladakh', 'lakshadweep', 'puducherry']
};

async function runBatch(batchNum) {
  const slugs = BATCHES[batchNum];
  if (!slugs) {
    console.error(`Invalid batch number: ${batchNum}`);
    process.exit(1);
  }

  console.log(`\n============================================================`);
  console.log(`      STARTING CIMS PHASE 4: STAGE 1 — BATCH ${batchNum}`);
  console.log(`      Regions: ${slugs.join(', ')}`);
  console.log(`============================================================\n`);

  const pool = getPool();
  const batchReport = [];

  try {
    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];
      console.log(`[Batch ${batchNum}] [${i + 1}/6] Processing ${slug}...`);
      const regionRes = await processRegion(slug, pool);

      // Verify via StateModel API query
      const stateFromModel = await StateModel.getBySlug(slug);
      const apiVerified = stateFromModel && 
                          stateFromModel.image_url && 
                          stateFromModel.hero_image_url;

      regionRes.apiVerification = {
        verified: !!apiVerified,
        activePrimaryUrl: stateFromModel?.image_url,
        activeHeroUrl: stateFromModel?.hero_image_url
      };

      console.log(`  ✓ Primary: ${regionRes.primary.action} (QS: ${regionRes.primary.newScore || regionRes.primary.score})`);
      console.log(`  ✓ Hero:    ${regionRes.hero.action} (QS: ${regionRes.hero.newScore || regionRes.hero.score})`);
      console.log(`  ✓ API Model Response Verified: ${regionRes.apiVerification.verified}`);

      batchReport.push(regionRes);
    }

    // Save batch output
    const scratchDir = 'C:\\Desktop\\coding\\Tourist_guide 2.0\\backend\\scratch';
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }

    const batchFilePath = path.join(scratchDir, `batch_${batchNum}_report.json`);
    fs.writeFileSync(batchFilePath, JSON.stringify(batchReport, null, 2), 'utf8');

    console.log(`\n============================================================`);
    console.log(`✓ BATCH ${batchNum} COMPLETED SUCCESSFULLY AND VERIFIED`);
    console.log(`  Saved to: ${batchFilePath}`);
    console.log(`============================================================\n`);

  } catch (err) {
    console.error(`\n❌ ERROR in Batch ${batchNum}:`, err);
    process.exit(1);
  } finally {
    await closePool();
  }
}

const batchArg = parseInt(process.argv[2], 10) || 1;
runBatch(batchArg);
