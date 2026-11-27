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
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('vidhan') || t.includes('constituenc') || t.includes('lok_sabha')) continue;

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

const MAHARASHTRA_CONFIG = [
  { slug: 'ahmednagar', location: 'Sacred pilgrimage shrine of Shirdi Sai Baba and impregnable Ahmednagar Fort', queries: ['Shirdi Sai Baba Temple Ahmednagar', 'Ahmednagar Fort Maharashtra', 'Harishchandragad Konkan Kada'] },
  { slug: 'akola', location: 'Historic hilltop bastions of Narnala Fort in Satpura ranges and Asadgad Fort Akola', queries: ['Narnala Fort Akola', 'Akola Fort Maharashtra', 'Narnala sanctuary'] },
  { slug: 'amravati', location: 'Misty green cliffs of Chikhaldara hill station and teak forests of Melghat Tiger Reserve, Amravati', queries: ['Chikhaldara hill station Amravati', 'Melghat Tiger Reserve Amravati', 'Chikhaldara Maharashtra'] },
  { slug: 'beed', location: 'Sacred Parli Vaijnath Jyotirlinga Temple and historic Kankaleshwar water temple, Beed', queries: ['Parli Vaijnath Temple Beed', 'Kankaleshwar Temple Beed', 'Beed Maharashtra'] },
  { slug: 'bhandara', location: 'Tranquil wetlands of Koka Wildlife Sanctuary and grand Gosekhurd Dam on Wainganga River, Bhandara', queries: ['Koka Wildlife Sanctuary Bhandara', 'Gosekhurd Dam Wainganga', 'Bhandara Maharashtra'] },
  { slug: 'buldhana', location: 'World-famous mysterious saline and alkaline waters of Lonar Meteorite Crater Lake, Buldhana', queries: ['Lonar Crater Lake Buldhana Maharashtra', 'Lonar crater', 'Lonar lake temple'] },
  { slug: 'chandrapur', location: 'Thriving royal Bengal tiger habitat of Tadoba Andhari Tiger Reserve forests, Chandrapur', queries: ['Tadoba National Park tiger Chandrapur', 'Tadoba Andhari Tiger Reserve', 'Chandrapur fort'] },
  { slug: 'chhatrapati-sambhajinagar', location: 'Rock-cut monolith masterpiece Kailasa Temple at Ellora Caves and Bibi Ka Maqbara, Sambhajinagar', queries: ['Kailasa Temple Ellora Caves Aurangabad', 'Bibi Ka Maqbara Aurangabad', 'Daulatabad Fort Maharashtra'] },
  { slug: 'dharashiv', location: 'Ancient 6th-Century rock-cut Dharashiv Caves and revered Tulja Bhavani Shaktipeeth Temple', queries: ['Tuljabhavani Temple Tuljapur Dharashiv', 'Dharashiv Caves Osmanabad', 'Naldurg Fort Maharashtra'] },
  { slug: 'dhule', location: 'Historic medieval hilltop fortifications of Laling Fort and Bhamer Fort in Dhule', queries: ['Laling Fort Dhule', 'Songir Fort Dhule', 'Dhule Maharashtra landscape'] },
  { slug: 'gadchiroli', location: 'Exquisite 11th-Century stone-carved Hemadpanthi temples of Markanda on holy Wainganga River, Gadchiroli', queries: ['Markanda Temple Gadchiroli', 'Markandeshwar Temple Wainganga', 'Gadchiroli forest'] },
  { slug: 'gondia', location: 'Pristine lake waters and sal woodlands of Navegaon National Park and Nagzira wildlife sanctuary, Gondia', queries: ['Navegaon National Park Gondia', 'Nagzira Wildlife Sanctuary Gondia', 'Gondia Maharashtra'] },
  { slug: 'hingoli', location: 'Sacred 8th Jyotirlinga shrine of Aundha Nagnath with intricate stone carvings, Hingoli', queries: ['Aundha Nagnath Jyotirlinga Hingoli', 'Aundha Nagnath Temple', 'Hingoli Maharashtra'] },
  { slug: 'jalgaon', location: 'Gateway to world-heritage Ajanta Caves gorge and sacred Padmalaya Ganpati shrines, Jalgaon', queries: ['Ajanta Caves entrance gorge', 'Mehrun Lake Jalgaon', 'Padmalaya Jalgaon'] },
  { slug: 'jalna', location: 'Historic hilltop fort and sacred Matsyodari Devi Temple surrounded by Deccan plateau, Jalna', queries: ['Matsyodari Devi Temple Jalna', 'Jalna Fort Maharashtra', 'Jalna Maharashtra'] },
  { slug: 'kolhapur', location: 'Sacred 7th-Century Mahalakshmi (Ambadi) Temple and historic hilltop ramparts of Panhala Fort, Kolhapur', queries: ['Mahalakshmi Temple Kolhapur', 'Panhala Fort Kolhapur', 'Rankala Lake Kolhapur', 'New Palace Kolhapur'] },
  { slug: 'latur', location: 'Impressive 60-foot deep water trench of Udgir Fort and ancient Siddheshwar Temple in Latur', queries: ['Udgir Fort Latur', 'Ausa Fort Latur', 'Latur Maharashtra'] },
  { slug: 'mumbai-city', location: 'Colonial basalt arch of Gateway of India overlooking Mumbai Harbour and Marine Drive curve', queries: ['Gateway of India Mumbai sunset', 'Marine Drive Mumbai Queen Necklace', 'Chhatrapati Shivaji Maharaj Terminus illuminated'] },
  { slug: 'mumbai-suburban', location: 'Ancient 1st-Century BC Buddhist Kanheri Caves nestled inside Sanjay Gandhi National Park, Mumbai', queries: ['Kanheri Caves Sanjay Gandhi National Park', 'Bandra-Worli Sea Link Mumbai sunset', 'Juhu Beach Mumbai'] },
  { slug: 'nagpur', location: 'Grand hemispherical dome of Deekshabhoomi and illuminated evening waters of Futala Lake, Nagpur', queries: ['Deekshabhoomi Nagpur illuminated', 'Futala Lake Nagpur', 'Sitabuldi Fort Nagpur'] },
  { slug: 'nanded', location: 'Gleaming white marble towers of Hazur Sahib Sachkhand Gurdwara on holy Godavari riverbanks, Nanded', queries: ['Hazur Sahib Nanded Gurudwara illuminated', 'Nanded Fort Godavari', 'Hazur Sahib Sachkhand'] },
  { slug: 'nandurbar', location: 'Misty plateau lake of Toranmal hill station and deep rocky abyss of Sita Khai, Nandurbar', queries: ['Toranmal hill station Nandurbar', 'Yashavant Lake Toranmal', 'Nandurbar Maharashtra'] },
  { slug: 'nashik', location: 'Sacred Trimbakeshwar Jyotirlinga at the base of Brahmagiri Mountain and holy Godavari Ramkund, Nashik', queries: ['Trimbakeshwar Temple Nashik Brahmagiri', 'Ramkund Godavari Nashik', 'Pandavleni Caves Nashik'] },
  { slug: 'palghar', location: 'Picturesque sea-encircled bastion walls of Arnala Fort and golden sunset sands of Kelva Beach, Palghar', queries: ['Arnala Fort Palghar sea', 'Kelva Beach Palghar', 'Dahanu beach Maharashtra'] },
  { slug: 'parbhani', location: 'Sacred riverfront shrine of Mudgaleshwar Temple on Godavari and historic Hazrat Turabul Haq Dargah, Parbhani', queries: ['Mudgaleshwar Temple Parbhani', 'Turabul Haq Dargah Parbhani', 'Parbhani Maharashtra'] },
  { slug: 'pune', location: 'Historic Maratha bastion of Shaniwar Wada, Sinhagad Fort heights and Italianate Aga Khan Palace, Pune', queries: ['Shaniwar Wada Pune facade', 'Sinhagad Fort Pune', 'Aga Khan Palace Pune'] },
  { slug: 'raigad', location: 'Impregnable capital fortress of Chhatrapati Shivaji Maharaj atop Raigad Hill and Murud Janjira Sea Fort', queries: ['Raigad Fort Maharashtra Chhatrapati Shivaji', 'Murud Janjira Sea Fort Raigad', 'Raigad Fort ropeway'] },
  { slug: 'ratnagiri', location: 'Scenic Konkan coastal shrine of Ganpatipule Temple on pristine sands and historic Jaigad Fort, Ratnagiri', queries: ['Ganpatipule Beach Temple Ratnagiri', 'Jaigad Fort Ratnagiri', 'Ratnadurg Fort Konkan'] },
  { slug: 'sangli', location: 'Historic riverside black stone Sangli Ganpati Temple on Krishna River and Sagareshwar Sanctuary', queries: ['Sangli Ganpati Temple Krishna river', 'Sagareshwar Sanctuary Sangli', 'Sangli Maharashtra'] },
  { slug: 'satara', location: 'UNESCO World Heritage Kaas Plateau Valley of Flowers and roaring 500-foot Thoseghar Waterfalls, Satara', queries: ['Kaas Plateau Valley of Flowers Satara', 'Thoseghar Falls Satara', 'Pratapgad Fort Satara'] },
  { slug: 'sindhudurg', location: 'Mighty 17th-Century Shivaji sea fortress of Sindhudurg Fort amidst Arabian Sea waves, Malvan', queries: ['Sindhudurg Fort Malvan sea', 'Tarkarli Beach Sindhudurg', 'Vijaydurg Fort Konkan'] },
  { slug: 'solapur', location: 'Sacred Siddheshwar Temple nestled inside lake and massive stone battlements of Solapur Fort', queries: ['Siddheshwar Temple Solapur lake', 'Solapur Fort Maharashtra', 'Great Indian Bustard Sanctuary Nannaj'] },
  { slug: 'thane', location: 'Picturesque palm-fringed shoreline of Upvan Lake against Yeoor Hills in Thane City', queries: ['Upvan Lake Thane Yeoor hills', 'Yeoor Hills Thane', 'Ghodbunder Fort Thane'] },
  { slug: 'wardha', location: 'Historic peaceful cottage of Bapu Kuti at Sevagram Ashram and pristine white Vishwa Shanti Stupa, Wardha', queries: ['Sevagram Ashram Wardha Mahatma Gandhi', 'Vishwa Shanti Stupa Wardha', 'Pavnar Ashram Wardha'] },
  { slug: 'washim', location: 'Ancient sacred waters of Padma Teerth and revered 11th-Century Balaji Temple in Washim', queries: ['Padma Teerth Washim', 'Shirpur Jain temple Washim', 'Washim Maharashtra'] },
  { slug: 'yavatmal', location: 'Thriving dry deciduous teak forest corridors of Tipeshwar Wildlife Sanctuary in Yavatmal', queries: ['Tipeshwar Wildlife Sanctuary tiger Yavatmal', 'Tipeshwar Yavatmal', 'Yavatmal Maharashtra'] }
];

