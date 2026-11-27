import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchDirectTitle(title, locationDesc) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    if (!page || !page.imageinfo || !page.imageinfo[0]) return null;

    const info = page.imageinfo[0];
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
      isLandscape: width >= height * 0.8,
      locationDescription: locationDesc
    };
  } catch (err) {
    console.warn(`[Direct] Error for "${title}":`, err.message);
    return null;
  }
}

async function searchCandidates(query, limit = 8) {
  if (query.startsWith('File:')) {
    const direct = await fetchDirectTitle(query, query);
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
    return candidates;
  } catch (err) {
    return [];
  }
}

const HARYANA_CONFIG = [
  {
    slug: 'ambala',
    location: 'Historic St. Paul Cathedral Church and Gurdwara Panjokhra Sahib in Ambala',
    queries: ['St. Paul\'s Church Ambala', 'Ambala Cantt church', 'Gurudwara Panjokhra Sahib Ambala', 'Ambala city']
  },
  {
    slug: 'bhiwani',
    location: 'Architectural Star Monument and historic temples of Chhoti Kashi Bhiwani',
    queries: ['Star Monument Bhiwani', 'Bhiwani temple', 'Loharu Fort Bhiwani', 'Bhiwani Haryana']
  },
  {
    slug: 'charkhi-dadri',
    location: 'Historic Shyam Sarovar and Derawala Mandir in Charkhi Dadri',
    queries: ['Charkhi Dadri lake', 'Charkhi Dadri temple', 'Charkhi Dadri Haryana', 'Charkhi Dadri']
  },
  {
    slug: 'faridabad',
    location: 'Ancient 10th-Century Sun Amphitheatre at Surajkund and Raja Nahar Singh Palace',
    queries: ['Surajkund Faridabad', 'Raja Nahar Singh Palace', 'Surajkund lake', 'Badkhal Lake Faridabad']
  },
  {
    slug: 'fatehabad',
    location: 'Historic Ashokan Pillar and Humayun Mosque complex in Fatehabad',
    queries: ['Ashokan Pillar Fatehabad', 'Humayun Mosque Fatehabad', 'Fatehabad Haryana monument', 'Fatehabad fort']
  },
  {
    slug: 'gurugram',
    location: 'Sultanpur National Park Wetland Sanctuary and iconic Cyber City Gurgaon',
    queries: ['Sultanpur National Park', 'Cyber City Gurgaon', 'Sheetla Mata Temple Gurgaon', 'Sultanpur Lake Haryana']
  },
  {
    slug: 'hansi',
    location: 'Historic 12th-Century Asigarh Fort (Prithviraj Chauhan Fort) and Barsi Gate Hansi',
    queries: ['Asigarh Fort Hansi', 'Barsi Gate Hansi', 'Hansi Fort Haryana', 'Hansi monument']
  },
  {
    slug: 'hisar',
    location: '14th-Century Firoz Shah Palace Complex, Lat ki Masjid and Gujri Mahal in Hisar',
    queries: ['Firoz Shah Palace Complex Hisar', 'Gujri Mahal Hisar', 'Lat ki Masjid Hisar', 'Blue Bird Lake Hisar']
  },
  {
    slug: 'jhajjar',
    location: 'Bhindawas Wetland Wildlife Bird Sanctuary and historic Bua Da Mazar Jhajjar',
    queries: ['Bhindawas Wildlife Sanctuary', 'Bua Da Mazar Jhajjar', 'Bhindawas lake', 'Jhajjar Haryana']
  },
  {
    slug: 'jind',
    location: 'Scenic Rani Talab and historic Bhuteshwar Shiva Temple in Jind',
    queries: ['Rani Talab Jind', 'Bhuteshwar Temple Jind', 'Jind Haryana', 'Rani Talab Haryana']
  },
  {
    slug: 'kaithal',
    location: 'Historic Bidkyar Lake and ancient Kaithal Fort heritage site',
    queries: ['Bidkyar Lake Kaithal', 'Kaithal Fort', 'Kaithal Haryana', 'Hanuman temple Kaithal']
  },
  {
    slug: 'karnal',
    location: 'Serene Karna Lake, British-era Cantonment Church Tower and Kalpana Chawla Memorial',
    queries: ['Karna Lake Karnal', 'Cantonment Church Tower Karnal', 'Karnal lake Haryana', 'Karnal monument']
  },
  {
    slug: 'kurukshetra',
    location: 'Sacred Brahma Sarovar water reservoir and Jyotisar Gita birth site Kurukshetra',
    queries: ['Brahma Sarovar Kurukshetra', 'Jyotisar Kurukshetra', 'Sannihit Sarovar Kurukshetra', 'Kurukshetra temple']
  },
  {
    slug: 'mahendragarh',
    location: 'Historic Jal Mahal Narnaul and hilltop Madhogarh Fort in Mahendragarh',
    queries: ['Jal Mahal Narnaul', 'Chor Gumbad Narnaul', 'Madhogarh Fort Mahendragarh', 'Narnaul monument']
  },
  {
    slug: 'nuh',
    location: 'Historic Kotla Mosque with red sandstone tombs and Sheikh Musa Dargah in Mewat Nuh',
    queries: ['Kotla Mosque Nuh', 'Sheikh Musa Nuh', 'Chui Mal Ka Chaubara Nuh', 'Nuh Haryana monument']
  },
  {
    slug: 'palwal',
    location: 'Sacred Panchwati Temple and historic Gandhi Seva Ashram in Palwal',
    queries: ['Panchwati Temple Palwal', 'Gandhi Seva Ashram Palwal', 'Palwal Haryana', 'Palwal temple']
  },
  {
    slug: 'panchkula',
    location: 'Mughal-style Yadavindra Pinjore Gardens and scenic Morni Hills Tikkar Taal',
    queries: ['Pinjore Gardens Panchkula', 'Yadavindra Gardens', 'Morni Hills Panchkula', 'Tikkar Taal Morni']
  },
  {
    slug: 'panipat',
    location: 'Historic Kabuli Bagh Mosque built by Babur and Sufi Tomb of Bu Ali Shah Qalandar',
    queries: ['Kabuli Bagh Mosque Panipat', 'Bu Ali Shah Qalandar Panipat', 'Panipat War Memorial', 'Hemu Samadhi Panipat']
  },
  {
    slug: 'rewari',
    location: 'Fairy Queen at Rewari Heritage Steam Locomotive Shed and historic Bada Talab',
    queries: ['Rewari Railway Heritage Museum', 'Rewari Steam Locomotive', 'Bada Talab Rewari', 'Rewari Haryana']
  },
  {
    slug: 'rohtak',
    location: 'Serene Tilyar Lake tourist complex and ancient 8th-Century Asthal Bohar Math',
    queries: ['Tilyar Lake Rohtak', 'Asthal Bohar Rohtak', 'Rohtak lake', 'Rohtak Haryana']
  },
  {
    slug: 'sirsa',
    location: 'Serene Tara Baba Kutiya and historic Sarsuti River archaeological heritage in Sirsa',
    queries: ['Tara Baba Kutiya Sirsa', 'Sirsa Haryana monument', 'Sirsa temple', 'Sirsa lake']
  },
  {
    slug: 'sonipat',
    location: 'Mughal-era Tomb of Khwaja Khizr and ancient archaeological mound at Sonipat',
    queries: ['Tomb of Khwaja Khizr Sonipat', 'Khwaja Khizr Sonipat', 'Sonipat monument', 'Sonipat Haryana']
  },
  {
    slug: 'yamunanagar',
    location: 'Scenic Hathni Kund Barrage on Yamuna River and Buddhist Stupa at Chaneti',
    queries: ['Hathni Kund Barrage Yamunanagar', 'Hathni Kund Barrage', 'Buddhist Stupa Chaneti', 'Kalesar National Park']
  }
];

