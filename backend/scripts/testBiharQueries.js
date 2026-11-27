import https from 'https';

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=960`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'ExploreIndiaBot/2.0 (tourism@exploreindia.org)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query ? Object.values(json.query.pages) : [];
          resolve(pages);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function testBiharQueries() {
  const queries = [
    'Ramrekha Ghat Buxar',
    'Buxar Fort Bihar',
    'Baba Garib Sthan Mandir Muzaffarpur',
    'Tara Sthan Mahishi Saharsa',
    'Matsyagandha Saharsa',
    'Vidyapati Dham Samastipur',
    'Gorakhnath Temple Katihar'
  ];
  for (const q of queries) {
    const res = await searchCommons(q);
    console.log(`=== Query: ${q} (found ${res.length}) ===`);
    for (const p of res) {
      const info = p.imageinfo ? p.imageinfo[0] : null;
      if (info) {
        console.log(`- Title: ${p.title} (${info.width}x${info.height})`);
        console.log(`  URL: ${info.thumburl || info.url}`);
      }
    }
  }
}
testBiharQueries();
