import { getPool, closePool } from '../src/config/db.js';

async function checkAffected() {
  const pool = getPool();
  try {
    const [rows] = await pool.query(`
      SELECT s.name, s.slug, ei.image_role, i.id, i.original_url, i.display_url, i.thumbnail_url, i.source_page_url
      FROM entity_images ei
      JOIN states s ON ei.state_id = s.id
      JOIN images i ON ei.image_id = i.id
      WHERE s.slug IN ('bihar', 'chhattisgarh', 'himachal-pradesh', 'west-bengal', 'andhra-pradesh')
        AND ei.entity_type = 'state'
        AND ei.is_active = 1
    `);
    for (const r of rows) {
      console.log(`\n[${r.name}] Role: ${r.image_role} (Image #${r.id})`);
      console.log('  Original URL:  ', r.original_url);
      console.log('  Display URL:   ', r.display_url);
      console.log('  Thumbnail URL: ', r.thumbnail_url);
      console.log('  Source Page:   ', r.source_page_url);
    }
  } finally {
    await closePool();
  }
}

checkAffected();
