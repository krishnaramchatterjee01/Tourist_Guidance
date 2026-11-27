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
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('minister') || t.includes('inauguration') || t.includes('modi') || t.includes('goyal')) continue;

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
  const datasetPath = path.resolve('backend/src/services/images/verifiedJharkhandDataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  console.log('Refining Jharkhand State Media...');
  // State Hero: Hundru Falls
  const heroCand = await searchCandidates('Hundru Falls Ranchi', 8);
  if (heroCand.length > 0) {
    const bestHero = heroCand.find(c => c.isLandscape && c.width >= 1000) || heroCand[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Magnificent cataracts of Hundru Falls plunging 98 metres over Chotanagpur plateau, Ranchi, Jharkhand'
    };
    console.log(`Updated State Hero: ${dataset.state.hero.title}`);
  }

  // Refine Chatra
  console.log('Refining Chatra...');
  const chatraCand = await searchCandidates('Itkhori Chatra temple', 6);
  if (chatraCand.length > 0) {
    dataset.districts['chatra'].primary = {
      ...chatraCand[0],
      locationDescription: 'Ancient 9th-Century archaeological site and Maa Bhadrakali Temple complex at Itkhori, Chatra'
    };
    if (chatraCand[1]) {
      dataset.districts['chatra'].backup = {
        ...chatraCand[1],
        locationDescription: 'Stone-carved stupas and historical antiquities of Itkhori, Chatra'
      };
    }
  }

  // Refine Gumla
  console.log('Refining Gumla...');
  const gumlaCand = await searchCandidates('Tanginath Dham Gumla temple', 6);
  if (gumlaCand.length > 0) {
    dataset.districts['gumla'].primary = {
      ...gumlaCand[0],
      locationDescription: 'Mystical hill shrine of Tanginath Dham with ancient rusted iron tridents, Gumla'
    };
  }

  // Refine Khunti backup
  console.log('Refining Khunti...');
  const khuntiCand = await searchCandidates('Panchghagh waterfall Jharkhand', 6);
  if (khuntiCand.length > 1) {
    dataset.districts['khunti'].backup = {
      ...khuntiCand[1],
      locationDescription: 'Five cascading streams of Panchghagh Falls near Khunti'
    };
  }

  // Refine Koderma
  console.log('Refining Koderma...');
  const kodCand = await searchCandidates('Tilaiya Dam Jharkhand', 6);
  if (kodCand.length > 0) {
    dataset.districts['koderma'].primary = {
      ...kodCand[0],
      locationDescription: 'Sprawling reservoir of Tilaiya Dam on Barakar River, Koderma'
    };
  }

  // Refine Sahibganj backup
  console.log('Refining Sahibganj...');
  const sahCand = await searchCandidates('Rajmahal hills Jharkhand Ganga', 6);
  if (sahCand.length > 0) {
    dataset.districts['sahibganj'].backup = {
      ...sahCand[0],
      locationDescription: 'Rolling Rajmahal volcanic hills and riverfront vistas near Sahibganj'
    };
  }

  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));
  console.log('Successfully saved refined Jharkhand dataset!');
}

refine().catch(console.error);
