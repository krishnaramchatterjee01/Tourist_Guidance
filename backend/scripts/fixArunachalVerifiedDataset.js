import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

async function fetchFileMetadata(fileTitle, locationDesc) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];

  if (!page || !page.imageinfo || !page.imageinfo[0]) {
    throw new Error(`Could not fetch metadata for ${fileTitle}`);
  }

  const info = page.imageinfo[0];
  const meta = info.extmetadata || {};
  const titleClean = page.title.replace(/^File:/i, '').replace(/\.[^.]+$/, '').replace(/_/g, ' ');
  const license = cleanHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || 'CC BY-SA 4.0');
  const photographer = cleanHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Contributor');
  const licenseUrl = meta.LicenseUrl?.value || 'https://creativecommons.org/licenses/by-sa/4.0/';
  const displayUrl = info.thumburl || info.url;

  // Live HTTP verification
  const probe = await fetch(displayUrl, {
    method: 'GET',
    headers: { 'Range': 'bytes=0-1024', 'User-Agent': USER_AGENT }
  });

  if (!probe.ok) {
    throw new Error(`Probe failed with HTTP ${probe.status} for ${fileTitle}`);
  }

  return {
    pageId: String(page.pageid),
    fileTitle: page.title,
    title: titleClean,
    originalUrl: info.url,
    displayUrl: displayUrl,
    thumbnailUrl: displayUrl,
    sourcePageUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
    photographer: photographer,
    licenseName: license,
    licenseUrl: licenseUrl,
    attribution: `${photographer} (${license}) via Wikimedia Commons`,
    width: info.width || 960,
    height: info.height || 640,
    mime: info.mime || 'image/jpeg',
    locationDescription: locationDesc
  };
}

async function run() {
  const datasetPath = path.resolve(__dirname, '../src/services/images/verifiedArunachalDataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  console.log('=== FIXING AUTHENTICITY FOR ARUNACHAL DATASET ===\n');

  // 1. kra-daadi -> File:View of Palin Town.jpg
  console.log('1. Fixing Kra Daadi (Palin Town)...');
  const palinMeta = await fetchFileMetadata('File:View of Palin Town.jpg', 'Palin Town & Valley Panorama in Kra Daadi');
  dataset.districts['kra-daadi'].primary = palinMeta;
  console.log(`   ✓ kra-daadi primary -> "${palinMeta.title}" (${palinMeta.photographer})`);

  // 2. lower-dibang-valley -> Mayodia Pass 2 as primary
  console.log('2. Fixing Lower Dibang Valley (Mayodia Pass)...');
  const mayodiaMeta = dataset.districts['lower-dibang-valley'].backup;
  dataset.districts['lower-dibang-valley'].primary = mayodiaMeta;
  console.log(`   ✓ lower-dibang-valley primary -> "${mayodiaMeta.title}" (${mayodiaMeta.photographer})`);

  // 3. tirap -> RIWATCH Nocte Women as primary
  console.log('3. Fixing Tirap (Khonsa Nocte Cultural Heritage)...');
  const tirapMeta = dataset.districts['tirap'].backup;
  dataset.districts['tirap'].primary = tirapMeta;
  console.log(`   ✓ tirap primary -> "${tirapMeta.title}" (${tirapMeta.photographer})`);

  // 4. upper-siang -> File:Tuting monastery -.jpg
  console.log('4. Fixing Upper Siang (Tuting Buddhist Monastery)...');
  const tutingMeta = await fetchFileMetadata('File:Tuting monastery -.jpg', 'Tuting Buddhist Monastery in Upper Siang');
  const gandhiBridgeMeta = await fetchFileMetadata('File:Gandhi bridge.jpg', 'Gandhi Suspension Bridge at Yingkiong, Upper Siang');
  dataset.districts['upper-siang'].primary = tutingMeta;
  dataset.districts['upper-siang'].backup = gandhiBridgeMeta;
  console.log(`   ✓ upper-siang primary -> "${tutingMeta.title}" (${tutingMeta.photographer})`);
  console.log(`   ✓ upper-siang backup  -> "${gandhiBridgeMeta.title}" (${gandhiBridgeMeta.photographer})`);

  // 5. west-siang -> File:River Siyom, Aalo, Arunachal Pradesh.jpg
  console.log('5. Fixing West Siang (River Siyom at Aalo)...');
  const siyomMeta = await fetchFileMetadata('File:River Siyom, Aalo, Arunachal Pradesh.jpg', 'River Siyom Waterfront at Aalo, West Siang');
  dataset.districts['west-siang'].primary = siyomMeta;
  console.log(`   ✓ west-siang primary -> "${siyomMeta.title}" (${siyomMeta.photographer})`);

  // Save back to JSON
  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2), 'utf8');
  console.log(`\nSuccessfully updated and saved authentic dataset to: ${datasetPath}`);
}

run().catch(err => {
  console.error('Fatal fix error:', err);
  process.exit(1);
});
