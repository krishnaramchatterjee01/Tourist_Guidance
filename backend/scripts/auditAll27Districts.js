import fs from 'fs';

const USER_AGENT = 'ExploreIndia/2.0 (tourist-platform@exploreindia.org)';

const DISTRICTS = [
  { slug: 'anjaw', queries: ['Kibithu Arunachal', 'Dong valley Arunachal', 'Anjaw Arunachal', 'Hawai Arunachal'] },
  { slug: 'bichom', queries: ['Kameng river Arunachal', 'Bhalukpong Kameng', 'Bichom river', 'Nafra Arunachal', 'Sessa Orchid Sanctuary'] },
  { slug: 'changlang', queries: ['Namdapha National Park', 'Pangsau Pass', 'Miao Changlang', 'Changlang Arunachal'] },
  { slug: 'dibang-valley', queries: ['Anini Dibang Valley', 'Anini Arunachal', 'Dibang Valley', 'Dibang wildlife'] },
  { slug: 'east-kameng', queries: ['Seppa East Kameng', 'Kameng River Seppa', 'East Kameng Arunachal', 'Seppa town'] },
  { slug: 'east-siang', queries: ['Pasighat East Siang', 'Siang River Pasighat', 'East Siang Arunachal', 'Pasighat bridge'] },
  { slug: 'kamle', queries: ['Raga Arunachal', 'Kamle Arunachal', 'Tamen Arunachal', 'Kamle river'] },
  { slug: 'keyi-panyor', queries: ['Yachuli Arunachal', 'Yazali Arunachal', 'Keyi Panyor', 'Panyor river'] },
  { slug: 'kra-daadi', queries: ['Palin Kra Daadi', 'Palin Arunachal', 'Nyapin Arunachal', 'Kra Daadi'] },
  { slug: 'kurung-kumey', queries: ['Koloriang Kurung Kumey', 'Koloriang Arunachal', 'Kurung Kumey', 'Kurung river'] },
  { slug: 'leparada', queries: ['Basar Arunachal', 'Leparada Arunachal', 'Basar festival', 'Basar Leparada'] },
  { slug: 'lohit', queries: ['Parshuram Kund Lohit', 'Tezu Lohit', 'Parasuram Kund', 'Lohit river Arunachal'] },
  { slug: 'longding', queries: ['Longding Arunachal', 'Wancho tribe Longding', 'Pongchau Longding', 'Longding'] },
  { slug: 'lower-dibang-valley', queries: ['Mayodia Pass', 'Roing Lower Dibang Valley', 'Mehao Lake Roing', 'Sally Lake Roing'] },
  { slug: 'lower-siang', queries: ['Malinithan Likabali', 'Malinithan temple', 'Likabali Lower Siang', 'Likabali Arunachal'] },
  { slug: 'lower-subansiri', queries: ['Ziro Valley Arunachal', 'Apatani valley Ziro', 'Tarin Fish Farm Ziro', 'Lower Subansiri'] },
  { slug: 'namsai', queries: ['Golden Pagoda Namsai', 'Kongmu Kham Golden Pagoda', 'Tengapani Namsai', 'Namsai Arunachal'] },
  { slug: 'pakke-kessang', queries: ['Pakke Tiger Reserve', 'Pakhui Wildlife Sanctuary', 'Pakke Kessang', 'Seijosa Pakke'] },
  { slug: 'papum-pare', queries: ['Ita Fort Itanagar', 'Ganga Lake Itanagar', 'Itanagar Gompa', 'Papum Pare'] },
  { slug: 'shi-yomi', queries: ['Mechuka Valley Shi Yomi', 'Menchukha valley', 'Samten Yongcha Mechuka', 'Shi Yomi'] },
  { slug: 'siang', queries: ['Boleng Siang', 'Pangin Siang', 'Siang river gorge', 'Siang district'] },
  { slug: 'tawang', queries: ['Tawang Monastery', 'Galden Namgey Lhatse', 'Sela Pass Tawang', 'Madhuri Lake'] },
  { slug: 'tirap', queries: ['Khonsa Tirap', 'Deomali Tirap', 'Khonsa town', 'Tirap Arunachal'] },
  { slug: 'upper-siang', queries: ['Tuting Upper Siang', 'Yingkiong Upper Siang', 'Mouling National Park', 'Upper Siang'] },
  { slug: 'upper-subansiri', queries: ['Daporijo Upper Subansiri', 'Menga Cave Daporijo', 'Subansiri river Daporijo', 'Daporijo'] },
  { slug: 'west-kameng', queries: ['Bomdila Monastery', 'Dirang Dzong West Kameng', 'Sangti Valley Dirang', 'West Kameng'] },
  { slug: 'west-siang', queries: ['Aalo West Siang', 'Darka village Aalo', 'Along West Siang', 'Yomgo river'] }
];

async function search(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=960&format=json`;
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

async function run() {
  console.log('=== PRE-AUDIT OF ALL 27 ARUNACHAL PRADESH DISTRICTS ===\n');
  const results = {};
  for (const d of DISTRICTS) {
    let found = [];
    for (const q of d.queries) {
      const candidates = await search(q);
      if (candidates.length > 0) {
        found = candidates;
        break;
      }
      await new Promise(r => setTimeout(r, 200));
    }
    results[d.slug] = found;
    if (found.length > 0) {
      console.log(`✓ [${d.slug}]: Found ${found.length} candidates (Top: "${found[0].title}", width: ${found[0].width})`);
    } else {
      console.log(`✗ [${d.slug}]: NO CANDIDATES FOUND!`);
    }
    await new Promise(r => setTimeout(r, 200));
  }
}

run();
