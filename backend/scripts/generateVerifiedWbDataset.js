import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_FILES = {
  state: {
    hero: 'File:Victoria Memorial Hall Kolkata.jpg',
    card: 'File:Howrah bridge at night.jpg'
  },
  districts: {
    'alipurduar': {
      primary: 'File:Buxa Fort, Alipurduar.jpg',
      backup: 'File:Jayanti river at Buxa tiger reserve 03.jpg'
    },
    'bankura': {
      primary: 'File:Madana Mohana temple of Bishnupur in Bankura district 37.jpg',
      backup: 'File:Jor Bangla Temple Bishnupur.jpg'
    },
    'birbhum': {
      primary: 'File:Bolpur-Santiniketan Road and Santiniketan-Sriniketan Road Junction - Hirabai Panthasala Area - Birbhum 2014-06-28 5203.JPG',
      backup: 'File:Upasana Griha Santiniketan.jpg'
    },
    'cooch-behar': {
      primary: 'File:The Cooch Behar Palace or the Cooch Behar Rajbari, Cooch Behar District, West Bengal, India 04.jpg',
      backup: 'File:Cooch Behar Palace West Bengal India.jpg'
    },
    'dakshin-dinajpur': {
      primary: 'File:Balurghat-airport-balurghat-dinajpur.jpg',
      backup: 'File:Balurghat college campus.jpg'
    },
    'darjeeling': {
      primary: 'File:Tiger Hill Darjeeling West Bengal India.JPG',
      backup: 'File:Darjeeling Himalayan Railway,toy train (8).jpg'
    },
    'hooghly': {
      primary: 'File:Hooghly Imambara, in and outside views 17.jpg',
      backup: 'File:Hooghly Imambara at West Bengal 01.jpg'
    },
    'howrah': {
      primary: 'File:Front view of the Belur Math temple in Belur Math, Howrah, West Bengal.jpg',
      backup: 'File:Belur Math, West Bengal.jpg'
    },
    'jalpaiguri': {
      primary: 'File:Mahakal Jhora, Gorumara National Park, Jalpaiguri, West Bengal.jpg',
      backup: 'File:Gorumara watchtower.jpg'
    },
    'jhargram': {
      primary: 'File:Jhargram Palace.jpg',
      backup: 'File:Jhargram Rajbari, West Bengal.jpg'
    },
    'kalimpong': {
      primary: 'File:Blessed! (8074695579).jpg',
      backup: 'File:Deolo Hill Kalimpong.jpg'
    },
    'kolkata': {
      primary: 'File:Victoria Memorial situated in Kolkata.jpg',
      backup: 'File:St. Paul\'s Cathedral, Kolkata.jpg'
    },
    'malda': {
      primary: 'File:Adina Mosque at Malda district of West Bengal 04.jpg',
      backup: 'File:Dakhil Darwaza Gour Malda.jpg'
    },
    'murshidabad': {
      primary: 'File:Hazarduari Palace, Murshidabad illuminated at night.jpg',
      backup: 'File:Hazarduari Palace Murshidabad India.jpg'
    },
    'nadia': {
      primary: 'File:Chandrodaya temple at ISKCON, Mayapur in Nadia District, West Bengal, India 02.jpg',
      backup: 'File:Mayapur Chandrodaya Temple.jpg'
    },
    'north-24-parganas': {
      primary: 'File:Dakshineswar Kali Temple, Dakshineswar, West Bengal, India (2007).jpg',
      backup: 'File:Dakshineswar Temple Kolkata.jpg'
    },
    'paschim-bardhaman': {
      primary: 'File:Durgapur barrage2.jpg',
      backup: 'File:Durgapur Barrage Damodar River.jpg'
    },
    'paschim-medinipur': {
      primary: 'File:Gangani, Grand Canyon of Bengal, Garbeta 09.jpg',
      backup: 'File:Kurumbera Fort West Bengal.jpg'
    },
    'purba-bardhaman': {
      primary: 'File:Lord Curzon Gate alias Bijoy Toran at Bardhaman town in Purba Bardhaman district in West Bengal 01.jpg',
      backup: 'File:108 Shiva Temple Kalna Purba Bardhaman.jpg'
    },
    'purba-medinipur': {
      primary: 'File:New Digha Sea beach in Digha 01.jpg',
      backup: 'File:Mandarmani Sea Beach Purba Medinipur.jpg'
    },
    'purulia': {
      primary: 'File:Ayodhya Hills - Purulia - I.jpg',
      backup: 'File:Ajodhya Hills Purulia West Bengal.jpg'
    },
    'south-24-parganas': {
      primary: 'File:Tourist Boat in Sundarbans, West Bengal, India 03.jpg',
      backup: 'File:Sundarbans Mangrove Waterway West Bengal.jpg'
    },
    'uttar-dinajpur': {
      primary: 'File:Kulik Bird Sanctuary in the Uttar Dinajpur district 16.jpg',
      backup: 'File:Raiganj Wildlife Sanctuary Kulik.jpg'
    }
  }
};

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

