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
      if (t.includes('locator') || t.includes('flag') || t.includes('symbol') || t.includes('logo') || t.includes('election') || t.includes('constituency') || t.includes('boundary') || t.includes('assembly')) continue;

      const meta = info.extmetadata || {};
      const width = info.width || 0;
      const height = info.height || 0;
      if (width < 600 || height < 400) continue;

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

async function curateState(stateConfig) {
  console.log(`\n=== CURATING STATE: ${stateConfig.name} (${stateConfig.slug}) ===`);
  const usedPageIds = new Set();
  const dataset = {
    state: {
      name: stateConfig.name,
      slug: stateConfig.slug,
      hero: null,
      card: null
    },
    districts: {}
  };

  // 1. Curate State Hero & Card
  for (const q of stateConfig.heroQueries) {
    const res = await searchCandidates(q, 5);
    const valid = res.find(c => !usedPageIds.has(c.pageId) && c.isLandscape && c.width >= 1200);
    if (valid) {
      usedPageIds.add(valid.pageId);
      dataset.state.hero = { ...valid, locationDescription: stateConfig.heroDesc };
      break;
    }
  }
  for (const q of stateConfig.cardQueries) {
    const res = await searchCandidates(q, 5);
    const valid = res.find(c => !usedPageIds.has(c.pageId) && c.isLandscape);
    if (valid) {
      usedPageIds.add(valid.pageId);
      dataset.state.card = { ...valid, locationDescription: stateConfig.cardDesc };
      break;
    }
  }

  // 2. Curate Districts
  for (const dist of stateConfig.districts) {
    console.log(`  > District: ${dist.slug}`);
    let primary = null;
    let backup = null;

    for (const q of dist.queries) {
      if (primary && backup) break;
      const candidates = await searchCandidates(q, 8);
      for (const cand of candidates) {
        if (usedPageIds.has(cand.pageId)) continue;
        if (!primary) {
          usedPageIds.add(cand.pageId);
          primary = { ...cand, locationDescription: dist.location };
        } else if (!backup) {
          usedPageIds.add(cand.pageId);
          backup = { ...cand, locationDescription: dist.location + ' (Alternative View)' };
          break;
        }
      }
    }

    if (!primary) {
      console.warn(`    ⚠️ Primary candidate missing for ${dist.slug}`);
    } else {
      console.log(`    ✓ Primary: ${primary.title.substring(0, 40)} (${primary.width}x${primary.height})`);
    }
    if (!backup) {
      console.warn(`    ⚠️ Backup candidate missing for ${dist.slug}`);
    } else {
      console.log(`    ✓ Backup: ${backup.title.substring(0, 40)} (${backup.width}x${backup.height})`);
    }

    dataset.districts[dist.slug] = {
      slug: dist.slug,
      location: dist.location,
      primary,
      backup
    };
  }

  return dataset;
}

export { searchCandidates, curateState };
