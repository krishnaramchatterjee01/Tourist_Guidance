import { getPool, closePool } from '../src/config/db.js';

async function main() {
  const pool = getPool();
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.name, s.slug, s.region_type,
             i_p.id as p_id, i_p.title as p_title, i_p.display_url as p_url, i_p.quality_score as p_qs,
             i_h.id as h_id, i_h.title as h_title, i_h.display_url as h_url, i_h.quality_score as h_qs
      FROM states s
      LEFT JOIN entity_images ei_p ON (ei_p.state_id = s.id AND ei_p.entity_type = 'state' AND ei_p.image_role = 'primary' AND ei_p.is_active = 1)
      LEFT JOIN images i_p ON ei_p.image_id = i_p.id
      LEFT JOIN entity_images ei_h ON (ei_h.state_id = s.id AND ei_h.entity_type = 'state' AND ei_h.image_role = 'hero' AND ei_h.is_active = 1)
      LEFT JOIN images i_h ON ei_h.image_id = i_h.id
      ORDER BY s.region_type, s.name
    `);
    console.log(`Total states/UTs in DB: ${rows.length}`);
    rows.forEach((r, idx) => {
      console.log(`${(idx + 1).toString().padStart(2, '0')}. [${r.region_type.toUpperCase()}] ${r.name.padEnd(35)} | Primary: #${r.p_id} (QS: ${r.p_qs}) | Hero: #${r.h_id} (QS: ${r.h_qs})`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await closePool();
  }
}

main();
