import fs from 'fs';
import path from 'path';

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
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
      const t = page.title.toLowerCase();
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('minister') || t.includes('inauguration')) continue;

      const meta = info.extmetadata || {};
      const width = info.width || 0;
      const height = info.height || 0;
      if (width < 600) continue;

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
        isLandscape: width >= height * 0.8
      });
    }
    return candidates;
  } catch (err) {
    return [];
  }
}

const KERALA_CONFIG = [
  {
    slug: 'alappuzha',
    location: 'Tranquil emerald backwaters and traditional thatched Kettuvallam houseboats of Alappuzha',
    queries: ['Alappuzha houseboat backwaters Kerala', 'Alleppey houseboat', 'Punnamada Lake Alappuzha', 'Alappuzha Beach lighthouse']
  },
  {
    slug: 'ernakulam',
    location: 'Historic cantilevered Chinese fishing nets against sunset at Fort Kochi harbor, Ernakulam',
    queries: ['Chinese Fishing Nets Fort Kochi sunset', 'Fort Kochi Chinese fishing nets', 'Mattancherry Palace Kochi']
  },
  {
    slug: 'idukki',
    location: 'Rolling emerald velvet tea estates of Munnar and colossal concrete curve of Idukki Arch Dam',
    queries: ['Munnar tea plantations Kerala', 'Munnar landscape tea garden', 'Idukki Arch Dam Kerala', 'Eravikulam National Park']
  },
  {
    slug: 'kannur',
    location: 'Asia longest drive-in beach at Muzhappilangad and coastal stone bastions of St Angelo Fort, Kannur',
    queries: ['Muzhappilangad Drive-in Beach Kannur', 'St Angelo Fort Kannur', 'Theyyam Kannur Kerala']
  },
  {
    slug: 'kasaragod',
    location: 'Magnificent keyhole-shaped ramparts of 17th-Century Bekal Fort overlooking Arabian Sea, Kasaragod',
    queries: ['Bekal Fort Kasaragod Kerala', 'Bekal Fort sea', 'Ananthapura Lake Temple Kasaragod']
  },
  {
    slug: 'kollam',
    location: 'Serene eight-armed waterways of Ashtamudi Lake and lush coconut groves of Munroe Island, Kollam',
    queries: ['Ashtamudi Lake Kollam', 'Munroe Island Kollam Kerala', 'Thangassery Lighthouse Kollam']
  },
  {
    slug: 'kottayam',
    location: 'Tranquil birdwatching canals of Kumarakom and expansive glassy waters of Vembanad Lake, Kottayam',
    queries: ['Kumarakom backwaters Vembanad Lake', 'Kumarakom Kerala', 'Ilaveezhapoonchira Kottayam']
  },
  {
    slug: 'kozhikode',
    location: 'Historic shores of Kappad Beach where Vasco da Gama landed and ancient wooden dhow shipyards of Beypore',
    queries: ['Kappad Beach Kozhikode', 'Beypore port Uru shipbuilding', 'Calicut beach Kozhikode']
  },
  {
    slug: 'malappuram',
    location: 'World oldest teak plantations at Nilambur Conolly Plot and coastal palm beaches of Malappuram',
    queries: ['Nilambur Teak Museum Malappuram', 'Conolly Plot Nilambur', 'Malappuram Kerala landscape']
  },
  {
    slug: 'palakkad',
    location: 'Historic granite ramparts of Palakkad Fort (Tipu Fort) surrounded by water moat and green Western Ghats',
    queries: ['Palakkad Fort Tipu Sultan Kerala', 'Palakkad Fort moat', 'Malampuzha Dam Palakkad']
  },
  {
    slug: 'pathanamthitta',
    location: 'Cascading Perunthenaruvi Waterfalls and sacred hillside pilgrimage groves of Pathanamthitta',
    queries: ['Perunthenaruvi Waterfalls Pathanamthitta', 'Gavi Pathanamthitta Kerala', 'Aranmula Parthasarathy Temple']
  },
  {
    slug: 'thiruvananthapuram',
    location: 'Dravidian gopuram splendor of Sree Padmanabhaswamy Temple and crescent golden sands of Kovalam Beach',
    queries: ['Padmanabhaswamy Temple Thiruvananthapuram illuminated', 'Kovalam Beach lighthouse Kerala', 'Napier Museum Trivandrum']
  },
  {
    slug: 'thrissur',
    location: 'Majestic 80-foot plunging cataract of Athirappilly Waterfalls on Chalakudy River and Vadakkunnathan Temple',
    queries: ['Athirappilly Falls Thrissur Kerala', 'Athirappilly Waterfalls', 'Vadakkunnathan Temple Thrissur']
  },
  {
    slug: 'wayanad',
    location: 'Massive earthen embankment of Banasura Sagar Dam surrounded by mist-laden Western Ghats, Wayanad',
    queries: ['Banasura Sagar Dam Wayanad', 'Banasura Sagar Dam', 'Edakkal Caves Wayanad', 'Chembra Peak Wayanad']
  }
];

