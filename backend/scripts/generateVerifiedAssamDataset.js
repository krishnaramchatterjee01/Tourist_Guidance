import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

const DISTRICT_CONFIG = [
  {
    slug: 'bajali',
    location: 'Bajali Historic Town & Pathsala Cultural Center',
    queries: ['File:Bajali college.jpg', 'File:Way Bajali College.jpg', 'Pathsala Assam']
  },
  {
    slug: 'baksa',
    location: 'Manas National Park UNESCO Biosphere & Foothills',
    queries: ['File:Manas National Park.jpg', 'Manas National Park Assam', 'Mothanguri Manas']
  },
  {
    slug: 'barpeta',
    location: 'Historic Barpeta Satra Namghar & Vaishnavite Cultural Heritage',
    queries: ['File:Holi at Barpeta Satra Namghar.jpg', 'Barpeta Satra Assam', 'Barpeta Kirtan Ghar']
  },
  {
    slug: 'biswanath',
    location: 'Biswanath Ghat & Ancient Gupta Kashi on Brahmaputra',
    queries: ['File:A view of sunset from Biswanath Ghat.jpg', 'Biswanath Ghat Assam', 'Biswanath Chariali']
  },
  {
    slug: 'bongaigaon',
    location: 'Bagheswari Temple & Historic Hilltop Shrine',
    queries: ['File:Bagheswari Temple, Bongaigaon.JPG', 'Bagheswari Temple Bongaigaon', 'Bongaigaon Assam']
  },
  {
    slug: 'cachar',
    location: 'Barak River & Sadarghat Waterfront at Silchar',
    queries: ['File:Barak River as seen from Sadarghat Bridge, Silchar, Assam..JPG', 'Silchar Barak river', 'Silchar Assam']
  },
  {
    slug: 'charaideo',
    location: 'Charaideo Maidams UNESCO World Heritage Royal Ahom Burial Mounds',
    queries: ['File:Charaideo Maidam of Ahom Kings at Charaideo in Sivasagar, Assam 4.jpg', 'Charaideo Maidam', 'Charaideo Maidams Assam']
  },
  {
    slug: 'chirang',
    location: 'Scenic Aie (Aai) River Valley & Bodoland Foothills',
    queries: ['File:Aai river.jpg', 'File:Sunset in Aai river.jpg', 'File:Aie River Bridge.jpg']
  },
  {
    slug: 'darrang',
    location: 'Orang National Park Great Indian Rhinoceros Sanctuary',
    queries: ['File:Greater one-horned rhinoceros.jpg', 'Orang National Park Assam', 'Mangaldai Darrang']
  },
  {
    slug: 'dhemaji',
    location: 'Subansiri River Waterfront & Gerukamukh Hills',
    queries: ['File:Voice of the river subansiri.... a tributary of brahmaputra 02.jpg', 'Subansiri river Dhemaji', 'Gerukamukh Assam']
  },
  {
    slug: 'dhubri',
    location: 'Historic Gurdwara Sri Guru Tegh Bahadur Sahib on Brahmaputra',
    queries: ['File:Dhubri Gurdwara stone.JPG', 'Gurdwara Sri Guru Tegh Bahadur Sahib Dhubri', 'Dhubri Gurdwara']
  },
  {
    slug: 'dibrugarh',
    location: 'Bogibeel Rail-Road Bridge across Brahmaputra & Tea Capital',
    queries: ['File:Bogibeel Bridge, Dibrugarh.jpg', 'Bogibeel Bridge Dibrugarh', 'Dibrugarh Brahmaputra']
  },
  {
    slug: 'dima-hasao',
    location: 'Haflong Lake & Barail Mountain Range Panorama',
    queries: ['File:Haflong Lake.jpg', 'Haflong Lake Assam', 'Haflong Assam']
  },
  {
    slug: 'goalpara',
    location: 'Sri Surya Pahar Ancient Archaeological & Rock-Cut Sculptures',
    queries: ['File:Entrance of Sri Surya Pahar, Goalpara.jpg', 'Sri Surya Pahar Goalpara', 'Goalpara Assam']
  },
  {
    slug: 'golaghat',
    location: 'Kaziranga National Park Rhino Sanctuary at Kohora',
    queries: ['File:Rhino in Kaziranga TR AJTJ P1070307.jpg', 'Kaziranga National Park rhino', 'Kaziranga grasslands']
  },
  {
    slug: 'hailakandi',
    location: 'Lush Tea Gardens & Scenic Landscapes of Hailakandi',
    queries: ['File:Beautiful side of Hailakandi.jpg', 'File:Rongpur hailakandi.jpg', 'Hailakandi Assam']
  },
  {
    slug: 'hojai',
    location: 'Hojai Cultural Heritage & Traditional Mandir Complex',
    queries: ['File:Panthoibi at Hojai, Assam 01.jpg', 'Hojai Assam', 'Lanka Hojai']
  },
  {
    slug: 'jorhat',
    location: 'Hoollongapar Gibbon Sanctuary Pristine Canopy & Rainforest',
    queries: ['File:A Paris Peacock butterfly from Hoollongapar Gibbon Sanctuary, Jorhat - Assam.jpg', 'Hoollongapar Gibbon Sanctuary', 'Jorhat Gymkhana']
  },
  {
    slug: 'kamrup',
    location: 'Hayagriva Madhava Ancient Sacred Temple at Hajo',
    queries: ['File:Hayagriva Madhava Temple, Hajo.jpg', 'Hajo Hayagriva Madhava temple', 'Hajo Assam']
  },
  {
    slug: 'kamrup-metropolitan',
    location: 'Sacred Nilachal Hill Kamakhya Temple Complex at Guwahati',
    queries: ['File:Kamakhya Temple, Guwahati.jpg', 'Kamakhya Temple Guwahati', 'Umananda Island Guwahati']
  },
  {
    slug: 'karbi-anglong',
    location: 'Diphu Hills Panoramic Vista & Karbi Cultural Highlands',
    queries: ['File:Diphu Government College.jpg', 'Diphu Karbi Anglong', 'Diphu Assam']
  },
  {
    slug: 'karimganj',
    location: 'Rural Barak Valley Riverine Landscapes of Karimganj',
    queries: ['File:A Village of Karimganj District, Assam..JPG', 'Karimganj Assam', 'Kushiara river Karimganj']
  },
  {
    slug: 'kokrajhar',
    location: 'Chakrashila Wildlife Sanctuary Habitat of Golden Langur',
    queries: ['File:Golden Langur.jpg', 'Chakrashila Wildlife Sanctuary', 'Kokrajhar Bodoland']
  },
  {
    slug: 'lakhimpur',
    location: 'Sri Sri Basudev Than Historic Vaishnavite Sanctuary',
    queries: ['File:Sri Sri Basudev Than, Lakhimpur.jpg', 'Basudev Than Lakhimpur', 'North Lakhimpur Assam']
  },
  {
    slug: 'majuli',
    location: 'Majuli Island Historic Neo-Vaishnavite Satra & Brahmaputra Sands',
    queries: ['File:Majuli Island (117).jpg', 'Majuli island Satra', 'Kamalabari Satra Majuli']
  },
  {
    slug: 'morigaon',
    location: 'Pobitora Wildlife Sanctuary Dense Rhinoceros Habitat',
    queries: ['File:Pobitora Wildlife Sanctuary India (202398413).jpeg', 'Pobitora Wildlife Sanctuary rhino', 'Mayong Morigaon']
  },
  {
    slug: 'nagaon',
    location: 'Batadrava (Bordowa) Than Birthplace of Mahapurush Srimanta Sankardeva',
    queries: ['File:Bordowa Than Cultural Project in Nagaon district, Assam, India.jpg', 'Batadrava Than Bordowa Nagaon', 'Bordowa Than Nagaon']
  },
  {
    slug: 'nalbari',
    location: 'Historic Sri Sri Hari Mandir during Raas Mahotsav',
    queries: ['File:Hari Mandir at Nalbari during Ras Utsav.jpg', 'Hari Mandir Nalbari', 'Nalbari Raas']
  },
  {
    slug: 'sivasagar',
    location: 'Rang Ghar Historic Royal Ahom Amphitheater',
    queries: ['File:Rang Ghar 1.jpg', 'Rang Ghar Sivasagar', 'Talatal Ghar Sivasagar']
  },
  {
    slug: 'sonitpur',
    location: 'Historic Agnigarh Hilltop Memorial overlooking Brahmaputra at Tezpur',
    queries: ['File:Tezpur view from Agnigarh.jpg', 'Agnigarh Tezpur Assam', 'Agnigarh hill Tezpur']
  },
  {
    slug: 'south-salmara-mankachar',
    location: 'Hatsingimari Waterfront & Brahmaputra River Border',
    queries: ['File:Hatsingimari College.jpg', 'File:Hatsingimari College Library.jpg', 'Hatsingimari Assam']
  },
  {
    slug: 'tamulpur',
    location: 'Sub-Himalayan Landscapes & Historic Foothill Town of Tamulpur',
    queries: ['File:Nature Of Phahurbari.jpg', 'File:तामूलपुर जौसिन फरायसालि.jpg', 'Tamulpur Assam']
  },
  {
    slug: 'tinsukia',
    location: 'Dibru-Saikhowa National Park Floodplain Biosphere',
    queries: ['File:Asiatic water buffalo.jpg', 'Dibru-Saikhowa National Park', 'Maguri Motapung Beel Tinsukia']
  },
  {
    slug: 'udalguri',
    location: 'Bhairabkunda Scenic Tri-Junction of Assam, Bhutan and Arunachal',
    queries: ['File:Bhairabkunda gate.jpg', 'Bhairabkunda Udalguri Assam', 'Bhairabkunda picnic']
  },
  {
    slug: 'west-karbi-anglong',
    location: 'Khandong Dam & Scenic Umrangso Lake in Karbi Hills',
    queries: ['File:The Khandong dam.jpg', 'Khandong dam Umrangso', 'Umrangso West Karbi Anglong']
  }
];

