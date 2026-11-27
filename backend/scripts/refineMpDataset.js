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
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('vidhan') || t.includes('constituenc') || t.includes('lok_sabha') || t.includes('boundary') || t.includes('boundaries')) continue;

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
  const datasetPath = path.resolve('backend/src/services/images/verifiedMpDataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  // Alirajpur
  console.log('Refining Alirajpur...');
  const aliCand = await searchCandidates('Narmada River Alirajpur Kattiwada', 6);
  const aliCand2 = aliCand.length ? aliCand : await searchCandidates('Alirajpur landscape Madhya Pradesh', 6);
  if (aliCand2.length > 0) {
    dataset.districts['alirajpur'].primary = {
      ...aliCand2[0],
      locationDescription: 'Scenic Western Ghats and Narmada River basin landscape of Alirajpur'
    };
    if (aliCand2[1]) {
      dataset.districts['alirajpur'].backup = {
        ...aliCand2[1],
        locationDescription: 'Lush countryside of Alirajpur district'
      };
    }
  }

  // Bhind
  console.log('Refining Bhind...');
  if (dataset.districts['bhind'].backup && !dataset.districts['bhind'].backup.title.toLowerCase().includes('vidhan')) {
    const oldBackup = dataset.districts['bhind'].backup;
    dataset.districts['bhind'].primary = oldBackup;
    dataset.districts['bhind'].primary.locationDescription = 'Historic 17th-Century Ater Fort overlooking the Chambal River ravines, Bhind';
  }
  const bhindCand = await searchCandidates('Ater Fort Chambal Bhind', 6);
  if (bhindCand.length > 1) {
    dataset.districts['bhind'].backup = {
      ...bhindCand[1],
      locationDescription: 'Ramparts and gateways of Ater Fort, Bhind'
    };
  }

  // Harda
  console.log('Refining Harda...');
  const hardaCand = await searchCandidates('Narmada Handia Harda ghat', 6);
  const hardaCand2 = hardaCand.length ? hardaCand : await searchCandidates('Harda Narmada river Madhya Pradesh', 6);
  if (hardaCand2.length > 0) {
    dataset.districts['harda'].primary = {
      ...hardaCand2[0],
      locationDescription: 'Sacred riverfront ghats and temples of Handia on holy Narmada River, Harda'
    };
    if (hardaCand2[1]) {
      dataset.districts['harda'].backup = {
        ...hardaCand2[1],
        locationDescription: 'Narmada waters and riverine landscapes in Harda'
      };
    }
  }

  // Damoh backup
  console.log('Refining Damoh...');
  const damohCand = await searchCandidates('Kundalpur Damoh temple', 6);
  if (damohCand.length > 1) {
    dataset.districts['damoh'].backup = {
      ...damohCand[1],
      locationDescription: 'Sacred tirth architecture of Kundalpur, Damoh'
    };
  }

  // Sehore backup
  console.log('Refining Sehore...');
  const sehoreCand = await searchCandidates('All Saints Church Sehore', 6);
  if (sehoreCand.length > 0) {
    dataset.districts['sehore'].backup = {
      ...sehoreCand[0],
      locationDescription: 'Victorian architecture of All Saints Church in Sehore'
    };
  }

  // Singrauli backup
  console.log('Refining Singrauli...');
  const singCand = await searchCandidates('Mada Caves Singrauli rock cut', 6);
  if (singCand.length > 1) {
    dataset.districts['singrauli'].backup = {
      ...singCand[1],
      locationDescription: 'Ancient 7th-Century rock-cut architecture of Mada Caves, Singrauli'
    };
  }

  // Chhatarpur (Khajuraho)
  console.log('Refining Chhatarpur...');
  const khajCand = await searchCandidates('Kandariya Mahadeva Temple Khajuraho', 6);
  if (khajCand.length > 0) {
    dataset.districts['chhatarpur'].primary = {
      ...khajCand[0],
      locationDescription: 'UNESCO World Heritage Kandariya Mahadeva Temple, Khajuraho, Chhatarpur'
    };
    if (khajCand[1]) {
      dataset.districts['chhatarpur'].backup = {
        ...khajCand[1],
        locationDescription: 'Ornate celestial sculptures of Lakshmana Temple, Khajuraho'
      };
    }
  }

  // Gwalior
  console.log('Refining Gwalior...');
  const gwalCand = await searchCandidates('Gwalior Fort Man Singh Palace facade', 6);
  if (gwalCand.length > 0) {
    dataset.districts['gwalior'].primary = {
      ...gwalCand[0],
      locationDescription: 'Iconic turquoise and yellow tiled facade of Man Singh Palace at Gwalior Fort'
    };
  }

  // Shahdol
  console.log('Refining Shahdol...');
  const shahCand = await searchCandidates('Bansagar Dam Son River Shahdol', 6);
  if (shahCand.length > 0) {
    dataset.districts['shahdol'].primary = {
      ...shahCand[0],
      locationDescription: 'Sprawling reservoir of Bansagar Dam on Son River, Shahdol'
    };
  }

  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));
  console.log('Successfully saved refined Madhya Pradesh dataset!');
}

refine().catch(console.error);
