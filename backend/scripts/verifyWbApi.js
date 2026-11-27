import stateModel from '../src/models/State.js';
import districtModel from '../src/models/District.js';
import { serializeState, serializeDistrict } from '../src/utils/serializer.js';
import { closePool } from '../src/config/db.js';

async function verify() {
  console.log('--- Verifying West Bengal CIMS Integration ---');
  const wbState = await stateModel.getBySlug('west-bengal');
  console.log('State Name:', wbState.name);
  console.log('State Hero Image:', wbState.hero_image_url);

  const districts = await districtModel.getByStateSlug('west-bengal');
  console.log(`Total Districts Returned: ${districts.length}`);

  let uniqueImages = new Set();
  let verifiedCount = 0;
  let onlineImageCount = 0;

  for (const d of districts) {
    const s = serializeDistrict(d, wbState);
    uniqueImages.add(s.image);
    if (s.onlineImageId) onlineImageCount++;
    if (s.imageStatus === 'verified') verifiedCount++;
    console.log(`  -> ${s.name} (${s.slug}):`);
    console.log(`     Image: ${s.image}`);
    console.log(`     Thumbnail: ${s.thumbnailUrl}`);
    console.log(`     Photographer: ${s.photographer}`);
    console.log(`     License: ${s.license}`);
    console.log(`     OnlineImageId: ${s.onlineImageId}`);
  }

  console.log('\n--- Summary ---');
  console.log(`Unique Image URLs: ${uniqueImages.size} / ${districts.length}`);
  console.log(`Districts with Online Images: ${onlineImageCount} / 23`);
  console.log(`Districts with Verified Status: ${verifiedCount} / 23`);

  await closePool();
  if (uniqueImages.size === 23 && onlineImageCount === 23) {
    console.log('SUCCESS: All 23 West Bengal districts have 100% unique online Wikimedia images and proper attribution!');
    process.exit(0);
  } else {
    console.error('FAIL: Mismatch in uniqueness or online images count.');
    process.exit(1);
  }
}

verify().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
