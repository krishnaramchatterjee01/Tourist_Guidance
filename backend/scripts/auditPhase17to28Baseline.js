import { getPool, closePool } from '../src/config/db.js';
import fs from 'fs';
import path from 'path';

async function audit() {
  const pool = getPool();
  try {
    const targetSlugs = [
      'meghalaya', 'mizoram', 'nagaland', 'odisha',
      'punjab', 'rajasthan', 'sikkim', 'tamil-nadu',
      'telangana', 'tripura', 'uttar-pradesh', 'uttarakhand'
    ];

    console.log('=== TARGET STATES AUDIT (PHASES 17-28) ===');
    const [states] = await pool.query(
      'SELECT id, name, slug FROM states WHERE slug IN (?) ORDER BY name ASC',
      [targetSlugs]
    );

    let totalDistricts = 0;
    const inventory = {};

    for (const s of states) {
      const [districts] = await pool.query(
        'SELECT id, name, slug FROM districts WHERE state_id = ? ORDER BY name ASC',
        [s.id]
      );
      inventory[s.slug] = {
        stateId: s.id,
        stateName: s.name,
        stateSlug: s.slug,
        districtCount: districts.length,
        districts: districts.map(d => ({ id: d.id, name: d.name, slug: d.slug }))
      };
      totalDistricts += districts.length;
      console.log(`[State ID ${s.id}] ${s.name} (${s.slug}): ${districts.length} districts`);
    }

    console.log('\nTotal target districts across 12 states:', totalDistricts);

    // Save inventory JSON for research scripts
    fs.writeFileSync(
      path.resolve('backend/scripts/phase17to28DistrictInventory.json'),
      JSON.stringify(inventory, null, 2)
    );
    console.log('Saved inventory to backend/scripts/phase17to28DistrictInventory.json');

    // Baseline audit of previously completed 16 states
    const baselineSlugs = [
      'west-bengal', 'andhra-pradesh', 'arunachal-pradesh', 'assam',
      'bihar', 'chhattisgarh', 'goa', 'gujarat',
      'haryana', 'himachal-pradesh', 'jharkhand', 'karnataka',
      'kerala', 'madhya-pradesh', 'maharashtra', 'manipur'
    ];

    const [baselineStates] = await pool.query(
      'SELECT id, name, slug FROM states WHERE slug IN (?) ORDER BY name ASC',
      [baselineSlugs]
    );

    console.log('\n=== BASELINE STATES AUDIT (PHASES 1-16) ===');
    let baselineEntityImagesCount = 0;
    for (const b of baselineStates) {
      const [eImgs] = await pool.query(
        'SELECT count(*) as count FROM entity_images WHERE state_id = ? AND is_active = 1',
        [b.id]
      );
      baselineEntityImagesCount += eImgs[0].count;
      console.log(`[Baseline State ${b.id}] ${b.name} (${b.slug}): ${eImgs[0].count} active entity images`);
    }

    const [totalActiveEntityImages] = await pool.query(
      'SELECT count(*) as count FROM entity_images WHERE is_active = 1'
    );
    console.log('\nTotal active entity images in DB:', totalActiveEntityImages[0].count);
    console.log('Total baseline entity images in DB:', baselineEntityImagesCount);

    const [totalImages] = await pool.query('SELECT count(*) as count FROM images');
    console.log('Total images in images table:', totalImages[0].count);

  } finally {
    await closePool();
  }
}

audit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
