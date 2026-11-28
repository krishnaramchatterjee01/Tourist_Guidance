import fs from 'fs';
import path from 'path';
import imageCollector from '../src/services/images/imageCollector.js';
import { getPool, closePool } from '../src/config/db.js';

async function main() {
  console.log('Applying targeted refinements for Nicobar and North East Delhi...');

  // 1. Refine Andaman and Nicobar Islands Dataset (Nicobar District)
  const anPath = path.resolve('backend/src/services/images/verifiedAndamanAndNicobarIslandsDataset.json');
  const anData = JSON.parse(fs.readFileSync(anPath, 'utf8'));
  
  anData.districts.nicobar.primary = {
    pageId: "49400244",
    fileTitle: "File:Indira Point, India - 100 0835fhh.jpg",
    title: "Indira Point Lighthouse, Great Nicobar",
    originalUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Indira_Point%2C_India_-_100_0835fhh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    displayUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Indira_Point%2C_India_-_100_0835fhh.jpg/960px-Indira_Point%2C_India_-_100_0835fhh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    thumbnailUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Indira_Point%2C_India_-_100_0835fhh.jpg/960px-Indira_Point%2C_India_-_100_0835fhh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Indira_Point,_India_-_100_0835fhh.jpg",
    photographer: "T.Harshavardan",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    attribution: "T.Harshavardan (CC BY-SA 4.0) via Wikimedia Commons",
    width: 2576,
    height: 1632,
    mime: "image/jpeg",
    isLandscape: true,
    locationDescription: "Indira Point, the southernmost point of India on Great Nicobar Island"
  };
  fs.writeFileSync(anPath, JSON.stringify(anData, null, 2), 'utf8');
  console.log('✓ Updated Nicobar primary image in dataset.');

  // 2. Refine Delhi Dataset (North East Delhi)
  const delhiPath = path.resolve('backend/src/services/images/verifiedDelhiDataset.json');
  const delhiData = JSON.parse(fs.readFileSync(delhiPath, 'utf8'));

  delhiData.districts['north-east-delhi'].primary = {
    pageId: "74122844",
    fileTitle: "File:Signaturebridgenedelhi.png",
    title: "Signature Bridge, North East Delhi",
    originalUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Signaturebridgenedelhi.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    displayUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Signaturebridgenedelhi.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Signaturebridgenedelhi.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Signaturebridgenedelhi.png",
    photographer: "ThommenJose",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    attribution: "ThommenJose (CC BY-SA 4.0) via Wikimedia Commons",
    width: 910,
    height: 509,
    mime: "image/png",
    isLandscape: true,
    locationDescription: "Iconic Signature Bridge across the Yamuna River in North East Delhi"
  };
  fs.writeFileSync(delhiPath, JSON.stringify(delhiData, null, 2), 'utf8');
  console.log('✓ Updated North East Delhi primary image in dataset.');

  // 3. Re-sync both UTs to DB
  console.log('Re-syncing Andaman and Nicobar Islands to database...');
  const anRes = await imageCollector.collectAndamanAndNicobarIslandsPilot();
  console.log('  Andaman res:', anRes);

  console.log('Re-syncing Delhi to database...');
  const delhiRes = await imageCollector.collectDelhiPilot();
  console.log('  Delhi res:', delhiRes);

  await closePool();
  console.log('Refinements applied and synced successfully.');
}

main().catch(err => {
  console.error('Error in refinements:', err);
  process.exit(1);
});
