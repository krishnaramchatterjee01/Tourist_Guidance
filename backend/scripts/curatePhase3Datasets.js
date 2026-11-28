import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchCandidates } from './curationCore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. Target Configurations for 16 Explore Destinations
const EXPLORE_DESTINATIONS = [
  {
    key: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    queries: ['Udaipur City Palace Lake Pichola', 'Lake Pichola Udaipur', 'Udaipur palace rajasthan']
  },
  {
    key: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    queries: ['Lakshman Jhula Rishikesh Ganga', 'Rishikesh Ganga river Uttarakhand', 'Parmarth Niketan Rishikesh']
  },
  {
    key: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    queries: ['Virupaksha Temple Hampi', 'Hampi stone chariot', 'Hampi monuments landscape']
  },
  {
    key: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    queries: ['Munnar tea gardens landscape', 'Munnar hills Kerala tea plantation', 'Munnar landscape']
  },
  {
    key: 'andaman-islands',
    name: 'Andaman Islands',
    state: 'Andaman & Nicobar',
    queries: ['Radhanagar Beach Havelock Andaman', 'Havelock Island beach Andaman', 'Elephant Beach Andaman']
  },
  {
    key: 'leh-ladakh',
    name: 'Leh Ladakh',
    state: 'Ladakh',
    queries: ['Pangong Lake Ladakh landscape', 'Leh Palace Ladakh landscape', 'Thiksey Monastery Ladakh']
  },
  {
    key: 'darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    queries: ['Darjeeling Himalayan Railway tea garden', 'Kanchenjunga view Darjeeling', 'Tiger Hill Darjeeling sunrise']
  },
  {
    key: 'goa',
    name: 'Goa',
    state: 'Goa',
    queries: ['Palolem Beach Goa sunset', 'Goa beach landscape palm trees', 'Basilica of Bom Jesus Goa']
  },
  {
    key: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    queries: ['Varanasi Ghats Ganga river morning', 'Dashashwamedh Ghat Varanasi', 'Assi Ghat Varanasi']
  },
  {
    key: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    queries: ['Solang Valley Manali landscape snow', 'Rohtang Pass Manali landscape', 'Manali Himachal Pradesh mountains']
  },
  {
    key: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    queries: ['Hawa Mahal Jaipur facade', 'Amber Fort Jaipur landscape', 'Jal Mahal Jaipur']
  },
  {
    key: 'alleppey',
    name: 'Alleppey',
    state: 'Kerala',
    queries: ['Alappuzha backwaters houseboat', 'Alleppey backwaters Kerala houseboat', 'Kerala backwaters houseboat']
  },
  {
    key: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    queries: ['Golden Temple Amritsar night illumination', 'Harmandir Sahib Amritsar', 'Golden Temple Amritsar lake']
  },
  {
    key: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    queries: ['Umiam Lake Shillong Meghalaya', 'Elephant Falls Shillong', 'Shillong Meghalaya landscape']
  },
  {
    key: 'jaisalmer',
    name: 'Jaisalmer',
    state: 'Rajasthan',
    queries: ['Jaisalmer Fort sandstone Rajasthan', 'Sam Sand Dunes Jaisalmer camel', 'Jaisalmer desert dunes']
  },
  {
    key: 'gokarna',
    name: 'Gokarna',
    state: 'Karnataka',
    queries: ['Om Beach Gokarna Karnataka', 'Kudle Beach Gokarna', 'Gokarna beach coastline']
  }
];

