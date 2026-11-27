import { getPool } from '../../config/db.js';
import verifier from './imageVerifier.js';
import recovery from './imageRecovery.js';
import collector from './imageCollector.js';
import providerManager from './imageProviderManager.js';

export class ImageService {
  /**
   * Retrieves active primary and hero image for an entity
   */
  async getEntityImages(entityType, entityId) {
    try {
      const pool = getPool();
      if (!pool) return null;

      const idField = entityType === 'state' ? 'state_id' : entityType === 'district' ? 'district_id' : 'place_id';

      const [rows] = await pool.query(
        `SELECT ei.image_role, ei.display_order,
                i.id AS image_id, i.provider_name, i.display_url, i.thumbnail_url, i.original_url,
                i.source_page_url, i.title, i.alt_text, i.photographer_name, i.license_name,
                i.license_url, i.attribution_text, i.status
         FROM entity_images ei
         JOIN images i ON ei.image_id = i.id
         WHERE ei.entity_type = ?
           AND ei.${idField} = ?
           AND ei.is_active = TRUE
         ORDER BY ei.image_role = 'primary' DESC, ei.image_role = 'hero' DESC, ei.display_order ASC`,
        [entityType, entityId]
      );

      return rows;
    } catch {
      return [];
    }
  }

  /**
   * Real-time failure reporting endpoint handler
   */
  async reportFailure(imageId, reason = 'Browser error loading image') {
    const pool = getPool();
    if (!pool) return { success: false, message: 'Database offline' };

    // Queue for immediate verification
    await pool.query(
      `INSERT INTO image_jobs (job_type, image_id, status, error_message)
       VALUES ('verify', ?, 'queued', ?)`,
      [imageId, reason]
    );

    // Verify immediately in background
    setTimeout(async () => {
      try {
        const result = await verifier.verifyImage(imageId, 'realtime_report');
        if (!result.isAccessible) {
          // Find which entity this image was primary for and trigger self-healing recovery
          const [mappings] = await pool.query(
            'SELECT * FROM entity_images WHERE image_id = ? AND image_role = "primary"',
            [imageId]
          );
          for (const m of mappings) {
            const targetId = m.district_id || m.state_id || m.place_id;
            await recovery.recoverEntityImage(m.entity_type, targetId, imageId, reason);
          }
        }
      } catch (err) {
        console.warn('[CIMS] Background recovery failed:', err.message);
      }
    }, 500);

    return { success: true, queued: true, imageId };
  }

  /**
   * Admin dashboard statistics overview
   */
  async getDashboardOverview() {
    const pool = getPool();
    if (!pool) {
      return {
        totalImages: 0,
        westBengalDistrictsTotal: 23,
        verifiedPrimaryCount: 0,
        brokenCount: 0,
        pendingCount: 0,
        backupCount: 0,
        providers: [{ name: 'wikimedia', status: 'available' }]
      };
    }

    const [statsRows] = await pool.query(`
      SELECT
        COUNT(*) AS total_images,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) AS verified_count,
        SUM(CASE WHEN status = 'broken' THEN 1 ELSE 0 END) AS broken_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN status = 'temporarily_unavailable' THEN 1 ELSE 0 END) AS temp_unavail_count
      FROM images
    `);

    const [distPrimaryRows] = await pool.query(`
      SELECT COUNT(DISTINCT ei.district_id) AS covered_districts
      FROM entity_images ei
      JOIN districts d ON ei.district_id = d.id
      JOIN states s ON d.state_id = s.id
      JOIN images i ON ei.image_id = i.id
      WHERE s.slug = 'west-bengal'
        AND ei.entity_type = 'district'
        AND ei.image_role = 'primary'
        AND ei.is_active = TRUE
        AND i.status = 'verified'
    `);

    const [backupRows] = await pool.query(`
      SELECT COUNT(*) AS total_backups
      FROM entity_images
      WHERE image_role = 'backup' AND is_active = TRUE
    `);

    const stats = statsRows[0] || {};
    const quota = await providerManager.checkQuota('wikimedia');

    return {
      totalImages: Number(stats.total_images || 0),
      westBengalDistrictsTotal: 23,
      verifiedPrimaryCount: Number(distPrimaryRows[0]?.covered_districts || 0),
      brokenCount: Number(stats.broken_count || 0),
      pendingCount: Number(stats.pending_count || 0),
      tempUnavailableCount: Number(stats.temp_unavail_count || 0),
      backupCount: Number(backupRows[0]?.total_backups || 0),
      providerQuota: quota
    };
  }

  /**
   * Admin list of West Bengal entity images with status & attribution
   */
  async getAdminImagesList({ status = null, districtId = null } = {}) {
    const pool = getPool();
    if (!pool) return [];

    let query = `
      SELECT i.*, ei.entity_type, ei.image_role, ei.is_active,
             d.name AS district_name, d.slug AS district_slug,
             s.name AS state_name
      FROM images i
      JOIN entity_images ei ON i.id = ei.image_id
      LEFT JOIN districts d ON ei.district_id = d.id
      LEFT JOIN states s ON ei.state_id = s.id OR d.state_id = s.id
      WHERE (s.slug = 'west-bengal' OR i.state = 'West Bengal')
    `;
    const params = [];

    if (status) {
      query += ' AND i.status = ?';
      params.push(status);
    }
    if (districtId) {
      query += ' AND ei.district_id = ?';
      params.push(districtId);
    }

    query += ' ORDER BY d.name ASC, ei.image_role = "primary" DESC, i.id ASC';

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

export default new ImageService();
