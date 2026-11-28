import fs from 'fs';
import path from 'path';
import { searchCandidates } from './curationCore.js';

const UT_CONFIGS = [
  // Phase 29: Andaman and Nicobar Islands
  {
    slug: 'andaman-and-nicobar-islands',
    name: 'Andaman and Nicobar Islands',
    outputFile: 'verifiedAndamanAndNicobarIslandsDataset.json',
    heroQuery: 'Radhanagar Beach Havelock Island Andaman',
    cardQuery: 'Cellular Jail Port Blair Andaman',
    districts: [
      {
        slug: 'nicobar',
        name: 'Nicobar',
        location: 'Great Nicobar Biosphere Reserve and pristine southern coral atolls',
        queries: ['Great Nicobar', 'Nicobar island landscape', 'Car Nicobar', 'Nicobar beach']
      },
      {
        slug: 'north-and-middle-andaman',
        name: 'North and Middle Andaman',
        location: 'Baratang Island limestone caves and Ross and Smith twin islands',
        queries: ['Ross and Smith Islands Diglipur', 'Baratang limestone caves Andaman', 'Baratang island Andaman', 'Diglipur Andaman']
      },
      {
        slug: 'south-andaman',
        name: 'South Andaman',
        location: 'Radhanagar Beach Swaraj Dweep and historic Cellular Jail Port Blair',
        queries: ['Radhanagar Beach Havelock', 'Cellular Jail Port Blair', 'Chidiya Tapu Andaman', 'Havelock Island Andaman']
      }
    ]
  },
  // Phase 30: Chandigarh
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    outputFile: 'verifiedChandigarhDataset.json',
    heroQuery: 'Sukhna Lake Chandigarh sunset',
    cardQuery: 'Rock Garden Chandigarh Nek Chand',
    districts: [
      {
        slug: 'chandigarh',
        name: 'Chandigarh',
        location: 'Le Corbusier Capitol Complex, Rock Garden and serene Sukhna Lake',
        queries: ['Rock Garden of Chandigarh', 'Sukhna Lake Chandigarh', 'Open Hand Monument Chandigarh', 'Rose Garden Chandigarh']
      }
    ]
  },
  // Phase 31: Dadra and Nagar Haveli and Daman and Diu
  {
    slug: 'dadra-and-nagar-haveli-and-daman-and-diu',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    outputFile: 'verifiedDadraAndNagarHaveliAndDamanAndDiuDataset.json',
    heroQuery: 'Diu Fort Arabian Sea',
    cardQuery: 'Moti Daman Fort Portuguese',
    districts: [
      {
        slug: 'dadra-and-nagar-haveli',
        name: 'Dadra and Nagar Haveli',
        location: 'Vanganga Lake Garden, Dudhni lake and lush Silvassa heritage',
        queries: ['Dudhni Lake Silvassa', 'Vanganga Garden Silvassa', 'Silvassa landscape', 'Dadra and Nagar Haveli']
      },
      {
        slug: 'daman',
        name: 'Daman',
        location: 'Portuguese Moti Daman Fort, Bom Jesus Church and golden Jampore Beach',
        queries: ['Moti Daman Fort', 'Jampore Beach Daman', 'Church of Bom Jesus Daman', 'Daman Fort']
      },
      {
        slug: 'diu',
        name: 'Diu',
        location: 'Historic sea-girt Diu Fort, Naida Caves and crescent Nagoa Beach',
        queries: ['Diu Fort', 'Naida Caves Diu', 'Nagoa Beach Diu', 'St. Paul Church Diu']
      }
    ]
  },
  // Phase 32: Delhi
  {
    slug: 'delhi',
    name: 'Delhi',
    outputFile: 'verifiedDelhiDataset.json',
    heroQuery: 'India Gate New Delhi evening lights',
    cardQuery: 'Red Fort Delhi Lal Qila',
    districts: [
      {
        slug: 'central-delhi',
        name: 'Central Delhi',
        location: 'Mughal architectural splendor of Jama Masjid and Shahjahanabad heritage',
        queries: ['Jama Masjid Delhi', 'Chandni Chowk heritage', 'Red Fort Delhi']
      },
      {
        slug: 'east-delhi',
        name: 'East Delhi',
        location: 'Colossal Swaminarayan Akshardham Temple complex and Sanjay Lake',
        queries: ['Akshardham Temple Delhi', 'Swaminarayan Akshardham Delhi', 'Sanjay Lake Delhi']
      },
      {
        slug: 'new-delhi',
        name: 'New Delhi',
        location: 'Imperial India Gate war memorial, Rashtrapati Bhavan and Lodhi Gardens',
        queries: ['India Gate Delhi', 'Rashtrapati Bhavan', 'Lodhi Gardens Delhi', 'Connaught Place Delhi']
      },
      {
        slug: 'north-delhi',
        name: 'North Delhi',
        location: 'Historic Northern Ridge, Mutiny Memorial and British colonial heritage',
        queries: ['Mutiny Memorial Delhi', 'Northern Ridge Delhi', 'Flagstaff Tower Delhi', 'Coronation Park Delhi']
      },
      {
        slug: 'north-east-delhi',
        name: 'North East Delhi',
        location: 'Scenic Yamuna riverfront wetlands and Signature Bridge landscape',
        queries: ['Signature Bridge Delhi', 'Yamuna riverfront Delhi', 'Yamuna Delhi bridge']
      },
      {
        slug: 'north-west-delhi',
        name: 'North West Delhi',
        location: 'Theme recreation at Adventure Island Metro Walk and Japanese Park Rohini',
        queries: ['Japanese Park Rohini', 'Adventure Island Rohini Delhi', 'Metro Walk Rohini']
      },
      {
        slug: 'shahdara',
        name: 'Shahdara',
        location: 'Historic trans-Yamuna Mughal market settlement and heritage havelis',
        queries: ['Shahdara Delhi', 'East Delhi heritage', 'Old Delhi street scene']
      },
      {
        slug: 'south-delhi',
        name: 'South Delhi',
        location: 'UNESCO World Heritage Qutub Minar, Mehrauli ruins and Bahai Lotus Temple',
        queries: ['Qutub Minar Delhi', 'Lotus Temple Delhi', 'Mehrauli Archaeological Park', 'Hauz Khas complex']
      },
      {
        slug: 'south-east-delhi',
        name: 'South East Delhi',
        location: 'UNESCO Humayun\'s Tomb Mughal gardens and Sunder Nursery heritage',
        queries: ['Humayuns Tomb Delhi', 'Sunder Nursery Delhi', 'Nizamuddin Dargah Delhi', 'Tughlaqabad Fort']
      },
      {
        slug: 'south-west-delhi',
        name: 'South West Delhi',
        location: 'Indian Air Force Museum Palam and historic stepwell at Dwarka Baoli',
        queries: ['Indian Air Force Museum Palam', 'Air Force Museum Delhi', 'Dwarka Baoli Delhi']
      },
      {
        slug: 'west-delhi',
        name: 'West Delhi',
        location: 'Historic Hastsal Minar hunting pavilion and sprawling district parks',
        queries: ['Hastsal Minar', 'Hastsal Minar Delhi', 'District Park Paschim Vihar']
      }
    ]
  },
  // Phase 33: Jammu and Kashmir
  {
    slug: 'jammu-and-kashmir',
    name: 'Jammu and Kashmir',
    outputFile: 'verifiedJammuAndKashmirDataset.json',
    heroQuery: 'Dal Lake shikara Srinagar Himalayas',
    cardQuery: 'Gulmarg Gondola mountain snow Kashmir',
    districts: [
      {
        slug: 'anantnag',
        name: 'Anantnag',
        location: 'Scenic Lidder River valley at Pahalgam and ancient 8th-century Martand Sun Temple',
        queries: ['Pahalgam Lidder River', 'Betaab Valley Pahalgam', 'Martand Sun Temple Anantnag', 'Aru Valley Pahalgam']
      },
      {
        slug: 'bandipora',
        name: 'Bandipora',
        location: 'Asia\'s largest freshwater Wular Lake and remote alpine beauty of Gurez Valley',
        queries: ['Wular Lake Kashmir', 'Gurez Valley Kashmir', 'Habba Khatoon Gurez']
      },
      {
        slug: 'baramulla',
        name: 'Baramulla',
        location: 'World-famous Gulmarg ski slopes, high-altitude Gondola and Apharwat Peak',
        queries: ['Gulmarg Gondola Apharwat', 'Gulmarg skiing snow', 'Gulmarg meadow Kashmir']
      },
      {
        slug: 'budgam',
        name: 'Budgam',
        location: 'Lush alpine meadows of Doodhpathri Milk Valley and forested Yusmarg',
        queries: ['Doodhpathri Kashmir', 'Yusmarg Kashmir', 'Charar-i-Sharief Budgam']
      },
      {
        slug: 'doda',
        name: 'Doda',
        location: 'Chhota Kashmir in Bhaderwah valley, alpine Jai Valley and Chenab gorges',
        queries: ['Bhaderwah Jammu', 'Jai Valley Bhaderwah', 'Chinta Valley Bhaderwah']
      },
      {
        slug: 'ganderbal',
        name: 'Ganderbal',
        location: 'Meadow of Gold Sonamarg, Thajiwas Glacier and Sindh River trout waters',
        queries: ['Sonamarg Thajiwas Glacier', 'Sonamarg Kashmir meadow', 'Sindh River Sonamarg']
      },
      {
        slug: 'jammu',
        name: 'Jammu',
        location: 'Historical Bahu Fort overlooking Tawi River and royal Mubarak Mandi Palace',
        queries: ['Bahu Fort Jammu', 'Mubarak Mandi Palace Jammu', 'Bagh-e-Bahu Jammu']
      },
      {
        slug: 'kathua',
        name: 'Kathua',
        location: 'Royal ruins of Jasrota Fort and expansive waters of Ranjit Sagar Dam',
        queries: ['Jasrota Fort Kathua', 'Ranjit Sagar Dam Kathua', 'Kathua Jammu landscape']
      },
      {
        slug: 'kishtwar',
        name: 'Kishtwar',
        location: 'Kishtwar High Altitude National Park and picturesque saffron terraces',
        queries: ['Kishtwar landscape Jammu', 'Kishtwar National Park', 'Paddar Valley Kishtwar']
      },
      {
        slug: 'kulgam',
        name: 'Kulgam',
        location: 'Roaring 25-meter Aharbal Waterfall known as the Niagara of Kashmir',
        queries: ['Aharbal Waterfall Kulgam', 'Aharbal Falls Kashmir', 'Kousarnag Lake Kulgam']
      },
      {
        slug: 'kupwara',
        name: 'Kupwara',
        location: 'Idyllic walnut orchards of Lolab Valley and pristine meadows of Bungus',
        queries: ['Lolab Valley Kupwara', 'Bungus Valley Kupwara', 'Kupwara Kashmir landscape']
      },
      {
        slug: 'poonch',
        name: 'Poonch',
        location: 'Historic royal Poonch Fort and scenic Pir Panjal mountain gateway',
        queries: ['Poonch Fort Jammu', 'Nangali Sahib Poonch', 'Peer Ki Gali Poonch']
      },
      {
        slug: 'pulwama',
        name: 'Pulwama',
        location: 'World-renowned purple saffron fields of Pampore and 9th-century Avantipur ruins',
        queries: ['Avantipur ruins Kashmir', 'Avantiswami Temple Pulwama', 'Pampore saffron Kashmir']
      },
      {
        slug: 'rajouri',
        name: 'Rajouri',
        location: 'Historic royal Mughal Road crossing, Rajouri Fort and Dehra Ki Gali',
        queries: ['Rajouri Fort Jammu', 'Dehra Ki Gali Rajouri', 'Mughal Road Rajouri']
      },
      {
        slug: 'ramban',
        name: 'Ramban',
        location: 'Picturesque Sanasar Lake meadows and massive Baglihar hydroelectric dam',
        queries: ['Sanasar Lake Jammu', 'Baglihar Dam Ramban', 'Batote pine forests Ramban']
      },
      {
        slug: 'reasi',
        name: 'Reasi',
        location: 'World-renowned holy shrine of Shri Mata Vaishno Devi and Chenab Rail Bridge',
        queries: ['Vaishno Devi Katra', 'Chenab Rail Bridge Reasi', 'Bhimgarh Fort Reasi']
      },
      {
        slug: 'samba',
        name: 'Samba',
        location: 'Ancient 19th-century Samba Fort and scenic Mansar Lake foothills',
        queries: ['Samba Fort Jammu', 'Mansar Lake Jammu', 'Purmandal Jammu']
      },
      {
        slug: 'shopian',
        name: 'Shopian',
        location: 'Scenic apple and walnut orchards and historic Peer Ki Gali mountain pass',
        queries: ['Peer Ki Gali Shopian', 'Jamia Masjid Shopian', 'Shopian Kashmir landscape']
      },
      {
        slug: 'srinagar',
        name: 'Srinagar',
        location: 'World-famous Dal Lake shikaras, terraced Nishat Bagh and Shankaracharya Temple',
        queries: ['Dal Lake Srinagar shikara', 'Nishat Bagh Srinagar', 'Shalimar Bagh Srinagar', 'Shankaracharya Temple Srinagar']
      },
      {
        slug: 'udhampur',
        name: 'Udhampur',
        location: 'Panoramic deodar cedar forests of Patnitop and 9th-century Krimchi temples',
        queries: ['Patnitop hill station Jammu', 'Krimchi Temples Udhampur', 'Patnitop cedar forest']
      }
    ]
  },
  // Phase 34: Ladakh
  {
    slug: 'ladakh',
    name: 'Ladakh',
    outputFile: 'verifiedLadakhDataset.json',
    heroQuery: 'Pangong Tso Lake Ladakh blue water mountains',
    cardQuery: 'Thiksey Monastery Ladakh Himalayas',
    districts: [
      {
        slug: 'kargil',
        name: 'Kargil',
        location: 'Trans-Himalayan Zanskar Valley, Phuktal cliff monastery and Drass War Memorial',
        queries: ['Zanskar Valley Ladakh', 'Phuktal Monastery Zanskar', 'Drass War Memorial Kargil', 'Suru Valley Nun Kun']
      },
      {
        slug: 'leh',
        name: 'Leh',
        location: 'Azure waters of Pangong Tso, Nubra Valley sand dunes, Khardung La and Thiksey Gompa',
        queries: ['Pangong Tso Ladakh', 'Nubra Valley Hunder dunes', 'Thiksey Monastery Leh', 'Leh Palace Shanti Stupa']
      }
    ]
  },
  // Phase 35: Lakshadweep
  {
    slug: 'lakshadweep',
    name: 'Lakshadweep',
    outputFile: 'verifiedLakshadweepDataset.json',
    heroQuery: 'Bangaram Island Lakshadweep turquoise lagoon',
    cardQuery: 'Agatti Island Lakshadweep coral reef',
    districts: [
      {
        slug: 'lakshadweep',
        name: 'Lakshadweep',
        location: 'Untouched turquoise lagoons at Bangaram, coral reefs of Agatti and Kavaratti',
        queries: ['Bangaram Island Lakshadweep', 'Agatti Island lagoon Lakshadweep', 'Kavaratti Lakshadweep beach', 'Lakshadweep coral reef']
      }
    ]
  },
  // Phase 36: Puducherry
  {
    slug: 'puducherry',
    name: 'Puducherry',
    outputFile: 'verifiedPuducherryDataset.json',
    heroQuery: 'Promenade Beach Puducherry French Quarter',
    cardQuery: 'White Town French Quarter Puducherry',
    districts: [
      {
        slug: 'karaikal',
        name: 'Karaikal',
        location: 'Sacred Thirunallar Saneeswara Temple and tranquil sandy Karaikal Beach',
        queries: ['Thirunallar Temple Karaikal', 'Karaikal Beach Puducherry', 'Karaikal town']
      },
      {
        slug: 'mahe',
        name: 'Mahe',
        location: 'Picturesque riverside walkways along Mahe River and French colonial monuments',
        queries: ['Mahe River Puducherry', 'Mahe walkway Kerala border', 'St Teresa Church Mahe']
      },
      {
        slug: 'puducherry',
        name: 'Puducherry',
        location: 'French Quarter White Town villas, Promenade Beach and Sri Aurobindo Ashram',
        queries: ['White Town Puducherry', 'Promenade Beach Pondicherry', 'Sri Aurobindo Ashram Pondicherry', 'French Quarter Pondicherry']
      },
      {
        slug: 'yanam',
        name: 'Yanam',
        location: 'Scenic landscaped riverfront promenade along the Godavari and French Heritage Tower',
        queries: ['Yanam Godavari riverfront', 'Yanam French tower', 'Yanam Puducherry']
      }
    ]
  }
];