// 2. Target Configurations for 16 Top Places Attractions
const TOP_PLACES_ATTRACTIONS = [
  {
    key: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    queries: ['Taj Mahal Agra sunrise front view', 'Taj Mahal Agra reflective pool', 'Taj Mahal Agra wide landscape']
  },
  {
    key: 'golden-temple',
    name: 'Golden Temple',
    location: 'Amritsar, Punjab',
    queries: ['Golden Temple Amritsar evening light', 'Harmandir Sahib Amritsar sarovar', 'Golden Temple Amritsar wide view']
  },
  {
    key: 'india-gate',
    name: 'India Gate',
    location: 'New Delhi',
    queries: ['India Gate New Delhi evening illuminated', 'India Gate New Delhi canopy landscape', 'India Gate Delhi monument']
  },
  {
    key: 'hawa-mahal',
    name: 'Hawa Mahal',
    location: 'Jaipur, Rajasthan',
    queries: ['Hawa Mahal Jaipur pink facade street', 'Hawa Mahal Palace of Winds Jaipur', 'Hawa Mahal Jaipur exterior']
  },
  {
    key: 'dal-lake',
    name: 'Dal Lake',
    location: 'Srinagar, Jammu & Kashmir',
    queries: ['Dal Lake Srinagar Shikara mountain reflection', 'Dal Lake Srinagar houseboats', 'Dal Lake Kashmir landscape']
  },
  {
    key: 'victoria-memorial',
    name: 'Victoria Memorial',
    location: 'Kolkata, West Bengal',
    queries: ['Victoria Memorial Kolkata reflection pond', 'Victoria Memorial Hall Kolkata exterior', 'Victoria Memorial Kolkata night']
  },
  {
    key: 'qutub-minar',
    name: 'Qutub Minar',
    location: 'New Delhi',
    queries: ['Qutub Minar complex New Delhi tower', 'Qutb Minar Delhi architectural landscape', 'Qutub Minar Delhi']
  },
  {
    key: 'meenakshi-temple',
    name: 'Meenakshi Temple',
    location: 'Madurai, Tamil Nadu',
    queries: ['Meenakshi Amman Temple Madurai gopuram towers', 'Meenakshi Temple Madurai gopurams', 'Madurai Meenakshi temple']
  },
  {
    key: 'gateway-of-india',
    name: 'Gateway of India',
    location: 'Mumbai, Maharashtra',
    queries: ['Gateway of India Mumbai Arabian Sea Taj Hotel', 'Gateway of India Mumbai harbor', 'Gateway of India Mumbai sunrise']
  },
  {
    key: 'ajanta-ellora',
    name: 'Ajanta & Ellora Caves',
    location: 'Aurangabad, Maharashtra',
    queries: ['Kailasa Temple Ellora Cave 16 carved stone', 'Ajanta Caves exterior panoramic', 'Ellora Kailash temple']
  },
  {
    key: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    location: 'Puri, Odisha',
    queries: ['Konark Sun Temple wheel stone sculpture', 'Konark Sun Temple chariot wheel Odisha', 'Konark Sun Temple main structure']
  },
  {
    key: 'mysore-palace',
    name: 'Mysore Palace',
    location: 'Mysuru, Karnataka',
    queries: ['Mysore Palace illuminated night lighting', 'Mysore Palace exterior front view', 'Amba Vilas Palace Mysore']
  },
  {
    key: 'varanasi-ghats',
    name: 'Varanasi Ghats',
    location: 'Varanasi, Uttar Pradesh',
    queries: ['Varanasi Ghats evening Ganga Aarti fire ceremony', 'Ghats of Varanasi Ganges riverboats', 'Manikarnika Ghat Varanasi']
  },
  {
    key: 'amber-fort',
    name: 'Amber Fort',
    location: 'Jaipur, Rajasthan',
    queries: ['Amber Fort Amer Jaipur Maota Lake reflection', 'Amer Fort Jaipur ramparts hill', 'Amber Fort Jaipur courtyard']
  },
  {
    key: 'pangong-tso',
    name: 'Pangong Tso Lake',
    location: 'Ladakh',
    queries: ['Pangong Tso blue water mountains Ladakh', 'Pangong Lake Ladakh turquoise blue', 'Pangong Lake landscape']
  },
  {
    key: 'dudhsagar-falls',
    name: 'Dudhsagar Falls',
    location: 'Goa',
    queries: ['Dudhsagar Falls Goa railway bridge train', 'Dudhsagar Waterfalls Goa railway line', 'Dudhsagar Falls Goa monsoon']
  }
];

function buildAttractionQueries(place) {
  const queries = [];
  const cleanName = place.name
    .replace(/\(.*?\)/g, '')
    .trim();

  // Parts separated by & or / or and
  const parts = cleanName.split(/&|\/| and /i).map(s => s.trim()).filter(Boolean);
  
  // Specific Landmark + District/State
  for (const part of parts) {
    queries.push(`${part} ${place.district_name}`);
    queries.push(`${part} ${place.state_name}`);
    queries.push(part);
  }

  // Fallback
  queries.push(`${cleanName} ${place.district_name}`);
  queries.push(`${cleanName} ${place.state_name}`);
  queries.push(`${place.district_name} tourist attraction ${place.state_name}`);

  return Array.from(new Set(queries));
}

