import { getPool } from '../config/db.js';

export class DistrictModel {
  static async getByStateSlug(stateSlug) {
    if (!stateSlug) return [];
    const pool = getPool();
    const sql = `
      SELECT d.*, s.name AS state_name, s.slug AS state_slug
      FROM districts d
      INNER JOIN states s ON d.state_id = s.id
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
      SELECT d.*, s.name AS state_name, s.slug AS state_slug
      FROM districts d
      INNER JOIN states s ON d.state_id = s.id
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
      SELECT * FROM tourist_places
      WHERE district_id = ?
      ORDER BY display_order ASC, name ASC
    `;
    const [rows] = await pool.query(sql, [districtId]);
    return rows;
  }
}

export default DistrictModel;
