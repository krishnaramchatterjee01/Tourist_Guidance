import { getPool, closePool } from '../src/config/db.js';

async function checkSpecifics() {
  const pool = getPool();
  try {
    const [rows] = await pool.query(`
      SELECT id, provider_name, original_url, display_url, thumbnail_url, width, height, title
      FROM images 
      WHERE id IN (
        SELECT image_id FROM entity_images 
        WHERE (state_id = (SELECT id FROM states WHERE slug = 'jharkhand') AND image_role = 'hero')
           OR (state_id = (SELECT id FROM states WHERE slug = 'tripura') AND image_role = 'hero')
      )
    `);
    console.log('Specifics:', rows);
  } finally {
    await closePool();
  }
}

checkSpecifics();
