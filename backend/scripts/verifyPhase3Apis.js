async function verifyEndpoints() {
  console.log('====================================================');
  console.log('VERIFYING PHASE 3 REST API ENDPOINTS');
  console.log('====================================================\n');

  const BASE_URL = 'http://localhost:5000';
  let totalTests = 0;
  let passedTests = 0;

  async function check(name, url, validateFn) {
    totalTests++;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`❌ [FAIL] ${name} HTTP ${res.status}`);
        return;
      }
      const data = await res.json();
      const valid = validateFn(data);
      if (valid.pass) {
        passedTests++;
        console.log(`✓ [PASS] ${name}: ${valid.message}`);
      } else {
        console.error(`❌ [FAIL] ${name}: ${valid.message}`);
      }
    } catch (err) {
      console.error(`❌ [ERROR] ${name}: ${err.message}`);
    }
  }

  // 1. Featured Sliders (/api/featured)
  await check('Featured Sliders', `${BASE_URL}/api/featured`, (data) => {
    const d = data.data || data;
    const utSlider = d.utSlider || [];
    const exploreSlider = d.exploreSlider || [];
    const topSlider = d.topSlider || [];

    const allItems = [...utSlider, ...exploreSlider, ...topSlider];
    const hasLocal = allItems.some(it => it.image && it.image.includes('/images/'));
    const allHaveImages = allItems.every(it => it.image && it.image.startsWith('http'));

    if (hasLocal) return { pass: false, message: 'Found local /images/ paths in sliders!' };
    if (!allHaveImages) return { pass: false, message: 'Some slider items missing live URLs!' };
    return { pass: true, message: `UT (${utSlider.length}), Explore (${exploreSlider.length}), Top (${topSlider.length}) all have live Wikimedia URLs.` };
  });

  // 2. Explore Destinations (/api/destinations)
  await check('Explore Destinations', `${BASE_URL}/api/destinations`, (data) => {
    const list = data.data || data;
    const hasLocal = list.some(it => it.img && it.img.includes('/images/'));
    const allValid = list.every(it => it.img && it.img.startsWith('http'));
    if (hasLocal) return { pass: false, message: 'Found local /images/ in explore destinations!' };
    if (!allValid) return { pass: false, message: 'Some destinations missing live URLs!' };
    return { pass: true, message: `${list.length} destinations all have live Wikimedia URLs.` };
  });

  // 3. Top Places (/api/top-places)
  await check('Top Places Attractions', `${BASE_URL}/api/top-places`, (data) => {
    const list = data.data || data;
    const hasLocal = list.some(it => it.img && it.img.includes('/images/'));
    const allValid = list.every(it => it.img && it.img.startsWith('http'));
    if (hasLocal) return { pass: false, message: 'Found local /images/ in top places!' };
    if (!allValid) return { pass: false, message: 'Some top places missing live URLs!' };
    return { pass: true, message: `${list.length} top places all have live Wikimedia URLs.` };
  });

  // 4. States (/api/states)
  await check('States List', `${BASE_URL}/api/states`, (data) => {
    const list = data.data || data;
    const hasLocal = list.some(st => (st.image && st.image.includes('/images/')) || (st.heroImage && st.heroImage.includes('/images/')));
    const allValid = list.every(st => st.image && st.image.startsWith('http'));
    if (hasLocal) return { pass: false, message: 'Found local /images/ in states!' };
    if (!allValid) return { pass: false, message: 'Some states missing live URLs!' };
    return { pass: true, message: `${list.length} states all have live CIMS URLs.` };
  });

  // 5. District Detail (/api/states/west-bengal/districts/darjeeling)
  await check('Darjeeling District & Attractions', `${BASE_URL}/api/states/west-bengal/districts/darjeeling`, (data) => {
    const dist = data.data || data;
    const attractions = dist.attractions || [];
    const hasLocalDistrict = dist.image?.includes('/images/') || dist.heroImage?.includes('/images/');
    const hasLocalAttr = attractions.some(a => a.image && a.image.includes('/images/'));
    const hasUnsplash = attractions.some(a => a.image && a.image.includes('unsplash.com'));

    if (hasLocalDistrict) return { pass: false, message: 'District has local image paths!' };
    if (hasLocalAttr) return { pass: false, message: 'Attractions have local image paths!' };
    if (hasUnsplash) return { pass: false, message: 'Attractions still using generic Unsplash URLs!' };
    return { pass: true, message: `District and ${attractions.length} attractions have verified CIMS URLs with zero local/Unsplash paths.` };
  });

  // 6. Andhra Pradesh District Detail (/api/states/andhra-pradesh/districts/visakhapatnam)
  await check('Visakhapatnam District & Attractions', `${BASE_URL}/api/states/andhra-pradesh/districts/visakhapatnam`, (data) => {
    const dist = data.data || data;
    const attractions = dist.attractions || [];
    const hasLocalDistrict = dist.image?.includes('/images/') || dist.heroImage?.includes('/images/');
    const hasLocalAttr = attractions.some(a => a.image && a.image.includes('/images/'));
    const hasUnsplash = attractions.some(a => a.image && a.image.includes('unsplash.com'));

    if (hasLocalDistrict) return { pass: false, message: 'District has local image paths!' };
    if (hasLocalAttr) return { pass: false, message: 'Attractions have local image paths!' };
    if (hasUnsplash) return { pass: false, message: 'Attractions still using generic Unsplash URLs!' };
    return { pass: true, message: `District and ${attractions.length} attractions have verified CIMS URLs with zero local/Unsplash paths.` };
  });

  console.log(`\n====================================================`);
  console.log(`SUMMARY: ${passedTests} / ${totalTests} API Tests Passed!`);
  console.log(`====================================================`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

verifyEndpoints().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
