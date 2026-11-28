import { getPool, closePool } from '../src/config/db.js';

async function main() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT s.name, ei.image_role, COUNT(*) as cnt
    FROM states s
    JOIN entity_images ei ON ei.state_id = s.id AND ei.entity_type = 'state' AND ei.is_active = 1
    WHERE ei.image_role IN ('primary', 'hero')
    GROUP BY s.name, ei.image_role
    HAVING cnt > 1
  `);
  console.log('Duplicates in active entity_images:', rows);

  const [totalRows] = await pool.query(`
    SELECT COUNT(*) as total
    FROM states s
    JOIN entity_images ei ON ei.state_id = s.id AND ei.entity_type = 'state' AND ei.is_active = 1
    WHERE ei.image_role IN ('primary', 'hero')
  `);
  console.log('Total active state primary/hero:', totalRows[0].total);

  // Check states table image_url and hero_image_url
  const [stateCols] = await pool.query(`
    SELECT COUNT(*) as total_states,
           SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as has_primary,
           SUM(CASE WHEN hero_image_url IS NOT NULL AND hero_image_url != '' THEN 1 ELSE 0 END) as has_hero
    FROM states
  `);
  console.log('States table summary:', stateCols[0]);

  await closePool();
}

main().catch(async (e) => {
  console.error(e);
  await closePool();
  process.exit(1);
});
