import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function applyRefinements() {
  const jsonPath = path.join(__dirname, '../src/services/images/verifiedGujaratDataset.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // 1. Amreli -> Khodiyar Dam
  const amreliImg = await fetchDirectTitle('File:Khodiyar dam.jpg', 'Scenic Khodiyar Dam & Shetrunji River Valley in Amreli');
  if (amreliImg) {
    data.districts['amreli'].primary = amreliImg;
    console.log('✓ Updated Amreli primary to Khodiyar dam');
  }

  // 2. Narmada -> Statue of Unity
  const souImg = await fetchDirectTitle('File:Statue of Unity.jpg', 'World Tallest 182-Meter Statue of Unity & Sardar Sarovar Dam');
  if (souImg) {
    data.districts['narmada'].primary = souImg;
    console.log('✓ Updated Narmada primary to Statue of Unity');
  }

  // 3. Panchmahal -> Jami Masjid Champaner
  const champanerImg = await fetchDirectTitle('File:Jami Masjid of Champaner 03.jpg', 'UNESCO World Heritage Champaner-Pavagadh Archaeological Park Jami Masjid');
  if (champanerImg) {
    data.districts['panchmahal'].primary = champanerImg;
    console.log('✓ Updated Panchmahal primary to Jami Masjid of Champaner');
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved refined Gujarat dataset!');
}

applyRefinements().catch(console.error);
