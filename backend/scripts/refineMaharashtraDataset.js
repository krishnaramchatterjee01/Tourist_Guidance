import fs from 'fs';
import path from 'path';

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function searchCandidates(query, limit = 8) {
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
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('naidu') || t.includes('dustbin') || t.includes('voter') || t.includes('seagull') || t.includes('gull')) continue;

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

async function refine() {
  const datasetPath = path.resolve('backend/src/services/images/verifiedMaharashtraDataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  // State Hero: Gateway of India
  console.log('Refining Maharashtra State Hero...');
  const heroCand = await searchCandidates('Gateway of India Mumbai harbor', 8);
  if (heroCand.length > 0) {
    const bestHero = heroCand.find(c => c.isLandscape && c.width >= 1200) || heroCand[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Iconic Indo-Saracenic Gateway of India monument standing proud on Mumbai Harbour, Maharashtra'
    };
    console.log(`Updated State Hero: ${dataset.state.hero.title}`);
  }

  // State Card: Kailasa Temple Ellora
  console.log('Refining Maharashtra State Card...');
  const cardCand = await searchCandidates('Kailasa temple Ellora Caves', 8);
  if (cardCand.length > 0) {
    const bestCard = cardCand.find(c => c.isLandscape) || cardCand[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'Monolithic rock-cut Kailasa Temple carved from basalt cliffs at Ellora Caves UNESCO World Heritage, Maharashtra'
    };
    console.log(`Updated State Card: ${dataset.state.card.title}`);
  }

  // Ahmednagar
  console.log('Refining Ahmednagar...');
  const ahmCand = await searchCandidates('Harishchandragad Konkan Kada Ahmednagar', 6);
  const ahmCand2 = ahmCand.length ? ahmCand : await searchCandidates('Ahmednagar Fort Maharashtra', 6);
  if (ahmCand2.length > 0) {
    dataset.districts['ahmednagar'].primary = {
      ...ahmCand2[0],
      locationDescription: 'Dramatic semicircular cliff edge of Konkan Kada at Harishchandragad, Ahmednagar'
    };
    if (ahmCand2[1]) {
      dataset.districts['ahmednagar'].backup = {
        ...ahmCand2[1],
        locationDescription: 'Historic stone fortifications of Ahmednagar Fort'
      };
    }
  }

  // Nandurbar
  console.log('Refining Nandurbar...');
  const nanCand = await searchCandidates('Toranmal hill station Nandurbar', 6);
  if (nanCand.length > 0) {
    dataset.districts['nandurbar'].primary = {
      ...nanCand[0],
      locationDescription: 'Serene mountain waters of Yashavant Lake at Toranmal hill station, Nandurbar'
    };
  }

  // Mumbai City backup
  console.log('Refining Mumbai City backup...');
  const mumCand = await searchCandidates('Marine Drive Mumbai Queens Necklace evening', 6);
  if (mumCand.length > 0) {
    dataset.districts['mumbai-city'].backup = {
      ...mumCand[0],
      locationDescription: 'Sweeping illuminated curve of Marine Drive Queen Necklace, Mumbai'
    };
  }

  // Raigad
  console.log('Refining Raigad...');
  const raiCand = await searchCandidates('Murud Janjira Sea Fort Raigad', 6);
  if (raiCand.length > 0) {
    if (dataset.districts['raigad'].backup) {
      dataset.districts['raigad'].primary = dataset.districts['raigad'].backup;
    }
    dataset.districts['raigad'].backup = {
      ...raiCand[0],
      locationDescription: 'Mighty oval island sea fortress of Murud-Janjira amidst Arabian Sea waves, Raigad'
    };
  }

  // Sangli
  console.log('Refining Sangli...');
  if (dataset.districts['sangli'].backup) {
    const ganpati = dataset.districts['sangli'].backup;
    dataset.districts['sangli'].primary = ganpati;
    dataset.districts['sangli'].primary.locationDescription = 'Historic black stone Sangli Ganpati Temple on Krishna River banks, Sangli';
  }

  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));
  console.log('Successfully saved refined Maharashtra dataset!');
}

refine().catch(console.error);
