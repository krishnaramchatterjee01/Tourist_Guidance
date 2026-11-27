import fs from 'fs';
import path from 'path';

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
    return null;
  }
}

async function searchCandidates(query, limit = 8) {
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
      const t = page.title.toLowerCase();
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('coat_of_arms')) continue;

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
  const datasetPath = path.resolve('backend/src/services/images/verifiedHaryanaDataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  console.log('Refining State Media...');
  // Haryana State Hero: Brahma Sarovar or Kurukshetra panorama
  const heroCand = await searchCandidates('Brahma Sarovar Kurukshetra', 8);
  if (heroCand.length > 0) {
    const bestHero = heroCand.find(c => c.isLandscape && c.width >= 1200) || heroCand[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Sacred waters and expansive ghats of Brahma Sarovar, Kurukshetra, Haryana'
    };
    console.log(`Updated State Hero: ${dataset.state.hero.title}`);
  }

  // Fatehabad: Humayun Mosque or Fatehabad Fort / Pillar
  console.log('Refining Fatehabad...');
  const fatCand = await searchCandidates('Fatehabad pillar Humayun', 8);
  const fatCand2 = fatCand.length ? fatCand : await searchCandidates('Fatehabad Haryana', 8);
  const realFat = fatCand2.filter(c => !c.title.toLowerCase().includes('map') && !c.title.toLowerCase().includes('sikh'));
  if (realFat.length > 0) {
    dataset.districts['fatehabad'].primary = {
      ...realFat[0],
      locationDescription: 'Historic Lat of Ferozeshah and ancient Humayun Mosque at Fatehabad, Haryana'
    };
    if (realFat[1]) {
      dataset.districts['fatehabad'].backup = {
        ...realFat[1],
        locationDescription: 'Archaeological heritage and Ashokan pillar precincts in Fatehabad'
      };
    }
    console.log(`Updated Fatehabad primary: ${dataset.districts['fatehabad'].primary.title}`);
  }

  // Nuh: Kotla Mosque or Chui Mal or Aravalli Nalhar
  console.log('Refining Nuh...');
  const nuhCand = await searchCandidates('Kotla mosque Nuh Mewat', 8);
  const nuhCand2 = nuhCand.length ? nuhCand : await searchCandidates('Mewat Aravalli Haryana', 8);
  const realNuh = nuhCand2.filter(c => !c.title.toLowerCase().includes('law college') && !c.title.toLowerCase().includes('mr.'));
  if (realNuh.length > 0) {
    dataset.districts['nuh'].primary = {
      ...realNuh[0],
      locationDescription: 'Historic 14th-Century Kotla Mosque and tombs nestled against the Aravalli hills in Nuh'
    };
    if (realNuh[1]) {
      dataset.districts['nuh'].backup = {
        ...realNuh[1],
        locationDescription: 'Scenic Aravalli mountain pass and historic architecture of Mewat Nuh'
      };
    }
    console.log(`Updated Nuh primary: ${dataset.districts['nuh'].primary.title}`);
  }

  // Mahendragarh backup: Chor Gumbad Narnaul
  console.log('Refining Mahendragarh backup...');
  const mahCand = await searchCandidates('Chor Gumbad Narnaul', 6);
  if (mahCand.length > 0) {
    dataset.districts['mahendragarh'].backup = {
      ...mahCand[0],
      locationDescription: 'Iconic Chor Gumbad monument and medieval architecture of Narnaul, Mahendragarh'
    };
    console.log(`Updated Mahendragarh backup: ${mahCand[0].title}`);
  }

  // Rewari backup: Rewari Steam Locomotive
  console.log('Refining Rewari backup...');
  const rewCand = await searchCandidates('Rewari steam locomotive Fairy Queen', 6);
  if (rewCand.length > 0) {
    dataset.districts['rewari'].backup = {
      ...rewCand[0],
      locationDescription: 'World-famous preserved heritage steam locomotives at the Rewari Railway Heritage Museum'
    };
    console.log(`Updated Rewari backup: ${rewCand[0].title}`);
  }

  // Faridabad backup: Surajkund reservoir
  console.log('Refining Faridabad...');
  const fbdCand = await searchCandidates('Surajkund reservoir Faridabad amphitheatre', 6);
  if (fbdCand.length > 0) {
    dataset.districts['faridabad'].primary = {
      ...fbdCand[0],
      locationDescription: 'Ancient 10th-Century sun temple stepped amphitheatre reservoir at Surajkund, Faridabad'
    };
    console.log(`Updated Faridabad primary: ${fbdCand[0].title}`);
  }

  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));
  console.log('Successfully saved refined Haryana dataset!');
}

refine().catch(console.error);
