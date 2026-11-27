import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

const DISTRICT_CONFIG = [
  {
    slug: 'araria',
    location: 'Historic Jama Masjid & Alshams Millia Heritage Gate at Araria',
    queries: ['File:1385255 731700406857238 252656093 n Jama masjid araria bihar.jpg', 'File:1378230 731701583523787 1090888206 n (2) Alshams millia college gate araria bihar.jpg', 'Araria Bihar']
  },
  {
    slug: 'arwal',
    location: 'Son River (Sone) Valley Waterfront at Arwal',
    queries: ['File:Son River Arwal Bihar.jpg', 'Son river Bihar', 'Arwal Bihar']
  },
  {
    slug: 'aurangabad',
    location: 'Ancient 8th-Century Sun Temple at Deo (Deo Surya Mandir)',
    queries: ['File:Sun-temple DEO Aurangabad Bihar,India.jpg', 'File:Interior of a Hindu temple, Deo, Bihar. Coloured aquatint by Wellcome V0050487.jpg', 'Deo Sun Temple Bihar']
  },
  {
    slug: 'banka',
    location: 'Sacred Mandar Hill (Mandar Parvat) & Historical Pilgrimage Ridge',
    queries: ['File:Mandar Mount or Hill.jpg', 'Mandar Hill Bihar', 'Mandar Parvat']
  },
  {
    slug: 'begusarai',
    location: 'Kanwar Lake (Kabar Taal) Ramsar Freshwater Bird Sanctuary',
    queries: ['File:Kanwar Lake Begusarai by Ziddi Photowala.jpg', 'File:Begusarai banner.jpg', 'Kanwar Lake Bihar']
  },
  {
    slug: 'bhagalpur',
    location: 'Ancient Vikramshila Buddhist Mahavihara Archaeological Ruins',
    queries: ['File:Vikramshila,bhagalpur(bihar)2.jpg', 'Vikramshila Bihar', 'Vikramshila ruins']
  },
  {
    slug: 'bhojpur',
    location: 'Historic Aranya Devi Temple & Ganga Waterfront at Arrah',
    queries: ['File:Aranya Devi Temple, Arrah.jpg', 'File:Arrah- Chhapra Bridge, Ara (Bihar).jpeg', 'Arrah Bihar']
  },
  {
    slug: 'buxar',
    location: 'Historic Buxar Railway Heritage Station & Ganga Riverfront',
    queries: ['File:Buxar Railway Station Main.jpg', 'Buxar Bihar', 'Ramrekha Ghat Buxar']
  },
  {
    slug: 'darbhanga',
    location: 'Historic Darbhanga Raj Fort (Raj Qila) & Shyama Mai Temple Complex',
    queries: ['File:Darbhanga Raj Kila.jpg', 'File:Shyama Mai Temple, Darbhanga.jpg', 'File:Raj Darbhanga Photo.jpg']
  },
  {
    slug: 'east-champaran',
    location: 'World Heritage Kesariya Ancient Buddhist Stupa (Tallest Ancient Stupa)',
    queries: ['File:Kesariya Stupa -kesariya- east champaran- Bihar.jpg', 'Kesariya Stupa Bihar', 'Kesariya Buddhist Stupa']
  },
  {
    slug: 'gaya',
    location: 'UNESCO World Heritage Mahabodhi Temple Complex & Bodhi Tree at Bodh Gaya',
    queries: ['File:Votive Stupas - Mahabodhi Temple Complex - Bodh Gaya (18).jpg', 'Mahabodhi Temple Bodh Gaya', 'Vishnupad Temple Gaya']
  },
  {
    slug: 'gopalganj',
    location: 'Historic Thawe Durga Mandir Sacred Forest Shrine',
    queries: ['File:Thawe Mandir.jpg', 'Thawe Mandir Gopalganj', 'Thawe Bihar']
  },
  {
    slug: 'jamui',
    location: 'Ancient Kali Mandir Heritage Shrine & Hills in Jamui',
    queries: ['File:Kali Mandir jamui district.jpg', 'Jamui Bihar', 'Giddhaur Jamui']
  },
  {
    slug: 'jehanabad',
    location: 'Ancient 3rd-Century BCE Mauryan Rock-Cut Barabar Caves (Lomas Rishi Cave)',
    queries: ['File:Lomas Rishi Cave exterior.jpg', 'File:Lomas Rishi Cave interior.jpg', 'Barabar Caves Bihar']
  },
  {
    slug: 'kaimur',
    location: 'Historic 7th-Century Maa Mundeshwari Devi Temple in Kaimur Hills',
    queries: ['File:Mundeshwari temple, Kaimur.jpg', 'File:Maa Mundeshwari Devi.jpg', 'Mundeshwari Temple Kaimur']
  },
  {
    slug: 'katihar',
    location: 'Historic Katihar Junction Heritage Station & Manihari Riverfront',
    queries: ['File:Katihar Station.jpg', 'File:Katihar Junction\'s Manihari Terminal.jpg', 'Katihar Bihar']
  },
  {
    slug: 'khagaria',
    location: 'Khagaria Heritage Campus & Sangam River Basin',
    queries: ['File:Public-contribution-khagaria-institutes 036.jpg', 'Khagaria Bihar', 'Khagaria junction']
  },
  {
    slug: 'kishanganj',
    location: 'Kishanganj Historic Cityscape & Mahananda River Basin',
    queries: ['File:Kishanganj at night.jpg', 'Kishanganj Bihar', 'Kishanganj tea garden']
  },
  {
    slug: 'lakhisarai',
    location: 'Sacred Ashok Dham (Indradamneshwar Mahadev Temple) Pilgrimage Complex',
    queries: ['File:Ashok Dham.jpg', 'Ashokdham Lakhisarai', 'Lakhisarai Bihar']
  },
  {
    slug: 'madhepura',
    location: 'Historic Singheshwar Sthan Mahadev Temple Pilgrimage Center',
    queries: ['File:Madhepura-Singheswar Sthan Mandir-1.jpg', 'Singheshwar Sthan Madhepura', 'Madhepura Bihar']
  },
  {
    slug: 'madhubani',
    location: 'Historic Rajnagar Palace Ruins & Mithila Architectural Heritage',
    queries: ['File:Ruins of Rajnagar Madhubani district.jpg', 'Rajnagar Palace Madhubani', 'Madhubani Bihar']
  },
  {
    slug: 'munger',
    location: 'Historic 14th-Century Munger Fort & Kastaharni Ghat on the Ganges',
    queries: ['File:Fort of munger-Munger-Bihar.jpg', 'Munger Fort Bihar', 'Kastaharni Ghat Munger']
  },
  {
    slug: 'muzaffarpur',
    location: 'Muzaffarpur Historic Junction Heritage & Burhi Gandak Waterfront',
    queries: ['File:Muzaffarpur Junction Railway Station.jpg', 'Muzaffarpur Bihar', 'Garibnath Mandir Muzaffarpur']
  },
  {
    slug: 'nalanda',
    location: 'UNESCO World Heritage Nalanda Mahavihara Ancient University Ruins',
    queries: ['File:Temple 3 - Sariputta Stupa - Nalanda Mahavihara (10).jpg', 'Nalanda Mahavihara ruins', 'Nalanda archaeological ruins']
  },
  {
    slug: 'nawada',
    location: 'Picturesque Perennial Kakolat Waterfall in Nawada Hills',
    queries: ['File:Kakolat Water falls - panoramio.jpg', 'Kakolat Falls Nawada', 'Kakolat waterfall Bihar']
  },
  {
    slug: 'patna',
    location: 'Historic 18th-Century Golghar Granary Monument overlooking Gandhi Maidan',
    queries: ['File:GOLGHAR AT SUNSET LIGHT. BRITISH PATNA..JPG', 'Golghar Patna', 'Takht Sri Patna Sahib']
  },
  {
    slug: 'purnia',
    location: 'Historic Purnea University Architectural Campus & Purnia Heritage',
    queries: ['File:Main Building of Purnea University Purnea.jpg', 'File:Purnia Railway Station.jpg', 'Purnia Bihar']
  },
  {
    slug: 'rohtas',
    location: 'UNESCO Tentative List Mausoleum of Sher Shah Suri at Sasaram',
    queries: ['File:Sher Shah Suri Tomb.jpg', 'Tomb of Sher Shah Suri Sasaram', 'Rohtasgarh Fort']
  },
  {
    slug: 'saharsa',
    location: 'Historic DB Road Cityscape & Tara Sthan Mahishi Heritage',
    queries: ['File:DB Road, Saharsa.jpg', 'Saharsa Bihar', 'Tara Sthan Mahishi']
  },
  {
    slug: 'samastipur',
    location: 'Historic Samastipur Junction Heritage Station & Pusa Agricultural Heritage',
    queries: ['File:Samastipur Junction Front.jpg', 'File:Samastipur Junction (junction plate).jpg', 'Samastipur Bihar']
  },
  {
    slug: 'saran',
    location: 'Historic Rajendra Sarovar & Ganga-Ghaghara Riverfront at Chhapra',
    queries: ['File:Rajendra sarovar.jpg', 'File:Arrah Chhapra June 2017.jpg', 'Chhapra Saran Bihar']
  },
  {
    slug: 'sheikhpura',
    location: 'Scenic Hill Ranges & Mountain Landscapes of Sheikhpura',
    queries: ['File:Hill ranges sheikhpura.jpg', 'File:Mountain in Sheikhpura.jpg', 'File:Sheikhpura.jpg']
  },
  {
    slug: 'sheohar',
    location: 'Historic Baba Bhuvaneshwar Nath Shiv Mandir at Sheohar',
    queries: ['File:Shiv temple in Sheohar,Bihar.jpg', 'Sheohar Bihar', 'Sheohar district']
  },
  {
    slug: 'sitamarhi',
    location: 'Sacred Punaura Dham Mandir (Birthplace Shrine of Goddess Sita)',
    queries: ['File:Punaura Dham.jpg', 'File:Janakisthan, Sitamarhi, Bihar.jpg', 'Sitamarhi Bihar']
  },
  {
    slug: 'siwan',
    location: 'Sacred Baba Mahendra Nath Mandir at Mehdar',
    queries: ['File:Shivling Baba Mahendra Nath Mandir, Mehdar , Siwan (Bihar).jpg', 'Mahendra Nath Mandir Siwan', 'Siwan Bihar']
  },
  {
    slug: 'supaul',
    location: 'Mighty Kosi River Floodplain & Embankment at Supaul',
    queries: ['File:Kosi River.jpg', 'Kosi river Supaul', 'Supaul Bihar']
  },
  {
    slug: 'vaishali',
    location: 'Historic Mauryan Lion Capital Ashoka Pillar at Kolhua, Vaishali',
    queries: ['File:Ashoka pillar at Vaishali, Bihar, India 2007-01-29.jpg', 'Ashoka Pillar Vaishali', 'Vaishali Stupa']
  },
  {
    slug: 'west-champaran',
    location: 'Historic 3rd-Century BCE Ashoka Pillar at Lauriya Nandangarh',
    queries: ['File:Lauriya-Nandangarh pillar.jpg', 'File:Close view of Lauriya Nandangarh Ashoka Pillar.jpg', 'Valmiki National Park']
  }
];

