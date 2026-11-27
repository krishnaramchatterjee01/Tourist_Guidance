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

const KARNATAKA_CONFIG = [
  {
    slug: 'bagalkote',
    location: 'Ancient 6th-Century sandstone rock-cut cave temples and Agastya Lake at Badami, Bagalkote',
    queries: ['Badami Cave Temples Bagalkote', 'Badami cave temple', 'Agastya Lake Badami', 'Pattadakal temple complex']
  },
  {
    slug: 'ballari',
    location: 'Colossal granite monolithic heights of Bellary Fort and Tungabhadra river valley, Ballari',
    queries: ['Bellary Fort Karnataka', 'Bellary Fort', 'Ballari Karnataka landscape']
  },
  {
    slug: 'belagavi',
    location: 'Roaring horseshoe cataracts of Gokak Falls and stone-carved Kamal Basti inside Belgaum Fort',
    queries: ['Gokak Falls Belagavi', 'Gokak Falls', 'Belgaum Fort Karnataka']
  },
  {
    slug: 'bengaluru-rural',
    location: 'Historic stone ramparts of Devanahalli Fort and rugged trekking monoliths of Makalidurga',
    queries: ['Devanahalli Fort Bangalore', 'Devanahalli Fort', 'Makalidurga Karnataka']
  },
  {
    slug: 'bengaluru-urban',
    location: 'Neo-Dravidian granite majesty of Vidhana Soudha and Tudor-style Bangalore Palace',
    queries: ['Vidhana Soudha Bangalore illuminated', 'Vidhana Soudha', 'Bangalore Palace', 'Lalbagh Glass House Bangalore']
  },
  {
    slug: 'bidar',
    location: 'Magnificent 15th-Century Bahmani Bidar Fort with turquoise tilework and Mahmud Gawan Madrasa',
    queries: ['Bidar Fort Karnataka', 'Mahmud Gawan Madrasa Bidar', 'Rangeen Mahal Bidar']
  },
  {
    slug: 'chamarajanagar',
    location: 'Prime tiger habitat of Bandipur National Park and misty heights of Biligirirangana Hills',
    queries: ['Bandipur National Park tiger', 'Bandipur National Park', 'BR Hills Chamarajanagar']
  },
  {
    slug: 'chikkaballapura',
    location: 'Enchanting sunrise above clouds at Nandi Hills and ancient 9th-Century Bhoga Nandeeshwara Temple',
    queries: ['Nandi Hills sunrise clouds', 'Nandi Hills Bangalore', 'Bhoga Nandeeshwara Temple']
  },
  {
    slug: 'chikkamagaluru',
    location: 'Lush misty coffee highlands and Karnataka highest summit at Mullayanagiri Peak, Chikkamagaluru',
    queries: ['Mullayanagiri Peak Chikkamagaluru', 'Mullayanagiri', 'Baba Budangiri Chikkamagaluru']
  },
  {
    slug: 'chitradurga',
    location: 'Impregnable 17th-Century Kallina Kote stone fortress with seven concentric battlements, Chitradurga',
    queries: ['Chitradurga Fort Karnataka', 'Chitradurga Fort', 'Kallina Kote Chitradurga']
  },
  {
    slug: 'dakshina-kannada',
    location: 'Historic coastal Mangaladevi Temple and pristine sunset shores of Panambur Beach, Mangalore',
    queries: ['Panambur Beach Mangalore sunset', 'Mangalore coastal beach', 'Mangaladevi Temple Mangalore']
  },
  {
    slug: 'davanagere',
    location: 'Historic stone architecture of Harihareshwara Temple and serene Kunduvada Lake, Davanagere',
    queries: ['Harihareshwara Temple Harihar', 'Kunduvada Kere Davanagere', 'Davanagere Karnataka']
  },
  {
    slug: 'dharwad',
    location: 'Ancient 11th-Century Western Chalukya Chandramouleshwara Temple and tranquil Unkal Lake, Hubli-Dharwad',
    queries: ['Chandramouleshwara Temple Hubli', 'Unkal Lake Hubli Dharwad', 'Dharwad Karnataka']
  },
  {
    slug: 'gadag',
    location: 'Exquisite Kalyani Chalukyan stone carving at Trikuteshwara Temple and stepwells of Lakkundi',
    queries: ['Trikuteshwara Temple Gadag', 'Lakkundi stepwell Gadag', 'Gadag temples Karnataka']
  },
  {
    slug: 'hassan',
    location: 'Masterpiece Hoysala filigree stone sculptures at Belur Chennakeshava and Halebidu temples',
    queries: ['Belur Chennakeshava Temple Hassan', 'Halebidu Hoysaleshwara Temple', 'Shravanabelagola Gommateshwara statue']
  },
  {
    slug: 'haveri',
    location: 'Magnificent Western Chalukya Tarakeshwara Temple at Hangal and Siddhesvara temple, Haveri',
    queries: ['Tarakeshwara Temple Hangal Haveri', 'Siddhesvara Temple Haveri', 'Haveri temple Karnataka']
  },
  {
    slug: 'kalaburagi',
    location: 'Grand 14th-Century Gulbarga Fort with colossal arched Jama Masjid and Khwaja Bande Nawaz Dargah',
    queries: ['Gulbarga Fort Kalaburagi', 'Jama Masjid Gulbarga', 'Khwaja Bande Nawaz Dargah Gulbarga']
  },
  {
    slug: 'kodagu',
    location: 'Lush Western Ghats coffee estates, roaring Abbey Falls and sunset panoramic vistas at Raja Seat Coorg',
    queries: ['Raja\'s Seat Madikeri Coorg', 'Abbey Falls Coorg', 'Talakaveri Coorg', 'Coorg landscape']
  },
  {
    slug: 'kolar',
    location: 'Historic gold-mining heritage landscapes of Kolar Gold Fields and Dravidian Someshwara Temple',
    queries: ['Someshwara Temple Kolar', 'Anthargange Kolar', 'Kolar Gold Fields Karnataka']
  },
  {
    slug: 'koppal',
    location: 'Prehistoric Kishkindha boulder hills of Anegundi and grand 12th-Century Mahadeva Temple Itagi',
    queries: ['Anegundi Koppal Tungabhadra', 'Mahadeva Temple Itagi Koppal', 'Koppal fort Karnataka']
  },
  {
    slug: 'mandya',
    location: 'Spectacular twin cataracts of Gaganachukki Shivanasamudra Falls on Kaveri River and Srirangapatna',
    queries: ['Shivanasamudra Falls Mandya', 'Gaganachukki Falls', 'Ranganathittu Bird Sanctuary', 'Srirangapatna fort']
  },
  {
    slug: 'mysuru',
    location: 'Indo-Saracenic royal Amba Vilas Mysore Palace illuminated by thousands of golden lights, Mysuru',
    queries: ['Mysore Palace illuminated night', 'Mysore Palace Karnataka', 'Chamundi Hill Mysore', 'Brindavan Gardens Mysore']
  },
  {
    slug: 'raichur',
    location: 'Historic hill fortress of Raichur Fort overlooking Krishna and Tungabhadra river plains',
    queries: ['Raichur Fort Karnataka', 'Raichur Karnataka', 'Raichur landscape']
  },
  {
    slug: 'ramanagara',
    location: 'Iconic granite monoliths of Ramadevara Betta sanctuary, famous setting of classic Indian cinema',
    queries: ['Ramadevara Betta Ramanagara', 'Ramanagara hills', 'Ramanagara boulders Karnataka']
  },
  {
    slug: 'shivamogga',
    location: 'Untamed plunging waters of Jog Falls over Sharavathi gorge and misty rainforest canopy of Agumbe',
    queries: ['Jog Falls Shivamogga', 'Jog Falls Karnataka', 'Agumbe sunset Western Ghats']
  },
  {
    slug: 'tumakuru',
    location: 'Sacred hilltop yoga shrines of Devarayanadurga and natural rock fountain of Namada Chilume',
    queries: ['Devarayanadurga Tumakuru', 'Namada Chilume Tumakuru', 'Tumkur Karnataka']
  },
  {
    slug: 'udupi',
    location: 'Sacred Krishna Matha car street and unique volcanic hexagonal basalt pillars of St Mary Island, Udupi',
    queries: ['St Mary\'s Island Udupi basalt', 'Malpe Beach Udupi', 'Udupi Krishna Temple']
  },
  {
    slug: 'uttara-kannada',
    location: 'Giant 123-foot Shiva statue towering over Arabian Sea at Murudeshwar and pristine Om Beach Gokarna',
    queries: ['Murudeshwara Temple Shiva statue', 'Om Beach Gokarna', 'Yana Rocks Uttara Kannada']
  },
  {
    slug: 'vijayanagara',
    location: 'UNESCO World Heritage Vittala Temple stone chariot and Virupaksha Temple on Tungabhadra, Hampi',
    queries: ['Stone Chariot Hampi Vijayanagara', 'Virupaksha Temple Hampi', 'Hampi ruins Karnataka']
  },
  {
    slug: 'vijayapura',
    location: 'Acoustic marvel Gol Gumbaz with world second-largest dome and Ibrahim Rauza at Vijayapura',
    queries: ['Gol Gumbaz Vijayapura Bijapur', 'Gol Gumbaz dome', 'Ibrahim Rauza Bijapur']
  },
  {
    slug: 'yadgir',
    location: 'Massive monolithic hilltop fortifications of Yadgir Fort and Sleeping Buddha hill range',
    queries: ['Yadgir Fort Karnataka', 'Yadgir hill fort', 'Yadgir Karnataka']
  }
];

