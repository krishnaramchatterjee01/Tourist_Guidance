// Using global fetch built into Node.js 18+

const testFiles = [
  'File:Victoria Memorial Hall Kolkata.jpg',
  'File:Howrah bridge at night.jpg',
  'File:Buxa Fort.jpg',
  'File:Jor Bangla Temple Bishnupur.jpg',
  'File:Upasana Griha Santiniketan.jpg'
];

async function testWikimediaApi() {
  const titles = testFiles.join('|');
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) NodeFetch/2.0'
    }
  });

  const json = await res.json();
  console.log('API Response pages:');
  for (const page of Object.values(json.query.pages)) {
    if (page.imageinfo && page.imageinfo[0]) {
      const info = page.imageinfo[0];
      console.log(`Page: ${page.title}`);
      console.log(`  Thumb: ${info.thumburl}`);
      console.log(`  Original: ${info.url}`);

      // Verify the thumb URL with a GET
      const imgRes = await fetch(info.thumburl, {
        method: 'GET',
        headers: {
          'User-Agent': 'ExploreIndia/2.0 (https://github.com/explore-india; tourist-platform@exploreindia.org) NodeFetch/2.0'
        }
      });
      console.log(`  Thumb HTTP Status: ${imgRes.status}, Content-Type: ${imgRes.headers.get('content-type')}`);
    } else {
      console.log(`Missing imageinfo for: ${page.title}`);
    }
  }
}

testWikimediaApi().catch(console.error);
