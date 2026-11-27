import fs from 'fs';
import path from 'path';

const testDir = path.resolve('backend/tests');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

for (const file of files) {
  const filePath = path.join(testDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('Non-pilot states (Haryana)')) {
    content = content.replace(/Non-pilot states \(Haryana\)/g, 'Non-pilot states (Meghalaya)');
    content = content.replace(/\/api\/states\/haryana\/districts/g, '/api/states/meghalaya/districts');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated non-pilot state in ${file}`);
  }
}
