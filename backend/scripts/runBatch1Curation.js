import fs from 'fs';
import path from 'path';
import { curateState } from './curationCore.js';

const MEGHALAYA_CONFIG = {
  name: 'Meghalaya',
  slug: 'meghalaya',
  heroDesc: 'Thunderous plunge of Nohkalikai Falls into turquoise plunge pool near Cherrapunji, Meghalaya',
  heroQueries: ['Nohkalikai Falls Cherrapunji', 'Nohkalikai Falls Meghalaya', 'Krang Suri Falls Jowai'],
  cardDesc: 'Ancient living double-decker root bridge woven across jungle rivers at Nongriat, Meghalaya',
  cardQueries: ['Double decker living root bridge Nongriat', 'Living root bridge Cherrapunji', 'Umngot River Dawki Meghalaya'],
  districts: [
    {
      slug: 'east-garo-hills',
      location: 'Scenic cascade of Rongbang Falls and forested banks of Simsang River in East Garo Hills',
      queries: ['Rongbang Falls', 'Williamnagar Simsang', 'East Garo Hills', 'Simsang River Meghalaya']
    },
    {
      slug: 'east-jaintia-hills',
      location: 'Subterranean limestone wonder of Krem Liat Prah and vibrant blue waters of Lukha River, East Jaintia Hills',
      queries: ['Krem Liat Prah', 'Lukha River Meghalaya', 'Umlawan Cave', 'Narpuh Wildlife Sanctuary Meghalaya', 'Khliehriat Meghalaya']
    },
    {
      slug: 'east-khasi-hills',
      location: 'Towering drop of Nohkalikai Falls and misty gorge cliffs of Laitlum Canyons, East Khasi Hills',
      queries: ['Nohkalikai Falls', 'Laitlum Canyon', 'Mawsmai Cave Cherrapunji', 'Cherrapunji waterfall']
    },
    {
      slug: 'eastern-west-khasi-hills',
      location: 'Massive monolithic granite dome of Kyllang Rock and rolling emerald pine highlands of Mairang',
      queries: ['Kyllang Rock', 'Mairang Meghalaya', 'Symper Rock Meghalaya', 'Eastern West Khasi Hills']
    },
    {
      slug: 'north-garo-hills',
      location: 'Natural geothermal springs and tranquil forested hill ranges of Resubelpara, North Garo Hills',
      queries: ['Resubelpara Meghalaya', 'North Garo Hills', 'Mendipathar Meghalaya', 'Garo Hills stream']
    },
    {
      slug: 'ri-bhoi',
      location: 'Vast shimmering waters and pine-fringed islets of Umiam Lake (Barapani) in Ri Bhoi',
      queries: ['Umiam Lake Meghalaya', 'Barapani Lake', 'Umiam Dam', 'Nongpoh Meghalaya']
    },
    {
      slug: 'south-garo-hills',
      location: 'Deep limestone caverns of Siju Cave and pristine rainforest wilderness of Balpakram National Park',
      queries: ['Balpakram National Park', 'Siju Cave Garo', 'Balpakram Meghalaya', 'Baghmara Meghalaya']
    },
    {
      slug: 'south-west-garo-hills',
      location: 'Rolling riverine landscapes of Ampati and historical riverside heritage of South West Garo Hills',
      queries: ['Ampati Meghalaya', 'South West Garo Hills', 'Garo Hills landscape', 'Garo Hills Meghalaya']
    },
    {
      slug: 'south-west-khasi-hills',
      location: 'Spectacular river gorge of Ranikor and serene mountain streams of Mawkyrwat, South West Khasi Hills',
      queries: ['Ranikor Meghalaya', 'Mawkyrwat Meghalaya', 'Ranikor river', 'South West Khasi Hills']
    },
    {
      slug: 'west-garo-hills',
      location: 'Picturesque Pelga Falls and biodiversity-rich cloud forests of Nokrek Biosphere Reserve, West Garo Hills',
      queries: ['Pelga Falls Tura', 'Nokrek National Park', 'Tura Peak Meghalaya', 'Nokrek Biosphere']
    },
    {
      slug: 'west-jaintia-hills',
      location: 'Magical turquoise pool of Krang Suri Falls and ancient megalithic stone park at Nartiang, West Jaintia Hills',
      queries: ['Krang Suri Falls', 'Dawki river Umngot', 'Nartiang Monoliths', 'Thadlaskein Lake Jowai']
    },
    {
      slug: 'west-khasi-hills',
      location: 'Riverine island beaches of Nongkhnum and dramatic roaring cascades of Langshiang Falls, West Khasi Hills',
      queries: ['Nongkhnum Island Meghalaya', 'Langshiang Falls', 'Weinia Falls Nongstoin', 'West Khasi Hills']
    }
  ]
};

