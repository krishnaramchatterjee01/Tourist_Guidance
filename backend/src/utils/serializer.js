/**
 * Serializer layer: Converts relational database snake_case fields
 * into camelCase objects preserving exact property names expected by React components.
 */

export function serializeState(row, districts = null) {
  if (!row) return null;
  const isState = row.region_type === 'state';
  const slug = row.slug;
  const totalCount = row.total_districts || (districts ? districts.length : 0);

  const data = {
    id: row.id,
    category: row.region_type,
    name: row.name,
    slug: row.slug,
    capital: row.capital,
    url: row.button_url || `west-bengal.html?state=${slug}`,
    image: row.image_url,
    heroImage: row.hero_image_url || row.image_url,
    alt: `${row.name} scenery`,
    utBadge: isState ? null : 'Union Territory',
    title: row.name,
    desc: row.short_description || row.description,
    description: row.description,
    shortDescription: row.short_description,
    tagline: row.tagline,
    totalDistricts: totalCount,
    buttonUrl: row.button_url || `west-bengal.html?state=${slug}`,
    buttonText: row.button_text || (isState ? `Explore ${totalCount} Districts` : 'Explore Union Territory')
  };

  if (districts) {
    data.districts = districts;
  }

  return data;
}

export function serializeDistrict(row, state = null, attractions = null) {
  if (!row) return null;
  const stateSlug = state?.slug || row.state_slug;
  const stateName = state?.name || row.state_name;

  // Primary image selection order:
  // 1. Verified CIMS online primary image
  // 2. Verified CIMS online backup image
  // 3. For Pilot states (West Bengal & Andhra Pradesh): neutral SVG placeholder to strictly prevent cloned photographs!
  // 4. For non-pilot states: existing row.image_url
  const isPilotState = ['west-bengal', 'andhra-pradesh'].includes(stateSlug?.toLowerCase()) ||
                       ['West Bengal', 'Andhra Pradesh'].includes(stateName);
  const onlineUrl = row.online_image_url || row.backup_image_url;
  const safeFallback = isPilotState ? '/assets/images/destination-placeholder.svg' : row.image_url;
  const finalImage = onlineUrl || safeFallback;
  const finalThumb = row.online_thumbnail_url || onlineUrl || safeFallback;

  const data = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    headquarters: row.headquarters || row.name,
    division: row.division || 'Official District',
    tagline: row.tagline || `Heart of ${stateName || 'India'}`,
    shortDescription: row.short_description || `${row.name} is an officially recognized administrative district.`,
    fullDescription: row.full_description || row.short_description,
    image: finalImage,
    thumbnailUrl: finalThumb,
    heroImage: row.hero_image_url || onlineUrl || finalImage,
    backupImage: row.backup_image_url || null,
    onlineImageId: row.online_image_id || null,
    photographer: row.image_photographer || null,
    license: row.image_license || null,
    licenseUrl: row.image_license_url || null,
    attribution: row.image_attribution || null,
    sourcePageUrl: row.image_source_url || null,
    imageStatus: row.image_status || 'verified',
    stateSlug: stateSlug,
    stateName: stateName,
    bestTimeToVisit: row.best_time_to_visit,
    knownFor: row.known_for,
    attractionsCount: attractions ? attractions.length : 0
  };

  if (attractions) {
    data.attractions = attractions;
  }

  return data;
}

export function serializePlace(row) {
  if (!row) return null;
  return {
    id: row.id,
    sourceId: row.source_id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    location: row.location,
    description: row.description,
    image: row.image_url,
    mapQuery: row.map_query,
    mapUrl: row.map_url || (row.map_query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.map_query)}` : null),
    highlights: row.highlights,
    bestTime: row.best_time_to_visit,
    badge: row.badge,
    stateId: row.state_id,
    districtId: row.district_id
  };
}

export function serializeExploreItem(row) {
  if (!row) return null;
  return {
    category: row.category,
    name: row.destination_name,
    state: row.state_name,
    img: row.image_url,
    best: row.best_time,
    highlights: row.highlights,
    badge: row.badge,
    desc: row.description
  };
}

export function serializeTopPlaceItem(row) {
  if (!row) return null;
  return {
    category: row.category,
    name: row.destination_name,
    location: row.location,
    img: row.image_url,
    mapQuery: row.map_query,
    badge: row.badge,
    desc: row.description
  };
}

export function serializeSliderItem(row) {
  if (!row) return null;
  return {
    destination: row.destination_name,
    image: row.image_url,
    alt: row.alt_text || row.destination_name,
    badge: row.badge,
    title: row.destination_name,
    location: row.location || '',
    desc: row.description,
    buttonUrl: row.button_url,
    buttonText: row.button_text
  };
}

export default {
  serializeState,
  serializeDistrict,
  serializePlace,
  serializeExploreItem,
  serializeTopPlaceItem,
  serializeSliderItem
};
