import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

const DISTRICT_CONFIG = [
  {
    slug: 'anjaw',
    location: 'Kibithu Frontier & Dong Valley Eastern Himalayan Vista',
    queries: ['Kibithu Arunachal', 'The President, Smt. Pratibha Devisingh Patil addressing the troops during a Sainik Sammelan at Kibithu', 'Dong valley sunrise Arunachal']
  },
  {
    slug: 'bichom',
    location: 'Kameng River Basin & Sessa Orchid Sanctuary Cascades',
    queries: ['Waterfall at Sessa Orchid Sanctuary', 'In Bhalukpong of Aurnachal Pradesh, river Kameng river', 'Kameng River, source to mouth']
  },
  {
    slug: 'changlang',
    location: 'Namdapha National Park Rainforest Biosphere',
    queries: ['Namdapha National Park', 'Pangsau Pass', 'Miao Changlang']
  },
  {
    slug: 'dibang-valley',
    location: 'Anini Sub-Himalayan Valley & Dri River Landscape',
    queries: ['Anini Hospital', 'Anini Dibang Valley', 'Anini landscape Arunachal']
  },
  {
    slug: 'east-kameng',
    location: 'Kameng River Valley & Seppa Highlands',
    queries: ['Bhalukpong scenery', 'Kameng River, source to mouth', 'In Bhalukpong of Aurnachal Pradesh, river Kameng river']
  },
  {
    slug: 'east-siang',
    location: 'Pasighat Historic Town & Siang River Confluence',
    queries: ['Pasighat Town - May2019', 'Siang River Pasighat', 'Pasighat East Siang']
  },
  {
    slug: 'kamle',
    location: 'Raga Valley & Kamle River Watershed',
    queries: ['Raga Arunachal Pradesh', 'Raga Arunachal', 'Kamle Arunachal']
  },
  {
    slug: 'keyi-panyor',
    location: 'Yachuli Valley & Panyor River Panoramic Vistas',
    queries: ['Yachuli town - a panoramic view from top', 'Yachuli Arunachal', 'Yazali Arunachal']
  },
  {
    slug: 'kra-daadi',
    location: 'Palin Valley & Mountain River Panorama',
    queries: ['View of Palin Town', 'Palin Kra Daadi', 'Palin Arunachal']
  },
  {
    slug: 'kurung-kumey',
    location: 'Sarli Highlands & Kurung Kumey Foothills',
    queries: ['Sarli AP', 'A Nishi or Nyishi tribesman from Arunachal Pradesh wearing the traditional head-dress', 'Nishi tribal lightened']
  },
  {
    slug: 'leparada',
    location: 'Basar Traditional Agricultural Landscape & Galo Heritage',
    queries: ['Galo Women At Basar', 'Galo diorama', 'Tribe Of Arunachal Pradesh']
  },
  {
    slug: 'lohit',
    location: 'Parshuram Kund Sacred River Confluence on Lohit',
    queries: ['Parshuram Kund', 'Tezu Lohit', 'Parasuram Kund Arunachal']
  },
  {
    slug: 'longding',
    location: 'Wancho Tribal Heritage & Longding Highlands',
    queries: ['Khamnu Lik, Khonsa village, Longding district- RIWATCH Museum', 'Longding Arunachal', 'Wancho tribe Longding']
  },
  {
    slug: 'lower-dibang-valley',
    location: 'Mayodia Snow Pass & Roing Valley Panoramic Vista',
    queries: ['Mayodia Pass 2', 'Mayodia Pass', 'Roing Lower Dibang Valley']
  },
  {
    slug: 'lower-siang',
    location: 'Malinithan Ancient 14th-Century Archaeological Site at Likabali',
    queries: ['Malini thaan likabali 16', 'Malinithan Likabali', 'Malinithan temple']
  },
  {
    slug: 'lower-subansiri',
    location: 'Ziro Valley Apatani Cultural Landscape & Terraces',
    queries: ['An Apatani Old lady in Ziro valley of Arunachal Pradesh', 'Ziro Valley Arunachal', 'Apatani valley Ziro']
  },
  {
    slug: 'namsai',
    location: 'Kongmu Kham Golden Pagoda at Tengapani',
    queries: ['Golden Pagoda Namsai Arunachal Pradesh', 'Golden Pagoda Namsai', 'Kongmu Kham Golden Pagoda']
  },
  {
    slug: 'pakke-kessang',
    location: 'Pakke Tiger Reserve River Basin & Seijosa Foothills',
    queries: ['View from Pakke Jungle Camp over Pakke River and Tiger Reserve', 'Seijosa panorama', 'Pakke tiger reserve landscape']
  },
  {
    slug: 'papum-pare',
    location: 'Historic Ita Fort (14th Century) at Itanagar',
    queries: ['Ita fort itanagar 161010 (3)', 'Ita Fort Itanagar', 'Ganga Lake Itanagar']
  },
  {
    slug: 'shi-yomi',
    location: 'Mechuka (Menchukha) Valley & Siyom River Waters',
    queries: ['Natural beauty of Mechuka, Arunachal Pradesh', 'Menchukha landscape, river Siyom at the foreground', 'River at Mechuka valley']
  },
  {
    slug: 'siang',
    location: 'Boleng Siang Canyon & Aerial Valley View',
    queries: ['Boleng AirView1', 'Boleng Siang', 'Pangin Siang']
  },
  {
    slug: 'tawang',
    location: 'Galden Namgey Lhatse (Tawang Tibetan Buddhist Monastery)',
    queries: ['Tawang Monastery (Tibetan Buddhist)', 'Tawang Monastery Arunachal', 'Galden Namgey Lhatse']
  },
  {
    slug: 'tirap',
    location: 'Khonsa Highlands & Nocte Cultural Heritage',
    queries: ['Khonsa Tirap', 'Deomali Tirap', 'Khonsa town', 'Tirap Arunachal', 'Khamnu Lik, Khonsa village']
  },
  {
    slug: 'upper-siang',
    location: 'Tuting Buddhist Monastery & Upper Siang Gorge',
    queries: ['Tuting monastery -', 'Gandhi bridge', 'Siang River in Arunachal']
  },
  {
    slug: 'upper-subansiri',
    location: 'Subansiri River Basin & Tagin Highland Heritage',
    queries: ['Mountain, rivers and dams', 'Tagin Diorama', 'Tagin Tribe ARUNACHAL PRADESH INDIA']
  },
  {
    slug: 'west-kameng',
    location: 'Bomdila Monastery & Dirang Himalayan Vistas',
    queries: ['Bomdila Monastery, Arunachal Pradesh', 'Bomdila Monastery West Kameng', 'Dirang Dzong West Kameng']
  },
  {
    slug: 'west-siang',
    location: 'Yomgo (Siyom) River Waterfront at Aalo (Along)',
    queries: ['Along the River 7-119-3', 'Aalo West Siang', 'Darka village Aalo']
  }
];

