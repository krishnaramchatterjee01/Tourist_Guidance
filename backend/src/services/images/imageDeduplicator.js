import { getPool } from '../../config/db.js';

export class ImageDeduplicator {
  /**
   * Normalizes URLs for canonical comparison (strip tracking, protocol-relative, etc.)
   */
  normalizeUrl(url) {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      return `${parsed.hostname}${parsed.pathname}`.toLowerCase();
    } catch {
      return url.toLowerCase().trim();
    }
  }

  /**
   * Checks if an image is already used as a primary image for another district
   */
  async isDuplicatePrimaryDistrictImage(url, providerImageId, currentDistrictId) {
    try {
      const pool = getPool();
      if (!pool) return false;

      const norm = this.normalizeUrl(url);

      const [rows] = await pool.query(
        `SELECT ei.district_id, d.name AS district_name, i.display_url
         FROM entity_images ei
         JOIN images i ON ei.image_id = i.id
         JOIN districts d ON ei.district_id = d.id
         WHERE ei.entity_type = 'district'
           AND ei.image_role = 'primary'
           AND ei.is_active = TRUE
           AND (ei.district_id != ? OR ? IS NULL)
           AND (i.provider_image_id = ? OR i.original_url LIKE ? OR i.display_url LIKE ?)`,
        [currentDistrictId, currentDistrictId, providerImageId, `%${norm}%`, `%${norm}%`]
      );

      return rows.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Check if image already exists in master images table to reuse record
   */
  async findExistingImageRecord(providerName, providerImageId, url) {
    try {
      const pool = getPool();
      if (!pool) return null;

      const [rows] = await pool.query(
        `SELECT * FROM images
         WHERE (provider_name = ? AND provider_image_id = ?)
            OR original_url = ?
            OR display_url = ?
         LIMIT 1`,
        [providerName, providerImageId, url, url]
      );

      return rows[0] || null;
    } catch {
      return null;
    }
  }
}

export default new ImageDeduplicator();
