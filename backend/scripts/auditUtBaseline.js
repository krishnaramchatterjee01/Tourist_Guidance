import { getPool, closePool } from '../src/config/db.js';

async function main() {
  const pool = getPool();

  const [cols] = await pool.query('DESCRIBE collection_items');
  console.log('collection_items columns:', cols.map(c => c.Field));

  const [items] = await pool.query('SELECT ci.*, c.slug FROM collection_items ci JOIN destination_collections c ON ci.collection_id = c.id WHERE c.slug = "home-ut-slider"');
  console.log('home-ut-slider count:', items.length);
  console.log(items);

  const [uts] = await pool.query('SELECT id, name, slug, capital, region_type, image_url, hero_image_url, button_url, total_districts FROM states WHERE region_type != "state"');
  console.log('\nUT details in states table:', uts);

  await closePool();
}

main().catch(async err => {
  console.error(err);
  await closePool();
  process.exit(1);
});
