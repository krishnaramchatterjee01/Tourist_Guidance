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
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('soi') || t.includes('khan') || t.includes('baite') || t.includes('mp') || t.includes('inaugurating')) continue;

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
  const datasetPath = path.resolve('backend/src/services/images/verifiedManipurDataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  // State Hero: Loktak Lake
  console.log('Refining Manipur State Hero...');
  const heroCand = await searchCandidates('Loktak Lake Manipur', 8);
  if (heroCand.length > 0) {
    const bestHero = heroCand.find(c => c.isLandscape && c.width >= 1200) || heroCand[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Expansive scenic vistas and circular floating phumdi islands of Loktak Lake, Manipur'
    };
    console.log(`Updated State Hero: ${dataset.state.hero.title}`);
  }

  // Chandel
  console.log('Refining Chandel...');
  const chanCand = await searchCandidates('Chandel Manipur hills landscape', 6);
  const chanCand2 = chanCand.length ? chanCand : await searchCandidates('Chandel Manipur nature', 6);
  if (chanCand2.length > 0) {
    dataset.districts['chandel'].primary = {
      ...chanCand2[0],
      locationDescription: 'Misty subtropical hills and border ranges of Chandel, Manipur'
    };
    if (chanCand2[1]) {
      dataset.districts['chandel'].backup = {
        ...chanCand2[1],
        locationDescription: 'Forest canopy and river valleys of Chandel'
      };
    }
  }

  // Jiribam
  console.log('Refining Jiribam...');
  const jiriCand = await searchCandidates('Jiri River Manipur Barak', 6);
  const jiriCand2 = jiriCand.length ? jiriCand : await searchCandidates('Jiribam landscape Manipur', 6);
  if (jiriCand2.length > 0) {
    dataset.districts['jiribam'].primary = {
      ...jiriCand2[0],
      locationDescription: 'Scenic waters of Jiri River flowing through lush border valley at Jiribam'
    };
    if (jiriCand2[1]) {
      dataset.districts['jiribam'].backup = {
        ...jiriCand2[1],
        locationDescription: 'Verdant riverine countryside of Jiribam, Manipur'
      };
    }
  }

  // Kamjong
  console.log('Refining Kamjong...');
  const kamCand = await searchCandidates('Kamjong Manipur pine hills', 6);
  const kamCand2 = kamCand.length ? kamCand : await searchCandidates('Manipur eastern hills border', 6);
  if (kamCand2.length > 0) {
    dataset.districts['kamjong'].primary = {
      ...kamCand2[0],
      locationDescription: 'Rolling pine-covered mountain ridges and tribal settlements in Kamjong, Manipur'
    };
    if (kamCand2[1]) {
      dataset.districts['kamjong'].backup = {
        ...kamCand2[1],
        locationDescription: 'Misty highlands and virgin forests of Kamjong'
      };
    }
  }

  // Kangpokpi
  console.log('Refining Kangpokpi...');
  const kangCand = await searchCandidates('Mount Koubru Manipur hills', 6);
  const kangCand2 = kangCand.length ? kangCand : await searchCandidates('Sadar Hills Kangpokpi Manipur', 6);
  if (kangCand2.length > 0) {
    dataset.districts['kangpokpi'].primary = {
      ...kangCand2[0],
      locationDescription: 'Sacred heights of Mount Koubru and lush agricultural valleys of Kangpokpi'
    };
  }

  // Ukhrul backup
  console.log('Refining Ukhrul backup...');
  const ukhCand = await searchCandidates('Shirui peak Ukhrul Manipur hill', 6);
  if (ukhCand.length > 0) {
    dataset.districts['ukhrul'].backup = {
      ...ukhCand[0],
      locationDescription: 'Mist-shrouded slopes of Shirui Kashung peak, home of the rare Shirui Lily, Ukhrul'
    };
  }

  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));
  console.log('Successfully saved refined Manipur dataset!');
}

refine().catch(console.error);
