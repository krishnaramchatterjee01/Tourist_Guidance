import BaseImageProvider from './baseProvider.js';

/**
 * Openverse API Provider (WordPress Creative Commons & Cultural Media Index)
 * 100% Free, Public Domain & Creative Commons licensed media search
 */
export class OpenverseProvider extends BaseImageProvider {
  constructor() {
    super('openverse', {
      maxRequestsPerMinute: 60,
      dailyRequestLimit: 10000
    });
    this.endpoint = 'https://api.openverse.org/v1/images/';
    this.userAgent = 'ExploreIndia/2.0 (tourism-platform@exploreindia.local; contact: open-source-tourism)';
  }

  async search(query, { limit = 8 } = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        page_size: String(limit),
        license_type: 'commercial,modification'
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${this.endpoint}?${params.toString()}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return [];
      }

      const json = await res.json();
      if (!json.results || !Array.isArray(json.results)) {
        return [];
      }

      const candidates = [];
      for (const item of json.results) {
        if (!item.url || item.url.includes('.svg')) continue;

        candidates.push(
          this.normalizeCandidate({
            providerImageId: item.id || item.foreign_landing_url,
            originalUrl: item.url,
            displayUrl: item.url,
            thumbnailUrl: item.thumbnail || item.url,
            sourcePageUrl: item.foreign_landing_url || item.url,
            title: item.title || query,
            description: item.title || query,
            altText: `${item.title || query} travel photography`,
            photographerName: item.creator || 'Openverse Contributor',
            licenseName: (item.license || 'CC BY').toUpperCase(),
            licenseUrl: item.license_url || 'https://creativecommons.org/',
            attributionText: `${item.title || query} by ${item.creator || 'Contributor'} via Openverse`,
            width: item.width || 1920,
            height: item.height || 1080,
            format: 'image/jpeg',
            qualityScore: 88
          })
        );
      }

      return candidates;
    } catch (err) {
      // Graceful fallback if Openverse public rate limit or network times out
      return [];
    }
  }
}

export default OpenverseProvider;
