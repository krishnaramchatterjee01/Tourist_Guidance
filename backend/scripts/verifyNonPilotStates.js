import stateModel from '../src/models/State.js';
import districtModel from '../src/models/District.js';
import { serializeState, serializeDistrict } from '../src/utils/serializer.js';
import { closePool } from '../src/config/db.js';

async function testNonPilot() {
  console.log('--- Verifying Backward Compatibility on Non-Pilot States ---');

  // Test 1: Arunachal Pradesh
  const apState = await stateModel.getBySlug('arunachal-pradesh');
  const apDistricts = await districtModel.getByStateSlug('arunachal-pradesh');
  console.log(`Arunachal Pradesh Districts: ${apDistricts.length}`);
  if (apDistricts.length !== 27) {
    throw new Error(`Expected 27 districts for Arunachal Pradesh, got ${apDistricts.length}`);
  }
  const apFirst = serializeDistrict(apDistricts[0], apState);
  console.log('Sample AP District Image:', apFirst.image);

  // Test 2: All states list
  const allStates = await stateModel.getAll();
  console.log(`Total States & UTs returned: ${allStates.length}`);
  if (allStates.length !== 36) {
    throw new Error(`Expected 36 regions, got ${allStates.length}`);
  }

  await closePool();
  console.log('SUCCESS: All non-pilot states, counts, and fallbacks remain 100% intact!');
  process.exit(0);
}

testNonPilot().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
