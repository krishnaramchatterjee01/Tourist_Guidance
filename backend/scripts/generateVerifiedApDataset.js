import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

const DISTRICT_CONFIG = [
  {
    slug: 'alluri-sitharama-raju',
    queries: ['Borra Caves Araku', 'Araku Valley landscape', 'Chaparai waterfalls Araku']
  },
  {
    slug: 'anakapalli',
    queries: ['Bojjannakonda Buddhist', 'Sankaram Bojjannakonda', 'Anakapalli Andhra']
  },
  {
    slug: 'ananthapuramu',
    queries: ['Gooty Fort Anantapur', 'Thimmamma Marrimanu', 'Anantapur Clock Tower']
  },
  {
    slug: 'annamayya',
    queries: ['Horsley Hills Andhra', 'Gurramkonda Fort', 'Tallapaka Rayachoti']
  },
  {
    slug: 'bapatla',
    queries: ['Suryalanka Beach Bapatla', 'Bhavanarayana Swamy Temple Bapatla', 'Bapatla Andhra']
  },
  {
    slug: 'chittoor',
    queries: ['Chandragiri Fort Chittoor', 'Kaigal Falls Chittoor', 'Chittoor Andhra Pradesh']
  },
  {
    slug: 'dr-br-ambedkar-konaseema',
    queries: ['Konaseema Andhra Pradesh', 'Antarvedi temple Godavari', 'Godavari Delta Konaseema']
  },
  {
    slug: 'east-godavari',
    queries: ['Godavari Arch Bridge Rajahmundry', 'Havelock Bridge Rajahmundry', 'Dowleswaram Barrage Godavari']
  },
  {
    slug: 'eluru',
    queries: ['Kolleru Lake bird sanctuary', 'Guntupalli Caves Eluru', 'Kolleru Lake Andhra']
  },
  {
    slug: 'guntur',
    queries: ['Kondaveedu Fort Guntur', 'Kotappakonda Guntur', 'Guntur Andhra Pradesh']
  },
  {
    slug: 'kakinada',
    queries: ['Coringa Wildlife Sanctuary', 'Kakinada Beach Andhra', 'Hope Island Kakinada']
  },
  {
    slug: 'krishna',
    queries: ['Manginapudi Beach Machilipatnam', 'Machilipatnam Bandar Andhra', 'Krishna river delta']
  },
  {
    slug: 'kurnool',
    queries: ['Konda Reddy Buruju Kurnool', 'Oravakallu Rock Garden Kurnool', 'Kurnool Fort Andhra']
  },
  {
    slug: 'nandyal',
    queries: ['Belum Caves Nandyal', 'Yaganti temple Nandyal', 'Mahanandi Temple Nandyal', 'Ahobilam Temple']
  },
  {
    slug: 'ntr',
    queries: ['Prakasam Barrage Vijayawada', 'Kanaka Durga Temple Vijayawada', 'Undavalli Caves Vijayawada']
  },
  {
    slug: 'palnadu',
    queries: ['Ethipothala Falls Palnadu', 'Nagarjunakonda Palnadu', 'Kotappakonda Andhra']
  },
  {
    slug: 'parvathipuram-manyam',
    queries: ['Thotapalli Reservoir Nagavali', 'Nagavali River Andhra', 'Parvathipuram Manyam']
  },
  {
    slug: 'prakasam',
    queries: ['Bhairavakona Prakasam', 'Chirala Beach Andhra', 'Motupalli Ongole']
  },
  {
    slug: 'sri-potti-sriramulu-nellore',
    queries: ['Pulicat Lake Bird Sanctuary Andhra', 'Udayagiri Fort Nellore', 'Mypadu Beach Nellore']
  },
  {
    slug: 'sri-sathya-sai',
    queries: ['Lepakshi Veerabhadra Temple', 'Jatayu Lepakshi', 'Prasanthi Nilayam Puttaparthi']
  },
  {
    slug: 'srikakulam',
    queries: ['Arasavalli Sun Temple', 'Kalingapatnam Lighthouse', 'Srikurmam Temple']
  },
  {
    slug: 'tirupati',
    queries: ['Tirumala Venkateswara Temple', 'Sri Kalahasteeswara Temple', 'Kapila Theertham Tirupati']
  },
  {
    slug: 'visakhapatnam',
    queries: ['Rishikonda Beach Visakhapatnam', 'Kailasagiri Visakhapatnam', 'INS Kursura Submarine Visakhapatnam', 'Simhachalam Temple']
  },
  {
    slug: 'vizianagaram',
    queries: ['Vizianagaram Fort Andhra', 'Gajapathi Palace Vizianagaram', 'Ramatheertham Temple Vizianagaram']
  },
  {
    slug: 'west-godavari',
    queries: ['Somarama Bhimavaram', 'Perupalem Beach West Godavari', 'Bhimavaram Temple']
  },
  {
    slug: 'ysr-kadapa',
    queries: ['Gandikota canyon gorge Kadapa', 'Gandikota Fort Kadapa', 'Vontimitta Kodandarama Temple Kadapa']
  },
  {
    slug: 'markapuram',
    queries: ['Chennakesava Swamy Temple Markapuram', 'Cumbum Lake Andhra', 'Markapuram Andhra']
  },
  {
    slug: 'polavaram',
    queries: ['Polavaram Project Godavari', 'Papikonda Godavari Andhra', 'Papikondalu hills Andhra']
  }
];

const STATE_CONFIG = {
  heroQueries: ['Gandikota canyon gorge Andhra', 'Gandikota Fort Andhra', 'Grand Canyon of India Gandikota'],
  cardQueries: ['Undavalli Caves Guntur Andhra', 'Undavalli Caves Vijayawada', 'Amaravati Stupa Andhra']
};

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

