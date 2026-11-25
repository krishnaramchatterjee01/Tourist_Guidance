import fs from 'fs';
import path from 'path';

const errors = [];
const checked = [];

function checkFile(relPath, context) {
  if (!relPath || typeof relPath !== 'string') {
    errors.push(`[${context}] Invalid path: ${relPath}`);
    return;
  }
  if (!relPath.startsWith('/images/')) {
    errors.push(`[${context}] Does not use local /images/ path: ${relPath}`);
    return;
  }
  const fullPath = path.join('public', relPath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`[${context}] File missing on disk: ${fullPath}`);
  } else {
    const size = fs.statSync(fullPath).size;
    if (size < 10000) {
      errors.push(`[${context}] File suspiciously small (${size} bytes): ${fullPath}`);
    } else {
      checked.push({ context, path: relPath, size });
    }
  }
}

async function run() {
  // 1. Explore Data
  const { exploreData } = await import('../src/data/exploreData.js');
  console.log(`Checking Explore Data (${exploreData.length} items)...`);
  exploreData.forEach(d => checkFile(d.img, `exploreData: ${d.name}`));

  // 2. Top Places Data
  const { topPlacesData } = await import('../src/data/topPlacesData.js');
  console.log(`Checking Top Places Data (${topPlacesData.length} items)...`);
  topPlacesData.forEach(d => checkFile(d.img, `topPlacesData: ${d.name}`));

  // 3. Home Sliders Data
  const { homeSlidersData } = await import('../src/data/homeSlidersData.js');
  console.log(`Checking Home Sliders...`);
  homeSlidersData.unionTerritories.forEach(d => checkFile(d.image, `homeSliders UT: ${d.title}`));
  homeSlidersData.explore.forEach(d => checkFile(d.image, `homeSliders explore: ${d.title}`));
  homeSlidersData.topPlaces.forEach(d => checkFile(d.image, `homeSliders topPlaces: ${d.title}`));

  // 4. State Images & Regions Data
  const { STATE_IMAGES } = await import('../src/data/stateImages.js');
  console.log(`Checking STATE_IMAGES (${Object.keys(STATE_IMAGES).length} items)...`);
  Object.entries(STATE_IMAGES).forEach(([k, v]) => checkFile(v, `STATE_IMAGES: ${k}`));

  const { regionsData } = await import('../src/data/regionsData.js');
  console.log(`Checking regionsData (${regionsData.length} items)...`);
  regionsData.forEach(r => checkFile(r.image, `regionsData: ${r.name}`));

  // 5. Districts
  const { getDistrictImage, getDistrictHeroImage, DISTRICT_IMAGES } = await import('../src/data/districtImages.js');
  const { STATES_DATA } = await import('../districts.js');

  console.log(`Checking Arunachal Pradesh districts (27)...`);
  const arunachal = STATES_DATA['arunachal-pradesh'];
  arunachal.districts.forEach(d => {
    const img = getDistrictImage(d, arunachal);
    if (!img) errors.push(`[Arunachal District] Missing image for: ${d.name}`);
    else checkFile(img, `Arunachal: ${d.name}`);
  });

  console.log(`Checking Andhra Pradesh districts (28)...`);
  const andhra = STATES_DATA['andhra-pradesh'];
  andhra.districts.forEach(d => {
    const img = getDistrictImage(d, andhra);
    if (!img) errors.push(`[Andhra District] Missing image for: ${d.name}`);
    else checkFile(img, `Andhra: ${d.name}`);
  });

  console.log(`Checking West Bengal districts (23)...`);
  const wb = STATES_DATA['west-bengal'];
  wb.districts.forEach(d => {
    const img = getDistrictImage(d, wb);
    if (!img) errors.push(`[West Bengal District] Missing image for: ${d.name}`);
    else checkFile(img, `West Bengal: ${d.name}`);
  });

  console.log(`Checking Uttar Pradesh districts (75)...`);
  const up = STATES_DATA['uttar-pradesh'];
  let upWithLandmarks = 0;
  let upPlaceholders = 0;
  up.districts.forEach(d => {
    const img = getDistrictImage(d, up);
    if (img) {
      upWithLandmarks++;
      checkFile(img, `UP Landmark: ${d.name}`);
    } else {
      upPlaceholders++;
    }
  });
  console.log(`UP districts: ${upWithLandmarks} verified landmarks, ${upPlaceholders} safe placeholders (no Taj Mahal duplication).`);

  // Verify Aligarh does NOT have Taj Mahal
  const aligarh = up.districts.find(d => d.slug === 'aligarh');
  const aligarhImg = getDistrictImage(aligarh, up);
  if (aligarhImg && aligarhImg.includes('taj-mahal')) {
    errors.push('CRITICAL: Aligarh is inheriting Taj Mahal!');
  } else {
    console.log(`Verified: Aligarh correctly does NOT inherit Taj Mahal (returns ${aligarhImg})`);
  }

  // Check Hero Image for State Directory
  console.log(`Checking State Directory Hero Images for all 28 states...`);
  Object.keys(STATES_DATA).forEach(stateSlug => {
    const heroPath = `/images/states/${stateSlug}.jpg`;
    checkFile(heroPath, `State Hero: ${stateSlug}`);
  });

  console.log('-------------------------------------------');
  console.log('TOTAL VERIFIED LOCAL IMAGE CALLS CHECKED:', checked.length);
  console.log('ERRORS FOUND:', errors.length);
  if (errors.length > 0) {
    console.error('AUDIT FAILED WITH ERRORS:', errors);
    process.exit(1);
  } else {
    console.log('ALL AUDITS PASSED WITH ZERO ERRORS!');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
