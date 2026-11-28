import { getPool } from '../../config/db.js';
import WikimediaProvider from './providers/wikimediaProvider.js';
import OpenverseProvider from './providers/openverseProvider.js';
import UnsplashProvider from './providers/unsplashProvider.js';

export class ImageProviderManager {
  constructor() {
    this.providers = new Map();
    // Register approved zero-cost multi-source providers
    this.registerProvider(new WikimediaProvider());
    this.registerProvider(new OpenverseProvider());
    this.registerProvider(new UnsplashProvider());
  }

  registerProvider(provider) {
    this.providers.set(provider.name, provider);
  }

  getProvider(name = 'wikimedia') {
    return this.providers.get(name) || this.providers.get('wikimedia');
  }

  /**
   * Enforces zero-cost rate limits and records usage in MySQL
   */
  async trackUsage(providerName, requestType = 'discovery') {
    try {
      const pool = getPool();
      if (!pool) return true;

      const today = new Date().toISOString().slice(0, 10);
      const column = `${requestType}_requests`;

      await pool.query(
        `INSERT INTO image_provider_usage (provider_name, usage_date, ${column})
         VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE ${column} = ${column} + 1, last_request_at = CURRENT_TIMESTAMP`,
        [providerName, today]
      );
      return true;
    } catch (err) {
      // Soft failure if DB pool is currently offline
      return true;
    }
  }

  /**
   * Check if provider is within safe free limits
   */
  async checkQuota(providerName) {
    try {
      const pool = getPool();
      if (!pool) return { allowed: true, remaining: 1000 };

      const today = new Date().toISOString().slice(0, 10);
      const [rows] = await pool.query(
        'SELECT * FROM image_provider_usage WHERE provider_name = ? AND usage_date = ?',
        [providerName, today]
      );

      if (rows && rows[0]) {
        const total =
          (rows[0].discovery_requests || 0) +
          (rows[0].metadata_requests || 0) +
          (rows[0].verification_requests || 0) +
          (rows[0].recovery_requests || 0);

        const provider = this.getProvider(providerName);
        const limit = provider?.dailyRequestLimit || 50000;

        return {
          allowed: total < limit,
          used: total,
          limit,
          remaining: Math.max(0, limit - total)
        };
      }

      return { allowed: true, used: 0, limit: 50000, remaining: 50000 };
    } catch {
      return { allowed: true, used: 0, limit: 50000, remaining: 50000 };
    }
  }
}

export default new ImageProviderManager();