const STATE_CONFIG = {
  heroLocation: 'UNESCO World Heritage Nalanda Mahavihara Ancient Seat of Learning',
  heroQueries: ['File:Temple 3 - Sariputta Stupa - Nalanda Mahavihara (10).jpg', 'Nalanda Mahavihara ruins', 'Nalanda ancient university'],
  cardLocation: 'UNESCO Tentative List Mausoleum of Sher Shah Suri at Sasaram',
  cardQueries: ['File:Sher Shah Suri Tomb.jpg', 'Tomb of Sher Shah Suri Sasaram', 'Sher Shah Suri Tomb']
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
      const hasReasonableWidth = width >= 500;

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
  console.log('=== EXPLORE INDIA: BIHAR CIMS DATASET GENERATION ===');
  console.log('Auditing and sourcing authentic real-world media for 38 districts + state hero/card...\n');

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

  // 4. Assam Protected URLs
  const assamPath = path.resolve(__dirname, '../src/services/images/verifiedAssamDataset.json');
  if (fs.existsSync(assamPath)) {
    const assam = JSON.parse(fs.readFileSync(assamPath, 'utf8'));
    if (assam.state?.hero?.displayUrl) seenUrls.add(assam.state.hero.displayUrl);
    if (assam.state?.card?.displayUrl) seenUrls.add(assam.state.card.displayUrl);
    for (const d of Object.values(assam.districts || {})) {
      if (d.primary?.displayUrl) seenUrls.add(d.primary.displayUrl);
      if (d.backup?.displayUrl) seenUrls.add(d.backup.displayUrl);
    }
  }

  console.log(`Registered ${seenUrls.size} protected URLs from WB, AP, Arunachal, and Assam.\n`);

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

  // 2. 38 Districts
  console.log('\n--- 2. Resolving 38 District Media (Primary & Backup) ---');
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
  console.log('Verification Summary:');
  console.log('- State Hero: Verified (1/1)');
  console.log('- State Card: Verified (1/1)');
  console.log(`- District Primaries: ${districtSuccessCount} / 38`);
  console.log(`- District Backups: ${backupSuccessCount} / 38`);
  console.log(`- Total Unique URLs Used: ${seenUrls.size}`);
  console.log('====================================================\n');

  // Save to backend/src/services/images/verifiedBiharDataset.json
  const outPath = path.resolve(__dirname, '../src/services/images/verifiedBiharDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf8');
  console.log(`Successfully generated and written verified Bihar dataset to:\n${outPath}`);
}

run().catch(err => {
  console.error('\nFatal Bihar Dataset Generation Failure:', err);
  process.exit(1);
});