async function fetchMetadata(titles) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles.join('|'))}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  const data = await res.json();
  const pages = data.query?.pages || {};

  const map = {};
  for (const page of Object.values(pages)) {
    if (page.imageinfo && page.imageinfo[0]) {
      const info = page.imageinfo[0];
      const meta = info.extmetadata || {};
      map[page.title] = {
        pageId: String(page.pageid),
        title: page.title.replace(/^File:/i, '').replace(/\.[^.]+$/, '').replace(/_/g, ' '),
        originalUrl: info.url,
        displayUrl: info.thumburl || info.url,
        thumbnailUrl: info.thumburl || info.url,
        sourcePageUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
        photographer: cleanHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Contributor'),
        licenseName: cleanHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || 'CC BY-SA 4.0'),
        licenseUrl: meta.LicenseUrl?.value || 'https://creativecommons.org/licenses/by-sa/4.0/',
        attribution: `${cleanHtml(meta.Artist?.value || 'Wikimedia Contributor')} (${cleanHtml(meta.LicenseShortName?.value || 'CC BY-SA 4.0')}) via Wikimedia Commons`,
        width: info.width || 960,
        height: info.height || 640,
        mime: info.mime || 'image/jpeg'
      };
    }
  }
  return map;
}

async function verifyUrlLive(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Range': 'bytes=0-1024',
        'User-Agent': USER_AGENT
      }
    });
    const contentType = res.headers.get('content-type') || '';
    return {
      status: res.status,
      ok: res.ok && contentType.startsWith('image/'),
      contentType
    };
  } catch (err) {
    return { status: 0, ok: false, error: err.message };
  }
}

async function run() {
  console.log('=== COLLECTING AND VERIFYING LIVE WIKIMEDIA DATASET ===');

  const allTitles = [
    TARGET_FILES.state.hero,
    TARGET_FILES.state.card,
    ...Object.values(TARGET_FILES.districts).map(d => d.primary),
    ...Object.values(TARGET_FILES.districts).map(d => d.backup)
  ];

  console.log(`Total target files to resolve: ${allTitles.length}`);

  // Fetch in batches of 15
  const metaMap = {};
  for (let i = 0; i < allTitles.length; i += 15) {
    const chunk = allTitles.slice(i, i + 15);
    const result = await fetchMetadata(chunk);
    Object.assign(metaMap, result);
    await new Promise(r => setTimeout(r, 200));
  }

  const finalDataset = {
    state: {},
    districts: {}
  };

  // 1. State Hero & Card
  const heroMeta = metaMap[TARGET_FILES.state.hero];
  const cardMeta = metaMap[TARGET_FILES.state.card];

  if (!heroMeta || !cardMeta) {
    throw new Error('State hero or card could not be resolved from Wikimedia!');
  }
  finalDataset.state.hero = heroMeta;
  finalDataset.state.card = cardMeta;

  console.log(`✓ State Hero: "${heroMeta.title}" (${heroMeta.photographer})`);
  console.log(`✓ State Card: "${cardMeta.title}" (${cardMeta.photographer})`);

  // 2. Districts
  const seenUrls = new Set();
  let verifiedCount = 0;

  for (const [slug, pair] of Object.entries(TARGET_FILES.districts)) {
    const primary = metaMap[pair.primary];
    if (!primary) {
      console.warn(`WARNING: Missing primary for ${slug} (${pair.primary})`);
      continue;
    }

    // Live HTTP verify thumbnail
    const check = await verifyUrlLive(primary.displayUrl);
    if (!check.ok) {
      console.warn(`WARNING: Primary thumbnail check failed for ${slug}: ${primary.displayUrl} -> Status ${check.status}`);
      continue;
    }

    if (seenUrls.has(primary.displayUrl)) {
      throw new Error(`DUPLICATE URL DETECTED: ${slug} has same displayUrl as another district!`);
    }
    seenUrls.add(primary.displayUrl);

    const backup = metaMap[pair.backup] || null;
    finalDataset.districts[slug] = {
      primary,
      backup
    };
    verifiedCount++;
    console.log(`✓ [${slug}] Primary: "${primary.title}" -> HTTP ${check.status} (${primary.photographer}, ${primary.licenseName})`);
  }

  console.log(`\nVerified unique district primary images: ${verifiedCount} / 23`);

  // Save verified dataset to backend/src/services/images/verifiedWbDataset.json
  const outPath = path.resolve(__dirname, '../src/services/images/verifiedWbDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(finalDataset, null, 2), 'utf8');
  console.log(`Successfully written verified dataset to: ${outPath}`);
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
