const USER_AGENT = 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) BuiltInFetch/2.0';

async function searchCandidates(query, limit = 6) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    return pages.map(p => {
      const info = p.imageinfo ? p.imageinfo[0] : null;
      return {
        pageid: p.pageid,
        title: p.title,
        width: info?.width,
        height: info?.height,
        url: info?.thumburl || info?.url,
        desc: info?.extmetadata?.ImageDescription?.value?.replace(/<[^>]*>/g, '').substring(0, 100)
      };
    }).filter(p => p.url && !p.title.endsWith('.svg'));
  } catch (err) {
    return [];
  }
}

async function testAll() {
  const queries = {
    'kondagaon': ['Keshkal', 'Kondagaon', 'Bastar bell metal', 'Keshkal valley'],
    'raigarh': ['Raigarh Chhattisgarh', 'Singhanpur Chhattisgarh', 'Moti Mahal Raigarh', 'Ram Jharna', 'Kabir Chowk Raigarh'],
    'sakti': ['Chandrahasini', 'Chandrapur Chhattisgarh', 'Mahanadi Chandrapur', 'Madanpur Gadh'],
    'uttar-bastar-kanker': ['Kanker Palace', 'Kanker Chhattisgarh', 'Gadiya Mountain', 'Charre Marre', 'Malanjkudum'],
    'baloda-bazar': ['Giroudpuri', 'Barnawapara', 'Jaitkhamb', 'Baloda Bazar temple'],
    'bijapur': ['Indravati River Chhattisgarh', 'Bijapur Chhattisgarh landscape', 'Indravati landscape'],
    'khairagarh': ['Khairagarh', 'Gandai temple', 'Indira Kala Sangit'],
    'mungeli': ['Setganga', 'Achanakmar', 'Mungeli temple'],
    'narayanpur': ['Abujhmad', 'Handawada', 'Narayanpur Chhattisgarh landscape'],
    'sukma': ['Sabari River', 'Sukma landscape', 'Dudma waterfall']
  };

  for (const [key, qList] of Object.entries(queries)) {
    console.log(`\n=================== Testing: ${key} ===================`);
    for (const q of qList) {
      const results = await searchCandidates(q, 4);
      console.log(`Query "${q}" (${results.length} found):`);
      for (const r of results) {
        console.log(`  - ${r.title} (${r.width}x${r.height}) | ${r.desc || ''}`);
      }
    }
  }
}

testAll();
