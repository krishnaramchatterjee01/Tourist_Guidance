import { getPool, closePool } from '../src/config/db.js';

async function verify() {
  const pool = getPool();
  const [counts] = await pool.query(`
    SELECT s.id, s.name AS state, s.slug,
           COUNT(DISTINCT CASE WHEN ei.entity_type = 'state' AND ei.image_role = 'hero' THEN ei.id END) AS state_heroes,
           COUNT(DISTINCT CASE WHEN ei.entity_type = 'state' AND ei.image_role = 'primary' THEN ei.id END) AS state_cards,
           COUNT(DISTINCT CASE WHEN ei.entity_type = 'district' AND ei.image_role = 'primary' THEN ei.id END) AS district_primaries,
           COUNT(DISTINCT CASE WHEN ei.entity_type = 'district' AND ei.image_role = 'backup' THEN ei.id END) AS district_backups,
           COUNT(ei.id) AS total_entity_images
    FROM states s
    LEFT JOIN entity_images ei ON (ei.state_id = s.id OR ei.district_id IN (SELECT id FROM districts WHERE state_id = s.id))
    GROUP BY s.id, s.name, s.slug
    HAVING total_entity_images > 0
    ORDER BY s.id ASC
  `);
  console.log('States with active CIMS entity images:');
  console.table(counts);

  const [districtsAssam] = await pool.query(`
    SELECT d.id, d.name, d.slug,
           MAX(CASE WHEN ei.image_role = 'primary' THEN i.title END) AS primary_title,
           MAX(CASE WHEN ei.image_role = 'backup' THEN i.title END) AS backup_title
    FROM districts d
    INNER JOIN states s ON d.state_id = s.id
    LEFT JOIN entity_images ei ON (ei.district_id = d.id AND ei.entity_type = 'district' AND ei.is_active = 1)
    LEFT JOIN images i ON ei.image_id = i.id
    WHERE s.slug = 'assam'
    GROUP BY d.id, d.name, d.slug
    ORDER BY d.id ASC
  `);
  console.log('All 35 Assam districts mapped in DB:');
  console.log('Total districts returned:', districtsAssam.length);
  console.log('With primary image:', districtsAssam.filter(d => d.primary_title).length);
  console.log('With backup image:', districtsAssam.filter(d => d.backup_title).length);

  await closePool();
}

verify().catch(console.error);
