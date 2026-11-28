import fs from 'fs';
import path from 'path';

const UT_FILES = [
  'verifiedAndamanAndNicobarIslandsDataset.json',
  'verifiedChandigarhDataset.json',
  'verifiedDadraAndNagarHaveliAndDamanAndDiuDataset.json',
  'verifiedDelhiDataset.json',
  'verifiedJammuAndKashmirDataset.json',
  'verifiedLadakhDataset.json',
  'verifiedLakshadweepDataset.json',
  'verifiedPuducherryDataset.json'
];

for (const file of UT_FILES) {
  const p = path.resolve('backend/src/services/images', file);
  if (!fs.existsSync(p)) {
    console.log(`Missing file: ${file}`);
    continue;
  }
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`\n=== ${d.state.name} (${Object.keys(d.districts || {}).length} districts) ===`);
  console.log(`  State Hero: ${d.state.hero ? d.state.hero.title : 'MISSING'}`);
  console.log(`  State Card: ${d.state.card ? d.state.card.title : 'MISSING'}`);

  for (const [slug, dist] of Object.entries(d.districts || {})) {
    console.log(`  [${slug}]`);
    console.log(`    Primary: ${dist.primary ? dist.primary.title : 'MISSING'}`);
    console.log(`    Backup : ${dist.backup ? dist.backup.title : 'NONE'}`);
  }
}