function isCleanTouristSpot(item) {
  if (!item || !item.title) return false;
  const t = (item.title + ' ' + (item.fileTitle || '')).toLowerCase();
  const badList = [
    'modi', 'minister', 'shekhawat', 'naidu', 'goyal', 'prabhu', 'shri',
    'statue of', 'unveiled', 'inaugurat', 'ceremony', 'foundation stone',
    'depot', 'platform', 'scarabaeus', 'beetle', 'skull', 'party-wise',
    'conference', 'meeting', 'office', 'court', 'police', 'hospital',
    'locator', 'map', 'assembly', 'constituency', 'election'
  ];
  return !badList.some(b => t.includes(b));
}

async function curateUt(cfg) {
  console.log(`\n============================================================`);
  console.log(`CURATING UNION TERRITORY: ${cfg.name} (${cfg.districts.length} districts)`);
  console.log(`============================================================`);

  // 1. Curate State Hero & Card
  console.log(`Searching State Hero: "${cfg.heroQuery}"...`);
  const heroCands = (await searchCandidates(cfg.heroQuery, 6)).filter(isCleanTouristSpot);
  const hero = heroCands[0] || null;
  console.log(`  ✓ Hero selected: ${hero ? hero.title : 'FALLBACK'}`);

  console.log(`Searching State Card: "${cfg.cardQuery}"...`);
  const cardCands = (await searchCandidates(cfg.cardQuery, 6)).filter(isCleanTouristSpot);
  const card = cardCands[0] || null;
  console.log(`  ✓ Card selected: ${card ? card.title : 'FALLBACK'}`);

  // 2. Curate Districts
  const districts = {};
  for (const d of cfg.districts) {
    console.log(`\nCurating District: ${d.name} (${d.slug})...`);
    let pair = null;

    for (const q of d.queries) {
      console.log(`  Searching query: "${q}"...`);
      const candidates = (await searchCandidates(q, 8)).filter(isCleanTouristSpot);
      if (candidates.length > 0) {
        pair = {
          primary: {
            ...candidates[0],
            locationDescription: `${d.location} (${candidates[0].title})`
          },
          backup: candidates.length > 1 ? {
            ...candidates[1],
            locationDescription: `${d.location} - Alternative view (${candidates[1].title})`
          } : null
        };
        console.log(`  ✓ Primary found: ${pair.primary.title}`);
        if (pair.backup) console.log(`  ✓ Backup found: ${pair.backup.title}`);
        break;
      }
    }

    if (!pair) {
      console.warn(`  [Warning] No candidates found for ${d.name}! Trying generic search...`);
      const fallbackCands = (await searchCandidates(`${d.name} ${cfg.name} tourism`, 8)).filter(isCleanTouristSpot);
      if (fallbackCands.length > 0) {
        pair = {
          primary: {
            ...fallbackCands[0],
            locationDescription: `${d.location} (${fallbackCands[0].title})`
          },
          backup: fallbackCands.length > 1 ? {
            ...fallbackCands[1],
            locationDescription: `${d.location} - Alternative view (${fallbackCands[1].title})`
          } : null
        };
      }
    }

    districts[d.slug] = {
      slug: d.slug,
      name: d.name,
      location: d.location,
      primary: pair?.primary || null,
      backup: pair?.backup || null
    };
  }

  const dataset = {
    state: {
      name: cfg.name,
      slug: cfg.slug,
      hero,
      card
    },
    districts
  };

  const outPath = path.resolve('backend/src/services/images', cfg.outputFile);
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf8');
  console.log(`\n✓ Saved verified dataset: ${cfg.outputFile}`);
}

async function main() {
  for (const cfg of UT_CONFIGS) {
    await curateUt(cfg);
  }
  console.log('\n============================================================');
  console.log('ALL 8 UNION TERRITORY DATASETS CURATED SUCCESSFULLY!');
  console.log('============================================================\n');
}

main().catch(console.error);