const MIZORAM_CONFIG = {
  name: 'Mizoram',
  slug: 'mizoram',
  heroDesc: 'Breathtaking multi-tiered cascade of Vantawng Falls plunging down forested cliff face near Thenzawl, Mizoram',
  heroQueries: ['Vantawng Falls Mizoram', 'Vantawng Falls', 'Phawngpui Blue Mountain Mizoram'],
  cardDesc: 'Serene natural mirror waters of Tam Dil lake surrounded by lush tropical evergreen rainforest, Mizoram',
  cardQueries: ['Tam Dil Lake Mizoram', 'Tam Dil Mizoram', 'Reiek Tlang Mizoram', 'Aizawl city night'],
  districts: [
    {
      slug: 'aizawl',
      location: 'Panoramic mountain ridge vistas of Aizawl city and marble sanctuary of Solomon Temple, Aizawl',
      queries: ['Solomon Temple Aizawl', 'Durtlang Hills Aizawl', 'KV Paradise Aizawl', 'Aizawl Mizoram']
    },
    {
      slug: 'champhai',
      location: 'Heart-shaped natural mirror lake of Rih Dil and emerald terraced rice valley of Champhai',
      queries: ['Rih Dil lake', 'Champhai Mizoram', 'Lianchhiari lunglen tlang', 'Zokhawthar Champhai']
    },
    {
      slug: 'hnahthial',
      location: 'Rugged forested crags of Khawnglung Wildlife Sanctuary and pristine mountain valleys of Hnahthial',
      queries: ['Khawnglung Wildlife', 'Tuipui river Mizoram', 'Hnahthial Mizoram', 'Mizoram hills landscape']
    },
    {
      slug: 'khawzawl',
      location: 'Ancient megalithic standing stone heritage of Kawtchhuah Ropui and breezy pine hills of Khawzawl',
      queries: ['Kawtchhuah Ropui', 'Chalfilh tourist resort', 'Khawzawl Mizoram', 'Mizoram village landscape']
    },
    {
      slug: 'kolasib',
      location: 'Expansive reservoir waters of Serlui B Dam and lush bamboo-carpeted hillocks of Kolasib',
      queries: ['Serlui B Dam Kolasib', 'Bairabi Mizoram', 'Kolasib Mizoram', 'Serlui Dam']
    },
    {
      slug: 'lawngtlai',
      location: 'Majestic cloud-wrapped summit of Phawngpui (Blue Mountain) and pristine rainforests of Lawngtlai',
      queries: ['Phawngpui Peak Mizoram', 'Blue Mountain Phawngpui', 'Ngengpui Wildlife', 'Lawngtlai Mizoram']
    },
    {
      slug: 'lunglei',
      location: 'Natural bridge of rock formation and sweeping scenic sunrise view from Sairep peak, Lunglei',
      queries: ['Lunglei rock bridge', 'Lunglei Mizoram', 'Sairep viewpoint Lunglei', 'Serkawn Lunglei']
    },
    {
      slug: 'mamit',
      location: 'Dense wilderness corridors and tiger habitats of Dampa Tiger Reserve in Mamit',
      queries: ['Dampa Tiger Reserve Mizoram', 'Dampa Sanctuary', 'Mamit Mizoram', 'Dampa tiger']
    },
    {
      slug: 'saitual',
      location: 'Pristine emerald waters and tranquil boating haven of Tam Dil Lake, Saitual',
      queries: ['Tam Dil Lake Saitual', 'Tamdil lake Mizoram', 'Saitual Mizoram', 'Tam Dil']
    },
    {
      slug: 'serchhip',
      location: 'Magnificent 750-foot gorge drop of Vantawng Falls and handloom weaving town of Thenzawl, Serchhip',
      queries: ['Vantawng Falls Serchhip', 'Thenzawl waterfall', 'Thenzawl Mizoram', 'Tuirial river']
    },
    {
      slug: 'siaha',
      location: 'Enchanting oval natural lake of Palak Dil (Pala Tipo) and rich Mara cultural heritage of Siaha',
      queries: ['Palak Dil Lake', 'Palak Lake Mizoram', 'Siaha Mizoram', 'Pala Tipo']
    }
  ]
};

