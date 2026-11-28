import BaseImageProvider from './baseProvider.js';

/**
 * Unsplash API Provider
 * Professional travel photography
 */
export class UnsplashProvider extends BaseImageProvider {
  constructor(accessKey = null) {
    super('unsplash', {
      maxRequestsPerMinute: 50,
      dailyRequestLimit: 5000
    });
    this.accessKey = accessKey || process.env.UNSPLASH_ACCESS_KEY || null;
    this.endpoint = 'https://api.unsplash.com/search/photos';
  }

  async search(query, { limit = 8 } = {}) {
    if (!this.accessKey) {
      // Unsplash requires free developer access key; skip if key not present in environment
      return [];
    }

    try {
      const params = new URLSearchParams({
        query,
        per_page: String(limit),
        orientation: 'landscape'
      });

      const res = await fetch(`${this.endpoint}?${params.toString()}`, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
          'Accept-Version': 'v1'
        }
      });

      if (!res.ok) return [];

      const json = await res.json();
      if (!json.results || !Array.isArray(json.results)) return [];

      return json.results.map(item => this.normalizeCandidate({
        providerImageId: item.id,
        originalUrl: item.urls.raw,
        displayUrl: `${item.urls.raw}&auto=format,compress&q=85&w=1920`,
        thumbnailUrl: item.urls.thumb,
        sourcePageUrl: item.links.html,
        title: item.description || item.alt_description || query,
        description: item.description || item.alt_description || query,
        altText: item.alt_description || `${query} photography`,
        photographerName: item.user.name,
        photographerUrl: item.user.links.html,
        licenseName: 'Unsplash License',
        licenseUrl: 'https://unsplash.com/license',
        attributionText: `Photo by ${item.user.name} on Unsplash`,
        width: item.width,
        height: item.height,
        format: 'image/jpeg',
        qualityScore: 92
      }));
    } catch {
      return [];
    }
  }
}

export default UnsplashProvider;