const STATE_CONFIG = {
  heroLocation: 'Nilachal Hill Sacred Kamakhya Temple Complex, Guwahati',
  heroQueries: ['File:Kamakhya Temple, Guwahati.jpg', 'Kamakhya Temple Guwahati', 'Umananda Island Guwahati'],
  cardLocation: 'Majuli River Island World Heritage Neo-Vaishnavite Satra Landscape',
  cardQueries: ['File:Majuli Island (117).jpg', 'Majuli island Satra', 'Kamalabari Satra Majuli']
};

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchDirectTitle(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    if (!page || !page.imageinfo || !page.imageinfo[0]) return null;

    const info = page.imageinfo[0];
    if (!info.mime || !info.mime.startsWith('image/')) return null;

    const meta = info.extmetadata || {};
    const width = info.width || 0;
    const height = info.height || 0;
    const titleClean = page.title.replace(/^File:/i, '').replace(/\.[^.]+$/, '').replace(/_/g, ' ');
    const license = cleanHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || 'CC BY-SA 4.0');
    let photographer = cleanHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Contributor');
    if (photographer.length > 140) photographer = photographer.substring(0, 140);
    const licenseUrl = meta.LicenseUrl?.value || 'https://creativecommons.org/licenses/by-sa/4.0/';
    const displayUrl = info.thumburl || info.url;

    return {
      pageId: String(page.pageid),
      fileTitle: page.title,
      title: titleClean.substring(0, 200),
      originalUrl: info.url,
      displayUrl: displayUrl,
      thumbnailUrl: displayUrl,
      sourcePageUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
      photographer: photographer,
      licenseName: license.substring(0, 90),
      licenseUrl: licenseUrl,
      attribution: `${photographer} (${license}) via Wikimedia Commons`.substring(0, 250),
      width: width,
      height: height,
      mime: info.mime || 'image/jpeg',
      isLandscape: width >= height * 0.8
    };
  } catch (err) {
    console.warn(`[Direct] Error for "${title}":`, err.message);
    return null;
  }
}