const NAGALAND_CONFIG = {
  name: 'Nagaland',
  slug: 'nagaland',
  heroDesc: 'Rolling emerald green hillocks and pristine mountain streams of enchanting Dzukou Valley, Nagaland',
  heroQueries: ['Dzukou Valley Nagaland', 'Dzukou Valley', 'Kisama Heritage Village Hornbill'],
  cardDesc: 'Carved traditional morung clan architecture and ceremonial log drums of Kisama Naga Heritage Village, Nagaland',
  cardQueries: ['Kisama Naga Heritage Village', 'Kohima War Cemetery Nagaland', 'Hornbill Festival Nagaland', 'Khonoma village'],
  districts: [
    {
      slug: 'ch-moukedima',
      location: 'Picturesque cascades of Triple Falls and scenic picnic hills overlooking Chümoukedima',
      queries: ['Triple Falls Chumukedima', 'Chumukedima waterfall', 'Chumukedima Nagaland', 'Chumukedima hills']
    },
    {
      slug: 'dimapur',
      location: 'Ancient 10th-century monolithic mushroom-shaped pillars of Kachari Ruins in Dimapur',
      queries: ['Kachari Ruins Dimapur', 'Dimapur Kachari monoliths', 'Diezephe Craft Village', 'Dimapur Nagaland']
    },
    {
      slug: 'kiphire',
      location: 'Majestic snow-kissed crown of Mount Saramati (highest peak in Nagaland) and limestone Mimi Caves in Kiphire',
      queries: ['Mount Saramati Nagaland', 'Fakim Wildlife Sanctuary', 'Kiphire Nagaland', 'Mimi caves Nagaland']
    },
    {
      slug: 'kohima',
      location: 'Terraced garden memorial of historic Kohima War Cemetery and panoramic Japfu Peak ridge in Kohima',
      queries: ['Kohima War Cemetery', 'Kisama Heritage Village Kohima', 'Khonoma village Nagaland', 'Japfu Peak Kohima']
    },
    {
      slug: 'longleng',
      location: 'Panoramic heights of Yingnyushang Mountain and vibrant Phom tribal handicrafts in Longleng',
      queries: ['Yingnyushang Mountain Longleng', 'Longleng Nagaland', 'Dikhu river Nagaland', 'Phom Nagaland']
    },
    {
      slug: 'meluri',
      location: 'Sacred footprint-shaped waters of pristine Shilloi Lake nestled amidst pine valleys of Meluri',
      queries: ['Shilloi Lake Nagaland', 'Shilloi Lake Meluri', 'Meluri Nagaland', 'Lacham Lake Nagaland']
    },
    {
      slug: 'mokokchung',
      location: 'Ancient Ao tribal capital village of Ungma and picturesque misty mountain ridges of Longkhum, Mokokchung',
      queries: ['Ungma village Mokokchung', 'Longkhum Mokokchung', 'Mopungchuket village', 'Mokokchung Nagaland']
    },
    {
      slug: 'mon',
      location: 'Famous cross-border chieftain palace of Longwa village and tattooed Konyak warrior heritage in Mon',
      queries: ['Longwa village Mon Nagaland', 'Longwa village', 'Shangnyu village Mon', 'Konyak Nagaland Mon']
    },
    {
      slug: 'niuland',
      location: 'Serene bamboo forests and fertile riverine plains of Dhansiri River basin in Niuland',
      queries: ['Niuland Nagaland', 'Dhansiri river Nagaland', 'Niuland district', 'Nagaland river landscape']
    },
    {
      slug: 'noklak',
      location: 'Rugged eastern border highlands of Pangsha and rich Khiamniungan cultural heritage in Noklak',
      queries: ['Noklak Nagaland', 'Pangsha Nagaland', 'Khiamniungan Nagaland', 'Noklak hills']
    },
    {
      slug: 'peren',
      location: 'Pristine virgin rainforests of Ntangki National Park and traditional green terraced fields of Benreu, Peren',
      queries: ['Ntangki National Park', 'Intanki National Park Nagaland', 'Benreu village Peren', 'Mount Pauna Peren']
    },
    {
      slug: 'phek',
      location: 'Breath-taking cloud canopy atop Glory Peak in Pfutsero and historic ancestral heritage village of Khezhakeno, Phek',
      queries: ['Pfutsero Glory Peak', 'Khezhakeno village Phek', 'Pfutsero Nagaland', 'Phek Nagaland landscape']
    },
    {
      slug: 'shamator',
      location: 'Scenic foothills of Mount Saramati range and traditional Yimkhiung cultural heritage in Shamator',
      queries: ['Shamator Nagaland', 'Chessore Nagaland', 'Yayi river Shamator', 'Saramati foothills Nagaland']
    },
    {
      slug: 'tseminy',
      location: 'Historic stone monoliths and rich indigenous architectural traditions of Rengma Naga heritage in Tseminyu',
      queries: ['Tseminyu Nagaland', 'Rengma Nagaland', 'Tseminyu heritage', 'Nagaland village monolith']
    },
    {
      slug: 'tuensang',
      location: 'Mighty peak of Mount Tsongao and traditional Chang cultural morungs in the hills of Tuensang',
      queries: ['Tuensang Nagaland', 'Mount Tsongao Tuensang', 'Chang Naga Tuensang', 'Tuensang landscape']
    },
    {
      slug: 'wokha',
      location: 'Spectacular reservoir vistas of Doyang River (global roosting haven of Amur Falcons) and Mount Tiyi in Wokha',
      queries: ['Doyang Reservoir Wokha', 'Amur Falcon Doyang', 'Mount Tiyi Wokha', 'Doyang river Nagaland']
    },
    {
      slug: 'z-nheboto',
      location: 'Pristine rhododendron sanctuaries of Satoi Range and vibrant Sumi warrior traditions in Zünheboto',
      queries: ['Zunheboto Nagaland', 'Satoi Range Nagaland', 'Ghosu bird sanctuary Zunheboto', 'Zunheboto landscape']
    }
  ]
};

async function run() {
  const meghalaya = await curateState(MEGHALAYA_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedMeghalayaDataset.json', JSON.stringify(meghalaya, null, 2));
  console.log('Saved verifiedMeghalayaDataset.json');

  const mizoram = await curateState(MIZORAM_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedMizoramDataset.json', JSON.stringify(mizoram, null, 2));
  console.log('Saved verifiedMizoramDataset.json');

  const nagaland = await curateState(NAGALAND_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedNagalandDataset.json', JSON.stringify(nagaland, null, 2));
  console.log('Saved verifiedNagalandDataset.json');

  console.log('\n=== BATCH 1 (MEGHALAYA, MIZORAM, NAGALAND) COMPLETED ===');
}

run().catch(console.error);
