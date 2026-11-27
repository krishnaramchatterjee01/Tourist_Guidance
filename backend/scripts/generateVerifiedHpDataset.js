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
      if (t.includes('map') || t.includes('locator') || t.includes('flag')) continue;

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

const HP_CONFIG = [
  {
    slug: 'bilaspur',
    location: 'Gobind Sagar Lake and holy Naina Devi Temple overlooking Bilaspur Himachal',
    queries: ['Gobind Sagar Lake Bilaspur', 'Naina Devi Temple Bilaspur Himachal', 'Bhakra Dam Gobind Sagar']
  },
  {
    slug: 'chamba',
    location: 'Lush alpine meadows of Khajjiar and ancient Lakshmi Narayan Temple in Chamba',
    queries: ['Khajjiar Lake Chamba', 'Khajjiar meadow', 'Chamba Chaugan Himachal', 'Lakshmi Narayan Temple Chamba']
  },
  {
    slug: 'hamirpur',
    location: 'Historic Katoch dynasty Sujanpur Tira Fort and Baba Balak Nath temple',
    queries: ['Sujanpur Tira Fort Hamirpur', 'Sujanpur Tira', 'Baba Balak Nath Temple Deotsidh', 'Hamirpur Himachal']
  },
  {
    slug: 'kangra',
    location: 'Panoramic HPCA Cricket Stadium Dharamshala and thousand-year-old Kangra Fort',
    queries: ['Dharamshala Cricket Stadium', 'HPCA Stadium Dharamshala', 'Kangra Fort', 'McLeod Ganj Dharamshala']
  },
  {
    slug: 'kinnaur',
    location: 'Sacred Kinnaur Kailash peak and traditional wooden architecture of Sangla Valley Chitkul',
    queries: ['Chitkul Kinnaur Himachal', 'Sangla Valley Kinnaur', 'Kinnaur Kailash', 'Kalpa Kinnaur']
  },
  {
    slug: 'kullu',
    location: 'Picturesque alpine landscapes of Solang Valley and ancient woodcarved Naggar Castle',
    queries: ['Solang Valley Kullu', 'Naggar Castle Kullu', 'Rohtang Pass Kullu', 'Great Himalayan National Park']
  },
  {
    slug: 'lahaul-and-spiti',
    location: 'Perched 11th-Century Key Monastery (Ki Gompa) and azure high-altitude Chandratal Lake',
    queries: ['Key Monastery Spiti', 'Ki Gompa Spiti', 'Chandratal Lake Spiti', 'Dhankar Gompa Spiti']
  },
  {
    slug: 'mandi',
    location: 'Sacred waters of Rewalsar Lake and historic stone-carved Panchvaktra Temple in Mandi',
    queries: ['Rewalsar Lake Mandi', 'Panchvaktra Temple Mandi', 'Prashar Lake Mandi', 'Victoria Bridge Mandi']
  },
  {
    slug: 'shimla',
    location: 'Iconic neo-Gothic Christ Church at The Ridge and historic Viceregal Lodge in Shimla',
    queries: ['Christ Church Shimla Ridge', 'The Ridge Shimla', 'Viceregal Lodge Shimla', 'Mall Road Shimla']
  },
  {
    slug: 'sirmaur',
    location: 'Sprawling sacred waters of Renuka Lake and grand Shivalik heights of Sirmaur',
    queries: ['Renuka Lake Sirmaur', 'Renuka Lake Himachal', 'Churdhar Peak Sirmaur', 'Nahan Himachal']
  },
  {
    slug: 'solan',
    location: 'Spectacular Vedic architecture of Mohan Shakti Heritage Park and misty pine hills of Kasauli',
    queries: ['Mohan Shakti Heritage Park Solan', 'Kasauli Himachal', 'Christ Church Kasauli', 'Shoolini Temple Solan']
  },
  {
    slug: 'una',
    location: 'Revered Shaktipeeth Chintpurni Devi Temple and scenic Swan River valley in Una',
    queries: ['Chintpurni Temple Una', 'Chintpurni Devi Himachal', 'Una Himachal Pradesh', 'Kila Baba Bedi Ji Una']
  }
];

async function generate() {
  console.log('=== Curating Authentic Wikimedia Dataset for Himachal Pradesh (Phase 10) ===');
  const dataset = {
    state: {
      name: 'Himachal Pradesh',
      slug: 'himachal-pradesh',
      hero: null,
      card: null
    },
    districts: {}
  };

  // State Media
  console.log('Fetching HP State Media...');
  const heroCandidates = await searchCandidates('Chandratal Lake Spiti Himalayas panorama', 6);
  const heroCand2 = heroCandidates.length ? heroCandidates : await searchCandidates('Key Monastery Spiti valley landscape', 6);
  if (heroCand2.length > 0) {
    const bestHero = heroCand2.find(c => c.isLandscape && c.width >= 1200) || heroCand2[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Magnificent high-altitude vistas of Spiti Valley and snowcapped Himalayan peaks, Himachal Pradesh'
    };
    console.log(`State Hero found: ${bestHero.title}`);
  }

  const cardCandidates = await searchCandidates('Christ Church Shimla Ridge illuminated evening', 6);
  const cardCand2 = cardCandidates.length ? cardCandidates : await searchCandidates('Khajjiar Lake Chamba meadow', 6);
  if (cardCand2.length > 0) {
    const bestCard = cardCand2.find(c => c.isLandscape) || cardCand2[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'The Ridge and Christ Church against the pine-clad Himalayan hills, Shimla, Himachal Pradesh'
    };
    console.log(`State Card found: ${bestCard.title}`);
  }

  // Districts
  for (const item of HP_CONFIG) {
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
      const fallback = await searchCandidates(`${item.slug} Himachal Pradesh`, 6);
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

  const outPath = path.resolve('backend/src/services/images/verifiedHpDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));
  console.log(`Successfully saved dataset to ${outPath}`);
}

generate().catch(console.error);
