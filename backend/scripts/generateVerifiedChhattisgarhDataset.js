import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool, closePool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

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

    return candidates;
  } catch (err) {
    console.warn(`[Search] Error for query "${query}":`, err.message);
    return [];
  }
}

// All 33 districts of Chhattisgarh with verified landmark query sets
const CHHATTISGARH_CONFIG = [
  {
    slug: 'balod',
    location: 'Scenic Tandula Dam & Reservoir Valley in Balod',
    queries: ['Tandula Dam Balod', 'Tandula Dam', 'Balod Chhattisgarh']
  },
  {
    slug: 'baloda-bazar-bhatapara',
    location: 'Barnawapara Wildlife Sanctuary & Giroudpuri Dham',
    queries: ['Barnawapara Wildlife Sanctuary', 'Barnawapara Sanctuary', 'Giroudpuri Dham']
  },
  {
    slug: 'balrampur-ramanujganj',
    location: 'Tatapani Geothermal Hot Springs & Dipadih Archaeological Site',
    queries: ['Tatapani Chhattisgarh', 'Dipadih Balrampur', 'Balrampur Chhattisgarh']
  },
  {
    slug: 'bastar',
    location: 'Spectacular Chitrakote Falls (Niagara of India) on Indravati River',
    queries: ['Chitrakote Falls Bastar', 'Chitrakote Waterfalls', 'Chitrakoot Falls Chhattisgarh']
  },
  {
    slug: 'bemetara',
    location: 'Maa Bhadra Kali Temple & Sheonath River Basin at Bemetara',
    queries: ['Bhadra Kali Bemetara', 'Bemetara Chhattisgarh', 'Bemetara temple']
  },
  {
    slug: 'bijapur',
    location: 'Untamed Indravati Tiger Reserve Forest Landscape in Bijapur',
    queries: ['Indravati National Park', 'Bijapur Chhattisgarh', 'Indravati Tiger Reserve']
  },
  {
    slug: 'bilaspur',
    location: 'Ancient 11th-Century Mahamaya Temple Ratanpur & Khuntaghat Dam',
    queries: ['Mahamaya Temple Ratanpur', 'Ratanpur Mahamaya Temple', 'Ratanpur Chhattisgarh']
  },
  {
    slug: 'dakshin-bastar-dantewada',
    location: 'Historic Maa Danteshwari Shaktipeeth Temple & Dholkal Ganesha Peak',
    queries: ['Danteshwari Temple Dantewada', 'Dholkal Ganesha Dantewada', 'Dantewada temple']
  },
  {
    slug: 'dhamtari',
    location: 'Expansive Gangrel Dam (R.S. Sagar) on Mahanadi River in Dhamtari',
    queries: ['Gangrel Dam Dhamtari', 'Gangrel Dam Chhattisgarh', 'Gangrel Dam']
  },
  {
    slug: 'durg',
    location: 'Maitri Bagh Scenic Lake Park & Shivnath Riverfront at Durg-Bhilai',
    queries: ['Maitri Bagh Bhilai', 'Shivnath River Durg', 'Durg Chhattisgarh']
  },
  {
    slug: 'gariaband',
    location: 'Scenic Jatmayi Mata Waterfall Temple & Bhuteshwar Nath Shivalinga',
    queries: ['Jatmayi temple Gariaband', 'Jatmayi temple', 'Ghatarani waterfall']
  },
  {
    slug: 'gaurela-pendra-marwahi',
    location: 'Scenic Pendra Plateau & Historic Jwaleshwar Mahadev Temple',
    queries: ['Jwaleshwar Mahadev Temple', 'Pendra Chhattisgarh', 'Kabir Chabutara Chhattisgarh']
  },
  {
    slug: 'janjgir-champa',
    location: '12th-Century Nakshatra Vishnu Temple & Shivrinarayan Sangam',
    queries: ['Vishnu Temple Janjgir', 'Nakshatra Temple Janjgir', 'Shivrinarayan Temple']
  },
  {
    slug: 'jashpur',
    location: 'Scenic Ranidah Waterfall & Lush Highland Valleys of Jashpur',
    queries: ['Ranidah Waterfall Jashpur', 'Ranidah Waterfall', 'Jashpur Chhattisgarh waterfall']
  },
  {
    slug: 'kabirdham',
    location: '11th-Century Bhoramdeo Temple (Khajuraho of Chhattisgarh) & Maikal Hills',
    queries: ['Bhoramdeo Temple Kawardha', 'Bhoramdeo Temple', 'Bhoramdeo Mandir']
  },
  {
    slug: 'khairagarh-chhuikhadan-gandai',
    location: 'Indira Kala Sangit Fine Arts University & Ancient Shiva Temple of Gandai',
    queries: ['Khairagarh university', 'Gandai temple Chhattisgarh', 'Khairagarh Chhattisgarh']
  },
  {
    slug: 'kondagaon',
    location: 'Spectacular Keshkal Ghat Curving Valleys & Bastar Bell Metal Craft',
    queries: ['Keshkal Ghat Kondagaon', 'Keshkal Ghat Chhattisgarh', 'Keshkal Ghat']
  },
  {
    slug: 'korba',
    location: 'Majestic Hasdeo Bango Dam & Historic Chaiturgarh (Lafagarh) Fort',
    queries: ['Hasdeo Bango Dam Korba', 'Hasdeo Bango Dam', 'Chaiturgarh Fort Korba']
  },
  {
    slug: 'koriya',
    location: 'Breathtaking Amrit Dhara Waterfall on Hasdeo River in Koriya',
    queries: ['Amrit Dhara Waterfall Koriya', 'Amritdhara Falls Chhattisgarh', 'Amritdhara waterfall']
  },
  {
    slug: 'mahasamund',
    location: '7th-Century Red-Brick Lakshmana Temple & Archaeological Site of Sirpur',
    queries: ['Laxman Temple Sirpur Mahasamund', 'Lakshmana Temple Sirpur', 'Sirpur Mahasamund']
  },
  {
    slug: 'manendragarh-chirmiri-bharatpur',
    location: 'Permian Marine Fossil Park & Scenic Chirmiri Hill Station',
    queries: ['Marine Fossil Park Manendragarh', 'Chirmiri Chhattisgarh', 'Manendragarh Chhattisgarh']
  },
  {
    slug: 'mohla-manpur-ambagarh-chowki',
    location: 'Historic Ambagarh Chowki Fort & Mogra Dam Reservoir Valley',
    queries: ['Mogra Dam Chhattisgarh', 'Ambagarh Chowki', 'Mohla Manpur']
  },
  {
    slug: 'mungeli',
    location: 'Sacred Setganga Ancient Shiva Temple & Achanakmar Wilderness',
    queries: ['Setganga Mungeli', 'Setganga temple', 'Achanakmar Tiger Reserve']
  },
  {
    slug: 'narayanpur',
    location: 'Pristine Handawada Waterfall & Deep Abujhmad Forest Landscapes',
    queries: ['Handawada Waterfall Narayanpur', 'Abujhmad forest', 'Narayanpur Chhattisgarh']
  },
  {
    slug: 'raigarh',
    location: 'Ram Jharna Scenic Spring & Singhanpur Prehistoric Rock Art Caves',
    queries: ['Ram Jharna Raigarh', 'Singhanpur caves Raigarh', 'Singhanpur Raigarh']
  },
  {
    slug: 'raipur',
    location: 'Swami Vivekananda Sarovar (Budha Talab) & Mahant Ghasidas Memorial Museum',
    queries: ['Vivekananda Sarovar Raipur', 'Budha Talab Raipur', 'Mahant Ghasidas Museum Raipur']
  },
  {
    slug: 'rajnandgaon',
    location: 'Maa Bamleshwari Temple atop Dongargarh Hill & Ropeway',
    queries: ['Maa Bamleshwari Temple Dongargarh', 'Dongargarh Rajnandgaon', 'Bamleshwari Temple']
  },
  {
    slug: 'sakti',
    location: 'Maa Chandrahasini Devi Temple Chandrapur & Mahanadi River Confluence',
    queries: ['Chandrahasini Devi Temple Chandrapur', 'Chandrapur Sakti Chhattisgarh', 'Chandrahasini Devi temple']
  },
  {
    slug: 'sarangarh-bilaigarh',
    location: 'Gomarda Wildlife Sanctuary Forest Valley & Sarangarh Royal Palace',
    queries: ['Gomarda Wildlife Sanctuary Sarangarh', 'Gomarda Wildlife Sanctuary', 'Sarangarh palace']
  },
  {
    slug: 'sukma',
    location: 'Scenic Dudma Waterfall & Perennial Sabari River Landscapes in Sukma',
    queries: ['Dudma Waterfall Sukma', 'Sabari River Sukma', 'Sukma Chhattisgarh']
  },
  {
    slug: 'surajpur',
    location: 'Sacred Kudargarh Devi Temple atop Cliff Ridge & Tamor Pingla Sanctuary',
    queries: ['Kudargarh Surajpur', 'Kudargarh temple Chhattisgarh', 'Tamor Pingla Wildlife Sanctuary']
  },
  {
    slug: 'surguja',
    location: 'Scenic Mainpat Plateau (Tiger Point & Tibetan Monastery) & Ramgarh Caves',
    queries: ['Mainpat Surguja Chhattisgarh', 'Tiger Point Mainpat', 'Ramgarh caves Surguja']
  },
  {
    slug: 'uttar-bastar-kanker',
    location: 'Historic Kanker Palace & Cascading Charre Marre Waterfalls',
    queries: ['Kanker Palace Chhattisgarh', 'Kanker Palace', 'Charre Marre Waterfall Kanker']
  }
];

