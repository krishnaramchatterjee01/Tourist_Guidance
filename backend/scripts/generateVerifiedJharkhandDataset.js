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

const JHARKHAND_CONFIG = [
  {
    slug: 'bokaro',
    location: 'Scenic Garga Dam and lush landscaped greenways of Bokaro Steel City',
    queries: ['Garga Dam Bokaro', 'Bokaro Steel City park', 'Bokaro Jharkhand']
  },
  {
    slug: 'chatra',
    location: 'Ancient 9th-Century Ma Bhadrakali Temple complex at Itkhori, Chatra',
    queries: ['Bhadrakali temple Itkhori Chatra', 'Itkhori Chatra', 'Chatra Jharkhand']
  },
  {
    slug: 'deoghar',
    location: 'Sacred Baidyanath Jyotirlinga Dham temple complex and holy Shiva Ganga, Deoghar',
    queries: ['Baidyanath Temple Deoghar', 'Baidyanath Jyotirlinga', 'Deoghar temple Jharkhand']
  },
  {
    slug: 'dhanbad',
    location: 'Sprawling blue waters of Maithon Dam and Panchet reservoir on Damodar river',
    queries: ['Maithon Dam Dhanbad', 'Panchet Dam Dhanbad', 'Dhanbad lake Jharkhand']
  },
  {
    slug: 'dumka',
    location: 'Majestic Massanjore Canada Dam on Mayurakshi River and Basukinath Dham in Dumka',
    queries: ['Massanjore Dam Dumka', 'Canada Dam Dumka', 'Basukinath Dumka Jharkhand']
  },
  {
    slug: 'east-singhbhum',
    location: 'Serene Dimna Lake and lush Dalma Wildlife Sanctuary hills overlooking Jamshedpur',
    queries: ['Dimna Lake Jamshedpur', 'Dalma Wildlife Sanctuary', 'Jubilee Park Jamshedpur']
  },
  {
    slug: 'garhwa',
    location: 'Cascading Sukhaldari Waterfalls and ancient Nagar Untari Krishna temple in Garhwa',
    queries: ['Sukhaldari waterfall Garhwa', 'Garhwa Jharkhand', 'Garhwa waterfall']
  },
  {
    slug: 'giridih',
    location: 'Sacred Jain tirth Shikharji atop Parasnath Hill and scenic Khandoli Dam, Giridih',
    queries: ['Parasnath Hill Giridih', 'Shikharji Parasnath', 'Khandoli Dam Giridih']
  },
  {
    slug: 'godda',
    location: 'Sacred Maa Yogini Temple atop Barkope Hill and serene Sundar Dam in Godda',
    queries: ['Maa Yogini temple Godda', 'Sundar Dam Godda', 'Godda Jharkhand']
  },
  {
    slug: 'gumla',
    location: 'Historic Tanginath Dham archaeological ruins and sacred Anjan Dham birthplace in Gumla',
    queries: ['Tanginath temple Gumla', 'Tanginath Dham', 'Gumla Jharkhand']
  },
  {
    slug: 'hazaribagh',
    location: 'Scenic panoramic heights of Canary Hill and lush woodlands of Hazaribagh National Park',
    queries: ['Canary Hill Hazaribagh', 'Hazaribagh National Park', 'Hazaribagh lake']
  },
  {
    slug: 'jamtara',
    location: 'Lush greenery of Parwat Vihar and scenic Chotanagpur countryside in Jamtara',
    queries: ['Jamtara Jharkhand', 'Parwat Vihar Jamtara', 'Jamtara landscape']
  },
  {
    slug: 'khunti',
    location: 'Spectacular tiered cascades of Panchghagh Falls and Birsa Munda Memorial at Ulihatu',
    queries: ['Panchghagh Falls Khunti', 'Panchghagh Falls', 'Khunti Jharkhand']
  },
  {
    slug: 'koderma',
    location: 'Picturesque Tilaiya Dam on Barakar River and rolling hills of Koderma',
    queries: ['Tilaiya Dam Koderma', 'Tilaiya Dam Barakar', 'Koderma Jharkhand']
  },
  {
    slug: 'latehar',
    location: 'Breathtaking sunrise from Magnolia Point Netarhat and sal forests of Betla National Park',
    queries: ['Netarhat Magnolia Point Latehar', 'Netarhat sunrise', 'Betla National Park Latehar', 'Lodh Falls Latehar']
  },
  {
    slug: 'lohardaga',
    location: 'Picturesque bauxite plateaus of Bagru Hills and cascading Kekrang waterfalls in Lohardaga',
    queries: ['Lohardaga Jharkhand landscape', 'Lohardaga hills', 'Lohardaga waterfall']
  },
  {
    slug: 'pakur',
    location: 'Historic British-era Martello Tower and scenic rolling stone ridges of Pakur',
    queries: ['Martello Tower Pakur', 'Pakur Jharkhand', 'Pakur stone']
  },
  {
    slug: 'palamu',
    location: 'Historic twin stone forts of Chero kings in Palamu Tiger Reserve forests',
    queries: ['Palamu Fort Betla', 'Palamu Forts', 'Betla Fort Palamu']
  },
  {
    slug: 'ramgarh',
    location: 'Ancient Chhinnamasta Shaktipeeth Temple at the rocky river confluence of Rajrappa',
    queries: ['Rajrappa Temple Ramgarh', 'Chhinnamasta Temple Rajrappa', 'Rajrappa waterfall']
  },
  {
    slug: 'ranchi',
    location: 'Thundering Hundru Waterfalls on Subarnarekha River and 17th-Century Jagannath Temple Ranchi',
    queries: ['Hundru Falls Ranchi', 'Dassam Falls Ranchi', 'Jagannath Temple Ranchi', 'Jonha Falls Ranchi']
  },
  {
    slug: 'sahibganj',
    location: 'Cascading natural spring waters of Moti Jharna and historic Ganga ghats of Rajmahal',
    queries: ['Moti Jharna Sahibganj', 'Rajmahal hills Sahibganj', 'Sahibganj Jharkhand Ganga']
  },
  {
    slug: 'seraikela-kharsawan',
    location: 'Royal palace heritage of Seraikela Chhau and serene blue waters of Chandil Dam reservoir',
    queries: ['Chandil Dam Seraikela', 'Seraikela palace Jharkhand', 'Seraikela Kharsawan']
  },
  {
    slug: 'simdega',
    location: 'Tranquil scenic Kelaghagh Dam reservoir and sacred pilgrimage site of Ramrekha Dham',
    queries: ['Kelaghagh Dam Simdega', 'Ramrekha Dham Simdega', 'Simdega Jharkhand']
  },
  {
    slug: 'west-singhbhum',
    location: 'Vast virgin sal woodlands of Saranda Forest and scenic tiered cascades of Hirni Falls',
    queries: ['Saranda forest Jharkhand', 'Hirni Falls West Singhbhum', 'West Singhbhum landscape']
  }
];

