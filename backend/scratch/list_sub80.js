import { getPool, closePool } from '../src/config/db.js';

async function main() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT s.name, s.slug, ei.image_role, i.id as img_id, i.quality_score, i.composite_score, i.display_url
    FROM states s
    JOIN entity_images ei ON ei.state_id = s.id AND ei.entity_type = 'state' AND ei.is_active = 1
    JOIN images i ON ei.image_id = i.id
    WHERE ei.image_role IN ('primary', 'hero')
    ORDER BY s.region_type, s.name, ei.image_role
  `);

  console.log('Total active roles:', rows.length);
  const sub80 = rows.filter(r => (r.composite_score || r.quality_score) < 80);
  console.log('Sub-80 roles count:', sub80.length);
  sub80.forEach(r => {
    console.log(r.name.padEnd(25), r.image_role.padEnd(10), 'ID:', String(r.img_id).padEnd(6), 'QS:', (r.composite_score || r.quality_score), r.display_url.slice(0, 60));
  });

  await closePool();
}

main().catch(async (e) => {
  console.error(e);
  await closePool();
  process.exit(1);
});
