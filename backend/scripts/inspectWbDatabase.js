import mysql from 'mysql2/promise';
import { env } from '../src/config/env.js';

async function inspect() {
  console.log('=== EXPLORE INDIA — WEST BENGAL CIMS DATABASE AUDIT ===');
  const conn = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  });

  try {
    // 1. Check West Bengal state record
    const [stateRows] = await conn.query('SELECT * FROM states WHERE slug = "west-bengal"');
    console.log('\n1. State Record:');
    if (stateRows.length === 0) {
      console.log('   ERROR: West Bengal state not found!');
    } else {
      const s = stateRows[0];
      console.log(`   ID: ${s.id}, Name: ${s.name}, Slug: ${s.slug}, Image: ${s.image_url}, Hero: ${s.hero_image_url}`);
    }
    const wbStateId = stateRows[0]?.id;

    // 2. Check all West Bengal districts
    const [districts] = await conn.query(
      'SELECT id, name, slug, image_url, hero_image_url, state_id FROM districts WHERE state_id = ? ORDER BY display_order ASC, name ASC',
      [wbStateId]
    );
    console.log(`\n2. Districts in DB for State ID ${wbStateId}: ${districts.length}`);
    for (const d of districts) {
      console.log(`   [ID: ${d.id}] ${d.name} (${d.slug}) -> legacy image_url: ${d.image_url}`);
    }

    // 3. Check entity_images for West Bengal state and districts
    console.log('\n3. Entity Images Mappings for West Bengal:');
    const [entityImages] = await conn.query(`
      SELECT ei.id, ei.entity_type, ei.state_id, ei.district_id, ei.place_id,
             ei.image_id, ei.image_role, ei.is_active,
             i.provider_name, i.provider_image_id, i.display_url, i.thumbnail_url,
             i.title, i.photographer_name, i.license_name, i.status,
             d.name AS district_name, d.slug AS district_slug
      FROM entity_images ei
      JOIN images i ON ei.image_id = i.id
      LEFT JOIN districts d ON ei.district_id = d.id
      WHERE (ei.entity_type = 'state' AND ei.state_id = ?)
         OR (ei.entity_type = 'district' AND ei.district_id IN (SELECT id FROM districts WHERE state_id = ?))
      ORDER BY ei.entity_type, d.name, ei.image_role
    `, [wbStateId, wbStateId]);

    console.log(`   Total mappings found: ${entityImages.length}`);
    for (const m of entityImages) {
      console.log(`   - Entity: ${m.entity_type} (Dist ID: ${m.district_id}, ${m.district_name || 'State'}), Role: ${m.image_role}, Active: ${m.is_active}, Img ID: ${m.image_id}`);
      console.log(`     Title: ${m.title}`);
      console.log(`     Display URL: ${m.display_url}`);
      console.log(`     Status: ${m.status}, License: ${m.license_name}, Author: ${m.photographer_name}`);
    }

    // 4. Check for duplicate image assignments across districts
    console.log('\n4. Duplicate Image Analysis:');
    const [dupImageIds] = await conn.query(`
      SELECT ei.image_id, COUNT(DISTINCT ei.district_id) as district_count,
             GROUP_CONCAT(d.name) as districts,
             i.display_url, i.title
      FROM entity_images ei
      JOIN images i ON ei.image_id = i.id
      JOIN districts d ON ei.district_id = d.id
      WHERE ei.entity_type = 'district' AND ei.image_role = 'primary' AND ei.is_active = TRUE
      GROUP BY ei.image_id
      HAVING district_count > 1
    `);
    console.log(`   Primary Image IDs shared across multiple districts: ${dupImageIds.length}`);
    for (const dup of dupImageIds) {
      console.log(`   WARNING: Image ID ${dup.image_id} shared by ${dup.district_count} districts: ${dup.districts}`);
      console.log(`     URL: ${dup.display_url}`);
    }

    // 5. Check if different image IDs point to the same URL or title
    const [dupUrls] = await conn.query(`
      SELECT display_url, COUNT(*) as url_count, GROUP_CONCAT(id) as img_ids
      FROM images
      WHERE state = 'West Bengal'
      GROUP BY display_url
      HAVING url_count > 1
    `);
    console.log(`   Duplicate display URLs in images table: ${dupUrls.length}`);
    for (const u of dupUrls) {
      console.log(`   Duplicate URL count ${u.url_count} for IDs ${u.img_ids}: ${u.display_url}`);
    }

    // 6. Check tourist places for West Bengal districts
    console.log('\n5. Tourist Places for West Bengal:');
    const [places] = await conn.query(`
      SELECT p.id, p.name, p.slug, p.category, p.image_url, p.district_id, d.name as district_name
      FROM tourist_places p
      JOIN districts d ON p.district_id = d.id
      WHERE d.state_id = ?
    `, [wbStateId]);
    console.log(`   Total tourist places found: ${places.length}`);
    for (const p of places) {
      console.log(`   - [Place ID: ${p.id}] ${p.name} (District: ${p.district_name}) -> image: ${p.image_url}`);
    }

  } finally {
    await conn.end();
  }
}

inspect().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
