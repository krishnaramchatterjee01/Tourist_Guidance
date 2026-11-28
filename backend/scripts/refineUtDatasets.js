import fs from 'fs';
import path from 'path';
import { searchCandidates } from './curationCore.js';

async function refine() {
  console.log('--- REFINING UT DATASETS FOR TOP QUALITY ---');

  // 1. Lakshadweep Hero & Card
  const lakPath = path.resolve('backend/src/services/images/verifiedLakshadweepDataset.json');
  const lakData = JSON.parse(fs.readFileSync(lakPath, 'utf8'));
  const lakHero = (await searchCandidates('Bangaram Island 5799661931', 2))[0] || (await searchCandidates('Sea off Bangaram island, Lakshadweep', 2))[0];
  const lakCard = (await searchCandidates('Agatti island, Lakshadweep', 2))[0];
  if (lakHero) lakData.state.hero = lakHero;
  if (lakCard) lakData.state.card = lakCard;
  fs.writeFileSync(lakPath, JSON.stringify(lakData, null, 2));
  console.log('✓ Lakshadweep Hero & Card refined');

  // 2. Chandigarh Card
  const chdPath = path.resolve('backend/src/services/images/verifiedChandigarhDataset.json');
  const chdData = JSON.parse(fs.readFileSync(chdPath, 'utf8'));
  const chdCard = (await searchCandidates('Open Hand monument, Chandigarh', 2))[0];
  if (chdCard) chdData.state.card = chdCard;
  fs.writeFileSync(chdPath, JSON.stringify(chdData, null, 2));
  console.log('✓ Chandigarh Card refined to Open Hand Monument');

  // 3. Delhi
  const delPath = path.resolve('backend/src/services/images/verifiedDelhiDataset.json');
  const delData = JSON.parse(fs.readFileSync(delPath, 'utf8'));
  const delHero = (await searchCandidates('India Gate at night', 2))[0];
  if (delHero) delData.state.hero = delHero;

  const nwPrimary = (await searchCandidates('Japnese park rohini,Delhi', 2))[0];
  const nwBackup = (await searchCandidates('Japnese park 1', 2))[0];
  if (nwPrimary) delData.districts['north-west-delhi'].primary = { ...nwPrimary, locationDescription: 'Swarna Jayanti Japanese Park, Rohini, North West Delhi' };
  if (nwBackup) delData.districts['north-west-delhi'].backup = { ...nwBackup, locationDescription: 'Japanese Park Rohini, North West Delhi (Alternative view)' };

  const ndPrimary = (await searchCandidates('Mutiny Memorial 017', 2))[0];
  const ndBackup = (await searchCandidates('Mutiny memorial - A sad reminder', 2))[0];
  if (ndPrimary) delData.districts['north-delhi'].primary = { ...ndPrimary, locationDescription: 'Historic Mutiny Memorial Gothic Tower on Northern Ridge, North Delhi' };
  if (ndBackup) delData.districts['north-delhi'].backup = { ...ndBackup, locationDescription: 'Northern Ridge historic enclave, North Delhi' };

  const shPrimary = (await searchCandidates('Yamuna sport complex surajmal vihar new Delhi', 2))[0];
  const shBackup = (await searchCandidates('Flyover in Delhi Near Akshardham', 2))[0];
  if (shPrimary) delData.districts['shahdara'].primary = { ...shPrimary, locationDescription: 'Yamuna Sports Complex and modern infrastructure, Shahdara' };
  if (shBackup) delData.districts['shahdara'].backup = { ...shBackup, locationDescription: 'Trans-Yamuna landscape, Shahdara periphery' };

  const wdPrimary = (await searchCandidates('Dilli Haat Handicrafts', 2))[0];
  const wdBackup = (await searchCandidates('Dilli Haat 2024', 2))[0];
  if (wdPrimary) delData.districts['west-delhi'].primary = { ...wdPrimary, locationDescription: 'Vibrant cultural crafts and tourism open-air plaza at Dilli Haat, West Delhi' };
  if (wdBackup) delData.districts['west-delhi'].backup = { ...wdBackup, locationDescription: 'Dilli Haat artisan exhibitions, West Delhi' };

  fs.writeFileSync(delPath, JSON.stringify(delData, null, 2));
  console.log('✓ Delhi Hero, North West Delhi, North Delhi, Shahdara, West Delhi refined');

  // 4. Andaman and Nicobar
  const anPath = path.resolve('backend/src/services/images/verifiedAndamanAndNicobarIslandsDataset.json');
  const anData = JSON.parse(fs.readFileSync(anPath, 'utf8'));
  const carNic = (await searchCandidates('Andaman and Nicobar Islands - Car Nicobar', 2))[0];
  if (carNic) anData.districts['nicobar'].backup = { ...carNic, locationDescription: 'Car Nicobar coastal landscape' };
  const baratang = (await searchCandidates('Limestone Caves, Baratang, Andaman 02', 2))[0];
  if (baratang) anData.districts['north-and-middle-andaman'].backup = { ...baratang, locationDescription: 'Limestone caves at Baratang, North & Middle Andaman' };
  fs.writeFileSync(anPath, JSON.stringify(anData, null, 2));
  console.log('✓ Andaman and Nicobar backups refined');

  // 5. Dadra & Nagar Haveli and Daman & Diu
  const ddPath = path.resolve('backend/src/services/images/verifiedDadraAndNagarHaveliAndDamanAndDiuDataset.json');
  const ddData = JSON.parse(fs.readFileSync(ddPath, 'utf8'));
  const silvassa2 = (await searchCandidates('Dadra and Nagar Haveli Silvassa 2', 2))[0];
  if (silvassa2) ddData.districts['dadra-and-nagar-haveli'].backup = { ...silvassa2, locationDescription: 'Silvassa green landscape and Portuguese colonial architecture' };
  const gangeshwar = (await searchCandidates('Gangeshwar Temple,Diu', 2))[0];
  if (gangeshwar) ddData.districts['diu'].backup = { ...gangeshwar, locationDescription: 'Sea-facing rock-cut Gangeshwar Temple, Diu' };
  fs.writeFileSync(ddPath, JSON.stringify(ddData, null, 2));
  console.log('✓ Dadra & Nagar Haveli and Daman & Diu backups refined');

  // 6. Jammu & Kashmir
  const jkPath = path.resolve('backend/src/services/images/verifiedJammuAndKashmirDataset.json');
  const jkData = JSON.parse(fs.readFileSync(jkPath, 'utf8'));
  const mansarLake = (await searchCandidates('Beautiful Mansar Lake (ramsar Wetland) Dr. Harleen Kaur', 2))[0];
  if (mansarLake) jkData.districts['samba'].primary = { ...mansarLake, locationDescription: 'Scenic Mansar Lake Ramsar wetland and Shivalik foothills, Samba' };

  const warwan = (await searchCandidates('Warwan valley', 2))[0];
  if (warwan) jkData.districts['kishtwar'].backup = { ...warwan, locationDescription: 'Untouched Himalayan mountain landscape of Warwan Valley, Kishtwar' };

  const poonchRiver = (await searchCandidates('Poonch river', 2))[0];
  if (poonchRiver) jkData.districts['poonch'].backup = { ...poonchRiver, locationDescription: 'Scenic mountain valley along Poonch River, Poonch' };

  const rajouriTown = (await searchCandidates('Rajouri 500', 2))[0];
  if (rajouriTown) jkData.districts['rajouri'].backup = { ...rajouriTown, locationDescription: 'Historic mountain town of Rajouri' };

  const hirpora = (await searchCandidates('Hirpora WLS Shopian Kashmir', 2))[0] || (await searchCandidates('Clock Tower in Main Market Shopian, Jammu and Kashmir', 2))[0];
  if (hirpora) jkData.districts['shopian'].backup = { ...hirpora, locationDescription: 'Hirpora Wildlife Sanctuary along Mughal Road, Shopian' };

  fs.writeFileSync(jkPath, JSON.stringify(jkData, null, 2));
  console.log('✓ Jammu and Kashmir Samba, Kishtwar, Poonch, Rajouri, Shopian refined');

  // 7. Puducherry
  const pudPath = path.resolve('backend/src/services/images/verifiedPuducherryDataset.json');
  const pudData = JSON.parse(fs.readFileSync(pudPath, 'utf8'));
  const pudPrimary = (await searchCandidates('French Quarter, Pondicherry (5) (36845125313)', 2))[0];
  const pudBackup = (await searchCandidates('Pondicherry, Promenade Beach, Rock Beach, India', 2))[0];
  if (pudPrimary) pudData.districts['puducherry'].primary = { ...pudPrimary, locationDescription: 'Mustard-yellow French colonial villas in White Town, Puducherry' };
  if (pudBackup) pudData.districts['puducherry'].backup = { ...pudBackup, locationDescription: 'Promenade Beach and Rock Beach seafront, Puducherry' };

  const maheWalk = (await searchCandidates('Mahe walkway-01', 2))[0] || (await searchCandidates('Mahé (India) Main Beach', 2))[0];
  if (maheWalk) pudData.districts['mahe'].backup = { ...maheWalk, locationDescription: 'Scenic Mahe riverside promenade walkway, Mahe' };

  fs.writeFileSync(pudPath, JSON.stringify(pudData, null, 2));
  console.log('✓ Puducherry White Town, Promenade Beach and Mahe walkway refined');

  console.log('--- REFINEMENTS PASS COMPLETE ---');
}

refine().catch(console.error);
