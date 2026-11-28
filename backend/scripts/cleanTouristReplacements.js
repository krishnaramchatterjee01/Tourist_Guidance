import fs from 'fs';
import path from 'path';
import { searchCandidates } from './curationCore.js';

const SPECIFIC_TARGETS = [
  // Nagaland
  {
    state: 'Nagaland',
    district: 'longleng',
    role: 'both',
    queries: ['Phom Nagaland', 'Dikhu Nagaland', 'Tuensang landscape', 'Naga traditional morung']
  },
  {
    state: 'Nagaland',
    district: 'noklak',
    role: 'both',
    queries: ['Pangsha Nagaland', 'Khiamniungan', 'Mount Saramati Nagaland', 'Nagaland mountain village']
  },
  {
    state: 'Nagaland',
    district: 'ch-moukedima',
    role: 'backup',
    queries: ['Chumukedima', 'Dimapur landscape', 'Nagaland hills mist', 'Dzukou Valley']
  },
  // Meghalaya
  {
    state: 'Meghalaya',
    district: 'eastern-west-khasi-hills',
    role: 'backup',
    queries: ['Kyllang Rock', 'Khasi Hills landscape Meghalaya', 'Nongkhnum Meghalaya']
  },
  {
    state: 'Meghalaya',
    district: 'south-west-garo-hills',
    role: 'backup',
    queries: ['Garo Hills Meghalaya landscape', 'Tura Peak Meghalaya', 'Balpakram Meghalaya']
  },
  // Mizoram
  {
    state: 'Mizoram',
    district: 'kolasib',
    role: 'backup',
    queries: ['Serlui B Dam', 'Mizoram landscape hills', 'Bairabi Mizoram']
  },
  // Odisha
  {
    state: 'Odisha',
    district: 'jagatsinghpur',
    role: 'backup',
    queries: ['Paradip Port', 'Paradip Sea Beach', 'Mahanadi river delta Odisha']
  },
  // Punjab
  {
    state: 'Punjab',
    district: 'sangrur',
    role: 'backup',
    queries: ['Sangrur Punjab', 'Gurdwara Nankiana Sahib', 'Sunam Punjab', 'Punjab heritage']
  },
  // Uttar Pradesh
  {
    state: 'UttarPradesh',
    district: 'ballia',
    role: 'both',
    queries: ['Surha Tal', 'Surha Taal', 'Ganges river Ballia', 'Ballia Uttar Pradesh landscape']
  },
  {
    state: 'UttarPradesh',
    district: 'gonda',
    role: 'primary',
    queries: ['Chhapaiya Swaminarayan temple', 'Chhapaiya Gonda', 'Parvati Arga Bird Sanctuary']
  },
  {
    state: 'UttarPradesh',
    district: 'muzaffarnagar',
    role: 'primary',
    queries: ['Shukratal Muzaffarnagar', 'Sukartal temple', 'Ganga canal Uttar Pradesh']
  },
  {
    state: 'UttarPradesh',
    district: 'azamgarh',
    role: 'backup',
    queries: ['Nizamabad black pottery', 'Azamgarh pottery', 'Tamsa river Azamgarh']
  },
  {
    state: 'UttarPradesh',
    district: 'hapur',
    role: 'backup',
    queries: ['Garhmukteshwar Ganga', 'Brijghat Ganga', 'Garhmukteshwar temple']
  }
];

function isCleanTouristSpot(item) {
  if (!item || !item.title) return false;
  const t = (item.title + ' ' + (item.fileTitle || '')).toLowerCase();
  const badList = [
    'modi', 'minister', 'shekhawat', 'naidu', 'goyal', 'prabhu', 'shri',
    'statue of', 'unveiled', 'inaugurat', 'ceremony', 'foundation stone',
    'depot', 'platform', 'scarabaeus', 'beetle', 'skull', 'thali', 'shiva temple ananthagiri',
    'fatehpur', 'garuda feet', 'party-wise'
  ];
  return !badList.some(b => t.includes(b));
}

async function runCleanPass() {
  for (const t of SPECIFIC_TARGETS) {
    const filePath = path.resolve(`backend/src/services/images/verified${t.state}Dataset.json`);
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.districts || !data.districts[t.district]) continue;

    console.log(`Searching clean replacement for [${t.state}] ${t.district}...`);
    for (const q of t.queries) {
      const candidates = await searchCandidates(q, 10);
      const cleanCandidates = candidates.filter(isCleanTouristSpot);
      if (cleanCandidates.length > 0) {
        if (t.role === 'both' || t.role === 'primary') {
          data.districts[t.district].primary = {
            ...cleanCandidates[0],
            locationDescription: `${data.districts[t.district].location} (${cleanCandidates[0].title})`
          };
          console.log(`  ✓ Primary updated: ${cleanCandidates[0].title}`);
        }
        if ((t.role === 'both' || t.role === 'backup') && cleanCandidates.length > 1) {
          const bIdx = t.role === 'both' ? 1 : 0;
          data.districts[t.district].backup = {
            ...cleanCandidates[bIdx],
            locationDescription: `${data.districts[t.district].location} - Scenic view (${cleanCandidates[bIdx].title})`
          };
          console.log(`  ✓ Backup updated: ${cleanCandidates[bIdx].title}`);
        }
        break;
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
  console.log('Clean replacement complete!');
}

runCleanPass().catch(console.error);
