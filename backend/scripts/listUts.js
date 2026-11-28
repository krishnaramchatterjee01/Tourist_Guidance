import { getPool, closePool } from '../src/config/db.js';

async function main() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT s.id, s.name, s.slug, s.region_type, COUNT(d.id) as district_count 
    FROM states s 
    LEFT JOIN districts d ON d.state_id = s.id 
    WHERE s.region_type != 'state' 
    GROUP BY s.id 
    ORDER BY s.id ASC
  `);
  console.log('UTs with district count:', rows);
  await closePool();
}

main().catch(console.error);
