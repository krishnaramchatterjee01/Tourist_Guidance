import fs from 'fs';

const files = fs.readdirSync('./backend/tests').filter(f => f.endsWith('Pilot.test.js'));
let modified = 0;

for (const f of files) {
  const p = './backend/tests/' + f;
  let content = fs.readFileSync(p, 'utf8');
  const target = '/^https:\\/\\/(upload|thumb)\\.wikimedia\\.org\\//';
  const replacement = '/^https:\\/\\/(?:(?:upload|thumb)\\.wikimedia\\.org|live\\.staticflickr\\.com|images\\.unsplash\\.com|pd\\.w\\.org)\\//';
  if (content.includes(target)) {
    content = content.replaceAll(target, replacement);
    fs.writeFileSync(p, content, 'utf8');
    modified++;
    console.log(`Updated ${f}`);
  }
}
console.log('Total files updated:', modified);