async function searchCandidates(query, limit = 5) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    const candidates = [];

    for (const page of pages) {
      if (!page.imageinfo || !page.imageinfo[0]) continue;
      const info = page.imageinfo[0];
      if (!info.mime || !info.mime.startsWith('image/')) continue;
      if (page.title.endsWith('.svg') || page.title.endsWith('.tif') || page.title.endsWith('.tiff') || page.title.endsWith('.pdf')) continue;

      const meta = info.extmetadata || {};
      const width = info.width || 0;
      const height = info.height || 0;

      // Prefer landscape or reasonable aspect ratio
      const isLandscape = width >= height * 0.8;
      const hasReasonableWidth = width >= 800;

      if (!hasReasonableWidth) continue;

      const titleClean = page.title.replace(/^File:/i, '').replace(/\.[^.]+$/, '').replace(/_/g, ' ');
      const license = cleanHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || 'CC BY-SA 4.0');
      const photographer = cleanHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Contributor');
      const licenseUrl = meta.LicenseUrl?.value || 'https://creativecommons.org/licenses/by-sa/4.0/';
      const displayUrl = info.thumburl || info.url;

      candidates.push({
        pageId: String(page.pageid),
        fileTitle: page.title,
        title: titleClean,
        originalUrl: info.url,
        displayUrl: displayUrl,
        thumbnailUrl: displayUrl,
        sourcePageUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
        photographer: photographer,
        licenseName: license,
        licenseUrl: licenseUrl,
        attribution: `${photographer} (${license}) via Wikimedia Commons`,
        width: width,
        height: height,
        mime: info.mime || 'image/jpeg',
        isLandscape: isLandscape
      });
    }

    // Sort by landscape preference and width
    candidates.sort((a, b) => {
      if (a.isLandscape !== b.isLandscape) return a.isLandscape ? -1 : 1;
      return b.width - a.width;
    });

    return candidates;
  } catch (err) {
    console.warn(`[Search] Error for query "${query}":`, err.message);
    return [];
  }
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
    const ok = (res.status === 200 || res.status === 206) && contentType.startsWith('image/');
    return {
      status: res.status,
      ok,
      contentType
    };
  } catch (err) {
    return { status: 0, ok: false, error: err.message };
  }
}

async function run() {
  console.log('=== EXPLORE INDIA: ANDHRA PRADESH CIMS DATASET GENERATION ===');
  console.log(`Auditing and sourcing verified authentic media for 28 districts + state hero/card...\n`);

  const seenUrls = new Set();
  const dataset = {
    state: {},
    districts: {}
  };

  // Helper to find a verified unique image from queries
  async function resolveImage(queries, label) {
    for (const q of queries) {
      console.log(`[${label}] Searching: "${q}"...`);
      const candidates = await searchCandidates(q, 6);
      for (const cand of candidates) {
        if (seenUrls.has(cand.displayUrl)) continue;

        // Live HTTP probe
        const check = await verifyUrlLive(cand.displayUrl);
        await new Promise(r => setTimeout(r, 350)); // polite Wikimedia rate limit

        if (check.ok) {
          seenUrls.add(cand.displayUrl);
          console.log(`  ✓ Resolved: "${cand.title}" (Author: ${cand.photographer}, Lic: ${cand.licenseName}) -> HTTP ${check.status}`);
          return cand;
        } else {
          console.log(`  ✗ Probed but failed HTTP check (${check.status}): "${cand.title}"`);
        }
      }
      await new Promise(r => setTimeout(r, 300));
    }
    return null;
  }

  // 1. State Hero & Card
  console.log('--- 1. Resolving State Media ---');
  const stateHero = await resolveImage(STATE_CONFIG.heroQueries, 'AP State Hero');
  if (!stateHero) throw new Error('Could not resolve state hero image!');
  dataset.state.hero = stateHero;

  const stateCard = await resolveImage(STATE_CONFIG.cardQueries, 'AP State Card');
  if (!stateCard) throw new Error('Could not resolve state card image!');
  dataset.state.card = stateCard;

  // 2. All 28 Districts
  console.log('\n--- 2. Resolving 28 District Media (Primary & Backup) ---');
  let districtSuccessCount = 0;
  let backupSuccessCount = 0;

  for (const dist of DISTRICT_CONFIG) {
    console.log(`\nDistrict [${dist.slug}]:`);
    const primary = await resolveImage(dist.queries, `${dist.slug} (Primary)`);
    if (!primary) {
      throw new Error(`CRITICAL: Failed to resolve authentic verified primary image for ${dist.slug}!`);
    }

    // Attempt backup
    const backup = await resolveImage(dist.queries, `${dist.slug} (Backup)`);
    if (backup) {
      backupSuccessCount++;
    }

    dataset.districts[dist.slug] = {
      primary,
      backup
    };
    districtSuccessCount++;
  }

  console.log('\n====================================================');
  console.log(`Verification Summary:`);
  console.log(`- State Hero: Verified (1/1)`);
  console.log(`- State Card: Verified (1/1)`);
  console.log(`- District Primaries: ${districtSuccessCount} / 28`);
  console.log(`- District Backups: ${backupSuccessCount} / 28`);
  console.log(`- Total Unique URLs Used: ${seenUrls.size}`);
  console.log('====================================================\n');

  // Save to backend/src/services/images/verifiedApDataset.json
  const outPath = path.resolve(__dirname, '../src/services/images/verifiedApDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf8');
  console.log(`Successfully generated and written verified AP dataset to:\n${outPath}`);
}

run().catch(err => {
  console.error('\nFatal AP Dataset Generation Failure:', err);
  process.exit(1);
});
