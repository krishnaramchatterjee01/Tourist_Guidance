import fs from 'fs';
import path from 'path';
import { searchCandidates } from './curationCore.js';
import imageCollector from '../src/services/images/imageCollector.js';
import { getPool, closePool } from '../src/config/db.js';

async function main() {
  // 1. Fix Mulugu in verifiedTelanganaDataset.json
  const telanganaPath = path.resolve('backend/src/services/images/verifiedTelanganaDataset.json');
  const telanganaData = JSON.parse(fs.readFileSync(telanganaPath, 'utf8'));

  const ramappaCandidates = await searchCandidates('WHS Ramappa Temple 2', 3);
  const laknavaramCandidates = await searchCandidates('Laknavaram Lake, Laknavaram in Mulugu district, Telangana 01', 3);

  if (ramappaCandidates.length > 0) {
    telanganaData.districts.mulugu.primary = {
      ...ramappaCandidates[0],
      locationDescription: 'UNESCO World Heritage Site Kakatiya Rudreshwara (Ramappa) Temple, Mulugu'
    };
    console.log('✓ Updated Mulugu primary:', telanganaData.districts.mulugu.primary.title);
  }
  if (laknavaramCandidates.length > 0) {
    telanganaData.districts.mulugu.backup = {
      ...laknavaramCandidates[0],
      locationDescription: 'Scenic natural islands and suspension bridge at Laknavaram Lake, Mulugu'
    };
    console.log('✓ Updated Mulugu backup:', telanganaData.districts.mulugu.backup.title);
  }

  fs.writeFileSync(telanganaPath, JSON.stringify(telanganaData, null, 2));

  // 2. Re-sync Telangana to MySQL
  console.log('Resyncing Telangana into MySQL...');
  const syncRes = await imageCollector.collectTelanganaPilot();
  console.log('Sync result for Telangana:', syncRes);

  // 3. Fix test file imports
  const testDir = path.resolve('backend/tests');
  const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

  for (const f of files) {
    const p = path.join(testDir, f);
    let content = fs.readFileSync(p, 'utf8');
    if (content.includes('serializeDistrict(') && !content.includes("from '../src/utils/serializer.js'")) {
      content = content.replace(
        "import app from '../src/app.js';",
        "import app from '../src/app.js';\nimport { serializeDistrict } from '../src/utils/serializer.js';"
      );
      fs.writeFileSync(p, content, 'utf8');
      console.log(`✓ Added serializeDistrict import to ${f}`);
    }
  }

  await closePool();
  console.log('Fix script complete!');
}

main().catch(async (err) => {
  console.error(err);
  await closePool();
  process.exit(1);
});