async function generate() {
  console.log('=== Curating Authentic Wikimedia Dataset for Kerala (Phase 13) ===');
  const dataset = {
    state: {
      name: 'Kerala',
      slug: 'kerala',
      hero: null,
      card: null
    },
    districts: {}
  };

  // State Media
  console.log('Fetching Kerala State Media...');
  const heroCandidates = await searchCandidates('Alappuzha houseboat backwaters Kerala sunset panorama', 6);
  const heroCand2 = heroCandidates.length ? heroCandidates : await searchCandidates('Munnar tea plantations Kerala morning mist', 6);
  if (heroCand2.length > 0) {
    const bestHero = heroCand2.find(c => c.isLandscape && c.width >= 1200) || heroCand2[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Serene emerald backwaters framed by swaying coconut palms and traditional houseboats, Kerala'
    };
    console.log(`State Hero found: ${bestHero.title}`);
  }

  const cardCandidates = await searchCandidates('Chinese Fishing Nets Fort Kochi sunset Kerala', 6);
  const cardCand2 = cardCandidates.length ? cardCandidates : await searchCandidates('Athirappilly Falls Thrissur Kerala', 6);
  if (cardCand2.length > 0) {
    const bestCard = cardCand2.find(c => c.isLandscape) || cardCand2[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'Historic cantilevered Chinese fishing nets silhouetted against glowing Arabian Sea twilight, Kochi, Kerala'
    };
    console.log(`State Card found: ${bestCard.title}`);
  }

  // Districts
  for (const item of KERALA_CONFIG) {
    console.log(`Processing district: ${item.slug}`);
    let candidates = [];
    for (const q of item.queries) {
      const res = await searchCandidates(q, 6);
      candidates = candidates.concat(res);
      if (candidates.length >= 4) break;
    }

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
      const fallback = await searchCandidates(`${item.slug} Kerala`, 6);
      unique.push(...fallback);
    }

    const primary = unique.find(c => c.isLandscape && c.width >= 1000) || unique.find(c => c.isLandscape) || unique[0];
    const backup = unique.find(c => c.pageId !== primary?.pageId && c.isLandscape) || unique.find(c => c.pageId !== primary?.pageId) || null;

    if (primary) primary.locationDescription = item.location;
    if (backup) backup.locationDescription = `${item.location} (Alternative Perspective)`;

    dataset.districts[item.slug] = {
      slug: item.slug,
      location: item.location,
      primary: primary || null,
      backup: backup || null
    };

    console.log(`[${item.slug}] Primary: ${primary ? primary.title : 'NONE'} | Backup: ${backup ? backup.title : 'NONE'}`);
  }

  const outPath = path.resolve('backend/src/services/images/verifiedKeralaDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));
  console.log(`Successfully saved dataset to ${outPath}`);
}

generate().catch(console.error);
