import { getPool, closePool } from '../src/config/db.js';

async function main() {
  const pool = getPool();
  try {
    console.log('=== DATABASE INVENTORY AUDIT ===');
    
    // 1. Core tables counts
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));

    const [[{ statesCount }]] = await pool.query('SELECT COUNT(*) as statesCount FROM states');
    const [[{ statesOnly }]] = await pool.query("SELECT COUNT(*) as statesOnly FROM states WHERE region_type = 'state'");
    const [[{ utsOnly }]] = await pool.query("SELECT COUNT(*) as utsOnly FROM states WHERE region_type = 'ut'");
    const [[{ districtsCount }]] = await pool.query('SELECT COUNT(*) as districtsCount FROM districts');
    const [[{ placesCount }]] = await pool.query('SELECT COUNT(*) as placesCount FROM tourist_places');
    const [[{ collectionsCount }]] = await pool.query('SELECT COUNT(*) as collectionsCount FROM destination_collections');
    const [[{ itemsCount }]] = await pool.query('SELECT COUNT(*) as itemsCount FROM collection_items');
    const [[{ imagesCount }]] = await pool.query('SELECT COUNT(*) as imagesCount FROM images');
    const [[{ entityImagesCount }]] = await pool.query('SELECT COUNT(*) as entityImagesCount FROM entity_images');

    console.log('\nEntity counts:');
    console.log({
      statesCount,
      statesOnly,
      utsOnly,
      districtsCount,
      placesCount,
      collectionsCount,
      itemsCount,
      imagesCount,
      entityImagesCount
    });

    // 2. State-level entity images breakdown
    const [stateImages] = await pool.query(`
      SELECT 
        s.id as state_id,
        s.name as state_name,
        s.slug,
        s.region_type,
        s.image_url as state_image_url,
        s.hero_image_url as state_hero_image_url,
        ei.id as entity_image_id,
        ei.image_role,
        ei.is_active,
        i.id as image_id,
        i.provider_name,
        i.display_url,
        i.quality_score,
        i.status as image_status,
        i.license_name,
        i.photographer_name
      FROM states s
      LEFT JOIN entity_images ei ON ei.state_id = s.id AND ei.entity_type = 'state'
      LEFT JOIN images i ON ei.image_id = i.id
      ORDER BY s.region_type, s.name, ei.image_role, ei.display_order
    `);

    console.log(`\nTotal state-level entity_images rows returned: ${stateImages.length}`);

    // Group by state
    const statesMap = {};
    for (const row of stateImages) {
      if (!statesMap[row.state_id]) {
        statesMap[row.state_id] = {
          id: row.state_id,
          name: row.state_name,
          slug: row.slug,
          region_type: row.region_type,
          state_image_url: row.state_image_url,
          state_hero_image_url: row.state_hero_image_url,
          roles: []
        };
      }
      if (row.entity_image_id) {
        statesMap[row.state_id].roles.push({
          entity_image_id: row.entity_image_id,
          image_role: row.image_role,
          is_active: row.is_active,
          image_id: row.image_id,
          provider_name: row.provider_name,
          display_url: row.display_url,
          quality_score: row.quality_score,
          image_status: row.image_status,
          license_name: row.license_name,
          photographer: row.photographer_name
        });
      }
    }

    console.log(`\nFound ${Object.keys(statesMap).length} distinct states/UTs in map.`);
    
    // Sample state details
    const sampleIds = Object.keys(statesMap).slice(0, 5);
    for (const sid of sampleIds) {
      console.log(`\nSample State [${statesMap[sid].name}] (${statesMap[sid].region_type}):`, {
        state_image_url: statesMap[sid].state_image_url?.substring(0, 60),
        state_hero_image_url: statesMap[sid].state_hero_image_url?.substring(0, 60),
        roles: statesMap[sid].roles.map(r => ({ role: r.image_role, active: r.is_active, provider: r.provider_name, img_id: r.image_id, url: r.display_url?.substring(0, 60) }))
      });
    }

    // Role distribution across all states
    const [roleCounts] = await pool.query(`
      SELECT image_role, is_active, COUNT(*) as cnt
      FROM entity_images
      WHERE entity_type = 'state'
      GROUP BY image_role, is_active
    `);
    console.log('\nState entity_images role distribution:', roleCounts);

    // Provider distribution in images table
    const [providerCounts] = await pool.query(`
      SELECT provider_name, status, COUNT(*) as cnt
      FROM images
      GROUP BY provider_name, status
    `);
    console.log('\nMaster Images Provider distribution:', providerCounts);

  } catch (err) {
    console.error('Audit Error:', err);
  } finally {
    await closePool();
  }
}

main();
