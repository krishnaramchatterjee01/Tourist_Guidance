async function search(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ExploreIndia/2.0 (tourist-platform@exploreindia.org)' } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  console.log('Query:', q, '->', pages.filter(p => !p.title.endsWith('.png')).map(p => ({ title: p.title, width: p.imageinfo?.[0]?.width })));
}

async function run() {
  await search('Bhalukpong');
  await search('Kameng river');
  await search('Sessa Arunachal');
  await search('Tipi Arunachal');
  await search('Bana Arunachal');
  await search('Lada Arunachal');
  await search('Nafra');
  await search('Pakke river');
  await search('Seppa Kameng');
}

run();
