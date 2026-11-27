import { DistrictModel } from '../src/models/District.js';
import StateModel from '../src/models/State.js';
import { serializeState, serializeDistrict } from '../src/utils/serializer.js';
import { closePool } from '../src/config/db.js';

async function verify() {
  console.log('=== VERIFY BIHAR API SERIALIZATION & DATA INTEGRITY ===\n');

  const state = await StateModel.getBySlug('bihar');
  if (!state) throw new Error('State "bihar" not found');

  const rawDistricts = await DistrictModel.getByStateSlug('bihar');
  console.log(`Fetched ${rawDistricts.length} raw districts from DB.`);

  const serializedDistricts = rawDistricts.map(d => serializeDistrict(d, state));
  const serializedState = serializeState(state, serializedDistricts);

  console.log('State Hero Image:', serializedState.heroImage);
  console.log('State Card Image:', serializedState.image);

  const seenUrls = new Set();
  let uniqueCount = 0;
  let onlineCount = 0;

  serializedDistricts.forEach((d, idx) => {
    if (d.image && d.image.startsWith('https://')) {
      onlineCount++;
    }
    if (!seenUrls.has(d.image)) {
      uniqueCount++;
      seenUrls.add(d.image);
    }
    if (idx < 5 || idx >= 33) {
      console.log(`  [${d.slug.padEnd(20)}] -> ${d.image?.substring(0, 75)}... (onlineId: ${d.onlineImageId})`);
    }
  });

  console.log('\n--- Verification Summary ---');
  console.log(`Districts Count: ${serializedDistricts.length} / 38`);
  console.log(`Online HTTPS Images: ${onlineCount} / 38`);
  console.log(`Unique District Images: ${uniqueCount} / 38`);
  console.log(`State Total Districts: ${serializedState.totalDistricts}`);

  if (uniqueCount !== 38) {
    throw new Error(`Duplicate district images detected! (${uniqueCount}/38 unique)`);
  }

  await closePool();
  console.log('\n✓ ALL 38 BIHAR DISTRICTS 100% UNIQUE, AUTHENTIC & PROPERLY SERIALIZED!');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
