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

const MP_CONFIG = [
  { slug: 'agar-malwa', location: 'Historic Baijnath Mahadev Temple and tranquil waters of Moti Sagar Lake in Agar Malwa', queries: ['Baijnath Mahadev Temple Agar Malwa', 'Moti Sagar Lake Agar', 'Agar Malwa Madhya Pradesh'] },
  { slug: 'alirajpur', location: 'Scenic Narmada backwaters and vibrant tribal handicraft heritage of Alirajpur', queries: ['Alirajpur Madhya Pradesh', 'Kattiwada Alirajpur', 'Alirajpur landscape'] },
  { slug: 'anuppur', location: 'Sacred Narmada Udgam source and lush Maikal mountain forests of Amarkantak, Anuppur', queries: ['Narmada Udgam Amarkantak', 'Amarkantak temples', 'Amarkantak Anuppur'] },
  { slug: 'ashoknagar', location: 'Imposing hill battlements of Chanderi Fort and grand 15th-Century Koshak Mahal, Ashoknagar', queries: ['Chanderi Fort Ashoknagar', 'Koshak Mahal Chanderi', 'Chanderi Madhya Pradesh'] },
  { slug: 'balaghat', location: 'Dense sal canopies and tiger territory of Kanha National Park Mukki Range in Balaghat', queries: ['Kanha National Park Mukki Balaghat', 'Kanha Tiger Reserve Balaghat', 'Balaghat forest'] },
  { slug: 'barwani', location: 'Colossal 84-foot monolith rock-cut statue of Rishabhdev at Bawangaja in Satpura range, Barwani', queries: ['Bawangaja Barwani', 'Bawangaja Jain statue Barwani', 'Barwani Madhya Pradesh'] },
  { slug: 'betul', location: 'Picturesque waterfall and sacred Jain tirth complex of Muktagiri in Satpura hills, Betul', queries: ['Muktagiri Betul', 'Muktagiri Jain temple Betul', 'Betul Madhya Pradesh'] },
  { slug: 'bhind', location: 'Majestic 17th-Century Ater Fort overlooking the deep ravines of Chambal river in Bhind', queries: ['Ater Fort Bhind', 'Ater Fort Chambal', 'Bhind Madhya Pradesh'] },
  { slug: 'bhopal', location: 'Glassy expanse of Upper Lake (Bada Talab) and pink minarets of Taj-ul-Masajid, Bhopal', queries: ['Upper Lake Bhopal Bada Talab', 'Taj-ul-Masajid Bhopal', 'Bhopal lake Madhya Pradesh'] },
  { slug: 'burhanpur', location: 'Impregnable cliff-top Asirgarh Fort (Gateway to Deccan) and Shahi Qila on Tapti River, Burhanpur', queries: ['Asirgarh Fort Burhanpur', 'Shahi Qila Burhanpur', 'Burhanpur Madhya Pradesh'] },
  { slug: 'chhatarpur', location: 'UNESCO World Heritage western group of Khajuraho temples including Kandariya Mahadeva, Chhatarpur', queries: ['Kandariya Mahadeva Temple Khajuraho', 'Khajuraho temples Chhatarpur', 'Lakshmana Temple Khajuraho'] },
  { slug: 'chhindwara', location: 'Deep horseshoe chasm of Patalkot Valley and misty mountain ridge of Tamia, Chhindwara', queries: ['Patalkot Valley Chhindwara', 'Tamia Chhindwara', 'Chhindwara Madhya Pradesh'] },
  { slug: 'damoh', location: 'Exquisite 10th-Century Kalachuri stone architecture of Nohleshwar Shiva Temple at Nohta, Damoh', queries: ['Nohleshwar Temple Nohta Damoh', 'Damoh Madhya Pradesh', 'Singorgarh Fort Damoh'] },
  { slug: 'datia', location: 'Magnificent seven-storey stone-and-brick Govind Mahal (Bir Singh Palace) in Datia', queries: ['Govind Mahal Datia', 'Bir Singh Palace Datia', 'Datia Palace Madhya Pradesh'] },
  { slug: 'dewas', location: 'Sacred Chamunda Mata shrine atop the steep volcanic cone of Tekri Hill, Dewas', queries: ['Dewas Tekri Chamunda Mata', 'Dewas Tekri', 'Dewas Madhya Pradesh'] },
  { slug: 'dhar', location: 'Fairytale ship-like Jahaz Mahal and romantic Rani Roopmati Pavilion across Mandu plateau, Dhar', queries: ['Jahaz Mahal Mandu Dhar', 'Rani Roopmati Pavilion Mandu', 'Mandu Madhya Pradesh'] },
  { slug: 'dindori', location: 'Prehistoric plant fossils dating back 65 million years at Ghughua Fossil National Park, Dindori', queries: ['Ghughua Fossil National Park Dindori', 'Dindori Madhya Pradesh', 'Dindori Narmada'] },
  { slug: 'guna', location: 'Ancient ruined battlements and scenic water reservoirs of Bajrangarh Fort, Guna', queries: ['Bajrangarh Fort Guna', 'Guna Madhya Pradesh fort', 'Guna landscape'] },
  { slug: 'gwalior', location: 'Legendary turquoise-tiled Man Singh Palace atop towering sandstone cliffs of Gwalior Fort', queries: ['Gwalior Fort Man Singh Palace', 'Gwalior Fort Madhya Pradesh', 'Saas Bahu Temple Gwalior'] },
  { slug: 'harda', location: 'Historic riverside Narmada bathing ghats and stone temples of Handia, Harda', queries: ['Handia Narmada Harda', 'Harda Madhya Pradesh', 'Harda Narmada'] },
  { slug: 'indore', location: 'Grand seven-storey Holkar dynasty Rajwada Palace and French-chateau Lal Bagh Palace, Indore', queries: ['Rajwada Palace Indore', 'Lal Bagh Palace Indore', 'Indore palace Madhya Pradesh'] },
  { slug: 'jabalpur', location: 'Soaring 100-foot gleaming white Marble Rocks of Bhedaghat on turquoise Narmada river, Jabalpur', queries: ['Bhedaghat Marble Rocks Jabalpur Narmada', 'Dhuandhar Falls Jabalpur', 'Marble Rocks Jabalpur'] },
  { slug: 'jhabua', location: 'Ancient natural spring waters of Deojhiri Shiva temple and vibrant Bhil tribal heritage, Jhabua', queries: ['Deojhiri Jhabua', 'Jhabua Madhya Pradesh', 'Jhabua landscape'] },
  { slug: 'katni', location: 'Stone carvings of Vijayraghavgarh Fort and ancient heritage sites of Katni', queries: ['Vijayraghavgarh Fort Katni', 'Katni Madhya Pradesh', 'Katni temple'] },
  { slug: 'khandwa', location: 'Sacred island of Omkareshwar Jyotirlinga shaped like the holy symbol Om on Narmada River', queries: ['Omkareshwar Jyotirlinga Khandwa Narmada', 'Omkareshwar temple', 'Khandwa Madhya Pradesh'] },
  { slug: 'khargone', location: 'Majestic 18th-Century Ahilya Fort ramparts and stepped stone ghats on holy Narmada River at Maheshwar', queries: ['Maheshwar Ahilya Fort Khargone Narmada', 'Maheshwar ghats', 'Maheshwar Fort Madhya Pradesh'] },
  { slug: 'maihar', location: 'Revered Maa Sharda Shaktipeeth Temple atop the sacred Trikuta hill reached by 1063 steps, Maihar', queries: ['Maa Sharda Temple Maihar', 'Maihar temple Madhya Pradesh', 'Maihar hill'] },
  { slug: 'mandla', location: 'Scenic sal glades of Kanha National Park and historic 17th-Century Gond kings fort at Mandla', queries: ['Kanha National Park Mandla', 'Mandla Fort Narmada', 'Mandla Madhya Pradesh'] },
  { slug: 'mandsaur', location: 'Rare eight-faced monolithic Shivlinga at Pashupatinath Temple on the banks of Shivna River, Mandsaur', queries: ['Pashupatinath Temple Mandsaur', 'Mandsaur Fort', 'Mandsaur Madhya Pradesh'] },
  { slug: 'mauganj', location: 'Scenic roaring waterfalls of Rewa plateau and historic Mauganj fort heritage', queries: ['Mauganj Madhya Pradesh', 'Mauganj waterfall', 'Mauganj landscape'] },
  { slug: 'morena', location: 'Circular hypaethral stone shrine of 64 Yoginis at Mitawali and Bateshwar temple complex, Morena', queries: ['Chausath Yogini Temple Mitawali Morena', 'Bateshwar Temples Morena', 'Mitawali temple Morena'] },
  { slug: 'narmadapuram', location: 'Pachmarhi Queen of Satpura with panoramic sunset vistas at Dhoopgarh and Bee Falls, Narmadapuram', queries: ['Dhoopgarh Pachmarhi sunset', 'Bee Falls Pachmarhi', 'Pachmarhi hill station'] },
  { slug: 'narsinghpur', location: 'Holy Bramhan Ghat on Narmada River and historic Chauragadh Fort ramparts, Narsinghpur', queries: ['Bramhan Ghat Narsinghpur', 'Narsinghpur Madhya Pradesh', 'Chauragadh Fort'] },
  { slug: 'neemuch', location: 'Cascading natural rock amphitheatre waterfall of Sukhanand Dham and Gandhi Sagar reservoir, Neemuch', queries: ['Sukhanand Neemuch', 'Gandhi Sagar Neemuch', 'Neemuch Madhya Pradesh'] },
  { slug: 'niwari', location: 'Majestic 16th-Century Jehangir Mahal and royal cenotaphs on Betwa River at medieval Orchha, Niwari', queries: ['Jehangir Mahal Orchha Niwari', 'Orchha chhatris Betwa river', 'Ram Raja Temple Orchha'] },
  { slug: 'pandhurna', location: 'Rolling orange orchards and scenic banks of Jam River in Pandhurna', queries: ['Pandhurna Madhya Pradesh', 'Pandhurna landscape', 'Jam River Pandhurna'] },
  { slug: 'panna', location: 'Verdant gorges of Ken River canyon and emerald waters of Pandav Falls in Panna National Park', queries: ['Ken River Panna National Park', 'Pandav Falls Panna', 'Panna Tiger Reserve'] },
  { slug: 'raisen', location: 'World-famous 3rd-Century BC Great Stupa of Sanchi and prehistoric Bhimbetka Rock Shelters, Raisen', queries: ['Great Stupa Sanchi Raisen UNESCO', 'Sanchi Stupa Madhya Pradesh', 'Bhimbetka rock shelters'] },
  { slug: 'rajgarh', location: 'Picturesque white palace of Narsinghgarh Fort overlooking Chidikho lake wildlife sanctuary, Rajgarh', queries: ['Narsinghgarh Fort Rajgarh', 'Chidikho Lake Narsinghgarh', 'Rajgarh Madhya Pradesh'] },
  { slug: 'ratlam', location: 'Ancient rock-cut caves of Kedareshwar Temple and historic cactus gardens of Sailana, Ratlam', queries: ['Kedareshwar temple Ratlam', 'Sailana Ratlam', 'Ratlam Madhya Pradesh'] },
  { slug: 'rewa', location: 'Spectacular 430-foot plunge of Keoti Falls and historic Govindgarh Palace in Rewa', queries: ['Keoti Falls Rewa', 'Chachai Falls Rewa', 'Rewa Madhya Pradesh'] },
  { slug: 'sagar', location: 'Impressive stone ramparts of Rahatgarh Fort and tumbling Bina River waterfalls in Sagar', queries: ['Rahatgarh waterfall Sagar', 'Rahatgarh Fort', 'Lakha Banjara Lake Sagar'] },
  { slug: 'satna', location: 'Sacred Mandakini River ghats at Ramghat and underground stream of Gupt Godavari in Chitrakoot, Satna', queries: ['Ramghat Chitrakoot Satna Mandakini', 'Gupt Godavari Chitrakoot', 'Chitrakoot Satna'] },
  { slug: 'sehore', location: 'Historic British-built All Saints Church and ancient Ganesh Mandir in Sehore', queries: ['All Saints Church Sehore', 'Sehore Madhya Pradesh', 'Sehore landscape'] },
  { slug: 'seoni', location: 'Pristine teak forests of Pench Tiger Reserve, the legendary setting of The Jungle Book, Seoni', queries: ['Pench Tiger Reserve Seoni', 'Pench National Park Madhya Pradesh', 'Seoni forest'] },
  { slug: 'shahdol', location: 'Ancient 10th-Century Kalachuri stone carvings of Virat Temple at Sohagpur, Shahdol', queries: ['Virat Temple Sohagpur Shahdol', 'Bansagar Dam Shahdol', 'Shahdol Madhya Pradesh'] },
  { slug: 'shajapur', location: 'Historic riverside cenotaphs and scenic agricultural landscapes of Shajapur', queries: ['Shajapur Madhya Pradesh', 'Shajapur landscape', 'Shajapur fort'] },
  { slug: 'sheopur', location: 'Sprawling savannah grasslands of Kuno National Park and historic ramparts of Sheopur Fort', queries: ['Kuno National Park Sheopur', 'Sheopur Fort Madhya Pradesh', 'Kuno river Sheopur'] },
  { slug: 'shivpuri', location: 'Victorian George Castle overlooking Sakhya Sagar lake in Madhav National Park, Shivpuri', queries: ['George Castle Madhav National Park Shivpuri', 'Shivpuri Chhatris', 'Madhav National Park'] },
  { slug: 'sidhi', location: 'Lush sal woodlands and Banas river gorges of Sanjay National Park in Sidhi', queries: ['Sanjay National Park Sidhi', 'Sidhi Madhya Pradesh', 'Parsili Sidhi'] },
  { slug: 'singrauli', location: 'Ancient 7th-Century rock-cut Mada Caves and expansive Govind Ballabh Pant Sagar in Singrauli', queries: ['Mada Caves Singrauli', 'Rihand Dam Singrauli', 'Singrauli Madhya Pradesh'] },
  { slug: 'tikamgarh', location: 'Historic moated stone fortress of Garh Kundar and riverside Kundeshwar Mahadev Temple, Tikamgarh', queries: ['Garh Kundar Fort Tikamgarh', 'Kundeshwar temple Tikamgarh', 'Tikamgarh Madhya Pradesh'] },
  { slug: 'ujjain', location: 'Sacred Mahakaleshwar Jyotirlinga and evening Aarti on the holy Shipra River ghats, Ujjain', queries: ['Mahakaleshwar Temple Ujjain illuminated', 'Ram Ghat Shipra River Ujjain', 'Mahakaleshwar Jyotirlinga'] },
  { slug: 'umaria', location: 'Majestic cliffs of Bandhavgarh Fort and prime tiger habitat in Bandhavgarh National Park, Umaria', queries: ['Bandhavgarh National Park Umaria', 'Bandhavgarh Fort', 'Bandhavgarh tiger reserve'] },
  { slug: 'vidisha', location: 'Colossal 5th-Century Gupta rock-cut Varaha sculpture at Udayagiri Caves and Heliodorus Pillar, Vidisha', queries: ['Udayagiri Caves Vidisha Varaha', 'Udayagiri Caves Madhya Pradesh', 'Heliodorus Pillar Vidisha'] }
];

