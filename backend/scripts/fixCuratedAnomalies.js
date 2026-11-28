import fs from 'fs';
import path from 'path';
import { searchCandidates } from './curationCore.js';

// Specific high-quality tourist landmarks for anomalous districts
const FIXES = [
  {
    state: 'meghalaya',
    district: 'eastern-west-khasi-hills',
    queries: ['Kyllang Rock', 'Nongkhnum River Island', 'Mairang', 'West Khasi Hills landscape']
  },
  {
    state: 'mizoram',
    district: 'khawzawl',
    queries: ['Mizoram landscape hills', 'Champhai Mizoram hills', 'Mizo hills landscape']
  },
  {
    state: 'mizoram',
    district: 'saitual',
    queries: ['Tam Dil Lake Mizoram', 'Tamdil lake', 'Mizoram landscape']
  },
  {
    state: 'nagaland',
    district: 'noklak',
    queries: ['Naga hills landscape', 'Patkai hills Nagaland', 'Nagaland hills mist']
  },
  {
    state: 'nagaland',
    district: 'peren',
    queries: ['Ntangki National Park', 'Intanki National Park', 'Dzukou Valley Nagaland', 'Naga hills']
  },
  {
    state: 'nagaland',
    district: 'longleng',
    queries: ['Naga hills landscape', 'Dikhu river Nagaland', 'Nagaland village hills']
  },
  {
    state: 'punjab',
    district: 'sangrur',
    backupOnly: true,
    queries: ['Banasar Garden Sangrur', 'Sangrur Punjab heritage', 'Diwan Khana Sangrur']
  },
  {
    state: 'punjab',
    district: 'barnala',
    queries: ['Gurudwara Barnala Punjab', 'Punjab rural landscape mustard fields', 'Barnala heritage']
  },
  {
    state: 'rajasthan',
    district: 'beawar',
    queries: ['Chang Gate Beawar', 'Beawar Rajasthan', 'Ajmer Rajasthan hills']
  },
  {
    state: 'rajasthan',
    district: 'didwana-kuchaman',
    queries: ['Kuchaman Fort Rajasthan', 'Kuchaman Fort', 'Didwana Salt Lake']
  },
  {
    state: 'rajasthan',
    district: 'phalodi',
    queries: ['Khichan Bird Sanctuary Demoiselle Crane', 'Khichan Cranes', 'Phalodi Fort']
  },
  {
    state: 'telangana',
    district: 'mulugu',
    queries: ['Ramappa Temple Warangal', 'Bogatha Waterfall', 'Laknavaram Lake']
  },
  {
    state: 'telangana',
    district: 'rajanna-sircilla',
    queries: ['Vemulawada temple', 'Sri Raja Rajeshwara temple Vemulawada', 'Mid Manair Dam']
  },
  {
    state: 'uttar-pradesh',
    district: 'ambedkar-nagar',
    queries: ['Kichhauchha Dargah', 'Ashraf Jahangir Semnani', 'Saryu River Uttar Pradesh']
  },
  {
    state: 'uttar-pradesh',
    district: 'hathras',
    queries: ['Hathras Fort', 'Dauji Temple Hathras', 'Braj landscape']
  },
  {
    state: 'uttar-pradesh',
    district: 'muzaffarnagar',
    queries: ['Sukartal Muzaffarnagar', 'Shukratal Uttar Pradesh', 'Ganga Canal Muzaffarnagar']
  },
  {
    state: 'uttar-pradesh',
    district: 'saharanpur',
    queries: ['Shakumbhari Devi Temple Saharanpur', 'Saharanpur Botanical Garden', 'Company Garden Saharanpur']
  },
  {
    state: 'uttar-pradesh',
    district: 'sultanpur',
    queries: ['Gomti River Sultanpur', 'Victoria Manzil Sultanpur', 'Parijat tree Uttar Pradesh']
  },
  {
    state: 'uttar-pradesh',
    district: 'bijnor',
    queries: ['Haiderpur Wetland', 'Vidur Kuti Bijnor', 'Ganga Barrage Bijnor']
  },
  {
    state: 'uttar-pradesh',
    district: 'auraiya',
    queries: ['Pachnada Auraiya', 'Yamuna Chambal confluence', 'Devkali Temple Auraiya']
  }
];

function isGoodLandmark(item) {
  if (!item || !item.title) return false;
  const t = (item.title + ' ' + (item.fileTitle || '')).toLowerCase();
  const badWords = [
    'modi', 'minister', 'conference', 'meeting', 'pu zoramthanga',
    'geoffrey peren', 'skull', 'thali', 'restaurant', 'depot', 'platform',
    'party-wise', 'turban', 'til-patti', 'kite near', 'addressing', 'office',
    'locator', 'map', 'assembly', 'constituency', 'election', 'court',
    'police', 'station', 'hospital', 'grave', 'graves'
  ];
  return !badWords.some(w => t.includes(w));
}

async function fixAnomalies() {
  for (const item of FIXES) {
    const slug = item.state;
    const distSlug = item.district;
    const filePath = path.resolve(`backend/src/services/images/verified${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase())}Dataset.json`);
    if (!fs.existsSync(filePath)) continue;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.districts || !data.districts[distSlug]) continue;

    console.log(`Searching fixes for [${slug}] ${distSlug}...`);
    for (const q of item.queries) {
      const candidates = await searchCandidates(q, 8);
      const valid = candidates.filter(isGoodLandmark);
      if (valid.length > 0) {
        if (!item.backupOnly) {
          data.districts[distSlug].primary = {
            ...valid[0],
            locationDescription: `${data.districts[distSlug].location} (${valid[0].title})`
          };
          console.log(`  ✓ Updated primary for ${distSlug}: ${valid[0].title}`);
        }
        if (valid.length > 1) {
          data.districts[distSlug].backup = {
            ...valid[1],
            locationDescription: `${data.districts[distSlug].location} - Alternative view (${valid[1].title})`
          };
          console.log(`  ✓ Updated backup for ${distSlug}: ${valid[1].title}`);
        }
        break;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
  console.log('Anomalies fix pass complete!');
}

fixAnomalies().catch(console.error);
