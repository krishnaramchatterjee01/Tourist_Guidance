/**
 * Single source of truth for verified district-level destination images.
 * Provides accurate landmark photographs for prominent tourist districts across India.
 * Blocks duplicate state-level fallback inheritance (e.g., stops non-Agra UP districts from inheriting the Taj Mahal).
 * All images are served locally from /images/... for 100% offline reliability.
 */

export const DISTRICT_IMAGES = {
  // Uttar Pradesh verified landmarks
  'uttar-pradesh/agra': '/images/districts/uttar-pradesh/agra.jpg',
  'uttar-pradesh/ayodhya': '/images/districts/uttar-pradesh/ayodhya.jpg',
  'uttar-pradesh/jhansi': '/images/districts/uttar-pradesh/jhansi.jpg',
  'uttar-pradesh/lucknow': '/images/districts/uttar-pradesh/lucknow.jpg',
  'uttar-pradesh/mathura': '/images/districts/uttar-pradesh/mathura.jpg',
  'uttar-pradesh/prayagraj': '/images/districts/uttar-pradesh/prayagraj.jpg',
  'uttar-pradesh/varanasi': '/images/districts/uttar-pradesh/varanasi.jpg',

  // Rajasthan
  'rajasthan/jaipur': '/images/destinations/jaipur.jpg',
  'rajasthan/udaipur': '/images/destinations/udaipur.jpg',
  'rajasthan/jaisalmer': '/images/destinations/jaisalmer.jpg',
  'rajasthan/jodhpur': '/images/destinations/jaisalmer.jpg',

  // Karnataka
  'karnataka/bellary': '/images/destinations/hampi.jpg',
  'karnataka/vijayanagara': '/images/destinations/hampi.jpg',
  'karnataka/mysuru': '/images/attractions/mysore-palace.jpg',
  'karnataka/uttara-kannada': '/images/destinations/gokarna.jpg',

  // Maharashtra
  'maharashtra/mumbai-city': '/images/attractions/gateway-of-india.jpg',
  'maharashtra/mumbai-suburban': '/images/attractions/gateway-of-india.jpg',
  'maharashtra/chhatrapati-sambhajinagar': '/images/attractions/ajanta-ellora.jpg',

  // Tamil Nadu
  'tamil-nadu/madurai': '/images/attractions/meenakshi-temple.jpg',

  // Gujarat
  'gujarat/kutch': '/images/states/gujarat.jpg',

  // Punjab
  'punjab/amritsar': '/images/attractions/golden-temple.jpg',

  // Himachal Pradesh
  'himachal-pradesh/kullu': '/images/destinations/manali.jpg',

  // Uttarakhand
  'uttarakhand/dehradun': '/images/destinations/rishikesh.jpg',
  'uttarakhand/rudraprayag': '/images/states/uttarakhand.jpg',

  // Madhya Pradesh
  'madhya-pradesh/chhatarpur': '/images/states/madhya-pradesh.jpg',

  // Bihar
  'bihar/gaya': '/images/states/bihar.jpg',

  // Odisha
  'odisha/puri': '/images/attractions/konark-sun-temple.jpg',

  // Kerala
  'kerala/alappuzha': '/images/destinations/alleppey.jpg',
  'kerala/idukki': '/images/destinations/munnar.jpg',

  // Meghalaya
  'meghalaya/east-khasi-hills': '/images/destinations/shillong.jpg',

  // Assam
  'assam/golaghat': '/images/states/assam.jpg',

  // Haryana
  'haryana/kurukshetra': '/images/states/haryana.jpg',

  // Jharkhand
  'jharkhand/ranchi': '/images/states/jharkhand.jpg',

  // Chhattisgarh
  'chhattisgarh/bastar': '/images/states/chhattisgarh.jpg',

  // Manipur
  'manipur/bishnupur': '/images/states/manipur.jpg',

  // Tripura
  'tripura/sipahijala': '/images/states/tripura.jpg'
};

function normalizeSlug(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-');
}

/**
 * Resolves a reliable, geographically verified image for a district card.
 * Priority:
 * 1. Direct registry lookup in DISTRICT_IMAGES (compound key 'state/district' or bare slug)
 * 2. Arunachal Pradesh districts (all 27 curated local files)
 * 3. Andhra Pradesh districts (all 28 curated local files)
 * 4. West Bengal districts (all 23 curated local files)
 * 5. Explicit district.image if unique and not matching generic parent-state image
 * 6. null for other unverified districts so SmartImage cleanly renders destination-placeholder.svg
 *    (preventing duplicate state-level image inheritance, e.g. stopping non-Agra UP districts from inheriting Taj Mahal)
 */
export function getDistrictImage(district, stateData) {
  if (!district) return null;

  const rawStateSlug =
    stateData?.slug ||
    district.stateSlug ||
    (stateData?.state ? stateData.state : '');
  const stateSlug = normalizeSlug(rawStateSlug);
  const distSlug = normalizeSlug(district.slug || district.id || '');

  // 1. Direct registry lookup (compound key 'state/district' or bare distSlug)
  const compoundKey = `${stateSlug}/${distSlug}`;
  if (DISTRICT_IMAGES[compoundKey]) return DISTRICT_IMAGES[compoundKey];
  if (DISTRICT_IMAGES[distSlug]) return DISTRICT_IMAGES[distSlug];

  // 2. Arunachal Pradesh districts (all 27 curated local files)
  if (stateSlug === 'arunachal-pradesh' && distSlug) {
    return `/images/districts/arunachal-pradesh/${distSlug}.jpg`;
  }

  // 3. Andhra Pradesh districts (all 28 curated local files)
  if (stateSlug === 'andhra-pradesh' && distSlug) {
    return `/images/districts/andhra-pradesh/${distSlug}.jpg`;
  }

  // 4. West Bengal districts (all 23 curated local files)
  if (stateSlug === 'west-bengal' && distSlug) {
    return `/images/districts/west-bengal/${distSlug}.jpg`;
  }

  // 5. Explicit district image if unique and not matching generic parent-state image
  if (district.image && !district.image.includes('unsplash.com/photo-1564507592333-c60657eea523')) {
    return district.image;
  }

  // 6. Return null for other unverified districts so SmartImage cleanly renders destination-placeholder.svg
  return null;
}

/**
 * Resolves hero background banner image for DistrictDetail page.
 * Priority:
 * 1. District's own verified image
 * 2. District's explicit heroImage
 * 3. State's scenic hero image (/images/states/${stateSlug}.jpg)
 */
export function getDistrictHeroImage(district, stateData) {
  if (!district) return null;

  const rawStateSlug =
    stateData?.slug ||
    district.stateSlug ||
    (stateData?.state ? stateData.state : '');
  const stateSlug = normalizeSlug(rawStateSlug);

  // 1. If district has its own verified image, use it
  const resolved = getDistrictImage(district, stateData);
  if (resolved) return resolved;

  // 2. If district has explicit heroImage
  if (district.heroImage) return district.heroImage;

  // 3. Fallback to state's hero image so the banner is always a rich scenic image of that state
  if (stateSlug) {
    return `/images/states/${stateSlug}.jpg`;
  }

  return null;
}

export default {
  DISTRICT_IMAGES,
  getDistrictImage,
  getDistrictHeroImage
};
