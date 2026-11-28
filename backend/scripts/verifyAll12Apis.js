import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

const states = [
  { slug: 'meghalaya', name: 'Meghalaya', expected: 12 },
  { slug: 'mizoram', name: 'Mizoram', expected: 11 },
  { slug: 'nagaland', name: 'Nagaland', expected: 17 },
  { slug: 'odisha', name: 'Odisha', expected: 30 },
  { slug: 'punjab', name: 'Punjab', expected: 23 },
  { slug: 'rajasthan', name: 'Rajasthan', expected: 41 },
  { slug: 'sikkim', name: 'Sikkim', expected: 6 },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', expected: 38 },
  { slug: 'telangana', name: 'Telangana', expected: 33 },
  { slug: 'tripura', name: 'Tripura', expected: 8 },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', expected: 75 },
  { slug: 'uttarakhand', name: 'Uttarakhand', expected: 13 }
];

async function checkAll() {
  console.log('============================================================');
  console.log('VERIFYING ALL 12 PILOT STATE APIS (PHASES 17-28)');
  console.log('============================================================\n');

  let allPassed = true;
  let totalDistrictsVerified = 0;

  for (const s of states) {
    const sRes = await request(app).get('/api/states/' + s.slug);
    const dRes = await request(app).get('/api/states/' + s.slug + '/districts');

    const heroOk = typeof sRes.body.data?.heroImage === 'string' && sRes.body.data.heroImage.startsWith('https://');
    const cardOk = typeof sRes.body.data?.image === 'string' && sRes.body.data.image.startsWith('https://');
    const distCount = dRes.body.data?.length || 0;
    const countOk = distCount === s.expected;
    const allDistImagesOk = dRes.body.data?.every(d =>
      typeof d.image === 'string' &&
      d.image.startsWith('https://upload.wikimedia.org/') || d.image.startsWith('https://thumb.wikimedia.org/') &&
      d.onlineImageId != null &&
      d.photographer != null &&
      d.license != null
    );

    const pass = heroOk && cardOk && countOk && allDistImagesOk;
    if (!pass) allPassed = false;
    totalDistrictsVerified += distCount;

    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${s.name.padEnd(16)} | Hero/Card: ${heroOk && cardOk ? 'OK' : 'ERR'} | Districts: ${distCount}/${s.expected} | Online Images: ${allDistImagesOk ? '100%' : 'FAIL'}`);
  }

  console.log('\n============================================================');
  console.log(`VERIFICATION RESULT: ${allPassed ? '100% SUCCESS' : 'FAILURES DETECTED'}`);
  console.log(`Total Districts Verified Across 12 States: ${totalDistrictsVerified} / 307`);
  console.log('============================================================\n');

  await closePool();
  process.exit(allPassed ? 0 : 1);
}

checkAll().catch(async (err) => {
  console.error('Fatal verification error:', err);
  await closePool();
  process.exit(1);
});
