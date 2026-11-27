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

const GOA_CONFIG = [
  {
    slug: 'kushavati',
    location: 'Prehistoric Usgalimal Petroglyphs & Kushavati River Valley at Rivona',
    queries: ['Usgalimal petroglyphs', 'Usgalimal rock art', 'Kushavati River', 'Rivona Goa']
  },
  {
    slug: 'north-goa',
    location: 'Historic 17th-Century Fort Aguada Lighthouse & Arabian Sea Overlook',
    queries: ['Fort Aguada lighthouse', 'Aguada Fort Goa ocean', 'Chapora Fort ocean view']
  },
  {
    slug: 'south-goa',
    location: 'Picturesque Crescent Palolem Beach & Arabian Sea Coastline',
    queries: ['Palolem Beach Goa sunset', 'Palolem Beach Goa', 'Colva Beach South Goa']
  }
];

const GOA_STATE_CONFIG = {
  heroLocation: 'Majestic Dudhsagar 4-Tiered Waterfall in Bhagwan Mahaveer Sanctuary',
  heroQueries: ['Dudhsagar Falls Goa wide', 'Dudhsagar Waterfalls Goa', 'Dudhsagar Falls'],
  cardLocation: 'UNESCO World Heritage Basilica of Bom Jesus at Old Goa',
  cardQueries: ['Basilica of Bom Jesus front facade', 'Basilica of Bom Jesus Old Goa', 'Bom Jesus Basilica']
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
  console.log('\n--- Sourcing State Media for Goa ---');
  for (const q of GOA_STATE_CONFIG.heroQueries) {
    const candidates = await searchCandidates(q, 6);
    const valid = candidates.find(c => !usedUrls.has(c.displayUrl) && c.width >= 1200);
    if (valid) {
      usedUrls.add(valid.displayUrl);
      result.state.hero = { ...valid, locationDescription: GOA_STATE_CONFIG.heroLocation };
      console.log(`✓ State Hero: ${valid.title} (${valid.width}x${valid.height})`);
      break;
    }
  }

  for (const q of GOA_STATE_CONFIG.cardQueries) {
    const candidates = await searchCandidates(q, 6);
    const valid = candidates.find(c => !usedUrls.has(c.displayUrl) && c.width >= 1000);
    if (valid) {
      usedUrls.add(valid.displayUrl);
      result.state.card = { ...valid, locationDescription: GOA_STATE_CONFIG.cardLocation };
      console.log(`✓ State Card: ${valid.title} (${valid.width}x${valid.height})`);
      break;
    }
  }

  // 3 Districts
  console.log('\n--- Sourcing 3 Districts for Goa ---');
  for (const d of GOA_CONFIG) {
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

  const outPath = path.join(__dirname, '../src/services/images/verifiedGoaDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\nSuccessfully wrote verified Goa dataset to ${outPath}`);

  await closePool();
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
