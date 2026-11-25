import { getPool } from '../config/db.js';

export class CollectionModel {
  static async getBySlug(collectionSlug) {
    if (!collectionSlug) return null;
    const pool = getPool();
    const sql = 'SELECT * FROM destination_collections WHERE slug = ? LIMIT 1';
    const [rows] = await pool.query(sql, [collectionSlug.toLowerCase().trim()]);
    return rows[0] || null;
  }

  static async getItems(collectionSlug) {
    if (!collectionSlug) return [];
    const pool = getPool();
    const sql = `
      SELECT ci.*, c.slug AS collection_slug, c.title AS collection_title
      FROM collection_items ci
      INNER JOIN destination_collections c ON ci.collection_id = c.id
      WHERE c.slug = ?
      ORDER BY ci.display_order ASC
    `;
    const [rows] = await pool.query(sql, [collectionSlug.toLowerCase().trim()]);
    return rows;
  }
}

export default CollectionModel;
