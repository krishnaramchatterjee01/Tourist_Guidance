import stateModel from '../src/models/State.js';
import districtModel from '../src/models/District.js';
import { serializeState, serializeDistrict, serializePlace } from '../src/utils/serializer.js';
import { closePool } from '../src/config/db.js';

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

async function verifyAll() {
  console.log('=== END-TO-END VERIFICATION: WEST BENGAL CIMS IMAGE SYSTEM ===\n');

  // 1. Verify State
  const wbState = await stateModel.getBySlug('west-bengal');
  console.log(`1. State Verification:`);
  console.log(`   Name: ${wbState.name}`);
  console.log(`   Hero Image: ${wbState.hero_image_url}`);
  console.log(`   Card Image: ${wbState.image_url}`);

  const sHeroCheck = await fetch(wbState.hero_image_url, { headers: { 'User-Agent': USER_AGENT, 'Range': 'bytes=0-1024' } });
  console.log(`   -> Hero HTTP Status: ${sHeroCheck.status} (${sHeroCheck.headers.get('content-type')})`);

  // 2. Verify all 23 districts
  const districts = await districtModel.getByStateSlug('west-bengal');
  console.log(`\n2. Districts Verification (${districts.length} / 23):`);

  const seenUrls = new Set();
  const seenIds = new Set();
  const districtResults = [];

  for (const d of districts) {
    const s = serializeDistrict(d, wbState);

    if (seenUrls.has(s.image)) {
      throw new Error(`CRITICAL FAILURE: Duplicate image URL detected for district "${s.name}": ${s.image}`);
    }
    seenUrls.add(s.image);
    seenIds.add(s.onlineImageId);

    // Verify live URL
    const check = await fetch(s.thumbnailUrl, { headers: { 'User-Agent': USER_AGENT, 'Range': 'bytes=0-1024' } });
    const isImage = check.ok && (check.headers.get('content-type') || '').startsWith('image/');

    districtResults.push({
      id: s.id,
      name: s.name,
      slug: s.slug,
      onlineImageId: s.onlineImageId,
      image: s.image,
      thumbnail: s.thumbnailUrl,
      author: s.photographer,
      license: s.license,
      status: s.imageStatus,
      httpStatus: check.status,
      isImageOk: isImage
    });

    console.log(`   ✓ [ID ${s.id}] ${s.name}:`);
    console.log(`     Image: ${s.thumbnailUrl}`);
    console.log(`     HTTP ${check.status} | Author: ${s.photographer} | License: ${s.license}`);
  }

  // 3. Verify Non-Pilot States Protection
  console.log(`\n3. Non-Pilot States Verification:`);
  const allStates = await stateModel.getAll();
  console.log(`   Total regions in DB: ${allStates.length} (Expected 36)`);

  const apDistricts = await districtModel.getByStateSlug('arunachal-pradesh');
  console.log(`   Arunachal Pradesh Districts: ${apDistricts.length} (Expected 27)`);

  const rjDistricts = await districtModel.getByStateSlug('rajasthan');
  console.log(`   Rajasthan Districts: ${rjDistricts.length} (Expected 33)`);

  // 4. Verify Tourist Attractions in West Bengal
  console.log(`\n4. Tourist Attractions Sample Check:`);
  const darjAttractions = await districtModel.getAttractions(6); // Darjeeling
  console.log(`   Darjeeling Attractions: ${darjAttractions.length}`);
  for (const a of darjAttractions) {
    console.log(`   - ${a.name} (${a.category}) -> Image: ${a.image_url}`);
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Total West Bengal Districts: ${districts.length} / 23`);
  console.log(`Unique Primary Image URLs: ${seenUrls.size} / 23`);
  console.log(`Unique Primary Image IDs: ${seenIds.size} / 23`);
  const liveCount = districtResults.filter(r => r.isImageOk).length;
  console.log(`Live HTTP Verified Images: ${liveCount} / 23`);

  await closePool();

  if (districts.length === 23 && seenUrls.size === 23 && liveCount === 23) {
    console.log('\n🎉 ALL ACCEPTANCE CRITERIA FULLY PASSED!');
    process.exit(0);
  } else {
    console.error('\n❌ FAILURE: Acceptance criteria not met.');
    process.exit(1);
  }
}

verifyAll().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