async function generate() {
  console.log('=== Curating Authentic Wikimedia Dataset for Jharkhand (Phase 11) ===');
  const dataset = {
    state: {
      name: 'Jharkhand',
      slug: 'jharkhand',
      hero: null,
      card: null
    },
    districts: {}
  };

  // State Media
  console.log('Fetching Jharkhand State Media...');
  const heroCandidates = await searchCandidates('Hundru Falls Ranchi Subarnarekha River panorama', 6);
  const heroCand2 = heroCandidates.length ? heroCandidates : await searchCandidates('Netarhat sunset Latehar Jharkhand', 6);
  if (heroCand2.length > 0) {
    const bestHero = heroCand2.find(c => c.isLandscape && c.width >= 1200) || heroCand2[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Thundering cataracts of Hundru Falls plunging into the rocky chasm of Subarnarekha River, Jharkhand'
    };
    console.log(`State Hero found: ${bestHero.title}`);
  }

  const cardCandidates = await searchCandidates('Baidyanath Temple Deoghar Jharkhand illuminated', 6);
  const cardCand2 = cardCandidates.length ? cardCandidates : await searchCandidates('Dassam Falls Ranchi Jharkhand', 6);
  if (cardCand2.length > 0) {
    const bestCard = cardCand2.find(c => c.isLandscape) || cardCand2[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'Sacred Baidyanath Jyotirlinga Dham temple spires in holy Deoghar, Jharkhand'
    };
    console.log(`State Card found: ${bestCard.title}`);
  }

  // Districts
  for (const item of JHARKHAND_CONFIG) {
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
      const fallback = await searchCandidates(`${item.slug} Jharkhand`, 6);
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

  const outPath = path.resolve('backend/src/services/images/verifiedJharkhandDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));
  console.log(`Successfully saved dataset to ${outPath}`);
}

generate().catch(console.error);
