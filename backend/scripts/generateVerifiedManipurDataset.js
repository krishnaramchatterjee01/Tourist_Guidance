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
      if (t.includes('map') || t.includes('locator') || t.includes('flag') || t.includes('minister') || t.includes('inauguration') || t.includes('naidu') || t.includes('modi')) continue;

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

const MANIPUR_CONFIG = [
  { slug: 'bishnupur', location: 'Circular floating phumdis on Loktak Lake and dancing Sangai deer habitat of Keibul Lamjao, Bishnupur', queries: ['Loktak Lake Bishnupur Manipur', 'Loktak Lake phumdis', 'Keibul Lamjao National Park', 'Bishnupur Manipur temple'] },
  { slug: 'chandel', location: 'Lush tropical Indo-Myanmar border ranges and Yangoupokpi-Lokchao Wildlife Sanctuary in Chandel', queries: ['Chandel Manipur landscape', 'Chandel hills Manipur', 'Chandel Manipur'] },
  { slug: 'churachandpur', location: 'Scenic blue waters of Khuga Dam reservoir and rolling green mountain ranges of Churachandpur', queries: ['Khuga Dam Churachandpur Manipur', 'Churachandpur Manipur landscape', 'Khuga Dam'] },
  { slug: 'imphal-east', location: 'Ancient moated royal seat of Kangla Fort and sacred golden spires of Shri Govindaji Temple, Imphal East', queries: ['Kangla Fort Imphal Manipur', 'Govindaji Temple Imphal', 'Kangla Fort palace'] },
  { slug: 'imphal-west', location: 'Historic centuries-old Mother Market (Ima Keithel) run entirely by women traders, Imphal West', queries: ['Ima Keithel Imphal women market', 'Ima Market Imphal', 'Imphal Manipur city'] },
  { slug: 'jiribam', location: 'Scenic meandering currents of Jiri River along the lush Assam-Manipur borderlands in Jiribam', queries: ['Jiribam Manipur river', 'Jiri River Manipur', 'Jiribam landscape'] },
  { slug: 'kakching', location: 'Lush terraced floral hillside landscapes and panoramic valley views at Kakching Garden', queries: ['Kakching Garden Manipur', 'Kakching Manipur', 'Uyok Ching Kakching'] },
  { slug: 'kamjong', location: 'Misty pine mountain ridges and traditional tribal settlements along Indo-Myanmar hills in Kamjong', queries: ['Kamjong Manipur hills', 'Kamjong landscape', 'Kamjong Manipur'] },
  { slug: 'kangpokpi', location: 'Sacred misty heights of Mount Koubru and rolling green agricultural plateaus of Kangpokpi', queries: ['Koubru Peak Manipur', 'Kangpokpi Manipur hills', 'Kangpokpi landscape'] },
  { slug: 'noney', location: 'Engineering marvel of world highest railway bridge pier towering over Ijai River valley at Noney', queries: ['Noney railway bridge Manipur', 'Noney bridge pier', 'Noney Manipur landscape'] },
  { slug: 'pherzawl', location: 'Meandering Tuivai River valley and dense virgin bamboo woodlands of Pherzawl', queries: ['Pherzawl Manipur landscape', 'Tuivai river Manipur', 'Pherzawl hills'] },
  { slug: 'senapati', location: 'Breathtaking undulating emerald meadows and seasonal blooming lilies of Dzukou Valley, Senapati', queries: ['Dzukou Valley Senapati Manipur', 'Dzukou Valley lilies', 'Mao Manipur Senapati'] },
  { slug: 'tamenglong', location: 'Roaring cascades of Barak Waterfalls and dense virgin rainforest home of the Amur Falcon, Tamenglong', queries: ['Tamenglong Manipur waterfall', 'Barak waterfall Tamenglong', 'Tamenglong landscape'] },
  { slug: 'tengnoupal', location: 'Historic Indo-Myanmar Friendship Gate at border trade hub Moreh and scenic hills of Tengnoupal', queries: ['Moreh Manipur border', 'Tengnoupal Manipur hills', 'Moreh Indo Myanmar'] },
  { slug: 'thoubal', location: 'Historic British-era war memorial obelisk at Khongjom War Memorial and Waithou Lake, Thoubal', queries: ['Khongjom War Memorial Thoubal Manipur', 'Thoubal Manipur river', 'Waithou Lake Thoubal'] },
  { slug: 'ukhrul', location: 'Rare bell-shaped pink Shirui Lily blooming atop mist-clad Shirui Kashung peak in Ukhrul', queries: ['Shirui Lily Ukhrul Manipur', 'Shirui Kashung Ukhrul', 'Ukhrul Manipur hills', 'Khangkhui Cave Ukhrul'] }
];

async function generate() {
  console.log('=== Curating Authentic Wikimedia Dataset for Manipur (Phase 16) ===');
  const dataset = {
    state: {
      name: 'Manipur',
      slug: 'manipur',
      hero: null,
      card: null
    },
    districts: {}
  };

  // State Media
  console.log('Fetching Manipur State Media...');
  const heroCandidates = await searchCandidates('Loktak Lake Manipur phumdis sunset panorama', 6);
  const heroCand2 = heroCandidates.length ? heroCandidates : await searchCandidates('Loktak Lake Manipur aerial', 6);
  if (heroCand2.length > 0) {
    const bestHero = heroCand2.find(c => c.isLandscape && c.width >= 1200) || heroCand2[0];
    dataset.state.hero = {
      ...bestHero,
      locationDescription: 'Surreal circular floating islands (phumdis) of Loktak Lake reflecting twilight skies, Manipur'
    };
    console.log(`State Hero found: ${bestHero.title}`);
  }

  const cardCandidates = await searchCandidates('Kangla Fort Imphal Manipur gate entrance', 6);
  const cardCand2 = cardCandidates.length ? cardCandidates : await searchCandidates('Shirui Lily Ukhrul Manipur flower', 6);
  if (cardCand2.length > 0) {
    const bestCard = cardCand2.find(c => c.isLandscape) || cardCand2[0];
    dataset.state.card = {
      ...bestCard,
      locationDescription: 'Grand royal gateway and dragon (Kangla Sha) ramparts of historic Kangla Fort, Imphal, Manipur'
    };
    console.log(`State Card found: ${bestCard.title}`);
  }

  // Districts
  for (const item of MANIPUR_CONFIG) {
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
      const fallback = await searchCandidates(`${item.slug} Manipur`, 6);
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

  const outPath = path.resolve('backend/src/services/images/verifiedManipurDataset.json');
  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));
  console.log(`Successfully saved dataset to ${outPath}`);
}

generate().catch(console.error);