async function generate() {
  console.log('=== Curating Authentic Wikimedia Dataset for Haryana (Phase 9) ===');
  const dataset = {
    state: {
      name: 'Haryana',
      slug: 'haryana',
      hero: null,
      card: null
    },
    districts: {}
  };

  // State Media
  console.log('Fetching Haryana State Media...');
  const heroCandidates = await searchCandidates('Brahma Sarovar Kurukshetra sunset', 6);
  if (heroCandidates.length > 0) {
    const bestHero = heroCandidates.find(c => c.isLandscape && c.width >= 1200) || heroCandidates[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Sacred Brahma Sarovar with bronze Krishna-Arjuna chariot during twilight, Kurukshetra, Haryana'
    };
    console.log(`State Hero found: ${bestHero.title}`);
  }

  const cardCandidates = await searchCandidates('Pinjore Gardens Panchkula Mughal terrace', 6);
  if (cardCandidates.length > 0) {
    const bestCard = cardCandidates.find(c => c.isLandscape) || cardCandidates[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'Terraced Mughal water pavilions at Yadavindra Gardens, Pinjore, Panchkula, Haryana'
    };
    console.log(`State Card found: ${bestCard.title}`);
  }

  // Districts
  for (const item of HARYANA_CONFIG) {
    console.log(`Processing district: ${item.slug}`);
    let candidates = [];
    for (const q of item.queries) {
      const res = await searchCandidates(q, 6);
      candidates = candidates.concat(res);
      if (candidates.length >= 4) break;
    }

    // Deduplicate by pageId or originalUrl
    const seen = new Set();
    const unique = [];
    for (const c of candidates) {
      if (!seen.has(c.pageId) && !seen.has(c.originalUrl)) {
        seen.add(c.pageId);
        seen.add(c.originalUrl);
        unique.push(c);
      }
    }

    if (unique.length === 0) {
      console.warn(`WARNING: Zero candidates found for ${item.slug}, trying fallback generic query...`);
      const fallback = await searchCandidates(`${item.slug} Haryana`, 6);
      unique.push(...fallback);
    }

    // Primary: best landscape image
    const primary = unique.find(c => c.isLandscape && c.width >= 1000) || unique.find(c => c.isLandscape) || unique[0];
    // Backup: second distinct candidate
    const backup = unique.find(c => c.pageId !== primary?.pageId && c.isLandscape) || unique.find(c => c.pageId !== primary?.pageId) || null;

    if (primary) {
      primary.locationDescription = item.location;
    }
    if (backup) {
      backup.locationDescription = `${item.location} (Alternative Perspective)`;
    }

    dataset.districts[item.slug] = {
      slug: item.slug,
      location: item.location,
      primary: primary || null,
      backup: backup || null
    };

    console.log(`[${item.slug}] Primary: ${primary ? primary.title : 'NONE'} | Backup: ${backup ? backup.title : 'NONE'}`);
  }

  // Save to verifiedHaryanaDataset.json
  const outPath = path.resolve('backend/src/services/images/verifiedHaryanaDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));
  console.log(`Successfully saved dataset to ${outPath}`);

  // Summary
  const distKeys = Object.keys(dataset.districts);
  const withPrimary = distKeys.filter(k => dataset.districts[k].primary).length;
  const withBackup = distKeys.filter(k => dataset.districts[k].backup).length;
  console.log(`\n=== HARYANA CURATION SUMMARY ===`);
  console.log(`Total Districts: ${distKeys.length}`);
  console.log(`With Primary: ${withPrimary}/${distKeys.length}`);
  console.log(`With Backup: ${withBackup}/${distKeys.length}`);
  console.log(`State Hero: ${dataset.state.hero ? 'YES' : 'NO'}`);
  console.log(`State Card: ${dataset.state.card ? 'YES' : 'NO'}`);
}

generate().catch(err => {
  console.error('Curation failed:', err);
  process.exit(1);
});
