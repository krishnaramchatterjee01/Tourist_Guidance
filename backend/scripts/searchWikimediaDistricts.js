const districtQueries = {
  'alipurduar': 'Buxa Fort Dooars West Bengal',
  'bankura': 'Bishnupur Terracotta Temple Bankura',
  'birbhum': 'Santiniketan Birbhum West Bengal',
  'cooch-behar': 'Cooch Behar Palace West Bengal',
  'dakshin-dinajpur': 'Tapan Dighi Dakshin Dinajpur',
  'darjeeling': 'Darjeeling Himalayan Railway tea garden',
  'hooghly': 'Hooghly Imambara West Bengal',
  'howrah': 'Belur Math Howrah West Bengal',
  'jalpaiguri': 'Gorumara National Park Jalpaiguri',
  'jhargram': 'Jhargram Palace West Bengal',
  'kalimpong': 'Kalimpong landscape West Bengal',
  'kolkata': 'Victoria Memorial Kolkata West Bengal',
  'malda': 'Adina Mosque Malda West Bengal',
  'murshidabad': 'Hazarduari Palace Murshidabad',
  'nadia': 'Mayapur Chandrodaya Temple Nadia',
  'north-24-parganas': 'Dakshineswar Kali Temple West Bengal',
  'paschim-bardhaman': 'Durgapur Barrage West Bengal',
  'paschim-medinipur': 'Gongoni Grand Canyon West Bengal',
  'purba-bardhaman': 'Curzon Gate Bardhaman West Bengal',
  'purba-medinipur': 'Digha sea beach West Bengal',
  'purulia': 'Ayodhya Hills Purulia West Bengal',
  'south-24-parganas': 'Sundarbans mangrove West Bengal',
  'uttar-dinajpur': 'Kulik Bird Sanctuary Raiganj'
};

async function searchAll() {
  console.log('=== SEARCHING REAL WIKIMEDIA COMMONS MEDIA FOR 23 DISTRICTS ===\n');

  for (const [slug, query] of Object.entries(districtQueries)) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org)'
        }
      });
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {});
      const valid = pages.find(p => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].mime?.startsWith('image/'));

      if (valid) {
        const info = valid.imageinfo[0];
        const meta = info.extmetadata || {};
        console.log(`✓ [${slug}] Found: "${valid.title}"`);
        console.log(`   Thumb: ${info.thumburl}`);
        console.log(`   Author: ${meta.Artist?.value?.replace(/<[^>]*>/g, '') || 'Wikimedia Contributor'}`);
        console.log(`   License: ${meta.LicenseShortName?.value || 'CC BY-SA'}`);
      } else {
        console.log(`✗ [${slug}] No valid candidate for query: "${query}"`);
      }
    } catch (err) {
      console.log(`! [${slug}] Error: ${err.message}`);
    }

    // Brief polite delay
    await new Promise(r => setTimeout(r, 200));
  }
}

searchAll().catch(console.error);
