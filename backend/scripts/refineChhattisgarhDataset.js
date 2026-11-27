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
    console.warn(`[Direct] Error for "${title}":`, err.message);
    return null;
  }
}

async function refine() {
  const jsonPath = path.join(__dirname, '../src/services/images/verifiedChhattisgarhDataset.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Refine specific districts with authentic high-res gems
  const overrides = {
    'baloda-bazar-bhatapara': {
      primary: { file: 'File:Somnath Temple Simga.jpg', desc: 'Ancient Somnath Temple at Confluence of Kharun and Shivnath Rivers' },
      backup: { file: 'File:Giroudpuri Dham.jpg', desc: 'Sacred Giroudpuri Dham & World Tallest Jaitkham Monument' }
    },
    'bijapur': {
      primary: { file: 'File:Indravati river.jpg', desc: 'Indravati River Wildlife & Forest Valley Corridor in Bijapur' },
      backup: { file: 'File:View of the Indravati River.jpg', desc: 'Indravati River Wildlife & Forest Valley Corridor in Bijapur' }
    },
    'kondagaon': {
      primary: { file: 'File:Keskal Ghat.JPG', desc: 'Spectacular Keshkal Ghat Curving Valleys & Bastar Plateau Ridge' },
      backup: null
    },
    'khairagarh-chhuikhadan-gandai': {
      primary: { file: 'File:12th or 13th-century Gandai Shiv Mandir, Hindu temple, Chhattisgarh - 24.jpg', desc: 'Ancient 12th-Century Gandai Shiva Temple Archaeological Site' },
      backup: { file: 'File:Deur shiv mandir gandai CGTourism.jpg', desc: 'Ancient 12th-Century Gandai Shiva Temple Archaeological Site' }
    },
    'mungeli': {
      primary: { file: 'File:ACHANAKMAR TIGER RESERVE, CHHATISGARH (INDIA).jpg', desc: 'Achanakmar Tiger Reserve Pristine Sal Forest Wilderness' },
      backup: { file: 'File:Guest House , Achanakmar Tiger Reserve, Chhatisgarh.jpg', desc: 'Achanakmar Tiger Reserve Pristine Sal Forest Wilderness' }
    },
    'raigarh': {
      primary: { file: 'File:Hemu kalani chowk raigarh - panoramio.jpg', desc: 'Hemu Kalani Heritage City Square & Kelo River Basin at Raigarh' },
      backup: { file: 'File:Raigarh Railway Station.jpg', desc: 'Historic Raigarh Heritage Junction & Kelo Basin' }
    },
    'sakti': {
      primary: { file: 'File:Ardhnareshwar.jpg', desc: 'Sacred Maa Chandrahasini Devi Temple at Chandrapur on Mahanadi' },
      backup: null
    },
    'uttar-bastar-kanker': {
      primary: { file: 'File:Kanker view from DIET.jpg', desc: 'Scenic Kanker Hill Valley & Historic Kanker Heritage' },
      backup: { file: 'File:Kanker-palace-heritage.jpg', desc: 'Historic Kanker Palace & Heritage Estate' }
    }
  };

  for (const [slug, spec] of Object.entries(overrides)) {
    console.log(`Refining ${slug}...`);
    if (spec.primary) {
      const p = await fetchDirectTitle(spec.primary.file, spec.primary.desc);
      if (p) {
        data.districts[slug].primary = p;
        console.log(`  ✓ Updated primary: ${p.fileTitle} (${p.width}x${p.height})`);
      }
    }
    if (spec.backup) {
      const b = await fetchDirectTitle(spec.backup.file, spec.backup.desc);
      if (b) {
        data.districts[slug].backup = b;
        console.log(`  ✓ Updated backup: ${b.fileTitle} (${b.width}x${b.height})`);
      }
    } else if (spec.backup === null) {
      data.districts[slug].backup = null;
    }
  }

  // Audit all 33 districts
  let completeDistricts = 0;
  let missingPrimary = 0;
  for (const [slug, d] of Object.entries(data.districts)) {
    if (d.primary) {
      completeDistricts++;
    } else {
      missingPrimary++;
      console.warn(`WARNING: Missing primary for district: ${slug}`);
    }
  }

  console.log(`\nFinal Audit for Chhattisgarh:`);
  console.log(`- Districts with Primary: ${completeDistricts} / 33`);
  console.log(`- Missing Primaries: ${missingPrimary}`);

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Saved refined dataset to ${jsonPath}`);
}

refine().catch(console.error);
