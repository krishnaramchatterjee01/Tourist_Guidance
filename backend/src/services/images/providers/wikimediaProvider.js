import BaseImageProvider from './baseProvider.js';

/**
 * Wikimedia Commons API Provider
 * 100% Free, Public Domain & Creative Commons cultural media
 */
export class WikimediaProvider extends BaseImageProvider {
  constructor() {
    super('wikimedia', {
      maxRequestsPerMinute: 120,
      dailyRequestLimit: 50000
    });
    this.endpoint = 'https://commons.wikimedia.org/w/api.php';
    this.userAgent = 'ExploreIndia/2.0 (tourism-platform@exploreindia.local; contact: open-source-tourism)';
  }

  /**
   * Search Wikimedia Commons for geographic photographs
   */
  async search(query, { limit = 8, targetWidth = 960 } = {}) {
    const searchTerms = `${query} filetype:bitmap`;
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: searchTerms,
      gsrnamespace: '6', // File namespace only
      gsrlimit: String(limit),
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata|mime',
      iiurlwidth: String(targetWidth),
      origin: '*'
    });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(`${this.endpoint}?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'application/json'
          }
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          if (attempt < 3) {
            await new Promise(r => setTimeout(r, 1000 * attempt));
            continue;
          }
          return [];
        }

        const json = await res.json();
        if (!json.query || !json.query.pages) {
          return [];
        }

        const pages = Object.values(json.query.pages);
        const candidates = [];

        for (const page of pages) {
          if (!page.imageinfo || page.imageinfo.length === 0) continue;
          const info = page.imageinfo[0];

          // Reject non-raster or SVG files if seeking photograph
          const mime = info.mime || '';
          if (!mime.startsWith('image/') || mime.includes('svg')) continue;

          const meta = info.extmetadata || {};
          const title = (page.title || '').replace(/^File:/i, '').replace(/\.[^.]+$/, '').replace(/_/g, ' ');
          const artist = this.cleanHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Commons Contributor');
          const licenseShort = meta.LicenseShortName?.value || meta.UsageTerms?.value || 'CC BY-SA 4.0';
          const licenseUrl = meta.LicenseUrl?.value || 'https://creativecommons.org/licenses/by-sa/4.0/';
          const description = this.cleanHtml(meta.ImageDescription?.value || title);

          // Standard Wikimedia thumbnail at requested target width
          const displayUrl = info.thumburl || info.url;
          const originalUrl = info.url;

          candidates.push(
            this.normalizeCandidate({
              providerName: 'wikimedia',
              providerImageId: String(page.pageid || page.title),
              originalUrl,
              displayUrl,
              thumbnailUrl: displayUrl,
              sourcePageUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
              title,
              description,
              altText: `${title} travel photography`,
              photographerName: artist,
              licenseName: licenseShort,
              licenseUrl,
              attributionText: `${title} by ${artist} (${licenseShort}) via Wikimedia Commons`,
              width: info.width,
              height: info.height,
              format: mime,
              qualityScore: this.calculateQualityScore(info, meta)
            })
          );
        }

        return candidates;
      } catch (err) {
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 1200 * attempt));
          continue;
        }
        console.warn(`[WikimediaProvider Search Warning] Query '${query}':`, err.message);
        return [];
      }
    }
    return [];
  }

  cleanHtml(str) {
    if (!str) return '';
    return str
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  calculateQualityScore(info, meta) {
    let score = 75;
    // Reward adequate resolution
    if (info.width >= 1600) score += 10;
    else if (info.width >= 1000) score += 5;
    // Reward rich metadata
    if (meta.Artist?.value) score += 5;
    if (meta.LicenseShortName?.value) score += 5;
    return Math.min(100, score);
  }
}

export default WikimediaProvider;
