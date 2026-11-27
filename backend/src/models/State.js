import { getPool } from '../config/db.js';

export class StateModel {
  static async getAll(regionType = null) {
    const pool = getPool();
    let sql = `
      SELECT s.*,
             COALESCE(i.display_url, s.image_url) AS image_url,
             COALESCE(ih.display_url, s.hero_image_url) AS hero_image_url
      FROM states s
      LEFT JOIN entity_images ei ON (ei.entity_type = 'state' AND ei.state_id = s.id AND ei.image_role = 'primary' AND ei.is_active = TRUE)
      LEFT JOIN images i ON (ei.image_id = i.id AND i.status NOT IN ('broken', 'rejected'))
      LEFT JOIN entity_images eih ON (eih.entity_type = 'state' AND eih.state_id = s.id AND eih.image_role = 'hero' AND eih.is_active = TRUE)
      LEFT JOIN images ih ON (eih.image_id = ih.id AND ih.status NOT IN ('broken', 'rejected'))
    `;
    const params = [];

    if (regionType) {
      sql += ' WHERE s.region_type = ?';
      params.push(regionType);
    }

    sql += ' ORDER BY s.display_order ASC, s.name ASC';
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getBySlug(slug) {
    if (!slug) return null;
    const pool = getPool();
    const sql = `
      SELECT s.*,
             COALESCE(i.display_url, s.image_url) AS image_url,
             COALESCE(ih.display_url, s.hero_image_url) AS hero_image_url
      FROM states s
      LEFT JOIN entity_images ei ON (ei.entity_type = 'state' AND ei.state_id = s.id AND ei.image_role = 'primary' AND ei.is_active = TRUE)
      LEFT JOIN images i ON (ei.image_id = i.id AND i.status NOT IN ('broken', 'rejected'))
      LEFT JOIN entity_images eih ON (eih.entity_type = 'state' AND eih.state_id = s.id AND eih.image_role = 'hero' AND eih.is_active = TRUE)
      LEFT JOIN images ih ON (eih.image_id = ih.id AND ih.status NOT IN ('broken', 'rejected'))
      WHERE s.slug = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [slug.toLowerCase().trim()]);
    return rows[0] || null;
  }
}

export default StateModel;
