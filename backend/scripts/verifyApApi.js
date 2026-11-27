import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

async function testApi() {
  console.log('=== VERIFYING ANDHRA PRADESH REST APIS ===\n');

  // 1. State Endpoint
  const stateRes = await request(app).get('/api/states/andhra-pradesh');
  console.log('GET /api/states/andhra-pradesh status:', stateRes.status);
  console.log('State Hero Image:', stateRes.body.data.heroImage);
  console.log('State Card Image:', stateRes.body.data.image);

  // 2. Districts List Endpoint
  const distRes = await request(app).get('/api/states/andhra-pradesh/districts');
  console.log('\nGET /api/states/andhra-pradesh/districts status:', distRes.status);
  console.log('Districts count:', distRes.body.data.length);
  
  const sampleDistricts = distRes.body.data.slice(0, 5);
  for (const d of sampleDistricts) {
    console.log(`- [${d.name}] (${d.slug}):`);
    console.log(`    Image: ${d.image}`);
    console.log(`    Thumb: ${d.thumbnailUrl}`);
    console.log(`    Author: ${d.photographer}`);
    console.log(`    License: ${d.license}`);
  }

  // 3. Unique URLs Check
  const urls = distRes.body.data.map(d => d.image);
  const uniqueUrls = new Set(urls);
  console.log(`\nUnique image URLs in AP districts: ${uniqueUrls.size} / ${distRes.body.data.length}`);

  // 4. Single District Detail
  const tirupatiRes = await request(app).get('/api/states/andhra-pradesh/districts/tirupati');
  console.log('\nGET /api/states/andhra-pradesh/districts/tirupati status:', tirupatiRes.status);
  console.log('Tirupati Image:', tirupatiRes.body.data.image);
  console.log('Tirupati Photographer:', tirupatiRes.body.data.photographer);
  console.log('Tirupati License:', tirupatiRes.body.data.license);

  await closePool();
  process.exit(0);
}

testApi().catch(err => {
  console.error('API Verification error:', err);
  process.exit(1);
});
