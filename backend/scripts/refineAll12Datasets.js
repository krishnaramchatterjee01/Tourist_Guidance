import fs from 'fs';
import path from 'path';
import { searchCandidates } from './curationCore.js';

function isIrrelevant(item) {
  if (!item || !item.title) return true;
  const t = (item.title + ' ' + (item.fileTitle || '')).toLowerCase();
  if (t.includes('shri narendra modi') || t.includes('prime minister') || t.includes('vice president') || t.includes('venkaiah naidu')) return true;
  if (t.includes('convocation') || t.includes('inauguration') || t.includes('conference') || t.includes('minister for')) return true;
  if (t.includes('map') || t.includes('locator') || t.includes('constituency') || t.includes('assembly') || t.includes('election')) return true;
  if (t.includes('school') || t.includes('college') || t.includes('healthcenter') || t.includes('hospital')) return true;
  if (t.includes('railway station') || t.includes('tickets') || t.includes('beggers')) return true;
  return false;
}

const REFINEMENTS = {
  meghalaya: {
    'east-jaintia-hills': {
      queries: ['Lukha River Meghalaya', 'Lukha River The Green Reflection', 'Krem Liat Prah', 'Jaintia Hills landscape']
    },
    'eastern-west-khasi-hills': {
      queries: ['Mairang Meghalaya', 'Kyllang Rock Meghalaya', 'Symper Rock Meghalaya']
    },
    'south-west-garo-hills': {
      queries: ['Garo Hills Meghalaya landscape', 'Davidraju Garo Hills', 'Ampati Garo Hills']
    },
    'west-garo-hills': {
      queries: ['Pelga Falls Tura', 'Ganol River Meghalaya', 'Nokrek National Park Tura']
    }
  },
  mizoram: {
    'kolasib': {
      queries: ['Serlui B Dam', 'Mizoram landscape hills', 'Kolasib hills']
    }
  },
  nagaland: {
    'ch-moukedima': {
      queries: ['Chumukedima Ao Baptist Church', 'Chümoukedima District Office Complex', 'Chumukedima waterfall']
    },
    'longleng': {
      queries: ['Phom Nagaland', 'Dikhu river Nagaland', 'Naga hills landscape']
    },
    'peren': {
      queries: ['Ntangki National Park', 'Intanki National Park Nagaland', 'Benreu village Nagaland', 'Peren Nagaland']
    },
    'noklak': {
      queries: ['Noklak Nagaland', 'Khiamniungan Nagaland', 'Pangsha Nagaland hills']
    },
    'shamator': {
      queries: ['Zungki River Nagaland', 'Saramati Nagaland', 'Shamator hills']
    }
  },
  odisha: {
    'jagatsinghpur': {
      queries: ['Paradeep Port Odisha', 'Sarala Temple Jhankad', 'Paradip Beach Odisha']
    },
    'kalahandi': {
      queries: ['Phurlijharan Falls Kalahandi', 'Karlapat Wildlife Sanctuary', 'Asurgarh Fort Kalahandi']
    },
    'malkangiri': {
      queries: ['Balimela Dam Malkangiri', 'Balimela Reservoir', 'Satiguda Dam Malkangiri']
    },
    'nabarangpur': {
      queries: ['Chandandhara Falls Odisha', 'Nabarangpur Odisha landscape', 'Indravati river Odisha']
    },
    'jharsuguda': {
      queries: ['Jhadeswar Temple Jharsuguda', 'Kolabira Fort Jharsuguda', 'Hirakud reservoir backwaters Jharsuguda']
    }
  },
  punjab: {
    'barnala': {
      queries: ['Gurdwara Sekha Barnala', 'Baba Kala Mehar Barnala', 'Barnala Punjab heritage']
    },
    'faridkot': {
      queries: ['Raj Mahal Faridkot', 'Qila Mubarak Faridkot', 'Tilla Baba Farid Faridkot']
    }
  },
  rajasthan: {
    'didwana-kuchaman': {
      queries: ['Kuchaman Fort Rajasthan', 'Didwana Salt Lake Rajasthan', 'Kuchaman City']
    },
    'hanumangarh': {
      queries: ['Bhatner Fort Hanumangarh', 'Kalibangan excavation Hanumangarh', 'Hanumangarh Fort']
    },
    'jalore': {
      queries: ['Jalore Fort Rajasthan', 'Topkhana Jalore', 'Sundha Mata Temple Jalore']
    },
    'jhalawar': {
      queries: ['Gagron Fort Jhalawar', 'Kolvi Caves Jhalawar', 'Sun Temple Jhalrapatan Jhalawar']
    },
    'kota': {
      queries: ['Seven Wonders Park Kota', 'Chambal Riverfront Kota', 'Jagmandir Palace Kota']
    },
    'phalodi': {
      queries: ['Khichan Bird Sanctuary Demoiselle', 'Khichan Cranes Phalodi', 'Phalodi Fort Rajasthan']
    }
  },
  'tamil-nadu': {
    'kallakurichi': {
      queries: ['Kalvarayan Hills Tamil Nadu', 'Megam Falls Kallakurichi', 'Gomukhi Dam Kallakurichi']
    },
    'nagapattinam': {
      queries: ['Velankanni Church Tamil Nadu', 'Nagapattinam lighthouse', 'Point Calimere Sanctuary']
    },
    'nilgiris': {
      queries: ['Nilgiri Mountain Railway Ooty', 'Ooty Lake Nilgiris', 'Doddabetta Peak Nilgiris']
    }
  },
  telangana: {
    'kumuram-bheem-asifabad': {
      queries: ['Kerameri Ghats Asifabad', 'Kumuram Bheem Tribal museum', 'Jodeghat Asifabad']
    },
    'nizamabad': {
      queries: ['Nizamabad Fort Telangana', 'Ashok Sagar Nizamabad', 'Alisagar Nizamabad']
    },
    'peddapalli': {
      queries: ['Dhulikatta Buddhist Stupa', 'Sabitham Waterfall Peddapalli', 'Peddapalli Telangana']
    },
    'rajanna-sircilla': {
      queries: ['Vemulawada Raja Rajeshwara Temple', 'Mid Manair Dam Sircilla', 'Vemulawada temple']
    },
    'sangareddy': {
      queries: ['Manjeera Dam Kalpagur Sangareddy', 'Manjeera Wildlife Sanctuary', 'Singur Dam Sangareddy']
    },
    'wanaparthy': {
      queries: ['Wanaparthy Palace Telangana', 'Sarala Sagar Dam Wanaparthy', 'Wanaparthy royal palace']
    }
  },
  'uttar-pradesh': {
    'ayodhya': {
      queries: ['Ram Mandir Ayodhya', 'Saryu Ghat Ayodhya', 'Hanuman Garhi Ayodhya', 'Kanak Bhawan Ayodhya']
    },
    'azamgarh': {
      queries: ['Nizamabad black pottery Azamgarh', 'Dattatreya Temple Azamgarh', 'Tamsa river Azamgarh']
    },
    'ambedkar-nagar': {
      queries: ['Kichhauchha Dargah Ambedkar Nagar', 'Tanda Saryu Ambedkar Nagar', 'Ambedkar Nagar heritage']
    },
    'auraiya': {
      queries: ['Pachnada Auraiya', 'Devkali Temple Auraiya', 'Yamuna river Auraiya']
    },
    'basti': {
      queries: ['Kotahi Mandir Amorha Basti', 'Chando Tal Basti', 'Basti Uttar Pradesh heritage']
    },
    'bijnor': {
      queries: ['Haiderpur Wetland Bijnor', 'Vidur Kuti Bijnor', 'Kanva Ashram Bijnor']
    }
  }
};

