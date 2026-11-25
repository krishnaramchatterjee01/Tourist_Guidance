/**
 * Centralized API Client Service for Explore India
 * Communicates with the Node.js Express REST API using native Fetch & AbortController.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic request helper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson && errorJson.message) {
          errorMsg = errorJson.message;
        }
      } catch {
        // Fallback to response text
      }
      const error = new Error(errorMsg);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      // Request was cancelled intentionally
      throw error;
    }
    console.error(`[API Service Error] ${endpoint}:`, error.message);
    throw error;
  }
}

// ==========================================
// 1. Health and Readiness
// ==========================================
export async function getHealth() {
  return request('/health');
}

export async function getReadiness() {
  return request('/ready');
}

// ==========================================
// 2. States and Union Territories
// ==========================================
export async function getStates(type = null, { signal } = {}) {
  const query = type ? `?type=${encodeURIComponent(type)}` : '';
  const res = await request(`/states${query}`, { signal });
  return res.data || [];
}

export async function getStateBySlug(stateSlug, { signal } = {}) {
  if (!stateSlug) return null;
  const res = await request(`/states/${encodeURIComponent(stateSlug)}`, { signal });
  return res.data || null;
}

// ==========================================
// 3. Districts
// ==========================================
export async function getDistrictsByState(stateSlug, { signal } = {}) {
  if (!stateSlug) return [];
  const res = await request(`/states/${encodeURIComponent(stateSlug)}/districts`, { signal });
  return res.data || [];
}

export async function getDistrictDetails(stateSlug, districtSlug, { signal } = {}) {
  if (!stateSlug || !districtSlug) return null;
  const res = await request(
    `/states/${encodeURIComponent(stateSlug)}/districts/${encodeURIComponent(districtSlug)}`,
    { signal }
  );
  return res.data || null;
}

// ==========================================
// 4. Tourist Places
// ==========================================
export async function getTouristPlaces({ category, limit, page, signal } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (limit) params.append('limit', limit);
  if (page) params.append('page', page);

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const res = await request(`/places${queryStr}`, { signal });
  return res.data || [];
}

export async function getPlaceById(id, { signal } = {}) {
  if (!id) return null;
  const res = await request(`/places/${encodeURIComponent(id)}`, { signal });
  return res.data || null;
}

// ==========================================
// 5. Curated Collections
// ==========================================
export async function getDestinations({ signal } = {}) {
  const res = await request('/destinations', { signal });
  return res.data || [];
}

export async function getTopPlaces({ signal } = {}) {
  const res = await request('/top-places', { signal });
  return res.data || [];
}

export async function getFeaturedDestinations({ signal } = {}) {
  const res = await request('/featured', { signal });
  return res.data || { unionTerritories: [], explore: [], topPlaces: [] };
}

// ==========================================
// 6. Global Search
// ==========================================
export async function searchDestinations(query, { signal, limit = 20 } = {}) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }
  const params = new URLSearchParams({
    q: query.trim(),
    limit: String(limit)
  });
  const res = await request(`/search?${params.toString()}`, { signal });
  return res.data || [];
}

export default {
  getHealth,
  getReadiness,
  getStates,
  getStateBySlug,
  getDistrictsByState,
  getDistrictDetails,
  getTouristPlaces,
  getPlaceById,
  getDestinations,
  getTopPlaces,
  getFeaturedDestinations,
  searchDestinations
};
