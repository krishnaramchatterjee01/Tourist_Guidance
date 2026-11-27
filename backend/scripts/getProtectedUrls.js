import { getPool, closePool } from '../src/config/db.js';

async function getProtectedUrls() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT DISTINCT original_url, display_url, thumbnail_url FROM images');
  console.log(`Currently protected image records in DB: ${rows.length}`);
  await closePool();
}
getProtectedUrls();