async function refineDataset(slug) {
  const filePath = path.resolve(`backend/src/services/images/verified${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase())}Dataset.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const cfg = REFINEMENTS[slug] || {};
  let modified = false;

  for (const [distSlug, dist] of Object.entries(data.districts || {})) {
    const needsRefinement = cfg[distSlug] || isIrrelevant(dist.primary) || isIrrelevant(dist.backup);
    if (!needsRefinement) continue;

    console.log(`Refining [${slug}] ${distSlug}...`);
    const queries = (cfg[distSlug] && cfg[distSlug].queries) || [dist.location, distSlug + ' ' + slug];

    for (const q of queries) {
      const candidates = await searchCandidates(q, 6);
      const validCands = candidates.filter(c => !isIrrelevant(c));
      if (validCands.length > 0) {
        if (isIrrelevant(dist.primary) || (cfg[distSlug] && cfg[distSlug].queries)) {
          dist.primary = { ...validCands[0], locationDescription: dist.location };
          modified = true;
          console.log(`  ✓ Updated primary for ${distSlug}: ${dist.primary.title}`);
        }
        if (validCands.length > 1 && (isIrrelevant(dist.backup) || !dist.backup)) {
          dist.backup = { ...validCands[1], locationDescription: dist.location + ' (Alternative View)' };
          modified = true;
          console.log(`  ✓ Updated backup for ${distSlug}: ${dist.backup.title}`);
        }
        break;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved refined dataset: ${filePath}`);
  } else {
    console.log(`No refinements needed for ${slug}`);
  }
}

async function runAllRefinements() {
  const states = [
    'meghalaya', 'mizoram', 'nagaland', 'odisha',
    'punjab', 'rajasthan', 'sikkim', 'tamil-nadu',
    'telangana', 'tripura', 'uttar-pradesh', 'uttarakhand'
  ];
  for (const s of states) {
    await refineDataset(s);
  }
}

export { runAllRefinements };
if (process.argv[1].endsWith('refineAll12Datasets.js')) {
  runAllRefinements().catch(console.error);
}
