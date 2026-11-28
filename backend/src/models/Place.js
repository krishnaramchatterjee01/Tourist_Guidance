import { getPool } from '../config/db.js';

export class PlaceModel {
  static async getAll({ category = null, limit = 100, offset = 0 } = {}) {
    const pool = getPool();
    let sql = `
      SELECT p.*,
             COALESCE(i.display_url, p.image_url) AS image_url,
             i.id AS online_image_id,
             i.photographer_name AS image_photographer,
             i.license_name AS image_license,
             i.attribution_text AS image_attribution
      FROM tourist_places p
      LEFT JOIN entity_images ei ON (ei.entity_type = 'tourist_place' AND ei.place_id = p.id AND ei.image_role = 'primary' AND ei.is_active = TRUE)
      LEFT JOIN images i ON (ei.image_id = i.id AND i.status NOT IN ('broken', 'rejected'))
    `;
    const params = [];

    if (category) {
      sql += ' WHERE p.category = ?';
      params.push(category);
    }

    sql += ' ORDER BY p.display_order ASC, p.name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10) || 100, parseInt(offset, 10) || 0);

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getById(id) {
    if (!id) return null;
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
      WHERE p.id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async getByDistrictId(districtId) {
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

  static async getByStateSlug(stateSlug) {
    if (!stateSlug) return [];
    const pool = getPool();
    const sql = `
      SELECT p.*,
             COALESCE(i.display_url, p.image_url) AS image_url,
             i.id AS online_image_id,
             i.photographer_name AS image_photographer,
             i.license_name AS image_license,
             i.attribution_text AS image_attribution
      FROM tourist_places p
      LEFT JOIN states s ON p.state_id = s.id
      LEFT JOIN entity_images ei ON (ei.entity_type = 'tourist_place' AND ei.place_id = p.id AND ei.image_role = 'primary' AND ei.is_active = TRUE)
      LEFT JOIN images i ON (ei.image_id = i.id AND i.status NOT IN ('broken', 'rejected'))
      WHERE s.slug = ?
      ORDER BY p.display_order ASC, p.name ASC
    `;
    const [rows] = await pool.query(sql, [stateSlug.toLowerCase().trim()]);
    return rows;
  }
}

export default PlaceModel;
