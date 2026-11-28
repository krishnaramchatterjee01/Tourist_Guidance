import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import providerManager from '../src/services/images/imageProviderManager.js';
import aiQualityAssessor from '../src/services/images/aiQualityAssessor.js';

const queries = [
  { slug: 'gujarat', role: 'hero', state: 'Gujarat', query: 'Somnath Temple Gujarat', landmarks: ['Somnath Temple', 'Rann of Kutch'] },
  { slug: 'haryana', role: 'primary', state: 'Haryana', query: 'Brahma Sarovar Kurukshetra', landmarks: ['Brahma Sarovar', 'Kurukshetra'] },
  { slug: 'mizoram', role: 'primary', state: 'Mizoram', query: 'Aizawl city Mizoram', landmarks: ['Aizawl', 'Reiek'] },
  { slug: 'nagaland', role: 'primary', state: 'Nagaland', query: 'Dzukou Valley Nagaland', landmarks: ['Dzukou Valley', 'Kohima'] },
  { slug: 'uttarakhand', role: 'primary', state: 'Uttarakhand', query: 'Kedarnath temple Uttarakhand', landmarks: ['Kedarnath', 'Valley of Flowers'] },
  { slug: 'lakshadweep', role: 'hero', state: 'Lakshadweep', query: 'Agatti Island Lakshadweep', landmarks: ['Agatti', 'Bangaram'] },
  { slug: 'puducherry', role: 'primary', state: 'Puducherry', query: 'French Quarter Pondicherry', landmarks: ['French Quarter', 'Pondicherry'] },
  { slug: 'puducherry', role: 'hero', state: 'Puducherry', query: 'Matrimandir Auroville', landmarks: ['Matrimandir', 'Auroville'] }
];

const wiki = providerManager.getProvider('wikimedia');

for (const q of queries) {
  const cands = await wiki.search(q.query, { limit: 5, targetWidth: q.role === 'hero' ? 1920 : 1280 });
  console.log(`\nResults for ${q.state} (${q.role}) with "${q.query}": ${cands.length}`);
  for (const c of cands) {
    const assess = aiQualityAssessor.assess(c, { stateName: q.state, role: q.role, landmarkKeywords: q.landmarks });
    console.log(`  - QS: ${assess.totalScore} | Title: ${c.title.slice(0, 45)} | URL: ${c.displayUrl.slice(0, 70)}`);
  }
  await new Promise(r => setTimeout(r, 600));
}
