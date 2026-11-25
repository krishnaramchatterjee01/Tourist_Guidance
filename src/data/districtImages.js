/**
 * Single source of truth for verified district-level destination images.
 * Provides accurate landmark photographs for prominent tourist districts across India.
 * Blocks duplicate state-level fallback inheritance (e.g., stops non-Agra UP districts from inheriting the Taj Mahal).
 */

export const DISTRICT_IMAGES = {
  // Uttar Pradesh
  'uttar-pradesh/agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
  'uttar-pradesh/ayodhya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Ram_Mandir_Ayodhya.jpg/1200px-Ram_Mandir_Ayodhya.jpg',
  'uttar-pradesh/varanasi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Dashashwamedh_Ghat_Varanasi.jpg/1200px-Dashashwamedh_Ghat_Varanasi.jpg',
  'uttar-pradesh/lucknow': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bara_Imambara_Lucknow.jpg/1200px-Bara_Imambara_Lucknow.jpg',
  'uttar-pradesh/prayagraj': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Triveni_Sangam_Prayagraj.jpg/1200px-Triveni_Sangam_Prayagraj.jpg',
  'uttar-pradesh/mathura': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Prem_Mandir,_Vrindavan_01.jpg/1200px-Prem_Mandir,_Vrindavan_01.jpg',
  'uttar-pradesh/jhansi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Jhansi_Fort,_Uttar_Pradesh.jpg/1200px-Jhansi_Fort,_Uttar_Pradesh.jpg',

  // Andhra Pradesh
  'andhra-pradesh/tirupati': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/A_View_of_Tirumala_Venkateswara_Temple.JPG/1200px-A_View_of_Tirumala_Venkateswara_Temple.JPG',
  'andhra-pradesh/visakhapatnam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Visakhapatnam_RK_Beach.jpg/1200px-Visakhapatnam_RK_Beach.jpg',
  'andhra-pradesh/kurnool': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Gandikota_Canyon.jpg/1200px-Gandikota_Canyon.jpg',
  'andhra-pradesh/ananthapuramu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Nandi_Bull_Lepakshi.jpg/1200px-Nandi_Bull_Lepakshi.jpg',
  'andhra-pradesh/guntur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Undavalli_caves.jpg/1200px-Undavalli_caves.jpg',
  'andhra-pradesh/ntr': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kanaka_Durga_Temple,_Vijayawada.jpg/1200px-Kanaka_Durga_Temple,_Vijayawada.jpg',
  'andhra-pradesh/krishna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kanaka_Durga_Temple,_Vijayawada.jpg/1200px-Kanaka_Durga_Temple,_Vijayawada.jpg',

  // Rajasthan
  'rajasthan/jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
  'rajasthan/udaipur': 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&auto=format&fit=crop&q=80',
  'rajasthan/jodhpur': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
  'rajasthan/jaisalmer': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80',

  // Karnataka
  'karnataka/bengaluru-urban': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Vidhana_Soudha_Bengaluru.jpg/1200px-Vidhana_Soudha_Bengaluru.jpg',
  'karnataka/mysuru': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/1200px-Mysore_Palace_Morning.jpg',
  'karnataka/bellary': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
  'karnataka/vijayanagara': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',

  // Maharashtra
  'maharashtra/mumbai-city': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
  'maharashtra/mumbai-suburban': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
  'maharashtra/pune': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Shaniwar_wada.jpg/1200px-Shaniwar_wada.jpg',
  'maharashtra/chhatrapati-sambhajinagar': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&auto=format&fit=crop&q=80',

  // Tamil Nadu
  'tamil-nadu/madurai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
  'tamil-nadu/thanjavur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Brihadisvara_Temple_Thanjavur.jpg/1200px-Brihadisvara_Temple_Thanjavur.jpg',

  // Gujarat
  'gujarat/kutch': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Great_Rann_of_Kutch.jpg/1200px-Great_Rann_of_Kutch.jpg',
  'gujarat/ahmedabad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Adalaj_Stepwell.jpg/1200px-Adalaj_Stepwell.jpg',

  // Punjab
  'punjab/amritsar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Golden_Temple_-_Amritsar_India.jpg/1200px-Golden_Temple_-_Amritsar_India.jpg',

  // Himachal Pradesh
  'himachal-pradesh/shimla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/The_Ridge,_Shimla.jpg/1200px-The_Ridge,_Shimla.jpg',
  'himachal-pradesh/kullu': 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=800&auto=format&fit=crop&q=80',

  // Uttarakhand
  'uttarakhand/dehradun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lakshman_Jhula,_Rishikesh,_Uttarakhand,_India.jpg/1000px-Lakshman_Jhula,_Rishikesh,_Uttarakhand,_India.jpg',
  'uttarakhand/rudraprayag': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Kedarnath_temple_in_uttarakhand.jpg/1200px-Kedarnath_temple_in_uttarakhand.jpg',

  // Madhya Pradesh
  'madhya-pradesh/chhatarpur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kandariya_Mahadeva,_Khajuraho_M.P.jpg/1200px-Kandariya_Mahadeva,_Khajuraho_M.P.jpg',
  'madhya-pradesh/bhopal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/The_Great_Stupa_at_Sanchi.jpg/1200px-The_Great_Stupa_at_Sanchi.jpg',

  // Bihar
  'bihar/gaya': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
  'bihar/nalanda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Nalanda_University_Ruins.jpg/1200px-Nalanda_University_Ruins.jpg',

  // Assam
  'assam/kamrup-metropolitan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Kamakhya_Temple_Guwahati.jpg/1200px-Kamakhya_Temple_Guwahati.jpg',
  'assam/golaghat': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80'
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
 * If the district has a verified landmark image in DISTRICT_IMAGES, it returns that image.
 * If the district is part of West Bengal (where all 23 districts are individually curated), it returns district.image.
 * For all other districts (which originally inherited a duplicated generic parent-state image),
 * it returns null so SmartImage gracefully renders destination-placeholder.svg.
 */
export function getDistrictImage(district, stateData) {
  if (!district) return null;

  const rawStateSlug =
    stateData?.slug ||
    district.stateSlug ||
    (stateData?.state ? stateData.state : '');
  const stateSlug = normalizeSlug(rawStateSlug);
  const distSlug = normalizeSlug(district.slug || district.id || '');

  // 1. Direct registry lookup (compound key 'state/district' or bare district slug)
  const compoundKey = `${stateSlug}/${distSlug}`;
  if (DISTRICT_IMAGES[compoundKey]) return DISTRICT_IMAGES[compoundKey];
  if (DISTRICT_IMAGES[distSlug]) return DISTRICT_IMAGES[distSlug];

  // 2. West Bengal districts with individual curated photos
  if (stateSlug === 'west-bengal' && district.image) {
    return district.image;
  }

  // 3. Any other district in all other 27 states defaults to null (placeholder)
  // This explicitly prevents duplicate state-level image inheritance
  return null;
}

/**
 * Resolves hero background banner image for DistrictDetail page.
 * Blocks duplicate parent state hero images from appearing on unrelated districts.
 */
export function getDistrictHeroImage(district, stateData) {
  if (!district) return null;

  const resolved = getDistrictImage(district, stateData);
  if (resolved) return resolved;

  const rawStateSlug =
    stateData?.slug ||
    district.stateSlug ||
    (stateData?.state ? stateData.state : '');
  const stateSlug = normalizeSlug(rawStateSlug);
  if (stateSlug === 'west-bengal' && district.heroImage) {
    return district.heroImage;
  }

  return null;
}
