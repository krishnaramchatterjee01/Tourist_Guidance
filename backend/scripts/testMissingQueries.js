const queries = [
  'Buxa Fort West Bengal',
  'Buxa Tiger Reserve',
  'Alipurduar West Bengal',
  'Balurghat West Bengal',
  'Dakshin Dinajpur',
  'Darjeeling tea garden',
  'Darjeeling Himalayan Railway',
  'Tiger Hill Darjeeling'
];

async function testMissing() {
  for (const q of queries) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=2&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org)'
      }
    });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    const valid = pages.find(p => p.imageinfo && p.imageinfo[0]);
    if (valid) {
      console.log(`Query "${q}" => Found: "${valid.title}"`);
      console.log(`  Thumb: ${valid.imageinfo[0].thumburl}`);
      console.log(`  License: ${valid.imageinfo[0].extmetadata?.LicenseShortName?.value}`);
      console.log(`  Artist: ${valid.imageinfo[0].extmetadata?.Artist?.value?.replace(/<[^>]*>/g, '')}`);
    } else {
      console.log(`Query "${q}" => NOT found`);
    }
  }
}

testMissing().catch(console.error);
