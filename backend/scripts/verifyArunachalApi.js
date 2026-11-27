import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

async function testApi() {
  console.log('=== VERIFYING ARUNACHAL PRADESH REST APIS ===\n');

  // 1. State Endpoint
  const stateRes = await request(app).get('/api/states/arunachal-pradesh');
  console.log('GET /api/states/arunachal-pradesh status:', stateRes.status);
  console.log('State Hero Image:', stateRes.body.data.heroImage);
  console.log('State Card Image:', stateRes.body.data.image);

  // 2. Districts List Endpoint
  const distRes = await request(app).get('/api/states/arunachal-pradesh/districts');
  console.log('\nGET /api/states/arunachal-pradesh/districts status:', distRes.status);
  console.log('Districts count:', distRes.body.data.length);

  const urls = distRes.body.data.map(d => d.image);
  const uniqueUrls = new Set(urls);
  console.log(`Unique image URLs in Arunachal districts: ${uniqueUrls.size} / ${distRes.body.data.length}`);

  // 3. Inspect target test districts
  const testSlugs = ['anjaw', 'bichom', 'changlang', 'kra-daadi', 'tawang', 'west-siang'];
  for (const slug of testSlugs) {
    const singleRes = await request(app).get(`/api/states/arunachal-pradesh/districts/${slug}`);
    console.log(`\n- [${singleRes.body.data.name}] (${slug}):`);
    console.log(`    Image:  ${singleRes.body.data.image}`);
    console.log(`    Thumb:  ${singleRes.body.data.thumbnailUrl}`);
    console.log(`    Author: ${singleRes.body.data.photographer}`);
    console.log(`    Lic:    ${singleRes.body.data.license}`);
  }

  await closePool();
  process.exit(0);
}

testApi().catch(err => {
  console.error('API Verification error:', err);
  process.exit(1);
});
