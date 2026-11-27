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

async function searchCandidates(query, limit = 6) {
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

// All 34 districts of Gujarat mapped to verified authentic landmarks
const GUJARAT_CONFIG = [
  {
    slug: 'ahmedabad',
    location: 'Historic Sabarmati Ashram & Hriday Kunj overlooking the Sabarmati River',
    queries: ['Sabarmati Ashram Ahmedabad', 'Sabarmati Ashram', 'Hutheesing Jain Temple Ahmedabad']
  },
  {
    slug: 'amreli',
    location: 'Scenic Khodiyar Dam & Gir Forest Wildlife Corridor in Amreli',
    queries: ['Khodiyar Dam Amreli', 'Amreli Gir', 'Dhari Gir Amreli']
  },
  {
    slug: 'anand',
    location: 'Historic Amul Heritage Museum & Sardar Patel Memorial Karamsad',
    queries: ['Amul dairy Anand', 'Karamsad Anand', 'Anand Gujarat monument']
  },
  {
    slug: 'aravalli',
    location: 'Ancient 11th-Century Shamlaji Vishnu Temple on Meshwo River',
    queries: ['Shamlaji temple Aravalli', 'Shamlaji Vishnu Temple', 'Shamlaji Gujarat']
  },
  {
    slug: 'banaskantha',
    location: 'Sacred Ambaji Shaktipeeth Temple atop Gabbar Hill',
    queries: ['Ambaji Temple Gujarat', 'Ambaji Gabbar Hill', 'Ambaji temple Banaskantha']
  },
  {
    slug: 'bharuch',
    location: 'Historic 19th-Century Golden Bridge across Narmada River at Bharuch',
    queries: ['Golden Bridge Bharuch', 'Narmada River Bharuch', 'Golden Bridge Narmada']
  },
  {
    slug: 'bhavnagar',
    location: 'Sacred Shatrunjaya Hill with 863 Marble Palitana Jain Temples',
    queries: ['Palitana Jain temples Bhavnagar', 'Palitana Shatrunjaya', 'Palitana temples']
  },
  {
    slug: 'botad',
    location: 'Sacred Shree Kashtbhanjan Dev Hanumanji Temple at Salangpur',
    queries: ['Salangpur Hanuman temple', 'Salangpur Botad', 'Salangpur temple Gujarat']
  },
  {
    slug: 'chhota-udaipur',
    location: 'Chhota Udepur Royal Heritage Palace & Sukhi Dam Reservoir',
    queries: ['Chhota Udepur palace', 'Chhota Udaipur palace', 'Chhota Udepur Gujarat']
  },
  {
    slug: 'dahod',
    location: 'Ancient 10th-Century Bavka Shiva Temple & Ratanmahal Sanctuary',
    queries: ['Bavka Shiva Temple Dahod', 'Bavka temple', 'Ratanmahal sanctuary Dahod']
  },
  {
    slug: 'dang',
    location: 'Breathtaking Gira Falls & Sahyadri Lush Forests at Saputara Hill Station',
    queries: ['Gira Falls Dang', 'Saputara hill station', 'Gira waterfall Saputara']
  },
  {
    slug: 'devbhumi-dwarka',
    location: 'Sacred 2,200-Year-Old Dwarkadhish Temple (Jagat Mandir) on Gomti Creek',
    queries: ['Dwarkadhish Temple Dwarka', 'Dwarkadhish Temple', 'Jagat Mandir Dwarka']
  },
  {
    slug: 'gandhinagar',
    location: 'Magnificent Akshardham Temple Complex & Cultural Gardens in Gandhinagar',
    queries: ['Akshardham Temple Gandhinagar', 'Akshardham Gandhinagar', 'Dandi Kutir Gandhinagar']
  },
  {
    slug: 'gir-somnath',
    location: 'Sacred First Jyotirlinga Somnath Temple on the Arabian Sea Coast',
    queries: ['Somnath Temple Gujarat front', 'Somnath Temple sea', 'Somnath Jyotirlinga']
  },
  {
    slug: 'jamnagar',
    location: 'Historic Lakhota Fort & Palace in Lakhota Lake at Jamnagar',
    queries: ['Lakhota Palace Jamnagar', 'Lakhota Fort Jamnagar', 'Lakhota Lake Jamnagar']
  },
  {
    slug: 'junagadh',
    location: 'Majestic Girnar Hill & 10th-Century Jain Temples atop 10,000 Steps',
    queries: ['Girnar Hill Junagadh', 'Uparkot Fort Junagadh', 'Mahabat Maqbara Junagadh']
  },
  {
    slug: 'kachchh',
    location: 'Expansive Pristine White Desert of the Great Rann of Kutch',
    queries: ['Great Rann of Kutch sunset', 'Rann of Kutch white desert', 'Great Rann of Kutch']
  },
  {
    slug: 'kheda',
    location: 'Sacred 18th-Century Ranchhodraiji Maharaj Temple at Dakor',
    queries: ['Dakor Temple Kheda', 'Ranchhodraiji Temple Dakor', 'Dakor temple Gujarat']
  },
  {
    slug: 'mahisagar',
    location: 'Ancient Kaleshwari Archaeological Complex & Kadana Dam on Mahi River',
    queries: ['Kaleshwari Mahisagar', 'Kadana Dam Mahisagar', 'Kadana Dam Gujarat']
  },
  {
    slug: 'mehsana',
    location: 'Magnificent 11th-Century Sun Temple at Modhera & Surya Kund',
    queries: ['Sun Temple Modhera Surya Kund', 'Modhera Sun Temple Mehsana', 'Sun Temple Modhera']
  },
  {
    slug: 'morbi',
    location: 'Historic Mani Mandir Palace & Machchhu River Heritage in Morbi',
    queries: ['Mani Mandir Morbi', 'Morbi palace Gujarat', 'Mani Mandir']
  },
  {
    slug: 'narmada',
    location: 'World Tallest 182-Meter Statue of Unity & Sardar Sarovar Dam',
    queries: ['Statue of Unity Narmada', 'Statue of Unity Gujarat', 'Statue of Unity']
  },
  {
    slug: 'navsari',
    location: 'Historic National Salt Satyagraha Memorial & Beach at Dandi',
    queries: ['Dandi Memorial Navsari', 'Dandi Beach Navsari', 'National Salt Satyagraha Memorial']
  },
  {
    slug: 'panchmahal',
    location: 'UNESCO World Heritage Champaner-Pavagadh Archaeological Park',
    queries: ['Champaner-Pavagadh Archaeological Park', 'Jami Masjid Champaner', 'Pavagadh temple']
  },
  {
    slug: 'patan',
    location: 'UNESCO World Heritage Rani ki Vav (Queen Stepwell) at Patan',
    queries: ['Rani ki Vav Patan stepwell', 'Rani ki Vav Patan', 'Rani ki Vav']
  },
  {
    slug: 'porbandar',
    location: 'Historic Kirti Mandir Memorial at Mahatma Gandhi Birthplace',
    queries: ['Kirti Mandir Porbandar', 'Porbandar beach Gujarat', 'Kirti Mandir']
  },
  {
    slug: 'rajkot',
    location: 'Historic Watson Museum & Jubilee Garden Heritage in Rajkot',
    queries: ['Watson Museum Rajkot', 'Aji Dam Rajkot', 'Rajkot Jubilee Garden']
  },
  {
    slug: 'sabarkantha',
    location: 'Scenic Ancient Polo Forest & 15th-Century Jain Temple Ruins',
    queries: ['Polo Forest Sabarkantha', 'Polo Forest Gujarat', 'Idar Fort Sabarkantha']
  },
  {
    slug: 'surat',
    location: 'Historic 16th-Century Surat Castle (Old Fort) on Tapi River',
    queries: ['Surat Castle Old Fort', 'Surat Castle', 'Dumas Beach Surat']
  },
  {
    slug: 'surendranagar',
    location: 'Indian Wild Ass Sanctuary & Little Rann of Kutch Landscapes',
    queries: ['Indian Wild Ass Sanctuary Little Rann of Kutch', 'Wild Ass Sanctuary Gujarat', 'Wadhwan stepwell']
  },
  {
    slug: 'tapi',
    location: 'Massive Ukai Dam (Vallabh Sagar) & Historic Songadh Fort on Tapi River',
    queries: ['Ukai Dam Tapi', 'Songadh Fort Tapi', 'Ukai Dam Gujarat']
  },
  {
    slug: 'vadodara',
    location: 'Magnificent Indo-Saracenic Laxmi Vilas Palace (Four Times the Size of Buckingham Palace)',
    queries: ['Laxmi Vilas Palace Vadodara front', 'Laxmi Vilas Palace Vadodara', 'Laxmi Vilas Palace']
  },
  {
    slug: 'valsad',
    location: 'Picturesque Black Sand Tithal Beach & Arabian Sea Coastline in Valsad',
    queries: ['Tithal Beach Valsad', 'Wilson Hills Valsad', 'Tithal Beach']
  },
  {
    slug: 'vav-tharad',
    location: 'Sacred Nadeshwari Mata Temple at Nadabet (Indo-Pak Border Seema Darshan)',
    queries: ['Nadabet Seema Darshan', 'Nadeshwari Mata Temple', 'Nadabet Gujarat border', 'Tharad Gujarat']
  }
];

const GUJARAT_STATE_CONFIG = {
  heroLocation: 'UNESCO World Heritage Rani ki Vav (Queen Stepwell) at Patan',
  heroQueries: ['Rani ki Vav wide stepwell', 'Rani ki Vav Patan panoramic', 'Rani ki Vav'],
  cardLocation: 'Ancient 11th-Century Sun Temple at Modhera & Surya Kund',
  cardQueries: ['Sun Temple Modhera Gujarat front', 'Modhera Sun Temple front', 'Sun Temple Modhera']
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

  // State Hero & Card
  console.log('\n--- Sourcing State Media for Gujarat ---');
  for (const q of GUJARAT_STATE_CONFIG.heroQueries) {
    const candidates = await searchCandidates(q, 6);
    const valid = candidates.find(c => !usedUrls.has(c.displayUrl) && c.width >= 1200);
    if (valid) {
      usedUrls.add(valid.displayUrl);
      result.state.hero = { ...valid, locationDescription: GUJARAT_STATE_CONFIG.heroLocation };
      console.log(`✓ State Hero: ${valid.title} (${valid.width}x${valid.height})`);
      break;
    }
  }

  for (const q of GUJARAT_STATE_CONFIG.cardQueries) {
    const candidates = await searchCandidates(q, 6);
    const valid = candidates.find(c => !usedUrls.has(c.displayUrl) && c.width >= 1000);
    if (valid) {
      usedUrls.add(valid.displayUrl);
      result.state.card = { ...valid, locationDescription: GUJARAT_STATE_CONFIG.cardLocation };
      console.log(`✓ State Card: ${valid.title} (${valid.width}x${valid.height})`);
      break;
    }
  }

  // 34 Districts
  console.log('\n--- Sourcing 34 Districts for Gujarat ---');
  for (const d of GUJARAT_CONFIG) {
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

  const outPath = path.join(__dirname, '../src/services/images/verifiedGujaratDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\nSuccessfully wrote verified Gujarat dataset to ${outPath}`);

  let pCount = 0;
  let bCount = 0;
  for (const slug of Object.keys(result.districts)) {
    if (result.districts[slug].primary) pCount++;
    if (result.districts[slug].backup) bCount++;
  }
  console.log(`Summary:`);
  console.log(`- State Hero: ${result.state.hero ? 'YES' : 'NO'}`);
  console.log(`- State Card: ${result.state.card ? 'YES' : 'NO'}`);
  console.log(`- Districts with Primary: ${pCount} / 34`);
  console.log(`- Districts with Backup: ${bCount} / 34`);

  await closePool();
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