const STATE_CONFIG = {
  heroLocation: 'Tawang Monastery (Galden Namgey Lhatse) Panoramic Himalayan View',
  heroQueries: ['Tawang Monastery (Tibetan Buddhist)', 'Tawang Monastery panoramic view', 'Tawang Monastery Arunachal'],
  cardLocation: 'Ziro Valley Apatani Cultural Landscape & Highlands',
  cardQueries: ['An Apatani Old lady in Ziro valley of Arunachal Pradesh', 'Ziro Valley landscape Arunachal', 'Apatani valley Ziro']
};

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

async function searchCandidates(query, limit = 6) {
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

      // Prefer landscape orientation or reasonable aspect ratio
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
  console.log('=== EXPLORE INDIA: ARUNACHAL PRADESH CIMS DATASET GENERATION ===');
  console.log(`Auditing and sourcing authentic real-world media for 27 districts + state hero/card...\n`);

  // Load existing datasets to strictly prevent cross-state duplicates
  const seenUrls = new Set();
  
  const wbPath = path.resolve(__dirname, '../src/services/images/verifiedWbDataset.json');
  if (fs.existsSync(wbPath)) {
    const wb = JSON.parse(fs.readFileSync(wbPath, 'utf8'));
    if (wb.state?.hero?.displayUrl) seenUrls.add(wb.state.hero.displayUrl);
    if (wb.state?.card?.displayUrl) seenUrls.add(wb.state.card.displayUrl);
    for (const d of Object.values(wb.districts || {})) {
      if (d.primary?.displayUrl) seenUrls.add(d.primary.displayUrl);
      if (d.backup?.displayUrl) seenUrls.add(d.backup.displayUrl);
    }
  }

  const apPath = path.resolve(__dirname, '../src/services/images/verifiedApDataset.json');
  if (fs.existsSync(apPath)) {
    const ap = JSON.parse(fs.readFileSync(apPath, 'utf8'));
    if (ap.state?.hero?.displayUrl) seenUrls.add(ap.state.hero.displayUrl);
    if (ap.state?.card?.displayUrl) seenUrls.add(ap.state.card.displayUrl);
    for (const d of Object.values(ap.districts || {})) {
      if (d.primary?.displayUrl) seenUrls.add(d.primary.displayUrl);
      if (d.backup?.displayUrl) seenUrls.add(d.backup.displayUrl);
    }
  }

  console.log(`Registered ${seenUrls.size} protected URLs from West Bengal and Andhra Pradesh.\n`);

  const dataset = {
    state: {},
    districts: {}
  };

  async function resolveImage(queries, label, locationDesc) {
    for (const q of queries) {
      console.log(`[${label}] Searching: "${q}"...`);
      const candidates = await searchCandidates(q, 6);
      for (const cand of candidates) {
        if (seenUrls.has(cand.displayUrl)) continue;

        const check = await verifyUrlLive(cand.displayUrl);
        await new Promise(r => setTimeout(r, 350)); // Throttling

        if (check.ok) {
          seenUrls.add(cand.displayUrl);
          cand.locationDescription = locationDesc;
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

  // 1. State Media
  console.log('--- 1. Resolving State Media ---');
  const stateHero = await resolveImage(STATE_CONFIG.heroQueries, 'State Hero', STATE_CONFIG.heroLocation);
  if (!stateHero) throw new Error('Could not resolve state hero image!');
  dataset.state.hero = stateHero;

  const stateCard = await resolveImage(STATE_CONFIG.cardQueries, 'State Card', STATE_CONFIG.cardLocation);
  if (!stateCard) throw new Error('Could not resolve state card image!');
  dataset.state.card = stateCard;

  // 2. 27 Districts
  console.log('\n--- 2. Resolving 27 District Media (Primary & Backup) ---');
  let districtSuccessCount = 0;
  let backupSuccessCount = 0;

  for (const dist of DISTRICT_CONFIG) {
    console.log(`\nDistrict [${dist.slug}] (${dist.location}):`);
    const primary = await resolveImage(dist.queries, `${dist.slug} (Primary)`, dist.location);
    if (!primary) {
      throw new Error(`CRITICAL: Failed to resolve authentic verified primary image for ${dist.slug}!`);
    }

    const backup = await resolveImage(dist.queries, `${dist.slug} (Backup)`, dist.location);
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
  console.log(`- District Primaries: ${districtSuccessCount} / 27`);
  console.log(`- District Backups: ${backupSuccessCount} / 27`);
  console.log(`- Total Unique URLs Used: ${seenUrls.size}`);
  console.log('====================================================\n');

  // Save to backend/src/services/images/verifiedArunachalDataset.json
  const outPath = path.resolve(__dirname, '../src/services/images/verifiedArunachalDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf8');
  console.log(`Successfully generated and written verified Arunachal dataset to:\n${outPath}`);
}

run().catch(err => {
  console.error('\nFatal Arunachal Dataset Generation Failure:', err);
  process.exit(1);
});
