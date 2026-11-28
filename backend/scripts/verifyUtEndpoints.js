const TARGET_UTS = [
  { slug: 'andaman-and-nicobar-islands', name: 'Andaman and Nicobar Islands', expectedDistricts: 3 },
  { slug: 'chandigarh', name: 'Chandigarh', expectedDistricts: 1 },
  { slug: 'dadra-and-nagar-haveli-and-daman-and-diu', name: 'Dadra and Nagar Haveli and Daman and Diu', expectedDistricts: 3 },
  { slug: 'delhi', name: 'Delhi', expectedDistricts: 11 },
  { slug: 'jammu-and-kashmir', name: 'Jammu and Kashmir', expectedDistricts: 20 },
  { slug: 'ladakh', name: 'Ladakh', expectedDistricts: 2 },
  { slug: 'lakshadweep', name: 'Lakshadweep', expectedDistricts: 1 },
  { slug: 'puducherry', name: 'Puducherry', expectedDistricts: 4 }
];

async function verify() {
  console.log('============================================================');
  console.log('LIVE ENDPOINT VERIFICATION FOR 8 UNION TERRITORIES');
  console.log('============================================================\n');

  let allPassed = true;
  let totalDistrictsVerified = 0;

  for (const ut of TARGET_UTS) {
    console.log(`Checking ${ut.name} (${ut.slug})...`);
    
    // Check State endpoint
    const stateRes = await fetch(`http://localhost:5000/api/states/${ut.slug}`);
    if (!stateRes.ok) {
      console.error(`  FAIL: State endpoint returned ${stateRes.status}`);
      allPassed = false;
      continue;
    }
    const stateData = await stateRes.json();
    if (!stateData.success || !stateData.data.heroImage || !stateData.data.image) {
      console.error(`  FAIL: Invalid state payload structure for ${ut.slug}`);
      allPassed = false;
      continue;
    }
    console.log(`  ✓ State Hero: ${stateData.data.heroImage.substring(0, 70)}...`);
    console.log(`  ✓ State Card: ${stateData.data.image.substring(0, 70)}...`);

    // Check Districts endpoint
    const distRes = await fetch(`http://localhost:5000/api/states/${ut.slug}/districts`);
    if (!distRes.ok) {
      console.error(`  FAIL: Districts endpoint returned ${distRes.status}`);
      allPassed = false;
      continue;
    }
    const distData = await distRes.json();
    if (!distData.success || !Array.isArray(distData.data)) {
      console.error(`  FAIL: Invalid districts payload structure for ${ut.slug}`);
      allPassed = false;
      continue;
    }

    if (distData.data.length !== ut.expectedDistricts) {
      console.error(`  FAIL: Expected ${ut.expectedDistricts} districts, got ${distData.data.length}`);
      allPassed = false;
      continue;
    }

    const seenUrls = new Set();
    let validDistricts = 0;
    for (const d of distData.data) {
      const isWikimedia = /^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(d.image);
      if (d.image && isWikimedia && d.onlineImageId && d.photographer && d.license) {
        validDistricts++;
        seenUrls.add(d.image);
      } else {
        console.error(`  FAIL: District ${d.name} missing required CIMS metadata!`, d);
        allPassed = false;
      }
    }

    if (seenUrls.size !== ut.expectedDistricts) {
      console.error(`  FAIL: Duplicate images found! Unique: ${seenUrls.size}, Expected: ${ut.expectedDistricts}`);
      allPassed = false;
    } else {
      console.log(`  ✓ All ${validDistricts} districts have 100% unique authentic Wikimedia images & metadata.`);
    }

    totalDistrictsVerified += validDistricts;
  }

  console.log('\n============================================================');
  console.log(`VERIFICATION SUMMARY: ${allPassed ? 'ALL PASSED' : 'FAILURES DETECTED'}`);
  console.log(`Total UT Districts Verified: ${totalDistrictsVerified} / 45`);
  console.log('============================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

verify().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
