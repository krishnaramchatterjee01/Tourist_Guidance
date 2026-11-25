import { getPool } from '../config/db.js';

export class SearchModel {
  static async search(query, limit = 20) {
    if (!query || typeof query !== 'string') return [];
    const q = query.trim();
    if (q.length < 1) return [];

    const pool = getPool();
    const searchPattern = `%${q}%`;
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const results = [];

    // 1. Search States / UTs
    const [states] = await pool.query(
      `SELECT id, name, slug, region_type, capital, short_description, image_url, button_url
       FROM states
       WHERE name LIKE ? OR capital LIKE ? OR description LIKE ?
       ORDER BY CASE WHEN name LIKE ? THEN 1 ELSE 2 END, display_order ASC
       LIMIT 6`,
      [searchPattern, searchPattern, searchPattern, `${q}%`]
    );

    states.forEach(s => {
      results.push({
        id: `state-${s.id}`,
        name: s.name,
        type: s.region_type === 'state' ? 'State' : 'Union Territory',
        slug: s.slug,
        subtitle: `Capital: ${s.capital || 'N/A'} • ${s.region_type === 'state' ? 'State Directory' : 'Union Territory'}`,
        url: s.button_url || `/west-bengal.html?state=${s.slug}`,
        image: s.image_url
      });
    });

    // 2. Search Districts
    const [districts] = await pool.query(
      `SELECT d.id, d.name, d.slug, d.headquarters, d.tagline, d.short_description, d.image_url, s.name AS state_name, s.slug AS state_slug
       FROM districts d
       INNER JOIN states s ON d.state_id = s.id
       WHERE d.name LIKE ? OR d.headquarters LIKE ? OR d.tagline LIKE ?
       ORDER BY CASE WHEN d.name LIKE ? THEN 1 ELSE 2 END, d.name ASC
       LIMIT 8`,
      [searchPattern, searchPattern, searchPattern, `${q}%`]
    );

    districts.forEach(d => {
      results.push({
        id: `district-${d.id}`,
        name: d.name,
        type: 'District',
        slug: d.slug,
        stateName: d.state_name,
        stateSlug: d.state_slug,
        subtitle: `District in ${d.state_name} • HQ: ${d.headquarters || d.name}`,
        url: `/district.html?name=${d.slug}&state=${d.state_slug}`,
        image: d.image_url
      });
    });

    // 3. Search Tourist Places & Collections
    const [places] = await pool.query(
      `SELECT id, name, category, location, image_url, badge, description
       FROM tourist_places
       WHERE name LIKE ? OR location LIKE ? OR description LIKE ? OR category LIKE ?
       LIMIT 8`,
      [searchPattern, searchPattern, searchPattern, searchPattern]
    );

    places.forEach(p => {
      results.push({
        id: `place-${p.id}`,
        name: p.name,
        type: p.badge || p.category || 'Tourist Attraction',
        subtitle: p.location || p.category || 'Scenic Landmark',
        url: `/top-places.html`,
        image: p.image_url
      });
    });

    return results.slice(0, safeLimit);
  }
}

export default SearchModel;