async function generate() {
  console.log('=== Curating Authentic Wikimedia Dataset for Karnataka (Phase 12) ===');
  const dataset = {
    state: {
      name: 'Karnataka',
      slug: 'karnataka',
      hero: null,
      card: null
    },
    districts: {}
  };

  // State Media
  console.log('Fetching Karnataka State Media...');
  const heroCandidates = await searchCandidates('Stone Chariot Hampi Vijayanagara sunset panorama', 6);
  const heroCand2 = heroCandidates.length ? heroCandidates : await searchCandidates('Stone Chariot Hampi Karnataka', 6);
  if (heroCand2.length > 0) {
    const bestHero = heroCand2.find(c => c.isLandscape && c.width >= 1200) || heroCand2[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Iconic 16th-Century stone chariot at Vittala Temple, Hampi UNESCO World Heritage, Karnataka'
    };
    console.log(`State Hero found: ${bestHero.title}`);
  }

  const cardCandidates = await searchCandidates('Mysore Palace illuminated night Amba Vilas', 6);
  const cardCand2 = cardCandidates.length ? cardCandidates : await searchCandidates('Mysore Palace Karnataka illuminated', 6);
  if (cardCand2.length > 0) {
    const bestCard = cardCand2.find(c => c.isLandscape) || cardCand2[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'Splendid Amba Vilas Mysore Palace illuminated with nearly 100,000 royal incandescent lamps, Karnataka'
    };
    console.log(`State Card found: ${bestCard.title}`);
  }

  // Districts
  for (const item of KARNATAKA_CONFIG) {
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
      const fallback = await searchCandidates(`${item.slug} Karnataka`, 6);
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

  const outPath = path.resolve('backend/src/services/images/verifiedKarnatakaDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));
  console.log(`Successfully saved dataset to ${outPath}`);
}

generate().catch(console.error);