async function generate() {
  console.log('=== Curating Authentic Wikimedia Dataset for Maharashtra (Phase 15) ===');
  const dataset = {
    state: {
      name: 'Maharashtra',
      slug: 'maharashtra',
      hero: null,
      card: null
    },
    districts: {}
  };

  // State Media
  console.log('Fetching Maharashtra State Media...');
  const heroCandidates = await searchCandidates('Gateway of India Mumbai sunset panorama', 6);
  const heroCand2 = heroCandidates.length ? heroCandidates : await searchCandidates('Kailasa Temple Ellora Caves panorama', 6);
  if (heroCand2.length > 0) {
    const bestHero = heroCand2.find(c => c.isLandscape && c.width >= 1200) || heroCand2[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Iconic Indo-Saracenic Gateway of India monument standing proud on the Arabian Sea harbor, Mumbai, Maharashtra'
    };
    console.log(`State Hero found: ${bestHero.title}`);
  }

  const cardCandidates = await searchCandidates('Kailasa temple Ellora Caves UNESCO illuminated', 6);
  const cardCand2 = cardCandidates.length ? cardCandidates : await searchCandidates('Raigad Fort Maharashtra aerial', 6);
  if (cardCand2.length > 0) {
    const bestCard = cardCand2.find(c => c.isLandscape) || cardCand2[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'Magnificent rock-cut Kailasa Temple carved from a single basalt cliff at Ellora Caves UNESCO World Heritage, Maharashtra'
    };
    console.log(`State Card found: ${bestCard.title}`);
  }

  // Districts
  for (const item of MAHARASHTRA_CONFIG) {
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
      const fallback = await searchCandidates(`${item.slug} Maharashtra`, 6);
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

  const outPath = path.resolve('backend/src/services/images/verifiedMaharashtraDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));
  console.log(`Successfully saved dataset to ${outPath}`);
}

generate().catch(console.error);
