const DISTRICTS = [
  { slug: 'araria', name: 'Araria', query: 'Araria Bihar' },
  { slug: 'arwal', name: 'Arwal', query: 'Arwal Bihar' },
  { slug: 'aurangabad', name: 'Aurangabad', query: 'Deo Sun Temple Bihar' },
  { slug: 'banka', name: 'Banka', query: 'Mandar Hill Bihar' },
  { slug: 'begusarai', name: 'Begusarai', query: 'Kanwar Lake Bihar' },
  { slug: 'bhagalpur', name: 'Bhagalpur', query: 'Vikramshila Bihar' },
  { slug: 'bhojpur', name: 'Bhojpur', query: 'Kunwar Singh Bhojpur' },
  { slug: 'buxar', name: 'Buxar', query: 'Buxar Fort Bihar' },
  { slug: 'darbhanga', name: 'Darbhanga', query: 'Darbhanga Raj Palace' },
  { slug: 'east-champaran', name: 'East Champaran', query: 'Kesariya Stupa Bihar' },
  { slug: 'gaya', name: 'Gaya', query: 'Mahabodhi Temple Bodh Gaya' },
  { slug: 'gopalganj', name: 'Gopalganj', query: 'Thawe Mandir Gopalganj' },
  { slug: 'jamui', name: 'Jamui', query: 'Jamui Bihar' },
  { slug: 'jehanabad', name: 'Jehanabad', query: 'Barabar Caves Bihar' },
  { slug: 'kaimur', name: 'Kaimur', query: 'Mundeshwari Temple Kaimur' },
  { slug: 'katihar', name: 'Katihar', query: 'Katihar Bihar' },
  { slug: 'khagaria', name: 'Khagaria', query: 'Khagaria Bihar' },
  { slug: 'kishanganj', name: 'Kishanganj', query: 'Kishanganj Bihar' },
  { slug: 'lakhisarai', name: 'Lakhisarai', query: 'Ashokdham Lakhisarai' },
  { slug: 'madhepura', name: 'Madhepura', query: 'Singheshwar Sthan Madhepura' },
  { slug: 'madhubani', name: 'Madhubani', query: 'Rajnagar Palace Madhubani' },
  { slug: 'munger', name: 'Munger', query: 'Munger Fort Bihar' },
  { slug: 'muzaffarpur', name: 'Muzaffarpur', query: 'Muzaffarpur Bihar' },
  { slug: 'nalanda', name: 'Nalanda', query: 'Nalanda Mahavihara ruins' },
  { slug: 'nawada', name: 'Nawada', query: 'Kakolat Falls Nawada' },
  { slug: 'patna', name: 'Patna', query: 'Golghar Patna' },
  { slug: 'purnia', name: 'Purnia', query: 'Purnia Bihar' },
  { slug: 'rohtas', name: 'Rohtas', query: 'Tomb of Sher Shah Suri Sasaram' },
  { slug: 'saharsa', name: 'Saharsa', query: 'Saharsa Bihar' },
  { slug: 'samastipur', name: 'Samastipur', query: 'Samastipur Bihar' },
  { slug: 'saran', name: 'Saran', query: 'Chhapra Saran Bihar' },
  { slug: 'sheikhpura', name: 'Sheikhpura', query: 'Sheikhpura Bihar' },
  { slug: 'sheohar', name: 'Sheohar', query: 'Sheohar Bihar' },
  { slug: 'sitamarhi', name: 'Sitamarhi', query: 'Sitamarhi Bihar' },
  { slug: 'siwan', name: 'Siwan', query: 'Siwan Bihar' },
  { slug: 'supaul', name: 'Supaul', query: 'Supaul Bihar' },
  { slug: 'vaishali', name: 'Vaishali', query: 'Ashoka Pillar Vaishali' },
  { slug: 'west-champaran', name: 'West Champaran', query: 'Valmiki National Park' }
];

async function testAll() {
  console.log('=== PRE-AUDIT OF ALL 38 BIHAR DISTRICTS ===\n');
  const userAgent = 'ExploreIndia/2.0 (contact@exploreindia.org) MediaWikiAPI/2.0';

  for (const d of DISTRICTS) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(d.query + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=960&format=json`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': userAgent } });
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {});
      const valid = pages.filter(p => !p.title.endsWith('.pdf') && !p.title.endsWith('.svg'));
      if (valid.length > 0) {
        console.log(`✓ [${d.slug.padEnd(20)}]: Found ${valid.length} (Query: "${d.query}", Top: "${valid[0].title}", w: ${valid[0].imageinfo?.[0]?.width})`);
      } else {
        console.log(`✗ [${d.slug.padEnd(20)}]: NO BITMAP FOUND (Query: "${d.query}")`);
      }
    } catch (err) {
      console.log(`! [${d.slug.padEnd(20)}]: ERROR ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 120));
  }
}

testAll();
