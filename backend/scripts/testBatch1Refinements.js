import fs from 'fs';
import { searchCandidates } from './curationCore.js';

async function testQueries() {
  const targets = [
    { key: 'ML_east_jaintia_backup', q: 'Lukha River Meghalaya' },
    { key: 'ML_kyllang_rock', q: 'Kyllang Rock Meghalaya' },
    { key: 'ML_sw_garo', q: 'Garo Hills landscape Meghalaya' },
    { key: 'ML_pelga_falls', q: 'Pelga Falls Meghalaya' },
    { key: 'MZ_kolasib', q: 'Serlui B Dam' },
    { key: 'MZ_kolasib_alt', q: 'Mizoram landscape hills' },
    { key: 'NL_chumukedima', q: 'Chumukedima Nagaland' },
    { key: 'NL_peren', q: 'Intanki National Park' },
    { key: 'NL_peren_alt', q: 'Benreu Nagaland' },
    { key: 'NL_longleng', q: 'Naga hills Nagaland landscape' },
    { key: 'NL_noklak', q: 'Nagaland village hills' },
    { key: 'NL_shamator', q: 'Saramati Nagaland' }
  ];

  for (const t of targets) {
    const res = await searchCandidates(t.q, 5);
    console.log(`\nResults for ${t.key} (${t.q}):`);
    for (const c of res) {
      console.log(`  - [${c.pageId}] ${c.title} (${c.width}x${c.height}) | ${c.photographer}`);
    }
  }
}

testQueries().catch(console.error);
