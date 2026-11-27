import { getPool, closePool } from '../src/config/db.js';

async function main() {
  const pool = getPool();
  const [states] = await pool.query('SELECT * FROM states WHERE slug = "bihar"');
  console.log('Bihar State Record:', states[0]);

  const [districts] = await pool.query('SELECT id, name, slug, display_order, image_url FROM districts WHERE state_id = ? ORDER BY id ASC', [states[0].id]);
  console.log(`Total Bihar Districts in DB: ${districts.length}`);
  console.table(districts.map(d => ({ id: d.id, name: d.name, slug: d.slug, image_url: d.image_url?.substring(0, 40) })));

  const [eiCounts] = await pool.query(`
    SELECT s.name AS state, s.slug, COUNT(ei.id) AS total_entity_images
    FROM states s
    LEFT JOIN entity_images ei ON (ei.state_id = s.id OR ei.district_id IN (SELECT id FROM districts WHERE state_id = s.id))
    GROUP BY s.id, s.name, s.slug
    HAVING total_entity_images > 0
    ORDER BY s.id ASC
  `);
  console.log('Existing Entity Images Counts:');
  console.table(eiCounts);

  await closePool();
}

main().catch(console.error);
