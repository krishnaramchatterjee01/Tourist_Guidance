import { getPool, closePool } from '../src/config/db.js';
import StateModel from '../src/models/State.js';

async function testApi() {
  const pool = getPool();
  console.log('=== VERIFYING MODEL & API DATA INTEGRITY ===\n');

  const states = await StateModel.getAll();
  console.log(`Total states retrieved from StateModel.getAll(): ${states.length}`);

  let missingImageCount = 0;
  let placeholderCount = 0;

  for (const s of states) {
    if (!s.image_url || !s.hero_image_url) {
      missingImageCount++;
      console.error(`❌ Missing image on ${s.name}: card=${s.image_url}, hero=${s.hero_image_url}`);
    }
    if (s.image_url?.includes('placeholder') || s.hero_image_url?.includes('placeholder')) {
      placeholderCount++;
      console.error(`❌ Placeholder found on ${s.name}`);
    }
  }

  console.log(`Missing images: ${missingImageCount}`);
  console.log(`Placeholder URLs: ${placeholderCount}`);

  // Test individual state detail retrieval
  const testSlugs = ['bihar', 'chhattisgarh', 'himachal-pradesh', 'goa', 'gujarat', 'jharkhand', 'tripura', 'delhi'];
  for (const slug of testSlugs) {
    const detail = await StateModel.getBySlug(slug);
    console.log(`✓ Detail check [${slug}]: ${detail.name} | Card: ${detail.image_url.slice(0, 60)}... | Hero: ${detail.hero_image_url.slice(0, 60)}...`);
  }

  // Check district/attraction/place safety
  const [[districts]] = await pool.query('SELECT count(*) as count FROM districts');
  const [[places]] = await pool.query('SELECT count(*) as count FROM places');
  console.log(`\nIntegrity Safety Check:`);
  console.log(`Districts count: ${districts.count} (Expected 784)`);
  console.log(`Places count:    ${places.count} (Expected 172)`);

  await closePool();
}

testApi().catch(async (e) => {
  console.error(e);
  await closePool();
  process.exit(1);
});
