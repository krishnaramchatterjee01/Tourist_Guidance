import { getPool, closePool } from '../src/config/db.js';

export const UT_DISTRICTS_DATA = {
  'andaman-and-nicobar-islands': {
    stateId: 29,
    districts: [
      {
        name: 'Nicobar',
        slug: 'nicobar',
        headquarters: 'Car Nicobar',
        division: 'Nicobar Division',
        tagline: 'Emerald Coral Atolls and Pristine Southern Biosphere',
        shortDescription: 'The southernmost island group of India, featuring dense rainforests and marine biodiversity.',
        fullDescription: 'Nicobar district encompasses the southern islands of the archipelago, including Great Nicobar and Car Nicobar. Celebrated for the Great Nicobar Biosphere Reserve and Indira Point, it boasts emerald waters, coral reefs, and unique tribal heritage.',
        bestTimeToVisit: 'November to April',
        knownFor: 'Biosphere Reserves, Coral Reefs, Indira Point'
      },
      {
        name: 'North and Middle Andaman',
        slug: 'north-and-middle-andaman',
        headquarters: 'Mayabunder',
        division: 'Andaman Division',
        tagline: 'Limestone Caves, Turtle Nesting Beaches & Saddle Peak',
        shortDescription: 'Home to Saddle Peak National Park, exotic limestone caves at Baratang, and pristine turtle nesting beaches.',
        fullDescription: 'North and Middle Andaman is celebrated for its untamed natural landscapes, active mud volcanoes, Baratang limestone caves, and Ross & Smith Twin Islands connected by a natural sandbar.',
        bestTimeToVisit: 'October to May',
        knownFor: 'Baratang Caves, Mud Volcanoes, Ross & Smith Islands, Saddle Peak'
      },
      {
        name: 'South Andaman',
        slug: 'south-andaman',
        headquarters: 'Port Blair',
        division: 'Andaman Division',
        tagline: 'Historical Cellular Jail & World-Class Radhanagar Beach',
        shortDescription: 'The bustling hub of the archipelago, home to historical Cellular Jail, Swaraj Dweep (Havelock), and Shaheed Dweep (Neil).',
        fullDescription: 'South Andaman is the tourism epicenter of the islands, featuring the historic Cellular Jail in Port Blair, the world-famous Radhanagar Beach at Swaraj Dweep, turquoise waters for scuba diving, and Chidiya Tapu sunset point.',
        bestTimeToVisit: 'October to May',
        knownFor: 'Cellular Jail, Radhanagar Beach, Scuba Diving, Coral Reefs'
      }
    ]
  },
  'chandigarh': {
    stateId: 30,
    districts: [
      {
        name: 'Chandigarh',
        slug: 'chandigarh',
        headquarters: 'Chandigarh',
        division: 'Chandigarh',
        tagline: 'Le Corbusier Architecture, Rock Garden & Sukhna Lake',
        shortDescription: 'India\'s first planned city, celebrated worldwide for its urban architecture and landscaped public gardens.',
        fullDescription: 'Designed by Swiss-French architect Le Corbusier, Chandigarh is a masterpiece of modern urbanism. Renowned for the unique sculpture gardens of Nek Chand\'s Rock Garden, tranquil Sukhna Lake, the UNESCO-recognized Capitol Complex, and the sprawling Zakir Hussain Rose Garden.',
        bestTimeToVisit: 'September to March',
        knownFor: 'Rock Garden, Sukhna Lake, Capitol Complex, Rose Garden'
      }
    ]
  },
  'dadra-and-nagar-haveli-and-daman-and-diu': {
    stateId: 31,
    districts: [
      {
        name: 'Dadra and Nagar Haveli',
        slug: 'dadra-and-nagar-haveli',
        headquarters: 'Silvassa',
        division: 'Dadra and Nagar Haveli',
        tagline: 'Lush Green Forests, Tribal Culture & Tranquil Dudhni Lake',
        shortDescription: 'Nestled between Gujarat and Maharashtra, famed for Silvassa\'s Portuguese heritage and verdant nature.',
        fullDescription: 'Dadra and Nagar Haveli offers a serene retreat with rolling green hills, rich Warli tribal heritage, the scenic Dudhni lake watersports hub, Vanganga Garden, and lion safaris in Vasona.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Silvassa Gardens, Dudhni Lake, Tribal Art, Nature Trails'
      },
      {
        name: 'Daman',
        slug: 'daman',
        headquarters: 'Daman',
        division: 'Daman',
        tagline: 'Moti Daman Portuguese Forts & Golden Jampore Beach',
        shortDescription: 'An idyllic coastal enclave boasting massive 16th-century Portuguese fortifications and scenic beaches.',
        fullDescription: 'Daman is steeped in four centuries of Portuguese colonial history, featuring the imposing Moti Daman and Nani Daman forts, the Church of Bom Jesus, and popular sunset coastlines at Jampore Beach and Devka Beach.',
        bestTimeToVisit: 'October to April',
        knownFor: 'Moti Daman Fort, Bom Jesus Church, Jampore Beach, Colonial Heritage'
      },
      {
        name: 'Diu',
        slug: 'diu',
        headquarters: 'Diu',
        division: 'Diu',
        tagline: 'Sea-Girt Diu Fort, Naida Caves & Pristine Nagoa Beach',
        shortDescription: 'A picturesque island fortress featuring grand maritime bastions, labyrinthine sea caves, and crescent beaches.',
        fullDescription: 'Diu is an enchanting island off the southern coast of Saurashtra, famed for the dramatic Diu Fort surrounded by the Arabian Sea, the otherworldly natural rock formations of Naida Caves, St. Paul\'s Church, and water sports at Nagoa Beach.',
        bestTimeToVisit: 'October to April',
        knownFor: 'Diu Fort, Naida Caves, Nagoa Beach, St. Paul\'s Church'
      }
    ]
  },
  'delhi': {
    stateId: 32,
    districts: [
      {
        name: 'Central Delhi',
        slug: 'central-delhi',
        headquarters: 'Daryaganj',
        division: 'Central',
        tagline: 'Historic Shahjahanabad, Mughal Splendor & Jama Masjid',
        shortDescription: 'The heart of historic Old Delhi, featuring Mughal bazaars, monumental mosques, and colonial heritage.',
        fullDescription: 'Central Delhi encompasses the historic core of Shahjahanabad, home to the magnificent Jama Masjid, the bustling alleys of Chandni Chowk, Daryaganj, and the historic Red Fort periphery along the Yamuna.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Jama Masjid, Chandni Chowk, Daryaganj Heritage'
      },
      {
        name: 'East Delhi',
        slug: 'east-delhi',
        headquarters: 'Preet Vihar',
        division: 'East',
        tagline: 'Colossal Akshardham Temple & Yamuna Riverfront',
        shortDescription: 'Home to the magnificent Akshardham Temple complex and vibrant cultural institutions along the Yamuna.',
        fullDescription: 'East Delhi is defined by the architectural marvel of Swaminarayan Akshardham Temple, Sanjay Lake gardens, and bustling cultural hubs showcasing traditional arts and modern urban development.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Akshardham Temple, Sanjay Lake, Yamuna Sports Complex'
      },
      {
        name: 'New Delhi',
        slug: 'new-delhi',
        headquarters: 'Connaught Place',
        division: 'New Delhi',
        tagline: 'Imperial Lutyens Delhi, India Gate & Rashtrapati Bhavan',
        shortDescription: 'The political capital of India, designed by Edwin Lutyens with grand boulevards and national monuments.',
        fullDescription: 'New Delhi is the sovereign heart of India, featuring iconic landmarks including the India Gate war memorial, Rashtrapati Bhavan, Parliament House, the colonnaded Georgian circles of Connaught Place, and the serene gardens of Lodhi Estate.',
        bestTimeToVisit: 'October to March',
        knownFor: 'India Gate, Rashtrapati Bhavan, Connaught Place, Lodhi Gardens'
      },
      {
        name: 'North Delhi',
        slug: 'north-delhi',
        headquarters: 'Alipur',
        division: 'North',
        tagline: 'Historic Delhi Ridge, Mutiny Memorial & University Heritage',
        shortDescription: 'Characterized by the historic Northern Ridge, colonial monuments, and prestigious academic campuses.',
        fullDescription: 'North Delhi features the forested slopes of the Northern Ridge, Ashoka Pillar, Mutiny Memorial, Vice Regal Lodge, and historical monuments tracing Delhi\'s pivotal 19th-century history.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Northern Ridge, Mutiny Memorial, Flagstaff Tower, University Enclave'
      },
      {
        name: 'North East Delhi',
        slug: 'north-east-delhi',
        headquarters: 'Nand Nagri',
        division: 'North East',
        tagline: 'Vibrant Riverfront Communities and Yamuna Biodiversity',
        shortDescription: 'Bordering the Yamuna river with scenic wetlands and traditional artisan communities.',
        fullDescription: 'North East Delhi spans the eastern banks of the Yamuna, featuring riverfront biodiversity parks, vibrant local markets, and traditional handicraft centers.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Yamuna Riverfront, Biodiversity Parks, Local Markets'
      },
      {
        name: 'North West Delhi',
        slug: 'north-west-delhi',
        headquarters: 'Kanjhawala',
        division: 'North West',
        tagline: 'Adventure Island, Urban Lakes & Modern Recreation Parks',
        shortDescription: 'A thriving district celebrated for expansive theme parks, sports complexes, and serene lakes.',
        fullDescription: 'North West Delhi is home to premier recreation hubs including Adventure Island and Metro Walk at Rohini, Japanese Park, and historic villages preserving traditional Delhi culture.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Adventure Island Rohini, Japanese Park, Heritage Baolis'
      },
      {
        name: 'Shahdara',
        slug: 'shahdara',
        headquarters: 'Shahdara',
        division: 'Shahdara',
        tagline: 'Historic Mughal Marketplaces and Eastern Heritage',
        shortDescription: 'One of Delhi\'s oldest historic trading localities founded during the Mughal era.',
        fullDescription: 'Shahdara, originally founded as a royal marketplace during Shah Jahan\'s reign, is rich with historic havelis, ancient temples, and proximity to major trans-Yamuna cultural landmarks.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Mughal Heritage, Historic Havelis, Traditional Bazaars'
      },
      {
        name: 'South Delhi',
        slug: 'south-delhi',
        headquarters: 'Saket',
        division: 'South',
        tagline: 'UNESCO Qutub Minar, Mehrauli Archaeological Park & Lotus Temple',
        shortDescription: 'The cultural and architectural showcase of Delhi, with medieval ruins and the world-famous Bahai Lotus Temple.',
        fullDescription: 'South Delhi boasts world-renowned heritage attractions including the 12th-century Qutub Minar complex, the expansive Mehrauli Archaeological Park, the tranquil white petals of the Lotus Temple, and historic monuments spanning seven centuries.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Qutub Minar, Lotus Temple, Mehrauli Archaeological Park, Hauz Khas'
      },
      {
        name: 'South East Delhi',
        slug: 'south-east-delhi',
        headquarters: 'Defence Colony',
        division: 'South East',
        tagline: 'UNESCO Humayun\'s Tomb, Nizamuddin Dargah & Lotus Shrines',
        shortDescription: 'Home to the magnificent precursor to the Taj Mahal and sacred Sufi shrines.',
        fullDescription: 'South East Delhi features Humayun\'s Tomb—a sublime UNESCO World Heritage Site in Persian-Mughal style—the venerable Hazrat Nizamuddin Dargah, Sunder Nursery heritage park, and the historic fortress of Tughlaqabad.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Humayun\'s Tomb, Sunder Nursery, Nizamuddin Dargah, Tughlaqabad Fort'
      },
      {
        name: 'South West Delhi',
        slug: 'south-west-delhi',
        headquarters: 'Kapashera',
        division: 'South West',
        tagline: 'International Gateway, Air Force Museum & Dwarka Heritage',
        shortDescription: 'Home to the National Air Force Museum, Dwarka baolis, and modern hospitality districts.',
        fullDescription: 'South West Delhi connects ancient history with modern aviation, featuring the Indian Air Force Museum, the historic Dwarka Baoli, and modern cultural centers.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Air Force Museum, Dwarka Baoli, Cultural Centers'
      },
      {
        name: 'West Delhi',
        slug: 'west-delhi',
        headquarters: 'Shivaji Place, Rajouri Garden',
        division: 'West',
        tagline: 'Vibrant Culinary Street Life, District Parks & Heritage Baolis',
        shortDescription: 'Celebrated for Punjabi culinary culture, sprawling district parks, and medieval monuments.',
        fullDescription: 'West Delhi is a bustling cultural and commercial hub, featuring vibrant food streets in Rajouri Garden and Tilak Nagar, the historic Hastsal Minar, and expansive district green parks.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Hastsal Minar, District Parks, Rajouri Garden Culture'
      }
    ]
  },
  'jammu-and-kashmir': {
    stateId: 33,
    districts: [
      {
        name: 'Anantnag',
        slug: 'anantnag',
        headquarters: 'Anantnag',
        division: 'Kashmir Division',
        tagline: 'Pahalgam Valley of Shepherds, Lidder River & Martand Sun Temple',
        shortDescription: 'The land of perennial springs, alpine meadows of Pahalgam, and ancient Martand ruins.',
        fullDescription: 'Anantnag, the commercial capital of South Kashmir, is world-famous for Pahalgam (the Valley of Shepherds), the gushing Lidder River, Betaab Valley, Aru Valley, and the 8th-century Martand Sun Temple ruins.',
        bestTimeToVisit: 'April to October',
        knownFor: 'Pahalgam, Lidder River, Martand Sun Temple, Betaab Valley'
      },
      {
        name: 'Bandipora',
        slug: 'bandipora',
        headquarters: 'Bandipora',
        division: 'Kashmir Division',
        tagline: 'Asia\'s Largest Freshwater Wular Lake & Gurez Valley Paradise',
        shortDescription: 'Cradled between the tranquil waters of Wular Lake and the secluded alpine beauty of Gurez Valley.',
        fullDescription: 'Bandipora is blessed with the vast expanse of Wular Lake, a vital wetland haven for migratory birds, the picturesque Kishenganga River in Gurez Valley, and Habba Khatoon peak.',
        bestTimeToVisit: 'May to October',
        knownFor: 'Wular Lake, Gurez Valley, Habba Khatoon Peak, Kishenganga River'
      },
      {
        name: 'Baramulla',
        slug: 'baramulla',
        headquarters: 'Baramulla',
        division: 'Kashmir Division',
        tagline: 'World-Class Gulmarg Ski Resort, Gondola & Apharwat Peak',
        shortDescription: 'Home to Gulmarg, Asia\'s premier winter sports wonderland, and the high-altitude Gulmarg Gondola.',
        fullDescription: 'Baramulla is celebrated across the globe for Gulmarg\'s powder snow slopes, the highest cable car in Asia leading to Apharwat Peak, pristine pine forests, and historic Buddhist stupas at Ushkur.',
        bestTimeToVisit: 'All year (Snow: Dec-Mar, Spring: Apr-Jun)',
        knownFor: 'Gulmarg Gondola, Skiing, Apharwat Peak, Alpather Lake'
      },
      {
        name: 'Budgam',
        slug: 'budgam',
        headquarters: 'Budgam',
        division: 'Kashmir Division',
        tagline: 'Untouched Meadows of Doodhpathri & Yusmarg Valley',
        shortDescription: 'The land of the Milk Valley at Doodhpathri, alpine Yusmarg, and sacred Charar-i-Sharief.',
        fullDescription: 'Budgam offers pristine meadows surrounded by pine forests at Doodhpathri (Valley of Milk) and Yusmarg, alongside the revered Sufi shrine of Sheikh Noor-ud-Din Noorani at Charar-i-Sharief.',
        bestTimeToVisit: 'April to October',
        knownFor: 'Doodhpathri, Yusmarg, Charar-i-Sharief, Nilnag Lake'
      },
      {
        name: 'Doda',
        slug: 'doda',
        headquarters: 'Doda',
        division: 'Jammu Division',
        tagline: 'Mini Switzerland of Bhaderwah & Chenab River Gorges',
        shortDescription: 'Nestled along the Chenab, featuring the scenic valleys of Bhaderwah and alpine meadows.',
        fullDescription: 'Doda is renowned for the breathtaking Bhaderwah valley, known as Chhota Kashmir for its lush meadows, Jai Valley, Seoj Dhar, and dramatic mountain roads overlooking the Chenab river.',
        bestTimeToVisit: 'March to November',
        knownFor: 'Bhaderwah, Jai Valley, Chinta Valley, Seoj Meadow'
      },
      {
        name: 'Ganderbal',
        slug: 'ganderbal',
        headquarters: 'Ganderbal',
        division: 'Kashmir Division',
        tagline: 'Sonamarg Meadow of Gold, Thajiwas Glacier & Great Lakes Trek',
        shortDescription: 'Gateway to Ladakh, featuring the golden alpine valley of Sonamarg and glacial trekking circuits.',
        fullDescription: 'Ganderbal is famed for Sonamarg (Meadow of Gold), the glittering Thajiwas Glacier, the Sind river angling waters, the sacred Kheer Bhawani temple, and the starting point of the Great Lakes Trek.',
        bestTimeToVisit: 'April to October',
        knownFor: 'Sonamarg, Thajiwas Glacier, Kheer Bhawani, Sind River'
      },
      {
        name: 'Jammu',
        slug: 'jammu',
        headquarters: 'Jammu',
        division: 'Jammu Division',
        tagline: 'The City of Temples, Bahu Fort & Grand Mubarak Mandi Palace',
        shortDescription: 'Winter capital of the UT, celebrated for ancient Dogra palaces, Bahu Fort, and sacred temples.',
        fullDescription: 'Jammu, the City of Temples, sits on the banks of the Tawi River. Highlights include the royal Mubarak Mandi Palace complex, the ancient Bahu Fort overlooking Bagh-e-Bahu, and Raghunath Temple.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Bahu Fort, Mubarak Mandi, Raghunath Temple, Bagh-e-Bahu'
      },
      {
        name: 'Kathua',
        slug: 'kathua',
        headquarters: 'Kathua',
        division: 'Jammu Division',
        tagline: 'City of Sufis, Jasrota Fort & Ranjit Sagar Dam Lake',
        shortDescription: 'Gateway to Jammu and Kashmir, boasting historic Jasrota Fort and the sprawling Ranjit Sagar reservoir.',
        fullDescription: 'Kathua features the ancient royal ruins of Jasrota Fort surrounded by wildlife sanctuaries, the vast waters of Ranjit Sagar Dam lake (Thein Dam), and the sacred Sukrala Mata pilgrimage.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Jasrota Fort, Ranjit Sagar Dam, Sukrala Mata, Billawar Temple'
      },
      {
        name: 'Kishtwar',
        slug: 'kishtwar',
        headquarters: 'Kishtwar',
        division: 'Jammu Division',
        tagline: 'Land of Saffron, Sapphire & Kishtwar High Altitude National Park',
        shortDescription: 'Surrounded by towering Himalayan peaks, alpine meadows, and rich saffron cultivation.',
        fullDescription: 'Kishtwar is famed for saffron plateaus, precious blue sapphires, Kishtwar National Park home to the Himalayan snow leopard, and scenic pilgrimages to Machail Mata.',
        bestTimeToVisit: 'May to October',
        knownFor: 'Kishtwar National Park, Saffron Fields, Machail Mata, Paddar Valley'
      },
      {
        name: 'Kulgam',
        slug: 'kulgam',
        headquarters: 'Kulgam',
        division: 'Kashmir Division',
        tagline: 'Niagara of Kashmir at Aharbal Falls & High-Altitude Kousarnag',
        shortDescription: 'Known as the Rice Bowl of Kashmir, celebrated for the roaring Aharbal Waterfall.',
        fullDescription: 'Kulgam is renowned for the majestic 25-meter cascade of Aharbal Waterfall, known as the Niagara of Kashmir, scenic apple orchards, and the glacial alpine waters of Kousarnag Lake.',
        bestTimeToVisit: 'April to October',
        knownFor: 'Aharbal Waterfall, Kousarnag Lake, Apple Orchards, Chittergull'
      },
      {
        name: 'Kupwara',
        slug: 'kupwara',
        headquarters: 'Kupwara',
        division: 'Kashmir Division',
        tagline: 'Enchanting Lolab Valley & Bungus Alpine Meadows',
        shortDescription: 'Famed for the idyllic walnut orchards of Lolab Valley and pristine wilderness of Bungus Valley.',
        fullDescription: 'Kupwara in north-western Kashmir is celebrated for the serene Lolab Valley, described by poet Allama Iqbal, the untouched alpine meadows of Bungus Valley, and ancient shrines at Kalaroos.',
        bestTimeToVisit: 'April to October',
        knownFor: 'Lolab Valley, Bungus Valley, Kalaroos Caves, Seemab Lake'
      },
      {
        name: 'Poonch',
        slug: 'poonch',
        headquarters: 'Poonch',
        division: 'Jammu Division',
        tagline: 'Poonch Royal Fort, Seven Lakes of Girgan & Pir Panjal Pass',
        shortDescription: 'A historic frontier district surrounded by Pir Panjal peaks and mystical alpine lakes.',
        fullDescription: 'Poonch is rich in Dogra and Mughal history, featuring the majestic Poonch Fort, the revered Nangali Sahib Gurdwara, and the high-altitude valley of Seven Lakes (Girgan Dhok) across the Pir Panjal.',
        bestTimeToVisit: 'April to October',
        knownFor: 'Poonch Fort, Nangali Sahib, Girgan Valley, Peer Ki Gali'
      },
      {
        name: 'Pulwama',
        slug: 'pulwama',
        headquarters: 'Pulwama',
        division: 'Kashmir Division',
        tagline: 'World-Renowned Saffron Fields of Pampore & Avantishwar Temple',
        shortDescription: 'The Saffron Capital of India, home to 9th-century Avantipur temple ruins along the Jhelum.',
        fullDescription: 'Pulwama is renowned for the purple saffron blooms of Pampore, the stone-carved architecture of the 9th-century Avantiswami and Avantishwar temples built by King Avantivarman, and scenic Shikargah.',
        bestTimeToVisit: 'April to November (Saffron blooms: Oct-Nov)',
        knownFor: 'Pampore Saffron, Avantipur Ruins, Shikargah, Tarsar-Marsar Trail'
      },
      {
        name: 'Rajouri',
        slug: 'rajouri',
        headquarters: 'Rajouri',
        division: 'Jammu Division',
        tagline: 'Historical Mughal Road, Rajouri Fort & Dehra Ki Gali',
        shortDescription: 'A historic stopping point on the royal Mughal route, set amidst Pir Panjal mountain forests.',
        fullDescription: 'Rajouri boasts royal forts, the historic Mughal Sarai route over Peer Ki Gali, scenic hill stations at Dehra Ki Gali, and panoramic views of snow-clad Pir Panjal ranges.',
        bestTimeToVisit: 'October to April',
        knownFor: 'Rajouri Fort, Mughal Road, Dehra Ki Gali, Mangla Mata'
      },
      {
        name: 'Ramban',
        slug: 'ramban',
        headquarters: 'Ramban',
        division: 'Jammu Division',
        tagline: 'Scenic Sanasar Meadows & Engineering Marvel Baglihar Dam',
        shortDescription: 'Perched in the Chenab valley, featuring alpine meadows at Sanasar and Baglihar reservoir.',
        fullDescription: 'Ramban is home to the picturesque eco-tourism destination of Sanasar lake, the massive engineering achievement of Baglihar Dam on the Chenab, and the cedar forests of Batote.',
        bestTimeToVisit: 'March to November',
        knownFor: 'Sanasar Lake, Baglihar Dam, Batote Pine Forests, Chenab Gorges'
      },
      {
        name: 'Reasi',
        slug: 'reasi',
        headquarters: 'Reasi',
        division: 'Jammu Division',
        tagline: 'Sacred Shri Mata Vaishno Devi Shrine & Chenab Rail Bridge',
        shortDescription: 'Home to the world-famous Vaishno Devi pilgrimage and the world\'s highest railway bridge.',
        fullDescription: 'Reasi welcomes millions of pilgrims to the holy cave shrine of Shri Mata Vaishno Devi at Katra. The district also features the historic Bhimgarh Fort, Shivkhori cave shrine, and the Chenab Rail Bridge.',
        bestTimeToVisit: 'All year',
        knownFor: 'Vaishno Devi Katra, Chenab Rail Bridge, Shivkhori, Bhimgarh Fort'
      },
      {
        name: 'Samba',
        slug: 'samba',
        headquarters: 'Samba',
        division: 'Jammu Division',
        tagline: 'Historic Samba Fort, Traditional Calico Printing & Mansar Lake Border',
        shortDescription: 'Famous for its historical Dogra fortress, traditional hand-block printing, and sacred lakes.',
        fullDescription: 'Samba is celebrated for the 19th-century Samba Fort overlooking the Shivalik foothills, traditional block-printed calico fabrics, the scenic Mansar lake circuit, and Purmandal pilgrimage.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Samba Fort, Calico Printing, Purmandal, Chichi Mata Temple'
      },
      {
        name: 'Shopian',
        slug: 'shopian',
        headquarters: 'Shopian',
        division: 'Kashmir Division',
        tagline: 'Apple Town of Kashmir, Peer Ki Gali & Mughal Road Gateway',
        shortDescription: 'The premier apple basket of the valley, set at the foot of the historic Pir Panjal mountains.',
        fullDescription: 'Shopian is celebrated for sweet apple and walnut orchards, the historic Jamia Masjid built during the Mughal era, and the scenic mountain ascent through Peer Ki Gali along the historic Mughal Road.',
        bestTimeToVisit: 'April to October',
        knownFor: 'Apple Orchards, Peer Ki Gali, Historic Jamia Masjid, Padpawan'
      },
      {
        name: 'Srinagar',
        slug: 'srinagar',
        headquarters: 'Srinagar',
        division: 'Kashmir Division',
        tagline: 'Iconic Dal Lake Shikaras, Mughal Gardens & Shankaracharya Temple',
        shortDescription: 'Summer capital of the UT, world-famous for Dal Lake houseboats, Nishat and Shalimar gardens.',
        fullDescription: 'Srinagar is the crown jewel of Kashmir tourism. Famed across the world for the serene waters of Dal Lake and Nigeen Lake with their handcrafted shikaras, the terraced Mughal Gardens (Shalimar, Nishat, Chashme Shahi), Shankaracharya Hill Temple, and the historic wooden architecture of Old City.',
        bestTimeToVisit: 'All year (Spring: Apr-Jun, Autumn: Sep-Nov, Winter: Dec-Feb)',
        knownFor: 'Dal Lake, Shikaras, Mughal Gardens, Shankaracharya Temple, Houseboats'
      },
      {
        name: 'Udhampur',
        slug: 'udhampur',
        headquarters: 'Udhampur',
        division: 'Jammu Division',
        tagline: 'Hill Station of Patnitop, Ancient Krimchi Temples & Devika River',
        shortDescription: 'Home to the panoramic cedar slopes of Patnitop and 9th-century Pandava temples of Krimchi.',
        fullDescription: 'Udhampur features the popular hill resort of Patnitop nestled amidst dense deodar forests, the ancient stone Krimchi group of temples known as Pandava Temples, and the sacred Devika river pilgrimage.',
        bestTimeToVisit: 'All year (Snow: Dec-Feb, Summer: Mar-Jun)',
        knownFor: 'Patnitop Hill Station, Krimchi Temples, Chenani-Nashri Tunnel, Pingla Mata'
      }
    ]
  },
  'ladakh': {
    stateId: 34,
    districts: [
      {
        name: 'Kargil',
        slug: 'kargil',
        headquarters: 'Kargil',
        division: 'Ladakh',
        tagline: 'Zanskar Valley, Drass Gateway & Phuktal Cliffside Monastery',
        shortDescription: 'High-altitude wonderland featuring Drass, the breathtaking Zanskar Valley, and Buddhist cliffside gompas.',
        fullDescription: 'Kargil district encompasses the dramatic trans-Himalayan valleys of Suru and Zanskar, the Kargil War Memorial in Drass, centuries-old rock carvings at Mulbekh, and the cliff-hanging Phuktal Monastery.',
        bestTimeToVisit: 'May to October',
        knownFor: 'Zanskar Valley, Drass War Memorial, Suru Valley, Phuktal Monastery'
      },
      {
        name: 'Leh',
        slug: 'leh',
        headquarters: 'Leh',
        division: 'Ladakh',
        tagline: 'Pangong Tso, Nubra Valley Sand Dunes, Khardung La & Thiksey Gompa',
        shortDescription: 'The Moonland of Ladakh, home to azure Pangong Lake, double-humped camel dunes in Nubra, and royal Leh Palace.',
        fullDescription: 'Leh is one of the world\'s most awe-inspiring high-altitude destinations, featuring the color-changing waters of Pangong Tso, the cold desert dunes of Nubra Valley, world-famous cliffside monasteries like Thiksey and Hemis, Shanti Stupa, and the world\'s highest motorable roads.',
        bestTimeToVisit: 'May to September',
        knownFor: 'Pangong Tso, Nubra Valley, Khardung La, Thiksey Monastery, Leh Palace'
      }
    ]
  },
  'lakshadweep': {
    stateId: 35,
    districts: [
      {
        name: 'Lakshadweep',
        slug: 'lakshadweep',
        headquarters: 'Kavaratti',
        division: 'Lakshadweep',
        tagline: 'Turquoise Coral Lagoons, Bangaram Atoll & Scuba Diving Paradise',
        shortDescription: 'An idyllic tropical archipelago of 36 coral islands, glowing turquoise lagoons, and extraordinary marine life.',
        fullDescription: 'Lakshadweep is a pristine coral paradise in the Arabian Sea. It is world-renowned for crystal-clear turquoise lagoons at Bangaram, water sports and scuba diving at Agatti and Kadmat, Kavaratti Marine Aquarium, and untouched white-sand beaches.',
        bestTimeToVisit: 'October to mid-May',
        knownFor: 'Coral Reefs, Scuba Diving, Bangaram Island, Agatti Lagoon, Marine Biodiversity'
      }
    ]
  },
  'puducherry': {
    stateId: 36,
    districts: [
      {
        name: 'Karaikal',
        slug: 'karaikal',
        headquarters: 'Karaikal',
        division: 'Puducherry',
        tagline: 'Scenic Arasalar Estuary, Thirunallar Temple & Coastal Beaches',
        shortDescription: 'A historic coastal town on the Coromandel coast, famed for sacred temple heritage and boating.',
        fullDescription: 'Karaikal, situated south of Puducherry in Tamil Nadu\'s delta region, is celebrated for the sacred Saneeswara temple at Thirunallar, serene boating along the Arasalar river estuary, and Sandy Karaikal Beach.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Thirunallar Temple, Karaikal Beach, Arasalar Boating'
      },
      {
        name: 'Mahe',
        slug: 'mahe',
        headquarters: 'Mahe',
        division: 'Puducherry',
        tagline: 'Historic French Colonial Outpost on the Malabar Coast',
        shortDescription: 'A picturesque riverside enclave on the Malabar coast, blending French heritage with Kerala charm.',
        fullDescription: 'Mahe, nestled on the mouth of the scenic Mahe River in Kerala, offers French colonial monuments, the historic St. Theresa Church, riverfront walkways, and scenic Arabian Sea sunsets.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Mahe Riverfront, St. Theresa Church, French Heritage, Coastal Views'
      },
      {
        name: 'Puducherry',
        slug: 'puducherry',
        headquarters: 'Puducherry',
        division: 'Puducherry',
        tagline: 'French Quarter White Town, Promenade Beach & Sri Aurobindo Ashram',
        shortDescription: 'The French Riviera of the East, famed for mustard-yellow colonial villas and seafront promenades.',
        fullDescription: 'Puducherry district is the crown jewel of Franco-Tamil heritage, featuring the iconic Promenade Beach, tree-lined boulevards of White Town, Sri Aurobindo Ashram, Manakula Vinayagar Temple, and nearby universal township of Auroville.',
        bestTimeToVisit: 'October to March',
        knownFor: 'White Town, Promenade Beach, Aurobindo Ashram, French Architecture'
      },
      {
        name: 'Yanam',
        slug: 'yanam',
        headquarters: 'Yanam',
        division: 'Puducherry',
        tagline: 'Godavari River Confluence & Scenic French Riverfront Promenade',
        shortDescription: 'A tranquil riverine enclave situated at the scenic confluence of the Godavari and Coringa rivers.',
        fullDescription: 'Yanam, surrounded by Andhra Pradesh\'s East Godavari region, features a beautiful landscaped riverfront promenade along the Godavari, French colonial towers, and serene boat cruises.',
        bestTimeToVisit: 'October to March',
        knownFor: 'Godavari Riverfront, French Heritage Tower, River Cruises'
      }
    ]
  }
};