async function generate() {
  console.log('=== Curating Authentic Wikimedia Dataset for Madhya Pradesh (Phase 14) ===');
  const dataset = {
    state: {
      name: 'Madhya Pradesh',
      slug: 'madhya-pradesh',
      hero: null,
      card: null
    },
    districts: {}
  };

  // State Media
  console.log('Fetching MP State Media...');
  const heroCandidates = await searchCandidates('Kandariya Mahadeva Temple Khajuraho sunset panorama', 6);
  const heroCand2 = heroCandidates.length ? heroCandidates : await searchCandidates('Bhedaghat Marble Rocks Jabalpur Narmada river', 6);
  if (heroCand2.length > 0) {
    const bestHero = heroCand2.find(c => c.isLandscape && c.width >= 1200) || heroCand2[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Towering sandstone shikhara of Kandariya Mahadeva Temple against dramatic skies, Khajuraho UNESCO World Heritage, Madhya Pradesh'
    };
    console.log(`State Hero found: ${bestHero.title}`);
  }

  const cardCandidates = await searchCandidates('Great Stupa Sanchi Raisen UNESCO illuminated', 6);
  const cardCand2 = cardCandidates.length ? cardCandidates : await searchCandidates('Sanchi Stupa Madhya Pradesh Torana gate', 6);
  if (cardCand2.length > 0) {
    const bestCard = cardCand2.find(c => c.isLandscape) || cardCand2[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'Ancient 3rd-Century BCE Buddhist Great Stupa and carved Torana gateways at Sanchi, Madhya Pradesh'
    };
    console.log(`State Card found: ${bestCard.title}`);
  }

  // Districts
  for (const item of MP_CONFIG) {
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
      const fallback = await searchCandidates(`${item.slug} Madhya Pradesh`, 6);
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

  const outPath = path.resolve('backend/src/services/images/verifiedMpDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));
  console.log(`Successfully saved dataset to ${outPath}`);
}

generate().catch(console.error);
