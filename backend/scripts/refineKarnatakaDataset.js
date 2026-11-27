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
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('minister') || t.includes('inaugurates') || t.includes('voter') || t.includes('election')) continue;

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
  const datasetPath = path.resolve('backend/src/services/images/verifiedKarnatakaDataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  console.log('Refining Tumakuru...');
  const tumCand = await searchCandidates('Devarayanadurga temple Tumakuru hill', 6);
  if (tumCand.length > 0) {
    dataset.districts['tumakuru'].primary = {
      ...tumCand[0],
      locationDescription: 'Sacred Yoga Narasimha hill temple complex at Devarayanadurga, Tumakuru'
    };
    if (tumCand[1]) {
      dataset.districts['tumakuru'].backup = {
        ...tumCand[1],
        locationDescription: 'Panoramic hill greenery of Devarayanadurga, Tumakuru'
      };
    }
  }

  console.log('Refining Yadgir backup...');
  const yadCand = await searchCandidates('Yadgir hill fort Karnataka', 6);
  if (yadCand.length > 1) {
    dataset.districts['yadgir'].backup = {
      ...yadCand[1],
      locationDescription: 'Historic hilltop bastions of Yadgir Fort overlooking Deccan plains'
    };
  }

  console.log('Refining Chamarajanagar backup...');
  const chamCand = await searchCandidates('Bandipur National park forest landscape', 6);
  if (chamCand.length > 0) {
    dataset.districts['chamarajanagar'].backup = {
      ...chamCand[0],
      locationDescription: 'Verdant forest canopy and elephant corridor of Bandipur National Park'
    };
  }

  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));
  console.log('Successfully saved refined Karnataka dataset!');
}

refine().catch(console.error);
