import { getPool } from '../config/db.js';

export class DistrictModel {
  static async getByStateSlug(stateSlug) {
    if (!stateSlug) return [];
    const pool = getPool();
    const sql = `
      SELECT d.*, s.name AS state_name, s.slug AS state_slug,
             COALESCE(i.id, ib.id) AS online_image_id,
             COALESCE(i.display_url, ib.display_url) AS online_image_url,
             COALESCE(i.thumbnail_url, ib.thumbnail_url, i.display_url, ib.display_url) AS online_thumbnail_url,
             COALESCE(i.photographer_name, ib.photographer_name) AS image_photographer,
             COALESCE(i.license_name, ib.license_name) AS image_license,
             COALESCE(i.license_url, ib.license_url) AS image_license_url,
             COALESCE(i.attribution_text, ib.attribution_text) AS image_attribution,
             COALESCE(i.source_page_url, ib.source_page_url) AS image_source_url,
             COALESCE(i.status, ib.status, 'verified') AS image_status,
             ib.display_url AS backup_image_url
      FROM districts d
      INNER JOIN states s ON d.state_id = s.id
      LEFT JOIN entity_images ei ON (ei.entity_type = 'district' AND ei.district_id = d.id AND ei.image_role = 'primary' AND ei.is_active = TRUE)
      LEFT JOIN images i ON (ei.image_id = i.id AND i.status NOT IN ('broken', 'rejected'))
      LEFT JOIN entity_images eib ON (eib.entity_type = 'district' AND eib.district_id = d.id AND eib.image_role = 'backup' AND eib.is_active = TRUE)
      LEFT JOIN images ib ON (eib.image_id = ib.id AND ib.status NOT IN ('broken', 'rejected'))
      WHERE s.slug = ?
      ORDER BY d.display_order ASC, d.name ASC
    `;
    const [rows] = await pool.query(sql, [stateSlug.toLowerCase().trim()]);
    return rows;
  }

  static async getBySlug(stateSlug, districtSlug) {
    if (!stateSlug || !districtSlug) return null;
    const pool = getPool();
    const sql = `
      SELECT d.*, s.name AS state_name, s.slug AS state_slug,
             COALESCE(i.id, ib.id) AS online_image_id,
             COALESCE(i.display_url, ib.display_url) AS online_image_url,
             COALESCE(i.thumbnail_url, ib.thumbnail_url, i.display_url, ib.display_url) AS online_thumbnail_url,
             COALESCE(i.photographer_name, ib.photographer_name) AS image_photographer,
             COALESCE(i.license_name, ib.license_name) AS image_license,
             COALESCE(i.license_url, ib.license_url) AS image_license_url,
             COALESCE(i.attribution_text, ib.attribution_text) AS image_attribution,
             COALESCE(i.source_page_url, ib.source_page_url) AS image_source_url,
             COALESCE(i.status, ib.status, 'verified') AS image_status,
             ib.display_url AS backup_image_url
      FROM districts d
      INNER JOIN states s ON d.state_id = s.id
      LEFT JOIN entity_images ei ON (ei.entity_type = 'district' AND ei.district_id = d.id AND ei.image_role = 'primary' AND ei.is_active = TRUE)
      LEFT JOIN images i ON (ei.image_id = i.id AND i.status NOT IN ('broken', 'rejected'))
      LEFT JOIN entity_images eib ON (eib.entity_type = 'district' AND eib.district_id = d.id AND eib.image_role = 'backup' AND eib.is_active = TRUE)
      LEFT JOIN images ib ON (eib.image_id = ib.id AND ib.status NOT IN ('broken', 'rejected'))
      WHERE s.slug = ? AND d.slug = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [
      stateSlug.toLowerCase().trim(),
      districtSlug.toLowerCase().trim()
    ]);
    return rows[0] || null;
  }

  static async getAttractions(districtId) {
    if (!districtId) return [];
    const pool = getPool();
    const sql = `
      SELECT p.*,
             COALESCE(i.display_url, p.image_url) AS image_url,
             i.id AS online_image_id,
             i.photographer_name AS image_photographer,
             i.license_name AS image_license,
             i.attribution_text AS image_attribution
      FROM tourist_places p
      LEFT JOIN entity_images ei ON (ei.entity_type = 'tourist_place' AND ei.place_id = p.id AND ei.image_role = 'primary' AND ei.is_active = TRUE)
      LEFT JOIN images i ON (ei.image_id = i.id AND i.status NOT IN ('broken', 'rejected'))
      WHERE p.district_id = ?
      ORDER BY p.display_order ASC, p.name ASC
    `;
    const [rows] = await pool.query(sql, [districtId]);
    return rows;
  }
}

export default DistrictModel;
