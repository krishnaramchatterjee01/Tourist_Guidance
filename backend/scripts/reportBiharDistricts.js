import { getPool, closePool } from '../src/config/db.js';

async function report() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT d.id, d.name, d.slug,
           i1.title AS primary_title, i1.display_url AS primary_url, i1.photographer_name AS primary_photo, i1.license_name AS primary_lic,
           i2.title AS backup_title
    FROM districts d
    LEFT JOIN entity_images ei1 ON ei1.district_id = d.id AND ei1.image_role = 'primary'
    LEFT JOIN images i1 ON i1.id = ei1.image_id
    LEFT JOIN entity_images ei2 ON ei2.district_id = d.id AND ei2.image_role = 'backup'
    LEFT JOIN images i2 ON i2.id = ei2.image_id
    WHERE d.state_id = 4
    ORDER BY d.name ASC
  `);
  console.log(`Total Bihar Districts: ${rows.length}`);
  console.table(rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    primary_title: r.primary_title ? r.primary_title.substring(0, 30) : 'NONE',
    primary_lic: r.primary_lic,
    backup: r.backup_title ? 'YES' : 'NONE'
  })));
  await closePool();
}

report().catch(err => {
  console.error(err);
  process.exit(1);
});
