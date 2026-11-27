import { getPool, closePool } from '../src/config/db.js';

async function audit() {
  const pool = getPool();
  const [states] = await pool.query(`
    SELECT s.id, s.name, s.slug, s.total_districts, COUNT(d.id) AS db_districts
    FROM states s
    LEFT JOIN districts d ON d.state_id = s.id
    WHERE s.slug IN ('bihar', 'chhattisgarh', 'goa', 'gujarat')
       OR s.name IN ('Bihar', 'Chhattisgarh', 'Goa', 'Gujarat')
    GROUP BY s.id, s.name, s.slug, s.total_districts
    ORDER BY s.id ASC
  `);
  console.log('Target States Audit:');
  console.table(states);

  for (const st of states) {
    const [districts] = await pool.query(
      `SELECT id, name, slug FROM districts WHERE state_id = ? ORDER BY name ASC`,
      [st.id]
    );
    console.log(`\nState ${st.name} (ID ${st.id}, slug '${st.slug}') has ${districts.length} districts in DB:`);
    console.log(districts.map(d => `${d.id}:${d.name} (${d.slug})`).join(', '));
  }

  // Also check existing CIMS entity images count for all states
  const [cimsCounts] = await pool.query(`
    SELECT s.id, s.name, s.slug,
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
  console.log('\nCurrent Active CIMS Entity Images Baseline:');
  console.table(cimsCounts);

  await closePool();
}

audit().catch(err => {
  console.error(err);
  process.exit(1);
});
