import { getPool } from '../config/db.js';

export class PlaceModel {
  static async getAll({ category = null, limit = 100, offset = 0 } = {}) {
    const pool = getPool();
    let sql = 'SELECT * FROM tourist_places';
    const params = [];

    if (category) {
      sql += ' WHERE category = ?';
      params.push(category);
    }

    sql += ' ORDER BY display_order ASC, name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10) || 100, parseInt(offset, 10) || 0);

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getById(id) {
    if (!id) return null;
    const pool = getPool();
    const sql = 'SELECT * FROM tourist_places WHERE id = ? LIMIT 1';
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async getByDistrictId(districtId) {
    if (!districtId) return [];
    const pool = getPool();
    const sql = 'SELECT * FROM tourist_places WHERE district_id = ? ORDER BY display_order ASC';
    const [rows] = await pool.query(sql, [districtId]);
    return rows;
  }

  static async getByStateSlug(stateSlug) {
    if (!stateSlug) return [];
    const pool = getPool();
    const sql = `
      SELECT p.*
      FROM tourist_places p
      LEFT JOIN states s ON p.state_id = s.id
      WHERE s.slug = ?
      ORDER BY p.display_order ASC
    `;
    const [rows] = await pool.query(sql, [stateSlug.toLowerCase().trim()]);
    return rows;
  }
}

export default PlaceModel;
