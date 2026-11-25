import { getPool } from '../config/db.js';

export class StateModel {
  static async getAll(regionType = null) {
    const pool = getPool();
    let sql = 'SELECT * FROM states';
    const params = [];

    if (regionType) {
      sql += ' WHERE region_type = ?';
      params.push(regionType);
    }

    sql += ' ORDER BY display_order ASC, name ASC';
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getBySlug(slug) {
    if (!slug) return null;
    const pool = getPool();
    const sql = 'SELECT * FROM states WHERE slug = ? LIMIT 1';
    const [rows] = await pool.query(sql, [slug.toLowerCase().trim()]);
    return rows[0] || null;
  }
}

export default StateModel;