const STATE_CONFIG = {
  heroLocation: 'Magnificent Chitrakote Falls (Niagara of India) on Indravati River',
  heroQueries: ['Chitrakote Falls panorama', 'Chitrakoot Falls Indravati River', 'Chitrakote Waterfalls'],
  cardLocation: '11th-Century Bhoramdeo Temple (Khajuraho of Chhattisgarh)',
  cardQueries: ['Bhoramdeo Temple Kawardha front', 'Bhoramdeo Temple Kawardha', 'Bhoramdeo Temple']
};

async function generate() {
  const pool = getPool();
  const [dbUrls] = await pool.query('SELECT DISTINCT display_url, original_url FROM images');
  const protectedUrls = new Set();
  for (const r of dbUrls) {
    if (r.display_url) protectedUrls.add(r.display_url);
    if (r.original_url) protectedUrls.add(r.original_url);
  }
  console.log(`Protected existing image URLs count: ${protectedUrls.size}`);

  const usedUrls = new Set([...protectedUrls]);
  const result = {
    state: {},
    districts: {}
  };

  // State Media
  console.log('\n--- Sourcing State Media for Chhattisgarh ---');
  for (const q of STATE_CONFIG.heroQueries) {
    const candidates = await searchCandidates(q, 6);
    const valid = candidates.find(c => !usedUrls.has(c.displayUrl) && c.width >= 1200 && c.isLandscape);
    if (valid) {
      usedUrls.add(valid.displayUrl);
      result.state.hero = { ...valid, locationDescription: STATE_CONFIG.heroLocation };
      console.log(`✓ State Hero: ${valid.title} (${valid.width}x${valid.height})`);
      break;
    }
  }

  for (const q of STATE_CONFIG.cardQueries) {
    const candidates = await searchCandidates(q, 6);
    const valid = candidates.find(c => !usedUrls.has(c.displayUrl) && c.width >= 1000);
    if (valid) {
      usedUrls.add(valid.displayUrl);
      result.state.card = { ...valid, locationDescription: STATE_CONFIG.cardLocation };
      console.log(`✓ State Card: ${valid.title} (${valid.width}x${valid.height})`);
      break;
    }
  }

  // 33 Districts
  console.log('\n--- Sourcing 33 Districts for Chhattisgarh ---');
  for (const d of CHHATTISGARH_CONFIG) {
    console.log(`Processing: ${d.slug}...`);
    let primary = null;
    let backup = null;

    for (const q of d.queries) {
      if (primary && backup) break;
      const candidates = await searchCandidates(q, 6);
      for (const cand of candidates) {
        if (primary && backup) break;
        if (usedUrls.has(cand.displayUrl)) continue;

        const lower = cand.title.toLowerCase();
        if (lower.includes('map') || lower.includes('locator') || lower.includes('flag') ||
            lower.includes('emblem') || lower.includes('logo') || lower.includes('district in')) {
          continue;
        }

        if (!primary) {
          primary = { ...cand, locationDescription: d.location };
          usedUrls.add(cand.displayUrl);
        } else if (!backup && cand.pageId !== primary.pageId) {
          backup = { ...cand, locationDescription: d.location };
          usedUrls.add(cand.displayUrl);
        }
      }
    }

    result.districts[d.slug] = {
      primary,
      backup
    };
    console.log(`  -> ${d.slug}: Primary: ${primary ? primary.title.substring(0, 30) : 'NONE'} | Backup: ${backup ? backup.title.substring(0, 30) : 'NONE'}`);
  }

  const outPath = path.join(__dirname, '../src/services/images/verifiedChhattisgarhDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\nSuccessfully wrote verified Chhattisgarh dataset to ${outPath}`);

  let pCount = 0;
  let bCount = 0;
  for (const slug of Object.keys(result.districts)) {
    if (result.districts[slug].primary) pCount++;
    if (result.districts[slug].backup) bCount++;
  }
  console.log(`Summary:`);
  console.log(`- State Hero: ${result.state.hero ? 'YES' : 'NO'}`);
  console.log(`- State Card: ${result.state.card ? 'YES' : 'NO'}`);
  console.log(`- Districts with Primary: ${pCount} / 33`);
  console.log(`- Districts with Backup: ${bCount} / 33`);

  await closePool();
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