async function seedUtDistricts() {
  const pool = getPool();
  console.log('--- SEEDING OFFICIAL 45 UT DISTRICTS ---');

  for (const [stateSlug, data] of Object.entries(UT_DISTRICTS_DATA)) {
    console.log(`Processing ${stateSlug} (State ID: ${data.stateId}, Districts: ${data.districts.length})...`);

    let displayOrder = 1;
    for (const d of data.districts) {
      const [existing] = await pool.query(
        'SELECT id FROM districts WHERE state_id = ? AND slug = ?',
        [data.stateId, d.slug]
      );

      if (existing.length === 0) {
        await pool.query(
          `INSERT INTO districts (
            state_id, name, slug, headquarters, division, tagline,
            short_description, full_description, image_url, hero_image_url,
            best_time_to_visit, known_for, display_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.stateId,
            d.name,
            d.slug,
            d.headquarters,
            d.division,
            d.tagline,
            d.short_description,
            d.full_description,
            `/images/districts/${d.slug}.jpg`,
            `/images/districts/${d.slug}-hero.jpg`,
            d.bestTimeToVisit,
            d.knownFor,
            displayOrder++
          ]
        );
        console.log(`  ✓ Inserted district: ${d.name} (${d.slug})`);
      } else {
        console.log(`  - District already exists: ${d.name} (${d.slug})`);
      }
    }

    // Update state total_districts and button_url
    await pool.query(
      `UPDATE states SET 
        total_districts = ?,
        button_url = ?,
        button_text = ?
       WHERE id = ?`,
      [
        data.districts.length,
        `west-bengal.html?state=${stateSlug}`,
        `Explore ${data.districts.length} ${data.districts.length === 1 ? 'District' : 'Districts'}`,
        data.stateId
      ]
    );
  }

  const [totalDistricts] = await pool.query('SELECT COUNT(*) as count FROM districts');
  console.log(`\nTotal districts across all states & UTs in database: ${totalDistricts[0].count}`);
  await closePool();
}

if (process.argv[1].endsWith('seedUtDistricts.js')) {
  seedUtDistricts().catch(async err => {
    console.error(err);
    await closePool();
    process.exit(1);
  });
}
