import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

async function verify() {
  const res = await request(app).get('/api/states/chhattisgarh/districts');
  console.log('Status:', res.status);
  console.log('Count:', res.body.data.length);
  const sample = res.body.data.slice(0, 3).map(d => ({
    name: d.name,
    image: d.image?.substring(0, 50),
    onlineImageId: d.onlineImageId,
    photographer: d.photographer
  }));
  console.log('Sample:', sample);

  const missingImage = res.body.data.filter(d => !d.image || !d.image.startsWith('https://'));
  console.log('Missing/invalid HTTPS image count:', missingImage.length);

  const stateRes = await request(app).get('/api/states/chhattisgarh');
  console.log('State Hero:', stateRes.body.data.heroImage?.substring(0, 60));
  console.log('State Card:', stateRes.body.data.image?.substring(0, 60));

  await closePool();
}

verify().catch(console.error);