async function searchCandidates(query, limit = 6) {
  if (query.startsWith('File:')) {
    const direct = await fetchDirectTitle(query);
    return direct ? [direct] : [];
  }

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

      const isLandscape = width >= height * 0.8;
      const hasReasonableWidth = width >= 600;

      if (!hasReasonableWidth) continue;

      const titleClean = page.title.replace(/^File:/i, '').replace(/\.[^.]+$/, '').replace(/_/g, ' ');
      const license = cleanHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || 'CC BY-SA 4.0');
      let photographer = cleanHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Contributor');
      if (photographer.length > 140) photographer = photographer.substring(0, 140);
      const licenseUrl = meta.LicenseUrl?.value || 'https://creativecommons.org/licenses/by-sa/4.0/';
      const displayUrl = info.thumburl || info.url;

      candidates.push({
        pageId: String(page.pageid),
        fileTitle: page.title,
        title: titleClean.substring(0, 200),
        originalUrl: info.url,
        displayUrl: displayUrl,
        thumbnailUrl: displayUrl,
        sourcePageUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
        photographer: photographer,
        licenseName: license.substring(0, 90),
        licenseUrl: licenseUrl,
        attribution: `${photographer} (${license}) via Wikimedia Commons`.substring(0, 250),
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
  console.log('=== EXPLORE INDIA: ASSAM CIMS DATASET GENERATION ===');
  console.log(`Auditing and sourcing authentic real-world media for 35 districts + state hero/card...\n`);

  const seenUrls = new Set();
  
  // 1. WB Protected URLs
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

  // 2. AP Protected URLs
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

  // 3. Arunachal Protected URLs
  const arunPath = path.resolve(__dirname, '../src/services/images/verifiedArunachalDataset.json');
  if (fs.existsSync(arunPath)) {
    const arun = JSON.parse(fs.readFileSync(arunPath, 'utf8'));
    if (arun.state?.hero?.displayUrl) seenUrls.add(arun.state.hero.displayUrl);
    if (arun.state?.card?.displayUrl) seenUrls.add(arun.state.card.displayUrl);
    for (const d of Object.values(arun.districts || {})) {
      if (d.primary?.displayUrl) seenUrls.add(d.primary.displayUrl);
      if (d.backup?.displayUrl) seenUrls.add(d.backup.displayUrl);
    }
  }

  console.log(`Registered ${seenUrls.size} protected URLs from WB, AP, and Arunachal Pradesh.\n`);

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
        await new Promise(r => setTimeout(r, 200)); // Throttling

        if (check.ok) {
          seenUrls.add(cand.displayUrl);
          cand.locationDescription = locationDesc;
          console.log(`  ✓ Resolved: "${cand.title}" (Author: ${cand.photographer}, Lic: ${cand.licenseName}) -> HTTP ${check.status}`);
          return cand;
        } else {
          console.log(`  ✗ Probed but failed HTTP check (${check.status}): "${cand.title}"`);
        }
      }
      await new Promise(r => setTimeout(r, 200));
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

  // 2. 35 Districts
  console.log('\n--- 2. Resolving 35 District Media (Primary & Backup) ---');
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
  console.log(`- District Primaries: ${districtSuccessCount} / 35`);
  console.log(`- District Backups: ${backupSuccessCount} / 35`);
  console.log(`- Total Unique URLs Used: ${seenUrls.size}`);
  console.log('====================================================\n');

  // Save to backend/src/services/images/verifiedAssamDataset.json
  const outPath = path.resolve(__dirname, '../src/services/images/verifiedAssamDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf8');
  console.log(`Successfully generated and written verified Assam dataset to:\n${outPath}`);
}

run().catch(err => {
  console.error('\nFatal Assam Dataset Generation Failure:', err);
  process.exit(1);
});
