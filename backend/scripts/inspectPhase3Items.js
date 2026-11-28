import { getPool } from '../src/config/db.js';

async function main() {
  const pool = getPool();

  // 1. Collections
  const [cols] = await pool.query(`
    SELECT ci.id, c.slug as col_slug, ci.destination_name, ci.state_name, ci.location, ci.image_url
    FROM collection_items ci
    JOIN destination_collections c ON c.id = ci.collection_id
    ORDER BY c.slug, ci.display_order
  `);
  console.log(`=== COLLECTION ITEMS (${cols.length}) ===`);
  const colMap = {};
  for (const item of cols) {
    if (!colMap[item.col_slug]) colMap[item.col_slug] = [];
    colMap[item.col_slug].push(item);
  }
  for (const [colSlug, items] of Object.entries(colMap)) {
    console.log(`\nCollection [${colSlug}] (${items.length} items):`);
    items.forEach(it => console.log(`  - [ID: ${it.id}] ${it.destination_name} (${it.state_name || it.location || 'N/A'}) -> ${it.image_url}`));
  }

  // 2. Tourist Places
  const [places] = await pool.query(`
    SELECT tp.id, tp.name, tp.category, tp.image_url, d.name as district_name, d.slug as district_slug, s.name as state_name, s.slug as state_slug
    FROM tourist_places tp
    JOIN districts d ON d.id = tp.district_id
    JOIN states s ON s.id = d.state_id
    ORDER BY s.name, d.name, tp.name
  `);
  console.log(`\n=== TOURIST PLACES (${places.length}) ===`);
  const placesByState = {};
  for (const p of places) {
    if (!placesByState[p.state_name]) placesByState[p.state_name] = [];
    placesByState[p.state_name].push(p);
  }
  for (const [st, pList] of Object.entries(placesByState)) {
    console.log(`State [${st}]: ${pList.length} attractions`);
  }

  // 3. States with local image paths
  const [localStates] = await pool.query(`
    SELECT id, name, slug, image_url, hero_image_url
    FROM states
    WHERE image_url LIKE '%/images/%' OR hero_image_url LIKE '%/images/%'
    ORDER BY id
  `);
  console.log(`\n=== STATES WITH LOCAL IMAGE PATHS (${localStates.length}) ===`);
  localStates.forEach(s => console.log(`  - [ID: ${s.id}] ${s.name}: ${s.image_url} | ${s.hero_image_url}`));

  // 4. Districts with local image paths
  const [localDistricts] = await pool.query(`
    SELECT d.id, d.name, d.slug, s.name as state_name, d.image_url
    FROM districts d
    JOIN states s ON s.id = d.state_id
    WHERE d.image_url LIKE '%/images/%' OR d.hero_image_url LIKE '%/images/%'
    ORDER BY s.name, d.name
  `);
  console.log(`\n=== DISTRICTS WITH LOCAL IMAGE PATHS (${localDistricts.length}) ===`);
  console.log(`Total districts with /images/: ${localDistricts.length}`);

  // 5. Existing CIMS state images
  const [stateEntityImgs] = await pool.query(`
    SELECT ei.state_id, s.name, s.slug, ei.image_role, i.display_url
    FROM entity_images ei
    JOIN states s ON s.id = ei.state_id
    JOIN images i ON i.id = ei.image_id
    WHERE ei.entity_type = 'state' AND ei.is_active = TRUE
    ORDER BY s.id, ei.image_role
  `);
  console.log(`\n=== ACTIVE STATE ENTITY IMAGES IN CIMS (${stateEntityImgs.length}) ===`);

  await pool.end();
}

main().catch(console.error);
