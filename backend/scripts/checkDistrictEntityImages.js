import { getPool, closePool } from '../src/config/db.js';

async function checkDetails() {
  const pool = getPool();
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.name, s.slug,
             COUNT(DISTINCT d.id) as district_count,
             COUNT(DISTINCT CASE WHEN ei.entity_type = 'district' AND ei.is_active = 1 THEN ei.id END) as district_entity_images,
             COUNT(DISTINCT CASE WHEN ei.entity_type = 'state' AND ei.is_active = 1 THEN ei.id END) as state_entity_images
      FROM states s
      LEFT JOIN districts d ON d.state_id = s.id
      LEFT JOIN entity_images ei ON (ei.entity_type = 'district' AND ei.district_id = d.id)
      GROUP BY s.id, s.name, s.slug
      ORDER BY s.id ASC
    `);

    console.log('=== STATE WISE ENTITY IMAGES AUDIT ===');
    let totalDistImgs = 0;
    let totalStateImgs = 0;
    for (const r of rows) {
      console.log(`[State ${r.id}] ${r.name.padEnd(20)} (${r.slug.padEnd(20)}): ${r.district_count} dists | ${r.district_entity_images} dist imgs`);
      totalDistImgs += Number(r.district_entity_images);
      totalStateImgs += Number(r.state_entity_images);
    }
    console.log('Total district entity images:', totalDistImgs);
  } finally {
    await closePool();
  }
}

checkDetails().catch(console.error);
