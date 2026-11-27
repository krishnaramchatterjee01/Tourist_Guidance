import { getPool, closePool } from '../src/config/db.js';

async function checkHaryana() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT s.id, s.name, s.slug, count(d.id) as cnt
    FROM states s
    LEFT JOIN districts d ON d.state_id = s.id
    WHERE s.slug = 'haryana' OR s.name = 'Haryana'
    GROUP BY s.id
  `);
  console.log('Haryana in DB:', rows);
  await closePool();
}
checkHaryana();
