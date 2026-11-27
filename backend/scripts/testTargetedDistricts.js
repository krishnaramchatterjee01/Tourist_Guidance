const USER_AGENT = 'ExploreIndia/2.0 (tourist-platform@exploreindia.org)';

async function search(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    return pages
      .filter(p => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].width >= 600 && !p.title.endsWith('.png') && !p.title.endsWith('.svg'))
      .map(p => ({ title: p.title, width: p.imageinfo[0].width, thumb: p.imageinfo[0].thumburl }));
  } catch {
    return [];
  }
}

async function test(label, queries) {
  console.log(`\n=== Testing: ${label} ===`);
  for (const q of queries) {
    const cand = await search(q);
    console.log(`Query "${q}" -> ${cand.length} results`);
    for (const c of cand.slice(0, 3)) {
      console.log(`   - ${c.title} (width: ${c.width})`);
    }
  }
}

async function run() {
  await test('Upper Subansiri', [
    'Subansiri river Arunachal',
    'Subansiri',
    'Daporijo bridge',
    'Daporijo Arunachal',
    'Tagin Arunachal',
    'Subansiri dam'
  ]);

  await test('Upper Siang', [
    'Mouling National Park',
    'Yingkiong Arunachal',
    'Tuting Arunachal',
    'Siang river Arunachal',
    'Upper Siang Arunachal'
  ]);

  await test('Kurung Kumey', [
    'Koloriang Arunachal Pradesh',
    'Kurung Kumey district',
    'Nyishi Arunachal',
    'Kurung river'
  ]);

  await test('Leparada', [
    'Basar Arunachal Pradesh',
    'Basar valley Arunachal',
    'Galo tribe Arunachal',
    'Leparada district'
  ]);

  await test('Shi Yomi', [
    'Mechuka valley',
    'Menchukha Arunachal',
    'Menchukha landscape',
    'Mechuka Arunachal'
  ]);

  await test('Pakke Kessang', [
    'Pakke Tiger Reserve landscape',
    'Pakhui Tiger Reserve',
    'Pakke river',
    'Seijosa Arunachal'
  ]);
}

run();
