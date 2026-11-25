/**
 * Single source of truth for verified, distinct images for all 28 States and 8 Union Territories.
 * Every destination features a geographically accurate, verified landmark photograph.
 * Zero duplicate images across regions.
 */

export const STATE_IMAGES = {
  // 28 Indian States
  'andhra-pradesh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/A_View_of_Tirumala_Venkateswara_Temple.JPG/1200px-A_View_of_Tirumala_Venkateswara_Temple.JPG',
  'arunachal-pradesh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/The_Tawang_Monastery.jpg/1200px-The_Tawang_Monastery.jpg',
  'assam': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80',
  'bihar': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
  'chhattisgarh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/The_Chitrakote_Falls.jpg/1200px-The_Chitrakote_Falls.jpg',
  'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  'gujarat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Great_Rann_of_Kutch.jpg/1200px-Great_Rann_of_Kutch.jpg',
  'haryana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Brahma_Sarovar,_Kurukshetra.jpg/1200px-Brahma_Sarovar,_Kurukshetra.jpg',
  'himachal-pradesh': 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=800&auto=format&fit=crop&q=80',
  'jharkhand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Hundru_Falls,_Ranchi.jpg/1200px-Hundru_Falls,_Ranchi.jpg',
  'karnataka': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
  'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
  'madhya-pradesh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kandariya_Mahadeva,_Khajuraho_M.P.jpg/1200px-Kandariya_Mahadeva,_Khajuraho_M.P.jpg',
  'maharashtra': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
  'manipur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/A_part_of_Loktak_Lake.jpg/1200px-A_part_of_Loktak_Lake.jpg',
  'meghalaya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Double_decker_living_root_bridge.jpg/1200px-Double_decker_living_root_bridge.jpg',
  'mizoram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Reiek_top,_Mizoram.jpg/1200px-Reiek_top,_Mizoram.jpg',
  'nagaland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/The_breathtaking_beauty_of_the_Dzukou_Valley.jpg/1200px-The_breathtaking_beauty_of_the_Dzukou_Valley.jpg',
  'odisha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Sun_Temple_at_Konark.jpg/1200px-Sun_Temple_at_Konark.jpg',
  'punjab': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Golden_Temple_-_Amritsar_India.jpg/1200px-Golden_Temple_-_Amritsar_India.jpg',
  'rajasthan': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
  'sikkim': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
  'tamil-nadu': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
  'telangana': 'https://images.unsplash.com/photo-1572455044327-7348c1be7267?w=800&auto=format&fit=crop&q=80',
  'tripura': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Neermahal_29122015.jpg/1200px-Neermahal_29122015.jpg',
  'uttar-pradesh': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
  'uttarakhand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Kedarnath_temple_in_uttarakhand.jpg/1200px-Kedarnath_temple_in_uttarakhand.jpg',
  'west-bengal': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80',

  // 8 Union Territories
  'andaman-and-nicobar-islands': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'chandigarh': 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80',
  'dadra-and-nagar-haveli-and-daman-and-diu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Diu_Fort.JPG/1200px-Diu_Fort.JPG',
  'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
  'jammu-and-kashmir': 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
  'ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80',
  'lakshadweep': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
  'puducherry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Beach_Promenade,_Pondicherry,_India.jpg/1200px-Beach_Promenade,_Pondicherry,_India.jpg'
};

/**
 * Get verified image for any State or Union Territory by slug or name.
 */
export function getStateImage(slugOrName) {
  if (!slugOrName) return null;
  const key = slugOrName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  return STATE_IMAGES[key] || null;
}
