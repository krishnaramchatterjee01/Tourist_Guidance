import { getPool } from '../../config/db.js';
import providerManager from './imageProviderManager.js';

export class ImageVerifier {
  /**
   * Verify a single image by ID
   */
  async verifyImage(imageId, verificationType = 'scheduled') {
    const pool = getPool();
    if (!pool) return { success: false, message: 'Database unavailable' };

    const [rows] = await pool.query('SELECT * FROM images WHERE id = ?', [imageId]);
    if (!rows || rows.length === 0) {
      return { success: false, message: 'Image record not found' };
    }

    const image = rows[0];
    const provider = providerManager.getProvider(image.provider_name);

    // Track verification request
    await providerManager.trackUsage(image.provider_name, 'verification');

    // Run verification check against display URL
    const check = await provider.verifyUrl(image.display_url);

    // Record verification log
    await pool.query(
      `INSERT INTO image_verification_logs (
        image_id, verification_type, http_status, is_accessible, response_time_ms, error_message
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        imageId,
        verificationType,
        check.status || 0,
        check.isAccessible,
        check.responseTimeMs || 0,
        check.error || null
      ]
    );

    // Update master image record status
    if (check.isAccessible) {
      await pool.query(
        `UPDATE images SET
          status = 'verified',
          last_verified_at = CURRENT_TIMESTAMP,
          last_success_at = CURRENT_TIMESTAMP,
          consecutive_failures = 0,
          next_verification_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)
        WHERE id = ?`,
        [imageId]
      );
    } else if (check.isRateLimited) {
      // Do not demote status on transient provider rate limits; back off gently
      console.warn(`[CIMS Verifier] Rate limit encountered for image #${imageId}. Backing off...`);
      await pool.query(
        `UPDATE images SET
          next_verification_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE)
        WHERE id = ?`,
        [imageId]
      );
    } else {
      const failures = (image.consecutive_failures || 0) + 1;
      // Mark permanently broken after 3 consecutive failures, else temporarily_unavailable
      const newStatus = failures >= 3 ? 'broken' : 'temporarily_unavailable';

      await pool.query(
        `UPDATE images SET
          status = ?,
          last_verified_at = CURRENT_TIMESTAMP,
          consecutive_failures = ?,
          next_verification_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 HOUR)
        WHERE id = ?`,
        [newStatus, failures, imageId]
      );
    }

    return {
      success: true,
      imageId,
      isAccessible: check.isAccessible,
      status: check.status,
      responseTimeMs: check.responseTimeMs
    };
  }

  /**
   * Batch verify overdue or pending images
   */
  async verifyBatch(limit = 10) {
    const pool = getPool();
    if (!pool) return [];

    const [images] = await pool.query(
      `SELECT id FROM images
       WHERE next_verification_at IS NULL
          OR next_verification_at <= CURRENT_TIMESTAMP
          OR status = 'pending'
       ORDER BY (status = 'broken' OR status = 'temporarily_unavailable') DESC, next_verification_at ASC
       LIMIT ?`,
      [limit]
    );

    const results = [];
    for (const img of images) {
      const res = await this.verifyImage(img.id, 'scheduled');
      results.push(res);
      // Polite rate-limit delay between checks
      await new Promise(r => setTimeout(r, 400));
    }

    return results;
  }
}

export default new ImageVerifier();
