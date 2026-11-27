import { getPool } from '../../config/db.js';
import providerManager from './imageProviderManager.js';
import deduplicator from './imageDeduplicator.js';

export class ImageRecoveryService {
  /**
   * Attempt automatic self-healing recovery for a broken entity image
   */
  async recoverEntityImage(entityType, entityId, oldImageId, reason = 'Reported broken') {
    const pool = getPool();
    if (!pool) return { recovered: false, message: 'Database connection offline' };

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Check if a verified backup image exists for this entity
      const idField = entityType === 'state' ? 'state_id' : entityType === 'district' ? 'district_id' : 'place_id';

      const [backupRows] = await conn.query(
        `SELECT ei.*, i.display_url, i.provider_name
         FROM entity_images ei
         JOIN images i ON ei.image_id = i.id
         WHERE ei.entity_type = ?
           AND ei.${idField} = ?
           AND ei.image_role = 'backup'
           AND ei.is_active = TRUE
           AND i.status = 'verified'
         ORDER BY ei.display_order ASC
         LIMIT 1`,
        [entityType, entityId]
      );

      if (backupRows && backupRows[0]) {
        const backup = backupRows[0];
        const provider = providerManager.getProvider(backup.provider_name);
        const check = await provider.verifyUrl(backup.display_url);

        if (check.isAccessible) {
          // Promote backup to primary
          await conn.query(
            `UPDATE entity_images SET image_role = 'backup'
             WHERE entity_type = ? AND ${idField} = ? AND image_role = 'primary'`,
            [entityType, entityId]
          );

          await conn.query(
            'UPDATE entity_images SET image_role = "primary" WHERE id = ?',
            [backup.id]
          );

          // Record replacement history
          await conn.query(
            `INSERT INTO image_replacement_history (
              entity_type, entity_id, old_image_id, new_image_id, reason, replaced_by
            ) VALUES (?, ?, ?, ?, ?, 'auto_backup_promoter')`,
            [entityType, entityId, oldImageId, backup.image_id, `Promoted backup: ${reason}`]
          );

          await conn.commit();
          return {
            recovered: true,
            promotedBackup: true,
            newImageId: backup.image_id,
            displayUrl: backup.display_url
          };
        }
      }

      // 2. If no valid backup, search approved provider for replacement
      let entityName = '';
      if (entityType === 'district') {
        const [dRows] = await conn.query('SELECT name FROM districts WHERE id = ?', [entityId]);
        entityName = dRows[0]?.name || '';
      } else if (entityType === 'state') {
        const [sRows] = await conn.query('SELECT name FROM states WHERE id = ?', [entityId]);
        entityName = sRows[0]?.name || '';
      }

      if (!entityName) {
        await conn.rollback();
        return { recovered: false, message: 'Entity name not found' };
      }

      const provider = providerManager.getProvider('wikimedia');
      const candidates = await provider.search(`${entityName} West Bengal landscape`);

      for (const cand of candidates) {
        const isDupe = await deduplicator.isDuplicatePrimaryDistrictImage(
          cand.displayUrl,
          cand.providerImageId,
          entityId
        );
        if (isDupe) continue;

        const check = await provider.verifyUrl(cand.displayUrl);
        if (!check.isAccessible) continue;

        // Insert new replacement image
        const [insertRes] = await conn.query(
          `INSERT INTO images (
            provider_name, provider_image_id, original_url, display_url, thumbnail_url,
            source_page_url, title, description, alt_text, photographer_name,
            license_name, license_url, attribution_text, width, height, format,
            state, district, status, review_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'West Bengal', ?, 'verified', 'auto_approved')`,
          [
            cand.providerName,
            cand.providerImageId,
            cand.originalUrl,
            cand.displayUrl,
            cand.thumbnailUrl,
            cand.sourcePageUrl,
            cand.title,
            cand.description,
            cand.altText,
            cand.photographerName,
            cand.licenseName,
            cand.licenseUrl,
            cand.attributionText,
            cand.width,
            cand.height,
            cand.format,
            entityName
          ]
        );

        const newImageId = insertRes.insertId;

        // Demote old primary
        await conn.query(
          `UPDATE entity_images SET image_role = 'backup'
           WHERE entity_type = ? AND ${idField} = ? AND image_role = 'primary'`,
          [entityType, entityId]
        );

        // Assign new primary
        await conn.query(
          `INSERT INTO entity_images (
            entity_type, ${idField}, image_id, image_role, is_active
          ) VALUES (?, ?, ?, 'primary', TRUE)`,
          [entityType, entityId, newImageId]
        );

        // Record replacement history
        await conn.query(
          `INSERT INTO image_replacement_history (
            entity_type, entity_id, old_image_id, new_image_id, reason, replaced_by
          ) VALUES (?, ?, ?, ?, ?, 'auto_provider_search')`,
          [entityType, entityId, oldImageId, newImageId, `Self-healed from Wikimedia: ${reason}`]
        );

        await conn.commit();
        return {
          recovered: true,
          replacementFound: true,
          newImageId,
          displayUrl: cand.displayUrl
        };
      }

      await conn.rollback();
      return { recovered: false, message: 'No suitable verified replacement found' };
    } catch (err) {
      await conn.rollback();
      return { recovered: false, error: err.message };
    } finally {
      conn.release();
    }
  }
}

export default new ImageRecoveryService();
