import fs from 'fs';

const USER_AGENT = 'ExploreIndia/2.0 (tourist-platform@exploreindia.org)';

const DISTRICTS = [
  { slug: 'bajali', queries: ['Pathsala Assam', 'Bajali Assam', 'Pari Hareswar Devalaya', 'Bajali district'] },
  { slug: 'baksa', queries: ['Manas National Park Mothanguri', 'Manas National Park Assam', 'Baksa Assam', 'Mothanguri Manas'] },
  { slug: 'barpeta', queries: ['Barpeta Satra Assam', 'Barpeta Kirtan Ghar', 'Barpeta Assam', 'Barpeta Satra'] },
  { slug: 'biswanath', queries: ['Biswanath Ghat Assam', 'Gupta Kashi Biswanath', 'Biswanath Chariali', 'Biswanath Assam'] },
  { slug: 'bongaigaon', queries: ['Bagheswari Temple Bongaigaon', 'Koyakujia Bongaigaon', 'Jogighopa caves', 'Bongaigaon Assam'] },
  { slug: 'cachar', queries: ['Khaspur Dimasa Cachar', 'Khaspur palace Silchar', 'Silchar Barak river', 'Cachar Assam'] },
  { slug: 'charaideo', queries: ['Charaideo Maidam', 'Charaideo Maidams Assam', 'Charaideo Ahom', 'Charaideo'] },
  { slug: 'chirang', queries: ['Champamati river Chirang', 'Kalamati Chirang', 'Chirang Assam', 'Chirang Bodoland'] },
  { slug: 'darrang', queries: ['Orang National Park Assam', 'Mangaldai Darrang Assam', 'Darrang Assam', 'Gandhi Smriti Park Mangaldai'] },
  { slug: 'dhemaji', queries: ['Gerukamukh Subansiri Dhemaji', 'Dhemaji Assam', 'Subansiri Dhemaji', 'Dhemaji district'] },
  { slug: 'dhubri', queries: ['Gurdwara Sri Guru Tegh Bahadur Sahib Dhubri', 'Dhubri Gurdwara', 'Dhubri Brahmaputra', 'Dhubri Assam'] },
  { slug: 'dibrugarh', queries: ['Bogibeel Bridge Dibrugarh', 'Bogibeel bridge Assam', 'Dibrugarh tea garden', 'Dibrugarh Brahmaputra'] },
  { slug: 'dima-hasao', queries: ['Haflong Lake Assam', 'Haflong hill station', 'Jatinga Assam', 'Maibang stone house', 'Dima Hasao'] },
  { slug: 'goalpara', queries: ['Sri Surya Pahar Goalpara', 'Surya Pahar Assam', 'Urpad Beel Goalpara', 'Goalpara Assam'] },
  { slug: 'golaghat', queries: ['Kaziranga National Park rhino', 'Deopahar Numaligarh', 'Kakochang waterfalls Golaghat', 'Kaziranga Kohora'] },
  { slug: 'hailakandi', queries: ['Siddheshwar temple Badarpurghat', 'Hailakandi Assam', 'Hailakandi tea garden', 'Hailakandi district'] },
  { slug: 'hojai', queries: ['Akashiganga waterfalls Hojai', 'Doboka archaeological Hojai', 'Hojai Assam', 'Akashiganga Assam'] },
  { slug: 'jorhat', queries: ['Hoollongapar Gibbon Sanctuary', 'Tocklai Tea Research Jorhat', 'Sukapha Samannay Kshetra Jorhat', 'Cinnamara Tea Estate'] },
  { slug: 'kamrup', queries: ['Hajo Hayagriva Madhava temple', 'Powa Mecca Hajo', 'Sualkuchi silk weaving Assam', 'Sualkuchi Assam'] },
  { slug: 'kamrup-metropolitan', queries: ['Kamakhya Temple Guwahati', 'Umananda Temple Guwahati', 'Deepor Beel Guwahati', 'Guwahati Brahmaputra riverfront'] },
  { slug: 'karbi-anglong', queries: ['Diphu Karbi Anglong', 'Taralangso Diphu', 'Silbheta Karbi Anglong', 'Karbi Anglong landscape'] },
  { slug: 'karimganj', queries: ['Son Beel wetland Karimganj', 'Kushiyara river Karimganj', 'Karimganj Assam', 'Sonbeel Assam'] },
  { slug: 'kokrajhar', queries: ['Chakrashila Wildlife Sanctuary Golden Langur', 'Chakrashila Kokrajhar', 'Bodoland Kokrajhar', 'Gaurang river Kokrajhar'] },
  { slug: 'lakhimpur', queries: ['Basudev Than Lakhimpur', 'Ranganadi Lakhimpur', 'North Lakhimpur Assam', 'Lakhimpur Assam'] },
  { slug: 'majuli', queries: ['Majuli island Satra', 'Kamalabari Satra Majuli', 'Dakhinpat Satra Majuli', 'Samaguri Satra mask Majuli'] },
  { slug: 'morigaon', queries: ['Pobitora Wildlife Sanctuary rhino', 'Mayong Morigaon Assam', 'Pobitora sanctuary', 'Morigaon Assam'] },
  { slug: 'nagaon', queries: ['Batadrava Than Bordowa Nagaon', 'Bordowa Than Sankardev', 'Champawati Kunda Nagaon', 'Nagaon Assam'] },
  { slug: 'nalbari', queries: ['Hari Mandir Nalbari', 'Billeshwar Temple Nalbari', 'Nalbari Raas Mahotsav', 'Nalbari Assam'] },
  { slug: 'sivasagar', queries: ['Rang Ghar Sivasagar', 'Talatal Ghar Sivasagar', 'Sivasagar Sivadol', 'Joysagar Sivasagar'] },
  { slug: 'sonitpur', queries: ['Agnigarh Tezpur Assam', 'Mahabhairab Temple Tezpur', 'Kolia Bhomora Setu Tezpur', 'Tezpur Brahmaputra'] },
  { slug: 'south-salmara-mankachar', queries: ['Mir Jumla tomb Mankachar', 'Mankachar Assam', 'Kalo dam Mankachar', 'South Salmara'] },
  { slug: 'tamulpur', queries: ['Daranga Mela Tamulpur', 'Tamulpur Assam', 'Tamulpur district', 'Borolia river Tamulpur'] },
  { slug: 'tinsukia', queries: ['Dibru-Saikhowa National Park feral horses', 'Digboi oil centenary museum', 'Margherita tea estate Tinsukia', 'Tinsukia Assam'] },
  { slug: 'udalguri', queries: ['Bhairabkunda Udalguri Assam', 'Bhairabkunda picnic spot', 'Udalguri Assam', 'Udalguri district'] },
  { slug: 'west-karbi-anglong', queries: ['Umrangso Kopili lake', 'Khandong dam Umrangso', 'Umrangso West Karbi Anglong', 'West Karbi Anglong'] }
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
  console.log('=== PRE-AUDIT OF ALL 35 ASSAM DISTRICTS ===\n');
  let success = 0;
  for (const d of DISTRICTS) {
    let found = [];
    let matchedQuery = '';
    for (const q of d.queries) {
      const candidates = await search(q);
      if (candidates.length > 0) {
        found = candidates;
        matchedQuery = q;
        break;
      }
      await new Promise(r => setTimeout(r, 150));
    }
    if (found.length > 0) {
      console.log(`✓ [${d.slug.padEnd(24)}]: Found ${found.length} (Query: "${matchedQuery}", Top: "${found[0].title}", w: ${found[0].width})`);
      success++;
    } else {
      console.log(`✗ [${d.slug.padEnd(24)}]: NO CANDIDATES FOUND!`);
    }
    await new Promise(r => setTimeout(r, 150));
  }
  console.log(`\nPre-audit complete: ${success} / 35 districts matched candidates.`);
}

run();