async function main() {
  console.log('====================================================');
  console.log('CIMS PHASE 3: CURATE HIGH-RESOLUTION DATASETS');
  console.log('====================================================');

  const usedPageIds = new Set();

  // 1. Curate 16 Explore Destinations
  console.log('\n--- CURATING 16 EXPLORE DESTINATIONS ---');
  const exploreDataset = {};
  for (const item of EXPLORE_DESTINATIONS) {
    console.log(`Curating Explore: ${item.name} (${item.state})...`);
    let found = null;
    for (const q of item.queries) {
      const candidates = await searchCandidates(q, 6);
      found = candidates.find(c => !usedPageIds.has(c.pageId) && c.width >= 900);
      if (found) break;
      await sleep(150);
    }
    if (found) {
      usedPageIds.add(found.pageId);
      exploreDataset[item.key] = {
        name: item.name,
        state: item.state,
        image: found
      };
      console.log(`  ✓ Found: ${found.title} (${found.width}x${found.height})`);
    } else {
      console.error(`  ❌ FAILED to find image for Explore: ${item.name}`);
    }
    await sleep(200);
  }

  // 2. Curate 16 Top Places Attractions
  console.log('\n--- CURATING 16 TOP PLACES ATTRACTIONS ---');
  const topPlacesDataset = {};
  for (const item of TOP_PLACES_ATTRACTIONS) {
    console.log(`Curating Top Place: ${item.name} (${item.location})...`);
    let found = null;
    for (const q of item.queries) {
      const candidates = await searchCandidates(q, 6);
      found = candidates.find(c => !usedPageIds.has(c.pageId) && c.width >= 900);
      if (found) break;
      await sleep(150);
    }
    if (found) {
      usedPageIds.add(found.pageId);
      topPlacesDataset[item.key] = {
        name: item.name,
        location: item.location,
        image: found
      };
      console.log(`  ✓ Found: ${found.title} (${found.width}x${found.height})`);
    } else {
      console.error(`  ❌ FAILED to find image for Top Place: ${item.name}`);
    }
    await sleep(200);
  }

  // Save collections dataset
  const collectionsDatasetPath = path.resolve(__dirname, '../src/services/images/verifiedCollectionsDataset.json');
  fs.writeFileSync(collectionsDatasetPath, JSON.stringify({
    explore: exploreDataset,
    topPlaces: topPlacesDataset,
    curatedAt: new Date().toISOString()
  }, null, 2));
  console.log(`\n✓ Collections dataset written to: ${collectionsDatasetPath}`);

  // 3. Curate 172 Tourist Places Attractions
  console.log('\n--- CURATING 172 TOURIST PLACES (WB + AP) ---');
  const placesRaw = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'all172Places.json'), 'utf8'));
  const touristPlacesDataset = {};

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < placesRaw.length; i++) {
    const p = placesRaw[i];
    const queries = buildAttractionQueries(p);
    let selected = null;

    for (const q of queries) {
      const candidates = await searchCandidates(q, 6);
      selected = candidates.find(c => !usedPageIds.has(c.pageId) && c.width >= 600);
      if (selected) break;
      await sleep(100);
    }

    if (!selected) {
      // Fallback query by district + state + scenic
      const fallbackCandidates = await searchCandidates(`${p.district_name} landscape ${p.state_name}`, 6);
      selected = fallbackCandidates.find(c => !usedPageIds.has(c.pageId) && c.width >= 600);
    }

    if (selected) {
      usedPageIds.add(selected.pageId);
      touristPlacesDataset[p.id] = {
        id: p.id,
        name: p.name,
        district: p.district_name,
        state: p.state_name,
        category: p.category,
        image: selected
      };
      successCount++;
      console.log(`[${i + 1}/${placesRaw.length}] ✓ ID ${p.id} (${p.name}): ${selected.title.substring(0, 35)}...`);
    } else {
      failCount++;
      console.error(`[${i + 1}/${placesRaw.length}] ❌ ID ${p.id} (${p.name}) failed to find candidate!`);
    }
    await sleep(150);
  }

  const touristPlacesDatasetPath = path.resolve(__dirname, '../src/services/images/verifiedTouristPlacesDataset.json');
  fs.writeFileSync(touristPlacesDatasetPath, JSON.stringify({
    places: touristPlacesDataset,
    totalCurated: successCount,
    failedCount: failCount,
    curatedAt: new Date().toISOString()
  }, null, 2));
  console.log(`\n✓ Tourist places dataset written to: ${touristPlacesDatasetPath}`);
  console.log(`Summary: ${successCount} successfully curated, ${failCount} failed.`);
}

main().catch(console.error);
