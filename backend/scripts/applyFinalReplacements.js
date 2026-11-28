import fs from 'fs';
import path from 'path';
import { searchCandidates } from './curationCore.js';

async function applyFinalReplacements() {
  const upPath = path.resolve('backend/src/services/images/verifiedUttarPradeshDataset.json');
  const upData = JSON.parse(fs.readFileSync(upPath, 'utf8'));

  // 1. Ballia
  const balliaPrimary = (await searchCandidates('Chhath Puja Ghat Piyarahi Ballia', 2))[0];
  const balliaBackup = (await searchCandidates('Ballia Railway Station 1', 2))[0];
  if (balliaPrimary) {
    upData.districts.ballia.primary = {
      ...balliaPrimary,
      locationDescription: 'Sacred Ganga ghat at Piyarahi and cultural heritage of Ballia'
    };
  }
  if (balliaBackup) {
    upData.districts.ballia.backup = {
      ...balliaBackup,
      locationDescription: 'Ballia architectural junction (Alternative view)'
    };
  }

  // 2. Gonda
  const gondaPrimary = (await searchCandidates('Swaminarayan Bhagwan Chhapiya', 2))[0];
  const gondaBackup = (await searchCandidates('Entrance of Mada village Gonda district', 2))[0];
  if (gondaPrimary) {
    upData.districts.gonda.primary = {
      ...gondaPrimary,
      locationDescription: 'Birthplace of Lord Swaminarayan at Chhapaiya, Gonda'
    };
  }
  if (gondaBackup) {
    upData.districts.gonda.backup = {
      ...gondaBackup,
      locationDescription: 'Heritage and rural village landscape of Gonda district'
    };
  }

  // 3. Muzaffarnagar
  const muzPrimary = (await searchCandidates('Vahelna Jain temple', 3))[0];
  const muzBackup = (await searchCandidates('Shiv Murti Muzaffarnagar', 3))[0] || (await searchCandidates('Vahelna Jain temple', 3))[1];
  if (muzPrimary) {
    upData.districts.muzaffarnagar.primary = {
      ...muzPrimary,
      locationDescription: 'Historical Vahelna Jain Temple heritage complex, Muzaffarnagar'
    };
  }
  if (muzBackup) {
    upData.districts.muzaffarnagar.backup = {
      ...muzBackup,
      locationDescription: 'Shiv Murti landmark and cultural heritage, Muzaffarnagar'
    };
  }

  // 4. Azamgarh backup
  const azamBackup = (await searchCandidates('Nizamabad black clay pottery', 2))[0];
  if (azamBackup) {
    upData.districts.azamgarh.backup = {
      ...azamBackup,
      locationDescription: 'World-renowned GI-tagged Nizamabad black clay pottery, Azamgarh'
    };
  }

  fs.writeFileSync(upPath, JSON.stringify(upData, null, 2));
  console.log('✓ Applied final UP replacements successfully!');
}

applyFinalReplacements().catch(console.error);
