/**
 * Base Abstract Provider for Centralized Image Management System
 * Enforces Zero-Cost Policy, Rate Limiting, and Standardized Metadata Extraction
 */

export class BaseImageProvider {
  constructor(name, options = {}) {
    this.name = name;
    this.isFreeTier = true;
    this.maxRequestsPerMinute = options.maxRequestsPerMinute || 60;
    this.dailyRequestLimit = options.dailyRequestLimit || 10000;
  }

  /**
   * Search for candidate images based on query and geographical location
   */
  async search(query, options = {}) {
    throw new Error(`search() must be implemented by ${this.name} provider`);
  }

  /**
   * Verify an image URL's availability and content headers
   */
  async verifyUrl(url, timeoutMs = 6000) {
    try {
      // Security check: Must be valid HTTPS URL
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') {
        return { isAccessible: false, status: 400, error: 'Insecure protocol: HTTPS required' };
      }

      // Block SSRF to local/private addresses
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.endsWith('.local')
      ) {
        return { isAccessible: false, status: 403, error: 'SSRF Block: Private network addresses prohibited' };
      }

      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const customUserAgent = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

      // Perform HEAD request first
      let res;
      try {
        res = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'User-Agent': customUserAgent
          }
        });
      } catch (headErr) {
        // CDN endpoints often block HEAD requests; fallback to GET with Range 0-1024
        res = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Range': 'bytes=0-1024',
            'User-Agent': customUserAgent
          }
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const responseTime = Date.now() - startTime;
      const contentType = res.headers.get('content-type') || '';
      const isImage = contentType.startsWith('image/');

      if ((res.ok || res.status === 206) && isImage) {
        return {
          isAccessible: true,
          status: res.status,
          responseTimeMs: responseTime,
          contentType,
          redirectedUrl: res.url !== url ? res.url : null
        };
      }

      const isRateLimited = res.status === 429;
      return {
        isAccessible: false,
        status: res.status,
        responseTimeMs: responseTime,
        isRateLimited,
        error: isRateLimited ? 'Rate limited (HTTP 429)' : `HTTP ${res.status}: Not a valid image or inaccessible`
      };
    } catch (err) {
      return {
        isAccessible: false,
        status: 0,
        error: err.name === 'AbortError' ? 'Request timed out' : err.message
      };
    }
  }

  /**
   * Standardize candidate metadata envelope
   */
  normalizeCandidate(data) {
    return {
      providerName: this.name,
      providerImageId: data.providerImageId,
      originalUrl: data.originalUrl,
      displayUrl: data.displayUrl || data.originalUrl,
      thumbnailUrl: data.thumbnailUrl || data.displayUrl || data.originalUrl,
      sourcePageUrl: data.sourcePageUrl,
      title: data.title || 'Tourism Photograph',
      description: data.description || '',
      altText: data.altText || data.title || 'Regional Scenery',
      photographerName: data.photographerName || 'Wikimedia Contributor',
      photographerUrl: data.photographerUrl || null,
      licenseName: data.licenseName || 'CC BY-SA',
      licenseVersion: data.licenseVersion || '4.0',
      licenseUrl: data.licenseUrl || 'https://creativecommons.org/licenses/by-sa/4.0/',
      attributionText: data.attributionText || '',
      width: data.width || 800,
      height: data.height || 600,
      format: data.format || 'image/jpeg',
      qualityScore: data.qualityScore || 85,
      geographicConfidence: data.geographicConfidence || 'district_headquarters'
    };
  }
}

export default BaseImageProvider;
