/**
 * EXPLORE INDIA — WEST BENGAL DISTRICTS & TOURISM DATASET
 * Centralized data structure for all 23 districts of West Bengal
 * Contains verified tourist spots, descriptions, imagery, and Google Maps endpoints
 */

const WEST_BENGAL_DATA = {
  state: "West Bengal",
  capital: "Kolkata",
  totalDistricts: 23,
  description: "West Bengal, stretching from the snow-capped Himalayas in the north to the Bay of Bengal in the south, is an enchanting tapestry of rich history, vibrant art, lush tea gardens, terracotta temples, and the mystical Sundarbans mangrove forests.",
  heroImage: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1600&auto=format&fit=crop&q=85",
  districts: [
    {
      id: "alipurduar",
      name: "Alipurduar",
      slug: "alipurduar",
      headquarters: "Alipurduar",
      division: "Jalpaiguri Division",
      tagline: "The Gateway to Bhutan and Dooars Wildlife",
      shortDescription: "A verdant paradise of lush tea estates, dense forests, and elephant corridors bordering Bhutan and Assam.",
      fullDescription: "Carved out of Jalpaiguri in 2014, Alipurduar is nestled in the foothills of the Eastern Himalayas. It is celebrated for its biodiversity, featuring the famous Buxa Tiger Reserve and Jaldapara National Park, home to the majestic one-horned Indian rhinoceros. The meandering Jayanti and Torsha rivers lend an ethereal charm to this Dooars landscape.",
      image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to April",
      knownFor: "Wildlife Safaris, Buxa Fort Trekking, Dooars Tea Estates",
      attractions: [
        {
          name: "Jaldapara National Park",
          image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&auto=format&fit=crop&q=80",
          location: "Madarihat, Alipurduar",
          description: "Renowned sanctuary holding the largest population of the Great Indian One-Horned Rhinoceros in West Bengal, along with elephant herds, Bengal tigers, and rare avian fauna.",
          mapsQuery: "Jaldapara+National+Park+Alipurduar+West+Bengal",
          highlights: "Rhino Elephant Safari, Bird Watching, Watchtowers"
        },
        {
          name: "Buxa Fort & Tiger Reserve",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Buxa Hills, Alipurduar",
          description: "Historic hill fort perched at 2,844 feet where Indian freedom fighters including Netaji Subhas Chandra Bose were detained, surrounded by rugged forested hills.",
          mapsQuery: "Buxa+Fort+Alipurduar+West+Bengal",
          highlights: "Historical Prison, Himalayan Trekking, Buxa Duar"
        },
        {
          name: "Jayanti River & Mahakal Cave",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Jayanti, Buxa Forest",
          description: "Known as the Queen of Dooars, Jayanti offers a dramatic dry riverbed lined with white pebbles against the majestic Bhutan hills and limestone caves.",
          mapsQuery: "Jayanti+River+Alipurduar+West+Bengal",
          highlights: "Pebble Riverbed, Stalactite Caves, Forest Trails"
        },
        {
          name: "Chilapata Forest",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Near Jaldapara, Alipurduar",
          description: "An important ecological corridor connecting Buxa and Jaldapara, housing the ancient fifth-century ruins of the Nalraja Garh fortress.",
          mapsQuery: "Chilapata+Forest+Alipurduar+West+Bengal",
          highlights: "Nalraja Garh Ruins, Elephant Corridor, Jungle Safari"
        }
      ]
    },
    {
      id: "bankura",
      name: "Bankura",
      slug: "bankura",
      headquarters: "Bankura",
      division: "Medinipur Division",
      tagline: "Land of Red Soil and Terracotta Masterpieces",
      shortDescription: "World-famous for Bishnupur terracotta temples, Bankura horse folk art, and the scenic hills of Susunia and Mukutmanipur.",
      fullDescription: "Bankura boasts a profound cultural legacy that flourished under the Malla kings. The district is celebrated for its distinctive 17th-century terracotta architecture, Baluchari silk sarees woven with mythological tales, and folk craft like the world-famous terracotta Bankura horse. Its undulating landscape features the scenic Mukutmanipur reservoir and rocky hills.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Bishnupur Terracotta Temples, Baluchari Silk, Dokra Craft",
      attractions: [
        {
          name: "Bishnupur Terracotta Temples",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Bishnupur, Bankura",
          description: "Magnificent medieval temples including Rasmancha, Jor Bangla, and Madan Mohan Temple, built from fired laterite clay tiles detailing scenes from the Ramayana.",
          mapsQuery: "Rasmancha+Bishnupur+Bankura+West+Bengal",
          highlights: "Rasmancha, Jor Bangla, Terracotta Murals"
        },
        {
          name: "Mukutmanipur Dam & Kangsabati Lake",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Mukutmanipur, Bankura",
          description: "India's second-largest earthen dam located at the serene confluence of the Kangsabati and Kumari rivers, surrounded by picturesque forested hillocks.",
          mapsQuery: "Mukutmanipur+Dam+Bankura+West+Bengal",
          highlights: "Earthen Dam, Boating to Deer Park, Sunset Views"
        },
        {
          name: "Susunia Hills",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
          location: "Chhatna, Bankura",
          description: "An ancient 1,442-foot hill known for stone-carving artisans, rock climbing trails, a natural spring, and 4th-century archaeological rock inscriptions.",
          mapsQuery: "Susunia+Hill+Bankura+West+Bengal",
          highlights: "Archaeological Inscriptions, Stone Carving, Trekking"
        },
        {
          name: "Biharinath Hill",
          image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop&q=80",
          location: "Saltora, Bankura",
          description: "The highest hill in Bankura district (1,480 feet), renowned for its verdant forest cover, ancient Shiva temple, and serene nature trails.",
          mapsQuery: "Biharinath+Hill+Bankura+West+Bengal",
          highlights: "Highest Peak in Bankura, Shiva Temple, Forest Eco-walks"
        }
      ]
    },
    {
      id: "birbhum",
      name: "Birbhum",
      slug: "birbhum",
      headquarters: "Suri",
      division: "Burdwan Division",
      tagline: "The Soul of Rabindranath Tagore and Baul Mysticism",
      shortDescription: "Home to Nobel laureate Rabindranath Tagore's Santiniketan, historic Shaktipeeths, and vibrant red-earth Baul songs.",
      fullDescription: "Birbhum, often referred to as the 'Land of Red Soil' (Lal Mati), is the cultural crucible of Bengal. It houses Santiniketan—inscribed as a UNESCO World Heritage Site—founded by Rabindranath Tagore. The soulful songs of wandering Baul mystics, the holy shrine of Tarapith, and the terracotta temples of Hetampur define this lyrical district.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "November to March (Poush Mela in December)",
      knownFor: "Santiniketan, UNESCO World Heritage, Baul Music, Poush Mela",
      attractions: [
        {
          name: "Santiniketan & Visva-Bharati",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Bolpur, Birbhum",
          description: "UNESCO World Heritage site founded by Rabindranath Tagore. Features the open-air university, Upasana Griha (Glass Prayer Hall), Rabindra Bhavana, and Kala Bhavana.",
          mapsQuery: "Visva+Bharati+University+Santiniketan+Birbhum",
          highlights: "Upasana Griha, Tagore Museum, Khoai Shonajhuri Haat"
        },
        {
          name: "Tarapith Temple",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Rampurhat, Birbhum",
          description: "One of the most revered Tantric pilgrimage sites in India, dedicated to Goddess Tara and sacred to saint Sadhak Bamakhepa.",
          mapsQuery: "Tarapith+Temple+Birbhum+West+Bengal",
          highlights: "Tara Maa Temple, Tantric Cremation Ground, Bamakhepa Ashram"
        },
        {
          name: "Kankalitala Shaktipeeth",
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
          location: "Kopai River, Bolpur",
          description: "One of the 51 sacred Shakti Peethas, where the waist (kankal) of Goddess Sati is believed to have fallen, situated on the tranquil banks of the Kopai River.",
          mapsQuery: "Kankalitala+Temple+Bolpur+Birbhum",
          highlights: "Sacred Kund Pond, Kopai Riverbank, Peaceful Ambience"
        },
        {
          name: "Ballavpur Wildlife Sanctuary",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Santiniketan, Birbhum",
          description: "Serene wooded deer park established in 1977, home to large herds of spotted deer, blackbucks, and migratory birds that visit three large waterbodies.",
          mapsQuery: "Ballavpur+Wildlife+Sanctuary+Bolpur+Birbhum",
          highlights: "Spotted Deer Park, Migratory Birds, Shonajhuri Forest Walk"
        }
      ]
    },
    {
      id: "cooch-behar",
      name: "Cooch Behar",
      slug: "cooch-behar",
      headquarters: "Cooch Behar",
      division: "Jalpaiguri Division",
      tagline: "The Royal Heritage City of Bengal",
      shortDescription: "A planned royal town distinguished by the magnificent European-style Cooch Behar Palace and historic temples.",
      fullDescription: "Once a princely kingdom ruled by the Koch dynasty, Cooch Behar is a peaceful city characterized by wide boulevards, monumental heritage palaces, and sacred waterbodies (dighis). The centerpiece Cooch Behar Palace, conceived by Maharaja Nripendra Narayan, reflects classic Italian Renaissance architecture.",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March (Ras Mela in November)",
      knownFor: "Cooch Behar Palace, Madan Mohan Temple, Ras Mela",
      attractions: [
        {
          name: "Cooch Behar Palace (Rajbari)",
          image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
          location: "Keshav Road, Cooch Behar",
          description: "Stately 1887 palace modeled after London's Buckingham Palace, featuring an Italian Renaissance dome, grand durbar hall, and museum of royal artifacts.",
          mapsQuery: "Cooch+Behar+Palace+West+Bengal",
          highlights: "Grand Durbar Hall, Royal Artifacts Museum, Manicured Gardens"
        },
        {
          name: "Madan Mohan Temple",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Cooch Behar City",
          description: "Historic temple built by Maharaja Nripendra Narayan housing deities of Lord Madan Mohan, Ma Kali, and Ma Tara. Epicenter of the annual traditional Ras Mela.",
          mapsQuery: "Madan+Mohan+Temple+Cooch+Behar",
          highlights: "White Classical Architecture, Ras Mela Celebrations"
        },
        {
          name: "Sagardighi",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Central Cooch Behar",
          description: "Huge historical square waterbody flanked by handsome colonial-era administrative buildings, migratory birds during winter, and illuminated promenades.",
          mapsQuery: "Sagardighi+Cooch+Behar",
          highlights: "Evening Promenade, Migratory Bird Watching, Heritage Buildings"
        },
        {
          name: "Rasikbil Bird Sanctuary",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Tufanganj, Cooch Behar",
          description: "Sprawling wetland lake and avian sanctuary famous for hosting thousands of migratory waterfowl, a deer park, and a crocodile rescue center.",
          mapsQuery: "Rasikbil+Bird+Sanctuary+Cooch+Behar",
          highlights: "Waterfowl Sanctuary, Boating, Leopard and Deer Rescue Center"
        }
      ]
    },
    {
      id: "dakshin-dinajpur",
      name: "Dakshin Dinajpur",
      slug: "dakshin-dinajpur",
      headquarters: "Balurghat",
      division: "Malda Division",
      tagline: "Ancient Ruins and Historic Reservoirs",
      shortDescription: "Rich in archaeological heritage, featuring the ancient city of Bangarh, historic water reservoirs, and tranquil rural landscapes.",
      fullDescription: "Dakshin Dinajpur (South Dinajpur) is a peaceful border district with roots delving deep into the Maurya and Pala empires. Its crown jewel is the ancient fortified city of Bangarh, where excavations have unearthed relics dating from the Mauryan through the Mughal periods.",
      image: "https://images.unsplash.com/photo-1583396618422-8e575052a665?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1583396618422-8e575052a665?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to February",
      knownFor: "Bangarh Ruins, Tapan Dighi, Balurghat Forest",
      attractions: [
        {
          name: "Bangarh Archaeological Ruins",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Gangarampur, Dakshin Dinajpur",
          description: "Excavated ancient ruined city mentioned in classical texts as Kotivarsha, spanning historic strata from the Mauryan, Shunga, Gupta, and Pala eras.",
          mapsQuery: "Bangarh+Ruins+Gangarampur+Dakshin+Dinajpur",
          highlights: "Ancient Fort Walls, Terracotta Seals, Historical Museum"
        },
        {
          name: "Tapan Dighi",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Tapan, Dakshin Dinajpur",
          description: "Massive historic freshwater lake measuring over 2 km in length, excavated by King Lakshman Sena of the Sena dynasty, enveloped in legendary folktales.",
          mapsQuery: "Tapan+Dighi+Dakshin+Dinajpur",
          highlights: "Massive Lake, Winter Birdwatching, Ancient Embankments"
        },
        {
          name: "Mahipal Dighi",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Kushmandi, Dakshin Dinajpur",
          description: "Historic waterbody dating to King Mahipala II of the Pala dynasty, surrounded by archaeological mounds, lotus beds, and rural serenity.",
          mapsQuery: "Mahipal+Dighi+Dakshin+Dinajpur",
          highlights: "Pala Dynasty Heritage, Lotus Blooms, Peaceful Countryside"
        }
      ]
    },
    {
      id: "darjeeling",
      name: "Darjeeling",
      slug: "darjeeling",
      headquarters: "Darjeeling",
      division: "Jalpaiguri Division",
      tagline: "The Queen of the Hills",
      shortDescription: "World-famous for breathtaking views of Mount Kanchenjunga, aromatic champagne tea, and the UNESCO Toy Train.",
      fullDescription: "Perched high in the Lesser Himalayas at an altitude of 6,700 feet, Darjeeling is one of the world's most iconic hill stations. Famed for its emerald tea gardens producing the celebrated 'Champagne of Teas', the town commands sweeping vistas of Mount Kanchenjunga, the world's third-highest peak.",
      image: "https://images.unsplash.com/photo-1622308644420-ec498ef3ccef?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1622308644420-ec498ef3ccef?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "March to May, September to December",
      knownFor: "Kanchenjunga Sunrise, Darjeeling Tea, Himalayan Toy Train",
      attractions: [
        {
          name: "Tiger Hill",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Senchal Hills, Darjeeling",
          description: "Legendary vantage point at 8,482 feet famous worldwide for its mesmerizing sunrise that paints Kanchenjunga and Mount Everest in dazzling gold and magenta.",
          mapsQuery: "Tiger+Hill+Darjeeling+West+Bengal",
          highlights: "Sunrise over Kanchenjunga, View of Everest, Morning Tea"
        },
        {
          name: "Batasia Loop & War Memorial",
          image: "https://images.unsplash.com/photo-1622308644420-ec498ef3ccef?w=800&auto=format&fit=crop&q=80",
          location: "Ghoom, Darjeeling",
          description: "Spectacular spiral railway engineering marvel where the Darjeeling Toy Train loops 360 degrees around landscaped gardens and a Gorkha war memorial.",
          mapsQuery: "Batasia+Loop+Darjeeling+West+Bengal",
          highlights: "360-degree Toy Train Track, Kanchenjunga Panorama, Floral Gardens"
        },
        {
          name: "Darjeeling Himalayan Railway (Toy Train)",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Darjeeling Station",
          description: "UNESCO World Heritage 2-foot narrow gauge mountain railway built in 1881 that chugs past pine forests, tea valleys, and mist-veiled mountain hamlets.",
          mapsQuery: "Darjeeling+Himalayan+Railway+Station",
          highlights: "UNESCO Heritage Ride, Vintage Steam Engines, Hill Vistas"
        },
        {
          name: "Ghoom Monastery (Yiga Choeling)",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Ghoom, Darjeeling",
          description: "Historic Tibetan Buddhist monastery built in 1875 by Lama Sherab Gyatso, enshrining a magnificent 15-foot statue of Maitreya Buddha (Future Buddha).",
          mapsQuery: "Ghoom+Monastery+Darjeeling+West+Bengal",
          highlights: "15-ft Maitreya Buddha, Tibetan Thangkas, Prayer Wheels"
        },
        {
          name: "Padmaja Naidu Himalayan Zoological Park",
          image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&auto=format&fit=crop&q=80",
          location: "Jawahar Parbat, Darjeeling",
          description: "India's highest altitude zoo (7,000 feet), globally acclaimed for its successful breeding programs for endangered Snow Leopards and Red Pandas.",
          mapsQuery: "Padmaja+Naidu+Himalayan+Zoological+Park+Darjeeling",
          highlights: "Snow Leopards, Red Pandas, Himalayan Mountaineering Institute"
        }
      ]
    },
    {
      id: "hooghly",
      name: "Hooghly",
      slug: "hooghly",
      headquarters: "Chinsurah",
      division: "Burdwan Division",
      tagline: "Colonial Settlements along the Sacred River",
      shortDescription: "A fascinating riverside corridor of Portuguese, Dutch, and French colonial history, terracotta temples, and sacred shrines.",
      fullDescription: "Stretching along the western bank of the sacred Hooghly River, this district preserves relics of European colonial trade posts. Bandel commemorates the Portuguese, Chinsurah the Dutch, and Chandannagar the French. It also houses holy shrines like Tarakeswar and Bansberia's Hangseshwari Temple.",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Bandel Church, Hooghly Imambara, French Chandannagar",
      attractions: [
        {
          name: "Bandel Church (Basilica of the Holy Rosary)",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Bandel, Hooghly",
          description: "One of India's oldest Christian churches, founded by Portuguese Augustinian friars in 1599, featuring a miraculous ship's mast presented by a grateful captain.",
          mapsQuery: "Bandel+Church+Hooghly+West+Bengal",
          highlights: "1599 Portuguese Basilica, Historic Ship Mast, River Promenade"
        },
        {
          name: "Hooghly Imambara",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Hooghly Ghat, Chinsurah",
          description: "Stately Shia congregation hall erected in 1861 by philanthropist Haji Muhammad Mohsin, featuring a towering twin-dial clock tower and river views.",
          mapsQuery: "Hooghly+Imambara+West+Bengal",
          highlights: "Grand Twin Clock Tower, River Hooghly Views, Intricate Calligraphy"
        },
        {
          name: "Hangseshwari Temple",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Bansberia, Hooghly",
          description: "Unique 13-spired temple built in 1814 based on Kundalini yogic anatomy, complemented by the neighbouring Ananta Vasudeva terracotta temple.",
          mapsQuery: "Hangseshwari+Temple+Bansberia+Hooghly",
          highlights: "13 Lotus Spired Shikhara, Kundalini Architecture, Terracotta Art"
        },
        {
          name: "Tarakeswar Temple",
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
          location: "Tarakeswar, Hooghly",
          description: "Revered 18th-century pilgrimage center dedicated to Lord Shiva as Taraknath, drawing millions of barefoot pilgrims during the Shravani Mela.",
          mapsQuery: "Tarakeswar+Temple+Hooghly+West+Bengal",
          highlights: "Taraknath Lingam, Dudhpukur Holy Tank, Shravani Mela"
        }
      ]
    },
    {
      id: "howrah",
      name: "Howrah",
      slug: "howrah",
      headquarters: "Howrah",
      division: "Presidency Division",
      tagline: "The Steel Gateway to Bengal and Spiritual Haven",
      shortDescription: "Famous for the iconic cantilever Howrah Bridge, spiritual Belur Math, and the historic Great Banyan Tree.",
      fullDescription: "Located directly opposite Kolkata across the Hooghly River, Howrah is both an industrial heartland and a cradle of renaissance spirituality. It is graced by Belur Math, the international headquarters of the Ramakrishna Order, and the historic Indian Botanic Garden home to the two-century-old Great Banyan Tree.",
      image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Howrah Bridge, Belur Math, Great Banyan Tree",
      attractions: [
        {
          name: "Howrah Bridge (Rabindra Setu)",
          image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80",
          location: "Hooghly River, Howrah",
          description: "World-famous balanced cantilever suspension bridge opened in 1943 without any nuts or bolts, carrying hundreds of thousands of commuters daily.",
          mapsQuery: "Howrah+Bridge+West+Bengal",
          highlights: "Iconic Cantilever Design, Night Illumination, River Ghats"
        },
        {
          name: "Belur Math",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Belur, Howrah",
          description: "Global headquarters of the Ramakrishna Math and Mission founded by Swami Vivekananda, combining Hindu, Islamic, and Christian architectural motifs.",
          mapsQuery: "Belur+Math+Howrah+West+Bengal",
          highlights: "Syncretic Architecture, Vivekananda Temple, Hooghly Riverbank"
        },
        {
          name: "Acharya Jagadish Chandra Bose Botanic Garden",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Shibpur, Howrah",
          description: "Established in 1787 over 270 acres, housing the legendary 250-year-old Great Banyan Tree whose canopy canopy covers over 3.5 acres.",
          mapsQuery: "Acharya+Jagadish+Chandra+Bose+Indian+Botanic+Garden+Howrah",
          highlights: "The Great Banyan Tree, Giant Amazonian Water Lilies, Exotic Palms"
        },
        {
          name: "Gadiara",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Shyampur, Howrah",
          description: "A tranquil picnic hamlet located at the scenic confluence of three mighty rivers: the Hooghly, Rupnarayan, and Damodar, boasting ruins of Fort Mornington.",
          mapsQuery: "Gadiara+Howrah+West+Bengal",
          highlights: "Three River Confluence, Sunset Boat Rides, Fort Mornington Ruins"
        }
      ]
    },
    {
      id: "jalpaiguri",
      name: "Jalpaiguri",
      slug: "jalpaiguri",
      headquarters: "Jalpaiguri",
      division: "Jalpaiguri Division",
      tagline: "Heart of the Dooars and Dense Forest Corridors",
      shortDescription: "A paradise of lush tea gardens, emerald mountain streams, and prime wildlife sanctuaries like Gorumara.",
      fullDescription: "Jalpaiguri is the emerald centerpiece of the North Bengal plains. Sheltered by the foothills of Bhutan and the Himalayas, it is bisected by the mighty Teesta and Torsha rivers. Famous for Gorumara National Park, scenic tea estates, and picturesque forest villages like Murti and Samsing.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to April (Jungle safaris open)",
      knownFor: "Gorumara Rhino Safaris, Murti River, Samsing & Suntalekhola",
      attractions: [
        {
          name: "Gorumara National Park",
          image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&auto=format&fit=crop&q=80",
          location: "Lataguri, Jalpaiguri",
          description: "Prime wildlife sanctuary located in the Dooars flood plains, home to Indian Rhinoceros, Asian Elephants, leopards, hornbills, and watchtowers overlooking salt licks.",
          mapsQuery: "Gorumara+National+Park+Lataguri+Jalpaiguri",
          highlights: "Rhino Safaris, Jatraprasad Watchtower, Medhla Watchtower"
        },
        {
          name: "Murti River & Chapramari Wildlife Sanctuary",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Murti, Jalpaiguri",
          description: "Pristine mountain river flowing over smooth river stones, offering elephant watching along Chapramari Wildlife Sanctuary and idyllic riverside eco-cottages.",
          mapsQuery: "Murti+River+Jalpaiguri+West+Bengal",
          highlights: "Riverbed Walks, Elephant Sightings, Chapramari Watchtower"
        },
        {
          name: "Samsing & Suntalekhola",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Matiali, Jalpaiguri",
          description: "Enchanting foothill hamlet located at 3,000 feet, where rolling tea gardens merge into dense Neora Valley pine and cardamom forests.",
          mapsQuery: "Suntalekhola+Jalpaiguri+West+Bengal",
          highlights: "Hanging Footbridge, Tea Garden Trails, Rocky Island"
        },
        {
          name: "Jalpesh Temple",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Mainaguri, Jalpaiguri",
          description: "Ancient Shiva temple founded in 1524 by King Biswa Singha of the Koch dynasty, rebuilt by Pran Narayan, drawing thousands during the Maha Shivratri fair.",
          mapsQuery: "Jalpesh+Temple+Mainaguri+Jalpaiguri",
          highlights: "Historic Koch Architecture, Anadi Shiva Lingam, Shivratri Mela"
        }
      ]
    },
    {
      id: "jhargram",
      name: "Jhargram",
      slug: "jhargram",
      headquarters: "Jhargram",
      division: "Medinipur Division",
      tagline: "Forest Kingdom of Red Laterite and Royal Palaces",
      shortDescription: "Celebrated for its royal heritage palace, dense Sal and Mahua forests, and indigenous tribal culture.",
      fullDescription: "Nestled between the Belpahari and Kankrajhor hills, Jhargram is a captivating district of red gravel paths, dense sal and teak woodlands, and ancient royal legends. Carved out as a separate district in 2017, it is an offbeat haven for eco-tourism and authentic Santhal and Kurmi tribal arts.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Jhargram Palace, Chilkigarh Temple, Belpahari Waterfalls",
      attractions: [
        {
          name: "Jhargram Rajbari (Palace)",
          image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
          location: "Jhargram Town",
          description: "Stately 16th-century palace combining Gothic and Muslim architectural accents, surrounded by sprawling gardens and ancestral royal courtyards.",
          mapsQuery: "Jhargram+Rajbari+Palace+West+Bengal",
          highlights: "Royal Heritage Hotel, Manicured Gardens, Tribal Folk Dances"
        },
        {
          name: "Chilkigarh Kanak Durga Temple & Sacred Grove",
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
          location: "Jamboni, Jhargram",
          description: "Medieval temple dedicated to Goddess Kanak Durga situated deep within an ecologically rare biodiverse forest grove beside the Dulung River.",
          mapsQuery: "Chilkigarh+Kanak+Durga+Temple+Jhargram",
          highlights: "Sacred Forest Grove, Dulung River Walk, Ancient Golden Deity"
        },
        {
          name: "Khandarani Lake & Dam",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Belpahari, Jhargram",
          description: "Breathtaking lake encircled by rolling forested hillocks, acting as a winter haven for colorful migratory birds against red soil backdrop.",
          mapsQuery: "Khandarani+Dam+Belpahari+Jhargram",
          highlights: "Birdwatching Paradise, Rolling Hillocks, Sunset Reflection"
        },
        {
          name: "Ghagra Waterfalls & Belpahari",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Belpahari, Jhargram",
          description: "Scenic cascade gushing through natural rock gorges, celebrated in regional Bengali cinema and offering dramatic wilderness picnics.",
          mapsQuery: "Ghagra+Waterfall+Belpahari+Jhargram",
          highlights: "Rock Gorges, Natural Cascades, Tribal Handicraft Centers"
        }
      ]
    },
    {
      id: "kalimpong",
      name: "Kalimpong",
      slug: "kalimpong",
      headquarters: "Kalimpong",
      division: "Jalpaiguri Division",
      tagline: "The Orchid Capital of the Eastern Himalayas",
      shortDescription: "Famous for panoramic views of Mount Kanchenjunga, flower nurseries, colonial cottages, and historic Buddhist monasteries.",
      fullDescription: "Perched atop a ridge at 4,100 feet overlooking the roaring Teesta River, Kalimpong was once a bustling gateway on the ancient silk and wool trade route to Tibet. It is internationally celebrated for exotic orchid and cactus nurseries, historic colonial schools, and peaceful Buddhist gompas.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "March to May, September to December",
      knownFor: "Orchid Nurseries, Deolo Hill, Durpin Monastery, Teesta River",
      attractions: [
        {
          name: "Deolo Hill",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Kalimpong Ridge",
          description: "The highest summit in Kalimpong (5,590 feet), presenting an awe-inspiring 360-degree vista of Mount Kanchenjunga, the Teesta valley, and Sikkim hills.",
          mapsQuery: "Deolo+Hill+Kalimpong+West+Bengal",
          highlights: "Kanchenjunga 360 Panorama, Paragliding, Landscaped Eco Park"
        },
        {
          name: "Morgan House",
          image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
          location: "Durpin Dara, Kalimpong",
          description: "Picturesque 1930s British colonial mansion featuring ivy-covered stone walls, sloping red roofs, and vintage mountain elegance.",
          mapsQuery: "Morgan+House+Kalimpong+West+Bengal",
          highlights: "Colonial Architecture, Ivy Clad Stone Walls, Mountain Views"
        },
        {
          name: "Zang Dhok Palri Phodang (Durpin Monastery)",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Durpin Hill, Kalimpong",
          description: "Majestic Buddhist monastery consecrated by the Dalai Lama in 1976, housing sacred Kangyur scriptures brought from Tibet and panoramic valley vistas.",
          mapsQuery: "Durpin+Monastery+Kalimpong+West+Bengal",
          highlights: "Sacred Tibetan Scriptures, Golden Stupas, 360 Mountain View"
        },
        {
          name: "Pine View Cactus Nursery",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Atisha Road, Kalimpong",
          description: "Asia's largest private collection of exotic cacti and succulents, housing over 1,500 species meticulously gathered from Central and South America.",
          mapsQuery: "Pine+View+Nursery+Kalimpong",
          highlights: "1500+ Cactus Species, Exotic Orchids, Greenhouse Tours"
        }
      ]
    },
    {
      id: "kolkata",
      name: "Kolkata",
      slug: "kolkata",
      headquarters: "Kolkata",
      division: "Presidency Division",
      tagline: "The City of Joy and Cultural Capital of India",
      shortDescription: "Iconic colonial monuments, timeless river ghats, thriving intellectual coffeehouses, and the grandeur of Durga Puja.",
      fullDescription: "Kolkata, the capital of West Bengal and India's cultural capital, is a grand metropolis steeped in 300 years of history. Celebrated for its literary heritage, magnificent colonial architecture including the Victoria Memorial, pioneering yellow taxis, trams, and UNESCO-inscribed Durga Puja festivities.",
      image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March (Durga Puja in Autumn)",
      knownFor: "Victoria Memorial, Howrah Bridge, Durga Puja, Street Food",
      attractions: [
        {
          name: "Victoria Memorial",
          image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80",
          location: "Queens Way, Kolkata",
          description: "Magnificent white Makrana marble palace completed in 1921, surrounded by 64 acres of landscaped gardens, housing royal galleries, sculptures, and sound-and-light shows.",
          mapsQuery: "Victoria+Memorial+Kolkata+West+Bengal",
          highlights: "White Marble Dome, Royal Art Gallery, Evening Light Show"
        },
        {
          name: "Dakshineswar Kali Temple",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Dakshineswar, Kolkata",
          description: "Legendary 1855 Navaratna temple built by Rani Rashmoni along the Hooghly River, where mystic saint Sri Ramakrishna Paramahamsa attained divine enlightenment.",
          mapsQuery: "Dakshineswar+Kali+Temple+Kolkata",
          highlights: "Navaratna Architecture, 12 Shiva Shrines, Ramakrishna Room"
        },
        {
          name: "Indian Museum",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Jawaharlal Nehru Road, Kolkata",
          description: "The ninth-oldest museum in the world and largest in India, founded in 1814. Features an Egyptian mummy, fossilized dinosaur skeletons, and Ashoka lion capitals.",
          mapsQuery: "Indian+Museum+Kolkata+West+Bengal",
          highlights: "Egyptian Mummy, Ashokan Lion Capital, Dinosaur Fossils"
        },
        {
          name: "Eco Park (Prakriti Tirtha)",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "New Town, Rajarhat, Kolkata",
          description: "India's largest urban ecological park spanning 480 acres, featuring a 104-acre water lake, replicas of the Seven Wonders of the World, and butterfly gardens.",
          mapsQuery: "Eco+Park+New+Town+Kolkata",
          highlights: "Seven Wonders Replicas, Boating Lake, Butterfly Garden"
        },
        {
          name: "Princep Ghat",
          image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
          location: "Strand Road, Hooghly Riverbank, Kolkata",
          description: "Romantic Greek-Gothic colonnade monument built in 1843 along the Hooghly riverbank, offering traditional wooden boat rides beneath Vidyasagar Setu.",
          mapsQuery: "Princep+Ghat+Kolkata+West+Bengal",
          highlights: "Palladian Colonnade, Riverboat Rides, Vidyasagar Setu View"
        }
      ]
    },
    {
      id: "malda",
      name: "Malda",
      slug: "malda",
      headquarters: "English Bazar",
      division: "Malda Division",
      tagline: "The Mango City and Medieval Citadel of Gour",
      shortDescription: "Renowned for sweet Fazli mangoes and the monumental medieval brick ruins of Gour and Pandua.",
      fullDescription: "Located at the confluence of the Mahananda and Kalindi rivers, Malda is an archaeological treasure trove. As the medieval capital of Bengal under the Ilyas Shahi and Hussain Shahi sultanates, the monumental ruins of Gour and Pandua boast colossal mosques, carved stone gateways, and terracotta minarets.",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "November to March (Summer for Fazli Mangoes)",
      knownFor: "Gour & Pandua Ruins, Adina Mosque, Fazli Mangoes",
      attractions: [
        {
          name: "Adina Mosque (Pandua)",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Pandua, Malda",
          description: "Built in 1373 by Sultan Sikandar Shah, this was once the largest mosque in the Indian subcontinent, modeled after the Great Mosque of Damascus.",
          mapsQuery: "Adina+Mosque+Pandua+Malda+West+Bengal",
          highlights: "Monumental Central Vault, Royal Badshah-ka-Takht, Carved Stone"
        },
        {
          name: "Dakhil Darwaza & Baro Shona Masjid",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Gour Archaeological Complex, Malda",
          description: "Massive 15th-century triumphal brick gateway and the majestic 'Great Golden Mosque' exhibiting 44 stone domes and carved terracotta panels.",
          mapsQuery: "Dakhil+Darwaza+Gour+Malda+West+Bengal",
          highlights: "60-ft Brick Gateway, Baro Shona Masjid Domes, Cannon Bastions"
        },
        {
          name: "Firoz Minar",
          image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
          location: "Gour, Malda",
          description: "Spectacular 84-foot terracotta victory tower built in 1489 by Sultan Saifuddin Firuz Shah, reminiscent of Delhi's Qutub Minar.",
          mapsQuery: "Firoz+Minar+Gour+Malda",
          highlights: "84-ft Victory Tower, Terracotta Bands, Spiral Staircase"
        },
        {
          name: "Jagjivanpur Buddhist Monastery",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Habibpur, Malda",
          description: "Excavated 9th-century Buddhist mahavihara from the reign of Pala Emperor Mahendrapala, uncovering bronze Buddha statues and terracotta seals.",
          mapsQuery: "Jagjivanpur+Excavation+Site+Malda",
          highlights: "9th-Century Pala Mahavihara, Bronze Statues, Terracotta Plaques"
        }
      ]
    },
    {
      id: "murshidabad",
      name: "Murshidabad",
      slug: "murshidabad",
      headquarters: "Baharampur",
      division: "Malda Division",
      tagline: "The Historic Capital of the Nawabs of Bengal",
      shortDescription: "A grand historical city of Nawabi palaces, Hazarduari Palace, royal tombs, and delicate silk sarees.",
      fullDescription: "Murshidabad was the sovereign capital of the Nawabs of Bengal, Bihar, and Orissa prior to the British conquest in the 1757 Battle of Plassey. Situated along the Bhagirathi River, it holds opulent palaces like Hazarduari (the Palace with 1,000 Doors), majestic mosques, and ancient silk-weaving ateliers.",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Hazarduari Palace, Katra Mosque, Murshidabad Silk, Nawabi History",
      attractions: [
        {
          name: "Hazarduari Palace",
          image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
          location: "Kila Nizamat, Murshidabad",
          description: "Stately palace built in 1837 by architect Duncan McLeod for Nawab Nazim Humayun Jah, featuring 1,000 doors (900 real, 100 false to thwart intruders) and a royal weapons museum.",
          mapsQuery: "Hazarduari+Palace+Murshidabad+West+Bengal",
          highlights: "1,000 Doors, Siraj-ud-Daulah's Sword, Royal Durbar Hall"
        },
        {
          name: "Katra Mosque",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Murshidabad",
          description: "Imposing 1723 caravanserai mosque erected by Nawab Murshid Quli Khan, with octagonal minarets, where the Nawab is entombed beneath the entrance steps.",
          mapsQuery: "Katra+Mosque+Murshidabad+West+Bengal",
          highlights: "Tomb of Murshid Quli Khan, 70-ft Octagonal Minarets, Arched Cells"
        },
        {
          name: "Kathgola Gardens & Palace",
          image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
          location: "Murshidabad",
          description: "Sumptuous 18th-century garden estate and mansion of the Dugar Jain mercantile dynasty, with marble statues, mirror halls, and a Adinath Jain temple.",
          mapsQuery: "Kathgola+Palace+Murshidabad+West+Bengal",
          highlights: "Adinath Jain Temple, Italian Marble Statues, Secret Underground Cells"
        },
        {
          name: "Motijheel & Eco Park",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Murshidabad",
          description: "Historic horse-shoe-shaped lake where Ghaseti Begum lived, now developed into a modern landscaped eco-park with musical fountain and light-and-sound shows.",
          mapsQuery: "Motijheel+Murshidabad+West+Bengal",
          highlights: "Horse-shoe Lake, Sound & Light Show, Nawab History Pavilions"
        }
      ]
    },
    {
      id: "nadia",
      name: "Nadia",
      slug: "nadia",
      headquarters: "Krishnanagar",
      division: "Presidency Division",
      tagline: "The Birthplace of Bhakti Movement and Clay Sculptures",
      shortDescription: "Sacred land of Sri Chaitanya Mahaprabhu's Nabadwip, ISKCON Mayapur, and world-class clay modeling.",
      fullDescription: "Nadia is the spiritual epicentre of Gaudiya Vaishnavism. Centered around Nabadwip and Mayapur across the Bhagirathi River, it witnessed the 15th-century devotional renaissance led by Chaitanya Mahaprabhu. Krishnanagar is renowned for its master clay sculptors who create lifelike terracotta miniatures.",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "ISKCON Mayapur, Nabadwip Dham, Krishnanagar Clay Dolls",
      attractions: [
        {
          name: "ISKCON Mayapur (Temple of Vedic Planetarium)",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Mayapur, Nadia",
          description: "Global headquarters of ISKCON featuring the colossal Temple of the Vedic Planetarium (TOVP)—one of the largest religious domes in the world—and river ghats.",
          mapsQuery: "ISKCON+Mayapur+Nadia+West+Bengal",
          highlights: "World's Largest Vedic Temple Dome, Gaura Purnima, Kirtan Hall"
        },
        {
          name: "Nabadwip Dham",
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
          location: "Nabadwip, Nadia",
          description: "Revered historical pilgrimage cluster of nine islands where Sri Chaitanya Mahaprabhu was born, celebrated as the 'Oxford of Bengal' for ancient Sanskrit logic.",
          mapsQuery: "Nabadwip+Dham+Nadia+West+Bengal",
          highlights: "Sonar Gouranga Temple, Mahaprabhu Janmasthan, Poramatala"
        },
        {
          name: "Krishnanagar Rajbari & Ghurni Clay Modeling",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Krishnanagar, Nadia",
          description: "Ancestral royal palace of Raja Krishna Chandra Roy and the nearby artisans' hub of Ghurni, world-renowned for hyper-realistic handcrafted clay models.",
          mapsQuery: "Krishnanagar+Rajbari+Nadia+West+Bengal",
          highlights: "Royal Palace Courtyards, World-Renowned Clay Dolls of Ghurni"
        },
        {
          name: "Bethuadahari Wildlife Sanctuary",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Bethuadahari, Nadia",
          description: "Lush wildlife reserve founded in 1980 conserving a flourishing population of chital (spotted deer), gharials, tortoises, and migratory birdlife.",
          mapsQuery: "Bethuadahari+Wildlife+Sanctuary+Nadia",
          highlights: "Spotted Deer Reserve, Gharial Breeding Pond, Nature Trails"
        }
      ]
    },
    {
      id: "north-24-parganas",
      name: "North 24 Parganas",
      slug: "north-24-parganas",
      headquarters: "Barasat",
      division: "Presidency Division",
      tagline: "Cradle of the 1857 Uprising and Border Riverbanks",
      shortDescription: "A dynamic district blending historic colonial cantonments like Barrackpore, border river charm in Taki, and green sanctuaries.",
      fullDescription: "Wrapping around Kolkata's northern and eastern perimeter, North 24 Parganas is West Bengal's most populous district. Historic Barrackpore witnessed the sparks of India's 1857 First War of Independence ignited by Mangal Pandey. Along the Ichamati River, Taki offers serene boat cruises along the international border.",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Mangal Pandey Park, Taki Riverfront, Parmadan Deer Park",
      attractions: [
        {
          name: "Mangal Pandey Park & Barrackpore Riverside",
          image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
          location: "Barrackpore, North 24 Parganas",
          description: "Historic cantonment memorial park where Sepoy Mangal Pandey rebelled on March 29, 1857, set amidst sprawling lawns and British colonial bungalows.",
          mapsQuery: "Mangal+Pandey+Park+Barrackpore",
          highlights: "1857 Memorial Monument, Hooghly Riverfront, Colonial Heritage"
        },
        {
          name: "Taki & Ichamati River",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Hasnabad, North 24 Parganas",
          description: "Charming border town along the Ichamati River overlooking Bangladesh, famous for country boat rides, Golpatar Jungle, and immersion festivities.",
          mapsQuery: "Taki+Ichamati+River+West+Bengal",
          highlights: "International River Border, Golpatar Forest Walk, Country Boat Rides"
        },
        {
          name: "Bibhutibhushan Wildlife Sanctuary (Parmadan)",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Bongaon, North 24 Parganas",
          description: "Tranquil deer sanctuary on the banks of the meandering Ichamati River named after literary giant Bibhutibhushan Bandyopadhyay.",
          mapsQuery: "Bibhutibhushan+Wildlife+Sanctuary+Parmadan",
          highlights: "Chital Deer Park, Forest Canopy Walks, River Ichamati View"
        }
      ]
    },
    {
      id: "paschim-bardhaman",
      name: "Paschim Bardhaman",
      slug: "paschim-bardhaman",
      headquarters: "Asansol",
      division: "Burdwan Division",
      tagline: "Industrial Heartland and Dam Vistas",
      shortDescription: "Known for the rolling reservoirs of Maithon, historic temples of Kalyaneshwari, and the poet Kazi Nazrul Islam.",
      fullDescription: "Formed in 2017, Paschim Bardhaman (West Burdwan) is one of Eastern India's prime mining and steel capitals, spanning Asansol and Durgapur. Yet beyond its industry lie tranquil treasures: the vast waters of Maithon Dam, the revered Shaktipeeth of Kalyaneshwari, and Churulia, birthplace of national poet Kazi Nazrul Islam.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Maithon Dam, Kalyaneshwari Temple, Churulia Nazrul Academy",
      attractions: [
        {
          name: "Maithon Dam & Reservoir",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Barakar River Border, Asansol",
          description: "Stupendous Damodar Valley Corporation dam featuring an underground hydroelectric power station and an emerald lake surrounded by green hillocks.",
          mapsQuery: "Maithon+Dam+Asansol+West+Bengal",
          highlights: "Lake Boating, Deer Island, Underground Power Station"
        },
        {
          name: "Kalyaneshwari Temple",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Kulti, Paschim Bardhaman",
          description: "Ancient 500-year-old pilgrimage shrine dedicated to Goddess Kalyaneshwari on the banks of the Barakar River, frequented by seekers of boons.",
          mapsQuery: "Kalyaneshwari+Temple+Asansol+West+Bengal",
          highlights: "500-Year Sacred Shrine, Barakar Riverbank, Festive Melas"
        },
        {
          name: "Churulia (Nazrul Academy)",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Jamuria, Paschim Bardhaman",
          description: "Birthplace of the rebel poet Kazi Nazrul Islam, housing a dedicated memorial museum, manuscript library, and annual commemorative cultural festivals.",
          mapsQuery: "Churulia+Nazrul+Academy+Asansol",
          highlights: "Rebel Poet's Birthplace, Manuscript Museum, Cultural Fair"
        }
      ]
    },
    {
      id: "paschim-medinipur",
      name: "Paschim Medinipur",
      slug: "paschim-medinipur",
      headquarters: "Medinipur",
      division: "Medinipur Division",
      tagline: "The Grand Canyon of Bengal and Historic Forts",
      shortDescription: "Renowned for Gongoni gorge, revolutionary freedom fighter heritage, and historic stone fortresses.",
      fullDescription: "Paschim Medinipur is a historic southwestern district crossed by the Kangsabati and Silabati rivers. It is famous for 'Gongoni'—often called the Grand Canyon of Bengal—featuring surreal red laterite river gorges carved over millennia, alongside ancient stone monuments and freedom struggle memories of Matangini Hazra and Khudiram Bose.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "November to February",
      knownFor: "Gongoni Grand Canyon, Kurumbera Fort, Gopegarh Heritage Park",
      attractions: [
        {
          name: "Gongoni Gorge (Grand Canyon of Bengal)",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
          location: "Garhbeta, Paschim Medinipur",
          description: "Spectacular natural gorge carved by the Silabati River through vibrant red laterite soil over millions of years, featuring cave-like chimneys and cliff edges.",
          mapsQuery: "Gongoni+Danga+Grand+Canyon+Garhbeta",
          highlights: "Natural Rock Canyons, Silabati River Vistas, Sunset Photography"
        },
        {
          name: "Kurumbera Fort",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Gaganeshwar, Keshiari",
          description: "Protected 15th-century stone fortress complex built by King Kapilendra Deva of Odisha, with pillared arcades, circular dome structures, and Odia inscriptions.",
          mapsQuery: "Kurumbera+Fort+Keshiari+Paschim+Medinipur",
          highlights: "Protected Stone Fort, Ancient Pillar Verandahs, Odia Inscriptions"
        },
        {
          name: "Gopegarh Heritage Eco Park",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Medinipur Town",
          description: "Historic hillock fort site of King Gope overlooking the Kangsabati River, now transformed into a pine-forested eco-tourism retreat and watchtower park.",
          mapsQuery: "Gopegarh+Eco+Park+Midnapore",
          highlights: "Ancient Fort Mound, Kangsabati Valley Watchtower, Forest Trails"
        }
      ]
    },
    {
      id: "purba-bardhaman",
      name: "Purba Bardhaman",
      slug: "purba-bardhaman",
      headquarters: "Bardhaman",
      division: "Burdwan Division",
      tagline: "The Granary of Bengal and 108 Terracotta Temples",
      shortDescription: "Celebrated for the unique 108 Shiva temple complex in Kalna, royal Burdwan monuments, and delicious Mihidana sweets.",
      fullDescription: "Purba Bardhaman (East Burdwan) is the agricultural rice bowl of West Bengal. It is acclaimed for its royal heritage of the Burdwan Raj family, Curzon Gate, and especially the town of Kalna (Ambika Kalna), which boasts the world-famous concentric 108 Shiva temple complex and exquisite terracotta architecture.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "108 Shiva Temples Kalna, Curzon Gate, Mihidana & Sitabhog",
      attractions: [
        {
          name: "108 Shiva Temples (Nava Kailash, Kalna)",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Kalna, Purba Bardhaman",
          description: "Architectural marvel erected in 1809 by Maharaja Tej Chandra Bahadur, featuring two concentric rings of 108 atchala Shiva temples built with alternating black and white shivalingams.",
          mapsQuery: "108+Shiva+Temples+Kalna+West+Bengal",
          highlights: "Concentric Geometry, 108 Shiva Shrines, Terracotta Art"
        },
        {
          name: "Curzon Gate & Royal Rajbari",
          image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
          location: "Bardhaman City",
          description: "Magnificent triumphal archway erected in 1903 to honor Lord Curzon's visit, leading toward the historic palace estates of the Maharajas of Burdwan.",
          mapsQuery: "Curzon+Gate+Bardhaman+West+Bengal",
          highlights: "Ornate Triumphal Arch, Burdwan University Campus, Night Lights"
        },
        {
          name: "Krishnasayar Eco Park",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Bardhaman",
          description: "Sprawling 33-acre historical artificial lake built in 1691 by the royal dynasty, now enhanced with floral pathways, pedal boating, and migratory birds.",
          mapsQuery: "Krishnasayar+Eco+Park+Bardhaman",
          highlights: "Royal Lake, Pedal Boating, Art Gallery, Musical Fountain"
        }
      ]
    },
    {
      id: "purba-medinipur",
      name: "Purba Medinipur",
      slug: "purba-medinipur",
      headquarters: "Tamluk",
      division: "Medinipur Division",
      tagline: "Sun-Kissed Beaches and Ancient Maritime Heritage",
      shortDescription: "Famous for popular coastal resorts like Digha and Mandarmani, and the ancient international sea port of Tamralipta.",
      fullDescription: "Stretching along the sun-drenched Bay of Bengal coastline, Purba Medinipur (East Medinipur) is Bengal's premier seaside holiday destination. It boasts golden beach towns like Digha, Mandarmani, and Tajpur, complemented by the profound maritime antiquity of Tamluk, known in ancient chronicles as the seaport of Tamralipta.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to April",
      knownFor: "Digha Beach, Mandarmani Coastal Strip, Tajpur, Ancient Tamralipta",
      attractions: [
        {
          name: "Digha Sea Beach (New & Old Digha)",
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
          location: "Digha, Purba Medinipur",
          description: "Bengal's most celebrated seaside getaway with flat hard sand beaches, Marine Aquarium, casuarina groves, and dynamic seaside promenades.",
          mapsQuery: "Digha+Sea+Beach+West+Bengal",
          highlights: "Flat Sandy Beach, Marine Aquarium, Fresh Seafood Stalls"
        },
        {
          name: "Mandarmani Beach",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Mandarmani, Purba Medinipur",
          description: "One of the longest motorable beach strips in India, famous for red ghost crabs, beachside luxury resorts, and high-adrenaline watersports.",
          mapsQuery: "Mandarmani+Beach+West+Bengal",
          highlights: "Drive-on Hard Sand Beach, Red Crabs, Jet Ski & Parasailing"
        },
        {
          name: "Tamluk (Ancient Tamralipta & Bargabhima Temple)",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Tamluk, Purba Medinipur",
          description: "Ancient port described by Buddhist traveler Faxian, featuring the sacred 1,000-year-old Bargabhima Kali Temple (a recognized Shaktipeeth).",
          mapsQuery: "Bargabhima+Temple+Tamluk+West+Bengal",
          highlights: "Bargabhima Shaktipeeth, Tamralipta Archaeological Museum"
        },
        {
          name: "Tajpur Beach",
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
          location: "Tajpur, Purba Medinipur",
          description: "Secluded pristine beach enveloped by dense tamarisk groves, offering peaceful relaxation away from crowded resorts.",
          mapsQuery: "Tajpur+Beach+West+Bengal",
          highlights: "Pristine Tamarisk Groves, Solitary Coastline, Fresh Seafood"
        }
      ]
    },
    {
      id: "purulia",
      name: "Purulia",
      slug: "purulia",
      headquarters: "Purulia",
      division: "Medinipur Division",
      tagline: "The Land of Ayodhya Hills and Chhau Dance",
      shortDescription: "Famed for the rugged Ayodhya Hills, dramatic rock climbing crags, serene dams, and the martial Chhau masked dance.",
      fullDescription: "Purulia is a breathtaking land of rugged granite hills, cascading waterfalls, and vibrant tribal lore. Known across the world for the acrobatic Chhau masked dance (inscribed on UNESCO's Intangible Cultural Heritage list), the district is an adventurer's dream with rock-climbing peaks like Joychandi Pahar and pristine water bodies.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March (Palash blooming in Spring)",
      knownFor: "Ayodhya Hills, UNESCO Chhau Mask Dance, Joychandi Pahar",
      attractions: [
        {
          name: "Ayodhya Hills (Ajodhya Hills)",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
          location: "Baghmundi, Purulia",
          description: "A scenic plateau of the Dalma Hill range at 2,000 feet, celebrated in Ramayana lore, featuring Bamni Falls, Turga Falls, and deep forest trails.",
          mapsQuery: "Ayodhya+Hills+Purulia+West+Bengal",
          highlights: "Bamni Falls, Turga Dam, Upper & Lower PPSP Reservoirs"
        },
        {
          name: "Garhpanchkot Ruins & Panchet Dam",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Neturia, Purulia",
          description: "Historic ruined fort city dating to the 5th century at the foot of Panchet Hill, devastated during 18th-century Bargi raids, boasting terracotta temples.",
          mapsQuery: "Garhpanchkot+Purulia+West+Bengal",
          highlights: "Ruined Panchratna Temples, Panchet Hill, Damodar Lake"
        },
        {
          name: "Joychandi Pahar",
          image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop&q=80",
          location: "Raghunathpur, Purulia",
          description: "Dramatic rocky monadnock peak famous for rock climbing and made immortal as the filming location for Satyajit Ray's classic 'Goopy Gyne Bagha Byne'.",
          mapsQuery: "Joychandi+Pahar+Purulia+West+Bengal",
          highlights: "Rock Climbing, Chandi Mata Hilltop Temple, 500 Steps Climb"
        },
        {
          name: "Muruguma Dam & Lake",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Baghmundi, Purulia",
          description: "Picturesque water reservoir built on the Saharajhore River against rolling hillocks, offering camping, stargazing, and tribal homestays.",
          mapsQuery: "Muruguma+Dam+Purulia+West+Bengal",
          highlights: "Lakeside Eco Camping, Stargazing, Sunset over Hills"
        }
      ]
    },
    {
      id: "south-24-parganas",
      name: "South 24 Parganas",
      slug: "south-24-parganas",
      headquarters: "Alipore",
      division: "Presidency Division",
      tagline: "The Realm of the Royal Bengal Tiger and Holy Gangasagar",
      shortDescription: "Home to the UNESCO World Heritage Sundarbans mangrove tiger reserve, Sagar Island pilgrimage, and Bakkhali beaches.",
      fullDescription: "South 24 Parganas extends into the sprawling delta of the Ganga-Brahmaputra basin. It is globally celebrated for the Sundarbans—the largest mangrove forest on Earth and sanctuary of the Royal Bengal Tiger. The district also hosts the revered Gangasagar Mela on Sagar Island at the holy river-sea confluence.",
      image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "November to March",
      knownFor: "Sundarbans National Park, Royal Bengal Tiger, Gangasagar",
      attractions: [
        {
          name: "Sundarbans National Park",
          image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&auto=format&fit=crop&q=80",
          location: "Sundarbans Delta, South 24 Parganas",
          description: "UNESCO World Heritage Site and Biosphere Reserve featuring the world's largest halophytic mangrove forest, home to swimming Royal Bengal Tigers and estuarine crocodiles.",
          mapsQuery: "Sundarbans+National+Park+West+Bengal",
          highlights: "Tiger Boat Safaris, Sajnekhali Watchtower, Dobanki Canopy Walk"
        },
        {
          name: "Gangasagar (Sagar Island)",
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
          location: "Sagar Island, South 24 Parganas",
          description: "Sacred confluence where the holy River Ganges meets the Bay of Bengal, home to the sage Kapil Muni Temple and India's second largest pilgrimage mela.",
          mapsQuery: "Gangasagar+Kapil+Muni+Temple+West+Bengal",
          highlights: "Ganga Confluence Bathing, Kapil Muni Temple, Sagar Beach"
        },
        {
          name: "Bakkhali Beach & Henry's Island",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Namkhana, South 24 Parganas",
          description: "Tranquil crescent beach known for hard driving sands, red fiddler crabs, dense mangrove plantations, and watchtower vistas of the open sea.",
          mapsQuery: "Bakkhali+Beach+West+Bengal",
          highlights: "Henry's Island Watchtower, Red Fiddler Crabs, Crocodile Breeding Center"
        },
        {
          name: "Diamond Harbour",
          image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
          location: "Diamond Harbour, South 24 Parganas",
          description: "Historic port town where the Hooghly River broadens dramatically into a sea-like expanse, featuring ruins of the 16th-century Portuguese Chingrikhali Fort.",
          mapsQuery: "Diamond+Harbour+West+Bengal",
          highlights: "River Hooghly Mouth, Portuguese Fort Ruins, Riverside Promenade"
        }
      ]
    },
    {
      id: "uttar-dinajpur",
      name: "Uttar Dinajpur",
      slug: "uttar-dinajpur",
      headquarters: "Raiganj",
      division: "Malda Division",
      tagline: "The Great Avian Haven of Asia",
      shortDescription: "Celebrated for the Kulik Bird Sanctuary, one of Asia's largest nesting sanctuaries for Asian openbills and migratory storks.",
      fullDescription: "Uttar Dinajpur (North Dinajpur) is a fertile agricultural and eco-tourism district bordering Bihar and Bangladesh. It is acclaimed across the continent for the Raiganj Wildlife Sanctuary (Kulik Bird Sanctuary), where over 100,000 migratory waterfowl arrive each monsoon to nest along the Kulik River.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "June to December (Peak nesting July to October)",
      knownFor: "Kulik Bird Sanctuary, Karnajora Park, Sapahar Eco Park",
      attractions: [
        {
          name: "Raiganj Wildlife Sanctuary (Kulik Bird Sanctuary)",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Raiganj, Uttar Dinajpur",
          description: "One of the largest bird breeding colonies in Asia along the Kulik River, attracting more than 80,000 Asian Openbill Storks, egrets, herons, and cormorants.",
          mapsQuery: "Raiganj+Wildlife+Sanctuary+Kulik+Bird+Sanctuary",
          highlights: "Asian Openbill Breeding Colonies, Forest Canopy Watchtowers, Boating"
        },
        {
          name: "Karnajora Museum & Eco Park",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Raiganj, Uttar Dinajpur",
          description: "Well-maintained district heritage museum exhibiting regional antiquities, terracotta artifacts, and landscaped deer gardens.",
          mapsQuery: "Karnajora+Park+Raiganj+Uttar+Dinajpur",
          highlights: "District Antiquities Museum, Deer Park, Children's Eco Zone"
        },
        {
          name: "Burhana Fakir Mosque",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
          location: "Hemtabad, Uttar Dinajpur",
          description: "Historical medieval shrine of saint Burhana Fakir attracting devotees of all faiths, reflecting regional secular heritage.",
          mapsQuery: "Burhana+Fakir+Mosque+Hemtabad+Uttar+Dinajpur",
          highlights: "Medieval Sufi Shrine, Syncretic Pilgrimage, Historic Tank"
        }
      ]
    }
  ]
};

/**
 * EXPLORE INDIA — ANDHRA PRADESH DISTRICTS & TOURISM DATASET
 * Centralized data structure for all 26 officially verified districts of Andhra Pradesh
 * Formed and reorganized according to the official Government of Andhra Pradesh gazette.
 * Contains verified tourist spots, locations, descriptions, categories, best times,
 * main highlights, Google Maps endpoints, and verified nearby accommodations.
 */

const ANDHRA_PRADESH_DATA = {
  state: "Andhra Pradesh",
  capital: "Amaravati",
  totalDistricts: 26,
  description: "Andhra Pradesh, the Sun-Kissed Jewel of the Coromandel Coast, unfolds across nearly 1,000 kilometers of pristine Bay of Bengal shoreline, the emerald Eastern Ghats, sacred Seven Hills of Tirumala, the Grand Canyon of Gandikota, and the fertile deltas of the Godavari and Krishna rivers.",
  heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=85",
  districts: [
    {
      id: "alluri-sitharama-raju",
      name: "Alluri Sitharama Raju",
      slug: "alluri-sitharama-raju",
      headquarters: "Paderu",
      division: "Uttarandhra (North Coastal)",
      tagline: "The Verdant Eastern Ghats and Valley of Whispering Clouds",
      shortDescription: "Cradled in the misty Eastern Ghats, renowned for Araku Valley coffee estates, prehistoric Borra Caves, and winter chills at Lambasingi.",
      fullDescription: "Named after the legendary revolutionary hero Alluri Sitarama Raju, this highland district encompasses the highest altitudes of the Eastern Ghats. Rich in biodiversity, it features the subterranean karst wonders of Borra Caves, sprawling organic coffee plantations of Araku Valley, cascading waterfalls like Chaparai and Katiki, and the frosty winter mornings of Lambasingi.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "September to March",
      knownFor: "Araku Valley, Borra Caves, Lambasingi Fog, Organic Coffee",
      attractions: [
        {
          name: "Borra Caves",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Ananthagiri Hills, Alluri Sitharama Raju",
          category: "Caves & Geo-Heritage",
          description: "One of the largest and deepest karst limestone cave systems in India, formed over millions of years by the subterranean Gosthani River, adorned with magnificent stalactites, stalagmites, and natural Shiva lingams.",
          mapsQuery: "Borra+Caves+Alluri+Sitharama+Raju+Andhra+Pradesh",
          highlights: "Karst Stalactites & Stalagmites, Gosthani River Gorge, Natural Shiva Lingam",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Valley Resort Araku & Tyda Jungle Bells Eco Resort"
        },
        {
          name: "Araku Valley & Coffee Estates",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
          location: "Araku Valley, Alluri Sitharama Raju",
          category: "Valleys & Hill Stations",
          description: "Picturesque highland valley perched at 3,000 feet, surrounded by Galikonda and Raktakonda hills, celebrated for tribal heritage, Padmapuram Botanical Gardens, and world-renowned organic shade-grown coffee.",
          mapsQuery: "Araku+Valley+Andhra+Pradesh",
          highlights: "Organic Coffee Plantations, Tribal Heritage Museum, Dhimsa Dance Performances",
          bestTimeToVisit: "September to March",
          accommodation: "AP Tourism Haritha Hill Resort Araku & Haritha Mayuri Resort"
        },
        {
          name: "Lambasingi (Kashmir of Andhra Pradesh)",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Chintapalli Mandal, Alluri Sitharama Raju",
          category: "Hill Station & Mist",
          description: "The only place in South India where temperatures drop to near freezing point during peak winter, cloaked in morning fog, pine plantations, apple orchards, and nearby Kothapalli Waterfalls.",
          mapsQuery: "Lambasingi+Chintapalli+Andhra+Pradesh",
          highlights: "Near-Freezing Winter Fog, Pine Forests, Kothapalli Waterfalls",
          bestTimeToVisit: "November to January",
          accommodation: "AP Tourism Haritha Resorts Lambasingi & Hillside Tented Camps"
        },
        {
          name: "Chaparai Water Cascades & Katiki Falls",
          image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80",
          location: "Dumbriguda & Katiki, Araku",
          category: "Waterfalls & Nature",
          description: "Smooth natural rock slopes where mountain streams cascade into shallow emerald wading pools, accompanied by scenic forest trails leading to the 50-foot Katiki waterfall on the Gosthani River.",
          mapsQuery: "Chaparai+Water+Cascade+Araku+Andhra+Pradesh",
          highlights: "Natural Rock Slopes, Trekking to Katiki Gorge, Authentic Bamboo Chicken Cuisine",
          bestTimeToVisit: "August to December",
          accommodation: "Araku Haritha Valley Resorts & private nature lodges"
        }
      ]
    },
    {
      id: "anakapalli",
      name: "Anakapalli",
      slug: "anakapalli",
      headquarters: "Anakapalli",
      division: "Uttarandhra (North Coastal)",
      tagline: "Ancient Buddhist Relics and South India's Jaggery Heartland",
      shortDescription: "Celebrated for the 3rd-century BC Bojjannakonda rock-cut Buddhist monastery and South India's premier jaggery market.",
      fullDescription: "Formed in 2022 from Visakhapatnam district, Anakapalli pairs rich agricultural heritage with ancient Buddhist spiritual archaeology. The monolithic rock-cut caves of Bojjannakonda and Lingalakonda date from the 3rd century BCE, exhibiting rock-cut stupas and chaityas. The district also houses Kondakarla Ava, one of Andhra Pradesh's largest freshwater bird sanctuaries.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Bojjannakonda Buddhist Caves, Kondakarla Ava Lake, Jaggery Market",
      attractions: [
        {
          name: "Bojjannakonda & Lingalakonda Buddhist Monastery",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Sankaram, Anakapalli",
          category: "Archaeology & Buddhist Heritage",
          description: "Remarkable 3rd-century BCE to 9th-century CE rock-cut Buddhist complex containing monolithic stupas, rock-cut viharas, and seated Buddha figures exhibiting Hinayana, Mahayana, and Vajrayana architectural phases.",
          mapsQuery: "Bojjannakonda+Buddhist+Rock+Cut+Caves+Sankaram+Anakapalli",
          highlights: "Monolithic Rock Stupas, Ancient Viharas, Seated Buddha Sculptures",
          bestTimeToVisit: "October to February",
          accommodation: "Hotels in Anakapalli town and Visakhapatnam city center (35 km)"
        },
        {
          name: "Kondakarla Ava Freshwater Sanctuary",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Atchutapuram Mandal, Anakapalli",
          category: "Eco-Tourism & Bird Sanctuary",
          description: "One of the largest natural freshwater lakes in Andhra Pradesh, blanketed in pink lotus flowers and reed beds, navigated by traditional catamaran log rafts while hosting migratory water birds.",
          mapsQuery: "Kondakarla+Ava+Bird+Sanctuary+Anakapalli",
          highlights: "Log Raft Boating, Lotus Canopy, Grey Herons and Whistling Ducks",
          bestTimeToVisit: "November to February",
          accommodation: "AP Tourism Haritha resorts in nearby Visakhapatnam"
        },
        {
          name: "Muthyalammadu & Panchadarla Shrines",
          image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80",
          location: "Panchadarla, Anakapalli",
          category: "Heritage & Natural Springs",
          description: "Historic 9th-century Eastern Chalukya temple dedicated to Lord Dharmalingeswara, famous for perennial freshwater springs (five streams) and scenic hillocks.",
          mapsQuery: "Panchadarla+Temple+Anakapalli",
          highlights: "Perennial Springs, Eastern Chalukya Epigraphs, Peaceful Forest Setting",
          bestTimeToVisit: "October to March",
          accommodation: "Anakapalli town lodges and hotels"
        }
      ]
    },
    {
      id: "ananthapuramu",
      name: "Ananthapuramu",
      slug: "ananthapuramu",
      headquarters: "Ananthapuramu",
      division: "Rayalaseema",
      tagline: "The Land of Vijayanagara Architectural Grandeur",
      shortDescription: "Home to the hanging pillar wonder of Lepakshi, historic Gooty hilltop citadel, and the ancient Penukonda fort.",
      fullDescription: "Ananthapuramu is steeped in legendary lore, marked by monumental granite outcrops and arid Deccan grandeur. It features the world-renowned Vijayanagara architectural masterpiece Veerabhadra Temple at Lepakshi with its hanging pillar and monolithic Nandi, alongside Gooty's majestic shell-shaped hilltop fortress guarding centuries of Deccan military history.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to February",
      knownFor: "Lepakshi Hanging Pillar, Gooty Hill Fort, Thimmamma Marrimanu",
      attractions: [
        {
          name: "Lepakshi Veerabhadra Temple & Monolithic Nandi",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Lepakshi, Ananthapuramu",
          category: "Heritage & Vijayanagara Architecture",
          description: "16th-century Vijayanagara architectural masterpiece famed for its gravity-defying hanging pillar, the 7-hooded Nagalinga carved from a single boulder, and India's largest monolithic Nandi bull.",
          mapsQuery: "Lepakshi+Veerabhadra+Temple+Ananthapuramu",
          highlights: "Gravity-Defying Hanging Pillar, Monolithic Nandi, Fresco Ceiling Paintings",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Resort Lepakshi & Hindupur hotels"
        },
        {
          name: "Gooty Hill Fort",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Gooty, Ananthapuramu",
          category: "Forts & Citadels",
          description: "One of Andhra Pradesh's oldest hill fortresses, rising 300 meters above the plains, fortified with 15 concentric gateways, ancient bastions, and the historic Morari Rao royal seat.",
          mapsQuery: "Gooty+Fort+Ananthapuramu",
          highlights: "Concentric Hill Ramparts, 15 Historic Gateways, Panoramic Deccan Horizon",
          bestTimeToVisit: "November to February",
          accommodation: "AP Tourism Haritha Gooty & Ananthapuramu city hotels"
        },
        {
          name: "Thimmamma Marrimanu (Giant Banyan Tree)",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Near Kadiri, Ananthapuramu",
          category: "Nature & Sacred Groves",
          description: "Guinness World Record-recognized giant banyan tree with a canopy spreading over 4.7 acres, boasting thousands of prop roots that have created a living forest labyrinth since the 14th century.",
          mapsQuery: "Thimmamma+Marrimanu+Kadiri+Ananthapuramu",
          highlights: "4.7-Acre Single Tree Canopy, Ancient Prop Roots, Sacred Folklife Shrine",
          bestTimeToVisit: "October to March",
          accommodation: "Kadiri town guesthouses & Ananthapuramu city hotels"
        }
      ]
    },
    {
      id: "annamayya",
      name: "Annamayya",
      slug: "annamayya",
      headquarters: "Rayachoti",
      division: "Rayalaseema",
      tagline: "The Serene Hills of Horsley and Sacred Sankeertana Heritage",
      shortDescription: "Named after saint-poet Tallapaka Annamacharya, featuring the cool heights of Horsley Hills and historic Gurramkonda Fort.",
      fullDescription: "Formed in 2022 from Chittoor and Kadapa, Annamayya district pays homage to Tallapaka Annamacharya, who authored over 32,000 devotional sankeertanas for Lord Venkateswara. The district is home to Horsley Hills, the premier hill retreat of Rayalaseema perched at 4,147 feet, the sheer granite cliff fort of Gurramkonda, and Chola-era temples.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "September to March",
      knownFor: "Horsley Hills Hill Station, Gurramkonda Fort, Tallapaka Memorial",
      attractions: [
        {
          name: "Horsley Hills (Yenugu Mallamma Konda)",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
          location: "Madanapalle, Annamayya",
          category: "Hill Station & Eco-Tourism",
          description: "Enchanting hill retreat at 4,147 feet with cool alpine breezes, eucalyptus groves, Gali Bandalu windy rock, Kalyani eucalyptus tree, and scenic high-altitude viewpoints.",
          mapsQuery: "Horsley+Hills+Annamayya+Andhra+Pradesh",
          highlights: "Gali Bandalu Windswept Rocks, Kalyani Eucalyptus, Sunset Viewpoint",
          bestTimeToVisit: "Year-round (Best October to March)",
          accommodation: "AP Tourism Haritha Hill Resort Horsley Hills"
        },
        {
          name: "Gurramkonda Fort & Rangin Mahal",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Gurramkonda, Annamayya",
          category: "Forts & Palaces",
          description: "Majestic 500-foot sheer granite cliff citadel built by the Vijayanagara kings and later held by Tipu Sultan, boasting the graceful wooden two-story Rangin Mahal palace.",
          mapsQuery: "Gurramkonda+Fort+Annamayya",
          highlights: "Rangin Mahal Palace, Impregnable Cliff Walls, Tipu Sultan Bastions",
          bestTimeToVisit: "October to February",
          accommodation: "Madanapalle and Rayachoti hotels"
        },
        {
          name: "Soumyanatha Swamy Temple, Nandalur",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Nandalur, Annamayya",
          category: "Pilgrimage & Chola Architecture",
          description: "Grand 11th-century Chola temple dedicated to Lord Vishnu, featuring 108 intricately sculpted stone pillars, ancient Tamil and Telugu epigraphs, and a massive granite gopuram.",
          mapsQuery: "Soumyanatha+Swamy+Temple+Nandalur+Annamayya",
          highlights: "108 Sculpted Pillars, Chola Architecture, Ancient Inscriptions",
          bestTimeToVisit: "September to March",
          accommodation: "Rajampet town lodges and Rayachoti guest rooms"
        }
      ]
    },
    {
      id: "bapatla",
      name: "Bapatla",
      slug: "bapatla",
      headquarters: "Bapatla",
      division: "Coastal Andhra",
      tagline: "Sun-Drenched Golden Beaches and Coastal Serenity",
      shortDescription: "Famous for Suryalanka Beach, historic Bhavanarayana Swamy Temple, and expansive sandy shorelines along the Bay of Bengal.",
      fullDescription: "Formed in 2022 from Guntur and Prakasam, Bapatla is celebrated for Suryalanka Beach, a favored seaside retreat boasting sweeping golden sands and gentle surf. The town of Bapatla has a deep historical legacy anchored by the 1,400-year-old Sri Bhavanarayana Swamy Temple built by the Chola kings and the vibrant coastal village life of Vodarevu.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Suryalanka Beach, Vodarevu Beach, Bhavanarayana Swamy Temple",
      attractions: [
        {
          name: "Suryalanka Beach",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Bapatla Coast, Bapatla",
          category: "Beaches & Coastline",
          description: "Vast golden sand beach with calm waters ideal for safe swimming, morning dolphin sightings, and sunset strolls along the Bay of Bengal, featuring beachfront cottages.",
          mapsQuery: "Suryalanka+Beach+Bapatla+Andhra+Pradesh",
          highlights: "Gentle Ocean Surf, Beachfront Cottages, Sunrise & Sunset Horizons",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Beach Resort Suryalanka"
        },
        {
          name: "Sri Bhavanarayana Swamy Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Bapatla Town, Bapatla",
          category: "Pilgrimage & Ancient Temples",
          description: "Ancient 1,400-year-old temple built during the Chola dynasty, dedicated to Lord Bhavanarayana Swamy, displaying historical stone carvings, temple tanks, and annual Brahmotsavam.",
          mapsQuery: "Bhavanarayana+Swamy+Temple+Bapatla",
          highlights: "Chola Inscriptions, Annual Brahmotsavam Chariot, Ancient Sanctum",
          bestTimeToVisit: "October to March",
          accommodation: "Bapatla town hotels and guest houses"
        },
        {
          name: "Vodarevu Beach & Fishermen Haven",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Near Chirala, Bapatla",
          category: "Beaches & Coastal Culture",
          description: "Lively coastal village beach shaded by towering coconut palm groves, where colorful catamarans and fresh morning fish hauls offer picturesque coastal views.",
          mapsQuery: "Vodarevu+Beach+Bapatla",
          highlights: "Coconut Palm Groves, Catamaran Boat Rides, Fresh Coastal Seafood",
          bestTimeToVisit: "November to February",
          accommodation: "Suryalanka Haritha Resort & Chirala town hotels"
        }
      ]
    },
    {
      id: "chittoor",
      name: "Chittoor",
      slug: "chittoor",
      headquarters: "Chittoor",
      division: "Rayalaseema",
      tagline: "Sacred Shrines and Cascading Foothill Waterfalls",
      shortDescription: "Home to the celebrated self-manifested Vinayaka Temple at Kanipakam, Kaundinya Elephant Sanctuary, and Kaigal Waterfalls.",
      fullDescription: "Bordered by Tamil Nadu and Karnataka, Chittoor is famed for the swayambhu (self-manifested) idol of Lord Ganesha at Kanipakam, which rests in a perennial spring well. The district encompasses rolling hills, lush mango orchards, the verdant Kaigal cascades, and the pristine wildlife habitats of Kaundinya Elephant Reserve.",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "September to February",
      knownFor: "Kanipakam Vinayaka Temple, Kaigal Waterfalls, Mango Orchards",
      attractions: [
        {
          name: "Sri Varasidhi Vinayaka Temple, Kanipakam",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Kanipakam, Chittoor",
          category: "Pilgrimage & Sacred Shrines",
          description: "Celebrated 11th-century temple founded by Chola King Kulothunga I, housing a swayambhu Ganesha murti emerging from a natural well, renowned for resolving disputes through the oath of truth.",
          mapsQuery: "Kanipakam+Vinayaka+Temple+Chittoor",
          highlights: "Swayambhu Well Shrine, Growing Deity Lore, Sacred Theertham Spring",
          bestTimeToVisit: "September to March",
          accommodation: "Kanipakam Devasthanam Choultries and Chittoor city hotels"
        },
        {
          name: "Kaigal Waterfalls (Dumukurallu)",
          image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80",
          location: "Baireddipalle Mandal, Chittoor",
          category: "Waterfalls & Nature",
          description: "Scenic perennial waterfall tumbling from a 40-foot height into a calm natural pool, surrounded by dense shola forests within the Kaundinya sanctuary corridor.",
          mapsQuery: "Kaigal+Falls+Chittoor+Andhra+Pradesh",
          highlights: "Perennial Water Stream, Natural Rock Pool, Forest Birding",
          bestTimeToVisit: "September to December",
          accommodation: "Chittoor city hotels and Palamaner guest houses"
        },
        {
          name: "Kaundinya Wildlife Sanctuary",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Palamaner, Chittoor",
          category: "Wildlife & Elephant Corridors",
          description: "The only Asian Elephant sanctuary in Andhra Pradesh, spanning rugged hill valleys covered in dry deciduous forests, home to wild elephant herds, sloth bears, and leopards.",
          mapsQuery: "Kaundinya+Wildlife+Sanctuary+Chittoor",
          highlights: "Asian Wild Elephant Herds, Forest Jungle Trails, Kalyan Dam",
          bestTimeToVisit: "October to April",
          accommodation: "Forest Inspection Bungalow & Palamaner hotels"
        }
      ]
    },
    {
      id: "dr-br-ambedkar-konaseema",
      name: "Dr. B.R. Ambedkar Konaseema",
      slug: "dr-br-ambedkar-konaseema",
      headquarters: "Amalapuram",
      division: "Coastal Andhra",
      tagline: "God's Own Delta and Kerala of the East Coast",
      shortDescription: "An emerald delta of meandering Godavari tributaries, endless coconut lagoons, Antarvedi sea confluence, and heritage riverside temples.",
      fullDescription: "Formed in 2022 from the fertile delta of the Godavari River, Konaseema is acclaimed as the Kerala of Andhra Pradesh. Bordered by the Gautami, Vashista, and Vainateya distributaries, this lush green garden district features scenic backwaters, houseboats at Dindi, the sacred Antarvedi Lakshmi Narasimha Swamy Temple where the river meets the Bay of Bengal, and rich culinary traditions.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Godavari Delta Backwaters, Dindi Houseboats, Antarvedi Confluence",
      attractions: [
        {
          name: "Dindi Backwaters & River Houseboats",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Dindi, Razole, Konaseema",
          category: "Backwaters & Eco-Tourism",
          description: "Tranquil palm-fringed backwater canals along the Vashista Godavari, featuring luxury eco-houseboats, floating cottages, and sunset river cruises amidst endless coconut groves.",
          mapsQuery: "Dindi+Resorts+Konaseema+Andhra+Pradesh",
          highlights: "River Cruise Houseboats, Coconut Island Lagoons, Sunset River Safaris",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Coconut Country Resort Dindi"
        },
        {
          name: "Antarvedi Sri Lakshmi Narasimha Swamy Temple & Sagara Sangamam",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Antarvedi, Sakhinetipalli Mandal, Konaseema",
          category: "Pilgrimage & Coastal Confluence",
          description: "Sacred 15th-century coastal shrine where the Vashista Godavari merges with the Bay of Bengal, revered as Sapta Sagara Sangamam, accompanied by an iconic British-era lighthouse.",
          mapsQuery: "Antarvedi+Temple+and+Beach+Konaseema",
          highlights: "River-Ocean Sagara Sangamam, 15th-Century Chariot Festival, Historic Lighthouse",
          bestTimeToVisit: "October to March",
          accommodation: "Temple Guest Rooms and Haritha Dindi Resort (25 km)"
        },
        {
          name: "Ainavilli Sri Siddhi Vinayaka Temple",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Ainavilli, Konaseema",
          category: "Pilgrimage & Temples",
          description: "Ancient shrine where Lord Ganesha is revered with his trunk turned right (Dakshinabhimukha), set amidst serene green paddy fields and coconut orchards.",
          mapsQuery: "Ainavilli+Vinayaka+Temple+Konaseema",
          highlights: "Dakshinabhimukha Ganesha, Scenic Delta Landscape, Temple Kalyani",
          bestTimeToVisit: "September to March",
          accommodation: "Amalapuram and Ravulapalem hotels"
        }
      ]
    },
    {
      id: "east-godavari",
      name: "East Godavari",
      slug: "east-godavari",
      headquarters: "Rajamahendravaram",
      division: "Coastal Andhra",
      tagline: "The Cultural and Literary Soul of the Godavari Basin",
      shortDescription: "Home to historic Rajahmundry, Godavari River ghats, Asia's iconic rail-cum-road bridges, and the vibrant flower nurseries of Kadiyam.",
      fullDescription: "Reorganized in 2022 with historic Rajamahendravaram (Rajahmundry) as its headquarters, East Godavari is the cradle of Telugu literature and cultural heritage. The mighty Godavari River expands here to its widest expanse, crossed by the famous Godavari Arch Bridge. The district is world-renowned for Kadiyam flower nurseries, sacred Pushkar Ghats, and the Dowleswaram Barrage.",
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Godavari Ghats, Godavari Arch Bridge, Kadiyam Nurseries, Dowleswaram",
      attractions: [
        {
          name: "Godavari River Ghats & Pushkar Ghat",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Rajamahendravaram, East Godavari",
          category: "River Ghats & Culture",
          description: "Sacred riverfront promenade bustling with grand evening Godavari Harathi rituals, tourist motorboats, and panoramic river breezes along the sacred Pushkar and Kotilingeshwara ghats.",
          mapsQuery: "Pushkar+Ghat+Rajamahendravaram+East+Godavari",
          highlights: "Evening Godavari Harathi, River Boating, Kotilingeshwara Temple",
          bestTimeToVisit: "October to March",
          accommodation: "Riverfront hotels and AP Tourism Haritha Rajamahendravaram"
        },
        {
          name: "Godavari Arch Bridge & Havelock Bridge Heritage",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Rajamahendravaram, East Godavari",
          category: "Engineering & Heritage",
          description: "Monumental bowstring arch bridge spanning 2.7 kilometers across the wide Godavari River, parallel to the historic 1900 Havelock stone piers, creating an iconic skyline.",
          mapsQuery: "Godavari+Arch+Bridge+Rajamahendravaram",
          highlights: "2.7-km Bowstring Arch Span, Sunset River Vistas, Historic Rail Heritage",
          bestTimeToVisit: "October to March",
          accommodation: "Rajamahendravaram city center hotels"
        },
        {
          name: "Kadiyam Flower Nurseries",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Kadiyam, East Godavari",
          category: "Horticulture & Eco-Tourism",
          description: "Sprawling floral belt across hundreds of acres with thousands of nurseries cultivating exotic ornamental plants, bonsai, fruit saplings, and vibrant flowering flora.",
          mapsQuery: "Kadiyam+Nurseries+Rajamahendravaram",
          highlights: "Exotic Flora Collections, Master Bonsai Gardens, Green Plant Shopping",
          bestTimeToVisit: "September to February",
          accommodation: "Rajamahendravaram hotels (12 km)"
        },
        {
          name: "Dowleswaram Barrage & Sir Arthur Cotton Museum",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Dowleswaram, East Godavari",
          category: "History & Engineering",
          description: "Historic irrigation barrage designed by visionary British engineer Sir Arthur Cotton, featuring a dedicated museum commemorating the transformation of the delta.",
          mapsQuery: "Sir+Arthur+Cotton+Museum+Dowleswaram",
          highlights: "Arthur Cotton Memorial, Barrage Engineering Vistas, Canal Network",
          bestTimeToVisit: "October to March",
          accommodation: "Rajamahendravaram business and luxury hotels"
        }
      ]
    },
    {
      id: "eluru",
      name: "Eluru",
      slug: "eluru",
      headquarters: "Eluru",
      division: "Coastal Andhra",
      tagline: "The Great Pelican Haven of Kolleru Lake",
      shortDescription: "World-famous for Kolleru Lake & Atapaka Bird Sanctuary, Chinna Tirupati temple at Dwaraka Tirumala, and Guntupalli Buddhist Caves.",
      fullDescription: "Established as an independent administrative district in 2022, Eluru encompasses one of Asia's largest freshwater wetlands, Kolleru Lake. The Atapaka sanctuary hosts thousands of nesting grey pelicans and painted storks. The district also houses Dwaraka Tirumala, revered as Chinna Tirupati, and the 3rd-century BC Buddhist rock caves of Guntupalli.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "November to March",
      knownFor: "Kolleru Lake Bird Sanctuary, Dwaraka Tirumala, Guntupalli Caves",
      attractions: [
        {
          name: "Kolleru Lake & Atapaka Bird Sanctuary",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Atapaka, Kolleru Lake, Eluru",
          category: "Wildlife & Ramsar Wetlands",
          description: "Internationally recognized Ramsar wetland and bird sanctuary spanning Kolleru Lake, welcoming over 20,000 migratory Spot-billed Pelicans, Painted Storks, and glossy ibises.",
          mapsQuery: "Atapaka+Bird+Sanctuary+Kolleru+Lake+Eluru",
          highlights: "Pelican Breeding Enclosures, Wetland Boat Rides, Migratory Bird Photography",
          bestTimeToVisit: "November to March",
          accommodation: "AP Tourism Haritha Atapaka & Eluru town hotels"
        },
        {
          name: "Dwaraka Tirumala (Chinna Tirupati)",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Dwaraka Tirumala, Eluru",
          category: "Pilgrimage & Sacred Peaks",
          description: "Ancient hill shrine on Seshadri Hill dedicated to Lord Venkateswara, widely revered as Chinna Tirupati where pilgrims fulfill vows before embarking to Tirumala.",
          mapsQuery: "Dwaraka+Tirumala+Temple+Eluru",
          highlights: "Swayambhu Venkateswara Idol, Golden Gopuram, Holy Pushkarini Tank",
          bestTimeToVisit: "October to March",
          accommodation: "Devasthanam Choultries and AC Guest Houses"
        },
        {
          name: "Guntupalli Buddhist Rock-Cut Monuments",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Kamavarapukota, Eluru",
          category: "Archaeology & Buddhist Caves",
          description: "Ancient 3rd-century BCE rock-cut Buddhist complex nestled in a scenic horseshoe ravine, comprising circular chaitya halls, viharas, and brick stupas older than Ajanta.",
          mapsQuery: "Guntupalli+Buddhist+Monuments+Eluru",
          highlights: "Circular Rock-Cut Chaitya Hall, Vihara Monasteries, Hill Ravine Setting",
          bestTimeToVisit: "October to February",
          accommodation: "Eluru city hotels (40 km)"
        }
      ]
    },
    {
      id: "guntur",
      name: "Guntur",
      slug: "guntur",
      headquarters: "Guntur",
      division: "Coastal Andhra",
      tagline: "Historic Citadels, Chilly Spices, and Hilltop Shrines",
      shortDescription: "Famous for the medieval Kondaveedu Fort, Kotappakonda Trikoteswara Temple, Uppalapadu Bird Sanctuary, and rich chili trading heritage.",
      fullDescription: "Guntur is a dynamic historical and commercial hub renowned worldwide for its fiery chili market and agricultural wealth. It is crowned by the formidable 14th-century Kondaveedu Fort built by the Reddy dynasty, the scenic Kotappakonda hill temple, and Uppalapadu village where rare spot-billed pelicans nest amid residential tanks.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Kondaveedu Fort, Kotappakonda Hill, Uppalapadu Bird Sanctuary",
      attractions: [
        {
          name: "Kondaveedu Fort",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Kondaveedu Hills, Guntur",
          category: "Forts & Citadels",
          description: "Formidable 14th-century hill citadel built by Reddy dynasty rulers, boasting 21 defensive ramparts, ancient stone grain stores, palace ruins, and scenic winding ghat road.",
          mapsQuery: "Kondaveedu+Fort+Guntur+Andhra+Pradesh",
          highlights: "Scenic Ghat Road Drive, Reddy Kings Citadel, Panoramic Valley Trekking",
          bestTimeToVisit: "October to February",
          accommodation: "Hotels and boutique stays in Guntur city center"
        },
        {
          name: "Kotappakonda Trikoteswara Swamy Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Kotappakonda Hill, Guntur",
          category: "Pilgrimage & Hilltop Shrines",
          description: "Ancient shrine perched on a 1,587-foot tri-peaked hill representing Brahma, Vishnu, and Shiva, renowned for massive 100-foot illuminated Prabhalu processions during Maha Shivaratri.",
          mapsQuery: "Kotappakonda+Temple+Guntur",
          highlights: "Tri-Peaked Sacred Hill, Maha Shivaratri Prabhas, Hilltop Deer Sanctuary",
          bestTimeToVisit: "November to March",
          accommodation: "Narasaraopet and Guntur city hotels"
        },
        {
          name: "Uppalapadu Bird Sanctuary",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Uppalapadu, Guntur",
          category: "Wildlife & Avian Havens",
          description: "Unique community-supported village wetland pond where thousands of endangered spot-billed pelicans and painted storks build nesting colonies on artificial wire perches.",
          mapsQuery: "Uppalapadu+Bird+Sanctuary+Guntur",
          highlights: "Spot-Billed Pelican Breeding, Elevated Watchtowers, Bird Photography",
          bestTimeToVisit: "October to March",
          accommodation: "Guntur city hotels (6 km)"
        }
      ]
    },
    {
      id: "kakinada",
      name: "Kakinada",
      slug: "kakinada",
      headquarters: "Kakinada",
      division: "Coastal Andhra",
      tagline: "The Mangrove Haven and Coastal Port of Coromandel",
      shortDescription: "Acclaimed for Coringa Mangrove Sanctuary, Hope Island, historic Draksharamam Pancharama temple, and Kakinada Kaja sweetness.",
      fullDescription: "Established as a dedicated coastal district in 2022, Kakinada is renowned for its planned grid layout, deep-water port, and delicious traditional sweet, Kakinada Kaja. The district is home to Coringa Wildlife Sanctuary, India's third largest mangrove ecosystem, Hope Island natural sand spit, and Draksharamam temple, one of the sacred Pancharama Kshetras.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Coringa Mangroves, Hope Island, Draksharamam Temple, Kakinada Beach",
      attractions: [
        {
          name: "Coringa Wildlife Sanctuary & Mangrove Boardwalk",
          image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
          location: "Coringa, Kakinada",
          category: "Mangroves & Wildlife",
          description: "India's third-largest mangrove forest at the Godavari estuary, featuring a scenic 4-kilometer elevated wooden canopy boardwalk, smooth river boat safaris, and otters.",
          mapsQuery: "Coringa+Wildlife+Sanctuary+Kakinada",
          highlights: "Longest Wooden Boardwalk, Estuary Boat Safari, Otters & Fishing Cats",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Kakinada & city waterfront hotels"
        },
        {
          name: "Hope Island & Kakinada Bay",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Kakinada Coast, Kakinada",
          category: "Islands & Beaches",
          description: "Stunning 18-kilometer crescent-shaped natural sand spit in Kakinada Bay formed over two centuries by coastal currents, safeguarding the natural port and Olive Ridley turtle nests.",
          mapsQuery: "Hope+Island+Kakinada+Bay",
          highlights: "Island Boat Excursions, Historic Lighthouse, Untouched Marine Sands",
          bestTimeToVisit: "November to February",
          accommodation: "Kakinada harbor hotels and luxury beach resorts"
        },
        {
          name: "Draksharamam Sri Bhimeswara Swamy Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Draksharamam, Kakinada",
          category: "Pilgrimage & Pancharama",
          description: "Revered as Dakshina Kashi and one of the five holy Pancharama Kshetras, enshrining a 14-foot crystal Shiva Lingam and the Manikyamba Shakti Peetha.",
          mapsQuery: "Draksharamam+Temple+Kakinada",
          highlights: "14-foot Crystal Lingam, Eastern Chalukya Inscriptions, Sapta Godavari Pond",
          bestTimeToVisit: "October to March",
          accommodation: "Devasthanam Choultries and Kakinada hotels (28 km)"
        }
      ]
    },
    {
      id: "krishna",
      name: "Krishna",
      slug: "krishna",
      headquarters: "Machilipatnam",
      division: "Coastal Andhra",
      tagline: "The Historic Port of Bandar and Manginapudi Sands",
      shortDescription: "Steeped in maritime trade history with Manginapudi black sand beach, historic Bandar Fort, and holy Hamsaladeevi confluence.",
      fullDescription: "With its historic headquarters at Machilipatnam (Bandar), Krishna district was a prominent 17th-century trading port for the Dutch, French, and British East India companies. It is famous for Machilipatnam Kalamkari vegetable-dye textile prints, Manginapudi beach with natural black sands, Panduranga Swamy Temple, and Hamsaladeevi where the Krishna River flows into the sea.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Manginapudi Beach, Machilipatnam Bandar Fort, Kalamkari Craft",
      attractions: [
        {
          name: "Manginapudi Beach",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Machilipatnam Coast, Krishna",
          category: "Beaches & Coastline",
          description: "Picturesque natural beach on the Bay of Bengal coastline characterized by black silica sand and shallow gentle surf, popular for sacred Magha Poornima dips and evening sea air.",
          mapsQuery: "Manginapudi+Beach+Machilipatnam+Krishna",
          highlights: "Black Sand Coastline, Calm Swimming Waters, Coastal Promenade",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Beach Resort Manginapudi & Machilipatnam hotels"
        },
        {
          name: "Machilipatnam Bandar Fort & Dutch Cemetery",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Machilipatnam, Krishna",
          category: "Colonial History & Forts",
          description: "17th-century coastal fortress built by Dutch merchants and subsequently held by French and British forces, preserving monumental tomb monuments and colonial cannons.",
          mapsQuery: "Bandar+Fort+Machilipatnam+Krishna",
          highlights: "Colonial Ramparts, Historic Dutch Tombs, Ancient Port Maritime Basin",
          bestTimeToVisit: "November to February",
          accommodation: "Machilipatnam city hotels"
        },
        {
          name: "Hamsaladeevi (Krishna Sagara Sangamam)",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Koduru Mandal, Krishna",
          category: "Eco-Tourism & Confluence",
          description: "Sacred confluence where the holy Krishna River meets the Bay of Bengal, surrounded by mangrove waterways, pristine sandbanks, and the holy Venugopala Swamy Temple.",
          mapsQuery: "Hamsaladeevi+Beach+Krishna+District",
          highlights: "River-Ocean Sagara Sangamam, Untouched Sandbanks, Venugopala Swamy Temple",
          bestTimeToVisit: "October to March",
          accommodation: "Avanigadda and Machilipatnam hotels"
        }
      ]
    },
    {
      id: "kurnool",
      name: "Kurnool",
      slug: "kurnool",
      headquarters: "Kurnool",
      division: "Rayalaseema",
      tagline: "The Historic Bastion of Rayalaseema and Oravakallu Rocks",
      shortDescription: "The former capital of Andhra State, famous for the iconic Konda Reddy Buruju, surreal Oravakallu rock formations, and Rollapadu sanctuary.",
      fullDescription: "Kurnool, situated on the banks of the Tungabhadra and Hundri rivers, served as the historic first capital of Andhra State (1953-1956). The city is anchored by the historic Konda Reddy Buruju bastion. Outside the city lies the geological spectacle of Oravakallu Rock Garden and the Rollapadu grassland sanctuary, home to the endangered Great Indian Bustard.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Konda Reddy Buruju, Oravakallu Rock Garden, Rollapadu Wildlife",
      attractions: [
        {
          name: "Konda Reddy Buruju (Kurnool Fort Bastion)",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Kurnool City Center, Kurnool",
          category: "Forts & Citadels",
          description: "Prominent 12th-century stone fortification tower built by Vijayanagara rulers, featuring historic underground tunnels, cannon batteries, and panoramic city vistas.",
          mapsQuery: "Konda+Reddy+Buruju+Kurnool",
          highlights: "Historic Prison Bastion, Cannon Battery, 360-Degree Kurnool City Views",
          bestTimeToVisit: "October to March",
          accommodation: "Premium business and luxury hotels in Kurnool city"
        },
        {
          name: "Oravakallu Rock Garden",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
          location: "Oravakallu, Kurnool",
          category: "Geo-Heritage & Rock Formations",
          description: "A 1,000-acre geological park displaying prehistoric igneous quartz and silica rock formations around a tranquil water reservoir, ideal for rock trekking and boating.",
          mapsQuery: "Oravakallu+Rock+Garden+Kurnool",
          highlights: "Prehistoric Quartz Pinnacles, Boating Reservoir, Nature Hiking Trails",
          bestTimeToVisit: "October to February",
          accommodation: "AP Tourism Haritha Rock Garden Resort Oravakallu"
        },
        {
          name: "Rollapadu Wildlife Sanctuary",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Nandikotkur Mandal, Kurnool",
          category: "Wildlife & Grasslands",
          description: "Semi-arid grassland ecosystem safeguarding the critically endangered Great Indian Bustard, along with blackbuck antelopes, Indian foxes, and migratory harriers.",
          mapsQuery: "Rollapadu+Wildlife+Sanctuary+Kurnool",
          highlights: "Great Indian Bustard Habitat, Blackbuck Antelope Herds, Grassland Trails",
          bestTimeToVisit: "October to March",
          accommodation: "Forest Rest House and Kurnool city hotels (45 km)"
        }
      ]
    },
    {
      id: "nandyal",
      name: "Nandyal",
      slug: "nandyal",
      headquarters: "Nandyal",
      division: "Rayalaseema",
      tagline: "The Sacred Abode of Srisailam Jyotirlinga and Belum Caves",
      shortDescription: "Home to the celebrated Srisailam Mallikarjuna Jyotirlinga, subterranean Belum Caves, Mahanandi, and the mystical growing Nandi of Yaganti.",
      fullDescription: "Established as an independent district in 2022, Nandyal is one of India's preeminent spiritual and geological corridors. Deep in the Nallamala forest hills stands Srisailam, one of the 12 Jyotirlingas and 18 Maha Shakti Peethas. The district also encompasses the underground wonders of Belum Caves, Mahanandi with its crystal springs, and Yaganti's growing stone Nandi.",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "September to March",
      knownFor: "Srisailam Jyotirlinga, Belum Caves, Mahanandi, Yaganti Temple",
      attractions: [
        {
          name: "Srisailam Sri Mallikarjuna Swamy Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Srisailam, Nallamala Hills, Nandyal",
          category: "Pilgrimage & Jyotirlinga",
          description: "One of India's 12 revered Shiva Jyotirlingas and 18 Maha Shakti Peethas (Bhramaramba Devi), situated dramatically atop the Nallamala Hills overlooking the Krishna River gorge.",
          mapsQuery: "Srisailam+Mallikarjuna+Temple+Andhra+Pradesh",
          highlights: "Jyotirlinga & Shakti Peetha, Krishna River Gorge, Srisailam Dam Vistas",
          bestTimeToVisit: "September to March",
          accommodation: "AP Tourism Haritha Srisailam & Devasthanam guest complexes"
        },
        {
          name: "Belum Caves",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Kolimigundla Mandal, Nandyal",
          category: "Caves & Geo-Heritage",
          description: "The second largest natural cave system in the Indian subcontinent, running 3.2 kilometers with spacious underground caverns, musical limestone stalactites, and Pathalaganga stream.",
          mapsQuery: "Belum+Caves+Nandyal+Andhra+Pradesh",
          highlights: "Kotilingalu Chamber, Musical Limestone Pillars, Pathalaganga Stream",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Belum Caves & Tadipatri hotels"
        },
        {
          name: "Mahanandi Sri Mahanandiswara Swamy Temple",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Mahanandi, Nandyal",
          category: "Pilgrimage & Perennial Springs",
          description: "Ancient 1,500-year-old temple complex surrounded by lush Nallamala forests, renowned for its perennial freshwater mineral springs that maintain crystal clarity throughout the year.",
          mapsQuery: "Mahanandi+Temple+Nandyal",
          highlights: "Perennial Spring Kalyani Tank, Navanandi Shrines, Dense Forest Setting",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Mahanandi & Nandyal town hotels (15 km)"
        },
        {
          name: "Yaganti Sri Uma Maheshwara Swamy Temple",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Banaganapalle, Nandyal",
          category: "Pilgrimage & Cave Shrines",
          description: "15th-century cave temple famous for its continuously growing monolithic Nandi statue, the mysterious absence of crows, Agastya Cave, and natural cliff amphitheater.",
          mapsQuery: "Yaganti+Temple+Nandyal",
          highlights: "Growing Monolithic Nandi, Natural Cave Shrines, Pushkarini Spring",
          bestTimeToVisit: "October to March",
          accommodation: "Banaganapalle town lodges and Nandyal city hotels"
        }
      ]
    },
    {
      id: "ntr",
      name: "NTR",
      slug: "ntr",
      headquarters: "Vijayawada",
      division: "Coastal Andhra",
      tagline: "The Vibrant Heart of Kanaka Durga and Prakasam Barrage",
      shortDescription: "Encompassing Vijayawada, crowned by Kanaka Durga Temple atop Indrakeeladri, Undavalli rock caves, and scenic Bhavani Island.",
      fullDescription: "Named in honor of Andhra Pradesh's iconic leader and cinema legend N.T. Rama Rao, NTR district has its heart in Vijayawada, the commercial capital of the state. It is commanded by the sacred Kanaka Durga Temple on Indrakeeladri Hill, the majestic Prakasam Barrage across the Krishna River, Bhavani Island river retreat, and nearby Kondapalli toy-making heritage.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Kanaka Durga Temple, Prakasam Barrage, Bhavani Island, Kondapalli Fort",
      attractions: [
        {
          name: "Sri Durga Malleswara Swamy (Kanaka Durga) Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Indrakeeladri Hill, Vijayawada, NTR",
          category: "Pilgrimage & Sacred Peaks",
          description: "Historic hill shrine perched atop Indrakeeladri commanding the Krishna River, celebrated as the second largest temple in Andhra Pradesh, where Goddess Durga triumphed over Mahishasura.",
          mapsQuery: "Kanaka+Durga+Temple+Vijayawada+NTR",
          highlights: "Indrakeeladri Hilltop Panorama, Dasara Navaratri Festivities, Ghat Road",
          bestTimeToVisit: "October to March",
          accommodation: "Luxury business hotels and Devasthanam guest rooms in Vijayawada"
        },
        {
          name: "Prakasam Barrage & Bhavani Island",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Krishna River, Vijayawada, NTR",
          category: "Riverfront & Island Tourism",
          description: "Monumental 1,223-meter barrage regulating the Krishna River, creating a vast lake hosting Bhavani Island, one of India's largest river islands offering water sports and luxury resorts.",
          mapsQuery: "Prakasam+Barrage+Vijayawada",
          highlights: "Illuminated Night Barrage, Bhavani Island Jet Skiing, Riverfront Walkways",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Berm Park & Haritha Bhavani Island Resort"
        },
        {
          name: "Kondapalli Fort & Wooden Toy Artisan Colony",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Kondapalli, NTR",
          category: "Forts & GI Handicrafts",
          description: "14th-century hill fortress built by Prolaya Vema Reddy, neighboring the artisan colony world-renowned for eco-friendly Kondapalli Bommalu wooden crafts made from Tella Poniki wood.",
          mapsQuery: "Kondapalli+Fort+NTR+District",
          highlights: "Gajaraja Khana Armoury, GI-Tagged Kondapalli Wooden Toys, Forest Trek",
          bestTimeToVisit: "October to March",
          accommodation: "Vijayawada city hotels (16 km)"
        }
      ]
    },
    {
      id: "palnadu",
      name: "Palnadu",
      slug: "palnadu",
      headquarters: "Narasaraopet",
      division: "Coastal Andhra",
      tagline: "The Historic Battlefields, Nagarjunasagar, and Buddhist Cradle",
      shortDescription: "Famous for the world-renowned Nagarjunasagar Dam, Nagarjunakonda Island Buddhist museum, and majestic Ethipothala Falls.",
      fullDescription: "Palnadu district, carved out of Guntur in 2022, is celebrated for its historic heroic folklore (Palnati Yuddham) and world-renowned Buddhist legacy. The district hosts the colossal Nagarjunasagar Dam on the Krishna River, Nagarjunakonda island museum preserving 2nd-century Mahayana Buddhist treasures, and the cascading waters of Ethipothala Falls.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Nagarjunakonda Island, Nagarjunasagar Dam, Ethipothala Waterfalls",
      attractions: [
        {
          name: "Nagarjunakonda Island Museum & Buddhist Relics",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Nagarjunasagar Reservoir, Palnadu",
          category: "Archaeology & Island Heritage",
          description: "Unique island museum set in the blue waters of Nagarjunasagar reservoir, housing priceless 2nd-century Buddhist relics, stone stupas, and monasteries relocated from the submerged valley.",
          mapsQuery: "Nagarjunakonda+Island+Museum+Palnadu",
          highlights: "Scenic Reservoir Ferry Ride, Acharya Nagarjuna Relics, Ancient Monasteries",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Vijay Vihar Nagarjunasagar"
        },
        {
          name: "Nagarjunasagar Dam",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Macherla Mandal, Palnadu",
          category: "Engineering & Dams",
          description: "One of the world's largest masonry dams built across the Krishna River with 26 crest gates that release thunderous cascades during peak monsoons, backed by a majestic lake.",
          mapsQuery: "Nagarjunasagar+Dam+Andhra+Pradesh",
          highlights: "26 Majestic Crest Gates, Deep River Canyon, Panoramic Dam Viewpoints",
          bestTimeToVisit: "August to February",
          accommodation: "AP Tourism Haritha Vijay Vihar Nagarjunasagar"
        },
        {
          name: "Ethipothala Waterfalls",
          image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80",
          location: "Near Macherla, Palnadu",
          category: "Waterfalls & Wildlife",
          description: "Spectacular 70-foot waterfall formed by the Chandravanka mountain stream plunging into an emerald lagoon surrounded by rocky cliffs and a dedicated crocodile breeding sanctuary.",
          mapsQuery: "Ethipothala+Falls+Palnadu+Andhra+Pradesh",
          highlights: "Lagoon Cascade, Crocodile Breeding Center, Illuminated Night Views",
          bestTimeToVisit: "September to January",
          accommodation: "AP Tourism Haritha Resort Ethipothala"
        }
      ]
    },
    {
      id: "parvathipuram-manyam",
      name: "Parvathipuram Manyam",
      slug: "parvathipuram-manyam",
      headquarters: "Parvathipuram",
      division: "Uttarandhra (North Coastal)",
      tagline: "The Pristine Tribal Hills and Verdant River Valleys",
      shortDescription: "Nestled in the lush Eastern Ghats, celebrated for the scenic Thotapalli Reservoir, Nagavali River, and indigenous tribal culture.",
      fullDescription: "Formed in 2022 in the northeastern corner of Andhra Pradesh bordering Odisha, Parvathipuram Manyam is predominantly forested and tribal. It is enriched by the perennial Nagavali and Suvarnamukhi rivers, Thotapalli Reservoir, cascading streams, and unspoiled tribal culture known for hand-woven organic textiles and brass craft.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Thotapalli Reservoir, Nagavali River, Tribal Eco-Tourism",
      attractions: [
        {
          name: "Thotapalli Barrage & Eco Reservoir",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Garugubilli Mandal, Parvathipuram Manyam",
          category: "Eco-Tourism & Reservoirs",
          description: "Picturesque water reservoir and barrage on the Nagavali River framed by rolling Eastern Ghats hill ranges, popular for tranquil boating and seasonal water birds.",
          mapsQuery: "Thotapalli+Reservoir+Parvathipuram+Manyam",
          highlights: "Wide Water Expanse, Eastern Ghats Backdrop, Wetland Bird Watching",
          bestTimeToVisit: "October to February",
          accommodation: "Parvathipuram town guest houses and lodges"
        },
        {
          name: "Nagavali River Scenic Valleys",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
          location: "Parvathipuram Valley, Parvathipuram Manyam",
          category: "Nature & River Valleys",
          description: "Verdant agricultural and forest river valley offering scenic riverside viewpoints, traditional bamboo fishing, and untouched rural village landscapes.",
          mapsQuery: "Nagavali+River+Parvathipuram",
          highlights: "River Valley Sunrises, Organic Tribal Farming, Peaceful Countryside",
          bestTimeToVisit: "October to March",
          accommodation: "Government Inspection Bungalows and Parvathipuram stays"
        },
        {
          name: "Addapusila & Sambara Shrines",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Sambara, Parvathipuram Manyam",
          category: "Folk Culture & Shrines",
          description: "Ancient folk pilgrimage sites celebrated for vibrant regional tribal Jatara festivals and scenic hillock temples sacred to local communities.",
          mapsQuery: "Parvathipuram+Manyam+Andhra+Pradesh",
          highlights: "Sambara Polamamba Jatara, Indigenous Tribal Heritage, Folk Lore",
          bestTimeToVisit: "November to March",
          accommodation: "Parvathipuram and Vizianagaram lodgings"
        }
      ]
    },
    {
      id: "prakasam",
      name: "Prakasam",
      slug: "prakasam",
      headquarters: "Ongole",
      division: "Coastal Andhra",
      tagline: "Home of the Ongole Cattle and Bhairavakona Rock-Cut Caves",
      shortDescription: "Famous for the world-renowned Ongole breed of bulls, Kothapatnam Beach, and the 8th-century rock-cut Shiva caves of Bhairavakona.",
      fullDescription: "Named after the fearless freedom fighter and Andhra's first Chief Minister Tanguturi Prakasam Pantulu (Andhra Kesari), Prakasam district blends rugged hills with coastal beaches. It is the birthplace of the majestic Ongole bull breed. Deep in the Nallamala forest lies Bhairavakona, where eight monolithic rock-cut cave temples and a perennial cascade reflect Pallava-era stone craft.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Bhairavakona Rock-Cut Caves, Kothapatnam Beach, Ongole Heritage",
      attractions: [
        {
          name: "Bhairavakona Rock-Cut Cave Temples",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Pamur Mandal, Nallamala Hills, Prakasam",
          category: "Archaeology & Rock-Cut Caves",
          description: "8th-century archaeological marvel featuring eight monolithic rock-cut cave temples carved from a single cliff face by Pallava architects, accompanied by a perennial waterfall.",
          mapsQuery: "Bhairavakona+Temple+Prakasam+District",
          highlights: "8 Monolithic Rock Temples, Perennial Waterfall, Nallamala Wilderness",
          bestTimeToVisit: "October to February",
          accommodation: "CS Puram guest houses and Ongole city hotels (80 km)"
        },
        {
          name: "Kothapatnam Beach",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Kothapatnam, Prakasam",
          category: "Beaches & Coastline",
          description: "Pristine and peaceful coastal beach with sweeping sands on the Bay of Bengal, favored for evening sunset strolls, seaside relaxation, and fresh coastal air.",
          mapsQuery: "Kothapatnam+Beach+Ongole+Prakasam",
          highlights: "Golden Shoreline, Boating, Casuarina Plantations",
          bestTimeToVisit: "October to March",
          accommodation: "Hotels and resorts in Ongole city (18 km)"
        },
        {
          name: "Singarakonda Sri Prasannanjaneya Swamy Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Addanki Mandal, Prakasam",
          category: "Pilgrimage & Hill Shrines",
          description: "Revered 14th-century hill shrine dedicated to Lord Hanuman, situated beside a tranquil irrigation lake and hillock with ancient stone shrines.",
          mapsQuery: "Singarakonda+Hanuman+Temple+Prakasam",
          highlights: "Historic Hanuman Sanctum, Scenic Lake, Annual Teppotsavam Floating Festival",
          bestTimeToVisit: "October to March",
          accommodation: "Addanki and Ongole city lodgings"
        }
      ]
    },
    {
      id: "sri-potti-sriramulu-nellore",
      name: "Sri Potti Sriramulu Nellore",
      slug: "sri-potti-sriramulu-nellore",
      headquarters: "Nellore",
      division: "Coastal Andhra",
      tagline: "The Flamingos of Pulicat and Coromandel Coastline",
      shortDescription: "Famous for Pulicat Lake & Nelapattu Bird Sanctuary, Mypadu Beach, Udayagiri hill fort, and the historic Ranganathaswamy Temple.",
      fullDescription: "Sri Potti Sriramulu Nellore, named after the revered martyr whose fast created Andhra State, sits on the southernmost coastline of the state. It is celebrated for Pulicat Lake, India's second largest brackish water lagoon, where thousands of pink flamingos congregate in winter at Nelapattu, alongside scenic Mypadu Beach and the 600-year-old Talpagiri Ranganatha Temple.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March (Flamingos: Dec to Feb)",
      knownFor: "Pulicat Lake Flamingos, Nelapattu Bird Sanctuary, Mypadu Beach",
      attractions: [
        {
          name: "Nelapattu Bird Sanctuary & Pulicat Lake",
          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          location: "Nelapattu & Sullurpeta, Nellore",
          category: "Wildlife & Flamingos",
          description: "Premier birding destination on India's second largest lagoon, hosting over 10,000 Greater Flamingos, Grey Pelicans, and painted storks annually during the state Flamingo Festival.",
          mapsQuery: "Nelapattu+Bird+Sanctuary+Pulicat+Lake+Nellore",
          highlights: "Flamingo Festival, Massive Pelican Colonies, Lagoon Boating",
          bestTimeToVisit: "December to February",
          accommodation: "AP Tourism Haritha Tada & Nellore city hotels"
        },
        {
          name: "Mypadu Beach",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Mypadu, Nellore Coast, Nellore",
          category: "Beaches & Coastline",
          description: "Renowned seaside retreat offering soft clean sands, azure waters, and gentle waves lined with lush casuarina and palm trees along the Bay of Bengal.",
          mapsQuery: "Mypadu+Beach+Nellore+Andhra+Pradesh",
          highlights: "Casuarina Groves, Water Sports, Sunrise Ocean Vistas",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Beach Resort Mypadu"
        },
        {
          name: "Sri Talpagiri Ranganathaswamy Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Penna Riverfront, Nellore",
          category: "Pilgrimage & Dravidian Architecture",
          description: "12th-century Dravidian temple complex on the banks of the Penna River, featuring a magnificent 96-foot seven-tiered Rajagopuram and gilded mirror halls.",
          mapsQuery: "Talpagiri+Ranganathaswamy+Temple+Nellore",
          highlights: "Penna Riverfront, 96-foot Rajagopuram, Intricate Stone Carvings",
          bestTimeToVisit: "October to March",
          accommodation: "Premium business hotels in Nellore city center"
        }
      ]
    },
    {
      id: "sri-sathya-sai",
      name: "Sri Sathya Sai",
      slug: "sri-sathya-sai",
      headquarters: "Puttaparthi",
      division: "Rayalaseema",
      tagline: "The Global Sanctuary of Spiritual Peace and Universal Love",
      shortDescription: "World-renowned for Prashanthi Nilayam in Puttaparthi, Chaitanya Jyoti Museum, and global spiritual institutions on the Chitravathi river.",
      fullDescription: "Established as a separate district in 2022 with its headquarters at Puttaparthi, Sri Sathya Sai district is an internationally acclaimed pilgrimage and humanitarian center. It is centered around Prashanthi Nilayam (Abode of Supreme Peace), the ashram founded by Sri Sathya Sai Baba, drawing pilgrims from over 150 nations with museums, planetarium, and world-class healthcare centers.",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Prashanthi Nilayam, Chaitanya Jyoti, Chitravathi Riverfront",
      attractions: [
        {
          name: "Prashanthi Nilayam (Main Ashram)",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Puttaparthi, Sri Sathya Sai",
          category: "Spiritual & Ashrams",
          description: "World-renowned spiritual sanctuary built in 1950, featuring the Sarva Dharma Stupa, the monumental Sai Kulwant Hall, and tranquil meditation gardens on the Chitravathi river.",
          mapsQuery: "Prashanthi+Nilayam+Puttaparthi+Sri+Sathya+Sai",
          highlights: "Sarva Dharma Stupa, Meditation Banyan Tree, Evening Bhajan Sessions",
          bestTimeToVisit: "October to March",
          accommodation: "Ashram guest houses and boutique hotels in Puttaparthi"
        },
        {
          name: "Chaitanya Jyoti Museum",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Hillview, Puttaparthi, Sri Sathya Sai",
          category: "Museums & Architecture",
          description: "Architectural marvel designed with Chinese roofs, Gothic arches, and Moorish domes depicting the life, philosophies, and humanitarian missions of Sri Sathya Sai Baba.",
          mapsQuery: "Chaitanya+Jyoti+Museum+Puttaparthi",
          highlights: "Multi-Cultural Architecture, Interactive Multimedia Exhibits, Hilltop Views",
          bestTimeToVisit: "October to March",
          accommodation: "Puttaparthi ashram complexes and hotels"
        },
        {
          name: "Sri Sathya Sai Space Theatre (Planetarium)",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Vidyagiri, Puttaparthi, Sri Sathya Sai",
          category: "Science & Astronomy",
          description: "Premier planetarium equipped with sophisticated optical projection systems for cosmic astronomy shows promoting scientific temper and cosmic wonder.",
          mapsQuery: "Sri+Sathya+Sai+Space+Theatre+Puttaparthi",
          highlights: "Fulldome Astronomy Shows, Cosmic Exhibits, Educational Tours",
          bestTimeToVisit: "Year-round",
          accommodation: "Puttaparthi town hotels and resorts"
        }
      ]
    },
    {
      id: "srikakulam",
      name: "Srikakulam",
      slug: "srikakulam",
      headquarters: "Srikakulam",
      division: "Uttarandhra (North Coastal)",
      tagline: "The Land of Sun Temples and Pristine Historic Shorelines",
      shortDescription: "Famous for the ancient 7th-century Arasavalli Sun Temple, world-unique Srikurmam Tortoise Temple, and Kalingapatnam lighthouse.",
      fullDescription: "Bordering Odisha on the Bay of Bengal coast, Srikakulam has a glorious antiquity as part of ancient Kalinga. It houses the 7th-century Arasavalli Sun God temple, where sun rays illuminate the deity twice every year, and Srikurmam, the only temple in the world dedicated to Lord Vishnu in the Kurma (tortoise) avatar. The coast features historic ports like Kalingapatnam and Baruva.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Arasavalli Sun Temple, Srikurmam Tortoise Temple, Kalingapatnam Beach",
      attractions: [
        {
          name: "Sri Suryanarayana Swamy Temple, Arasavalli",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Arasavalli, Srikakulam",
          category: "Pilgrimage & Sun Temples",
          description: "Rare 7th-century sun temple built by Kalinga King Devendra Varma, where early morning sun rays filter directly onto the lotus feet of the deity during Surya Jayanti.",
          mapsQuery: "Arasavalli+Sun+Temple+Srikakulam",
          highlights: "Solstice Sun Rays Phenomenon, Five Idol Granite Carving, Indra Pushkarini",
          bestTimeToVisit: "October to March",
          accommodation: "Devasthanam Cottages and Srikakulam city hotels"
        },
        {
          name: "Sri Kurmanatha Swamy Temple, Srikurmam",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Srikurmam, Gara Mandal, Srikakulam",
          category: "Pilgrimage & Heritage",
          description: "The world's only classical temple dedicated to Lord Vishnu in his Kurma (tortoise) incarnation, featuring 210 stone-carved pillars and a conservation park for star tortoises.",
          mapsQuery: "Srikurmam+Temple+Srikakulam",
          highlights: "Only Kurma Avatar Temple Worldwide, 210 Pillar Mandapam, Living Tortoise Sanctuary",
          bestTimeToVisit: "October to March",
          accommodation: "Srikurmam guest houses & Srikakulam town (14 km)"
        },
        {
          name: "Kalingapatnam Beach & British Lighthouse",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Kalingapatnam, Srikakulam",
          category: "Beaches & History",
          description: "Historic port town where the Vamsadhara River meets the sea, equipped with an 1884 British lighthouse and wide sandy beaches popular for sea viewing.",
          mapsQuery: "Kalingapatnam+Beach+Lighthouse+Srikakulam",
          highlights: "1884 Colonial Lighthouse, River-Sea Confluence, Gentle Beach Sands",
          bestTimeToVisit: "November to February",
          accommodation: "AP Tourism Haritha Kalingapatnam & Srikakulam hotels"
        }
      ]
    },
    {
      id: "tirupati",
      name: "Tirupati",
      slug: "tirupati",
      headquarters: "Tirupati",
      division: "Rayalaseema",
      tagline: "The World's Sacred Hill Temple of Lord Venkateswara",
      shortDescription: "The spiritual crown of India, home to Tirumala Sri Venkateswara Temple atop the Seven Hills, Srikalahasti, and Chandragiri Fort.",
      fullDescription: "Established as a dedicated district in 2022, Tirupati is the spiritual epicentre of India. Atop the Tirumala Seven Hills stands the holy shrine of Lord Venkateswara (Balaji), attracting tens of millions of pilgrims annually. The district also encompasses the Vayu Linga Kshetra at Srikalahasti, the 11th-century Chandragiri Fort, and the roaring Talakona Waterfalls.",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "September to March",
      knownFor: "Tirumala Venkateswara Temple, Srikalahasti Temple, Chandragiri Fort, Talakona",
      attractions: [
        {
          name: "Tirumala Sri Venkateswara Swamy Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Tirumala Hills, Tirupati",
          category: "Pilgrimage & Sacred Peaks",
          description: "World-renowned hill temple atop Venkatadri of the Seshachalam Seven Hills, the richest and most visited religious shrine in the world with ancient Dravidian architecture.",
          mapsQuery: "Tirumala+Venkateswara+Temple+Tirupati",
          highlights: "Ananda Nilayam Golden Gopuram, Laddu Prasadam, Alipiri Step Route",
          bestTimeToVisit: "September to March",
          accommodation: "TTD Guest Houses, Haritha Tirupati, and 5-star hotels in Tirupati"
        },
        {
          name: "Srikalahasteeswara Temple, Srikalahasti",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Srikalahasti, Tirupati",
          category: "Pilgrimage & Pancha Bhoota",
          description: "Famous Pancha Bhoota Sthalam representing the Vayu (Wind) element and foremost Rahu-Ketu Kshetra, featuring a perpetually flickering oil lamp in the airless inner sanctum.",
          mapsQuery: "Srikalahasteeswara+Temple+Srikalahasti+Tirupati",
          highlights: "Vayu Linga, Rahu-Ketu Pooja, 100-Pillar Vijayanagara Mandapam",
          bestTimeToVisit: "October to March",
          accommodation: "Devasthanam Choultries and Srikalahasti town hotels"
        },
        {
          name: "Chandragiri Fort & Raja Mahal",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Chandragiri, Tirupati",
          category: "Forts & Palaces",
          description: "11th-century fort palace of the Vijayanagara Empire built with stone, brick, and lime mortar without timber, featuring light and sound shows and museum.",
          mapsQuery: "Chandragiri+Fort+Tirupati",
          highlights: "Raja Mahal Palace, Archaeological Museum, Evening Sound & Light Show",
          bestTimeToVisit: "October to March",
          accommodation: "Hotels and luxury stays in Tirupati (12 km)"
        },
        {
          name: "Talakona Waterfalls",
          image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80",
          location: "Sri Venkateswara National Park, Tirupati",
          category: "Waterfalls & National Parks",
          description: "The highest waterfall in Andhra Pradesh plunging 270 feet into a deep forest gorge within Sri Venkateswara National Park, celebrated for therapeutic medicinal herbs.",
          mapsQuery: "Talakona+Waterfalls+Tirupati",
          highlights: "270-Foot Cascade, Forest Canopy Walk, Herbal Mist Trek",
          bestTimeToVisit: "September to January",
          accommodation: "AP Tourism Haritha Talakona & Forest Log Huts"
        }
      ]
    },
    {
      id: "visakhapatnam",
      name: "Visakhapatnam",
      slug: "visakhapatnam",
      headquarters: "Visakhapatnam",
      division: "Uttarandhra (North Coastal)",
      tagline: "The City of Destiny, Blue Flag Beaches, and Naval Pride",
      shortDescription: "The jewel of the East Coast with Blue Flag-certified Rishikonda Beach, INS Kursura Submarine Museum, and hilltop Kailasagiri.",
      fullDescription: "Known affectionately as Vizag and The City of Destiny, Visakhapatnam is nestled gracefully between the Eastern Ghats and the Bay of Bengal. It is home to India's Eastern Naval Command, the world-famous INS Kursura Submarine Museum on RK Beach, the Blue Flag certified Rishikonda beach, Simhachalam temple, and panoramic views from Kailasagiri hill park.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Rishikonda Beach, INS Kursura Submarine, Kailasagiri, Simhachalam",
      attractions: [
        {
          name: "Rishikonda Beach",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Beach Road, Visakhapatnam",
          category: "Beaches & Water Sports",
          description: "International Blue Flag certified golden sand beach framed by verdant hills, renowned for water sports, surfing, speed boating, and pristine crystal waters.",
          mapsQuery: "Rishikonda+Beach+Visakhapatnam",
          highlights: "Blue Flag Certification, Sea Kayaking & Surfing, Hilltop Viewpoint",
          bestTimeToVisit: "October to March",
          accommodation: "AP Tourism Haritha Rishikonda & luxury beachside resorts"
        },
        {
          name: "INS Kursura Submarine Museum & TU-142 Aircraft Museum",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "RK Beach, Visakhapatnam",
          category: "Naval Heritage & Museums",
          description: "South Asia's first real Russian-built submarine decommissioned and preserved on the sands of RK Beach, showcasing authentic naval life and adjacent TU-142 flight decks.",
          mapsQuery: "INS+Kursura+Submarine+Museum+Visakhapatnam",
          highlights: "Authentic Submarine Interior Walkthrough, Torpedo Bay, TU-142 Flight Deck",
          bestTimeToVisit: "Year-round",
          accommodation: "Premium waterfront and city hotels along RK Beach"
        },
        {
          name: "Kailasagiri Hilltop Park & Cable Car",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
          location: "Kailasagiri Hill, Visakhapatnam",
          category: "Hilltop Parks & Ropeways",
          description: "Picturesque 360-foot hilltop park offering sweeping vistas of the sea and city, massive monolithic statues of Shiva-Parvati, circular toy train, and scenic cable car ropeway.",
          mapsQuery: "Kailasagiri+Visakhapatnam",
          highlights: "Scenic Cable Car Ropeway, Shiva-Parvati Statues, Panoramic Bay Views",
          bestTimeToVisit: "October to March",
          accommodation: "Haritha Hilltop Resort & Vizag city hotels"
        },
        {
          name: "Sri Varaha Lakshmi Narasimha Swamy Temple, Simhachalam",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Simhachalam Hill, Visakhapatnam",
          category: "Pilgrimage & Kalinga Heritage",
          description: "11th-century hill shrine built in Kalinga architectural style, where the deity is perpetually covered in sandalwood paste, revealed in true form only during Chandanotsavam.",
          mapsQuery: "Simhachalam+Temple+Visakhapatnam",
          highlights: "Chandanotsavam Festival, Kalinga Stone Pillars, Hilltop Sanctum",
          bestTimeToVisit: "October to March",
          accommodation: "Simhachalam Devasthanam guest rooms & Vizag city hotels"
        }
      ]
    },
    {
      id: "vizianagaram",
      name: "Vizianagaram",
      slug: "vizianagaram",
      headquarters: "Vizianagaram",
      division: "Uttarandhra (North Coastal)",
      tagline: "The City of Victory and Classical Bobbili Veena Heritage",
      shortDescription: "Famous for the 18th-century Vizianagaram Fort, ancient Ramatheertham temple & Buddhist hills, and GI-tagged Bobbili Veena makers.",
      fullDescription: "Vizianagaram, translating to The City of Victory, was the royal seat of the Gajapati and Pusapati dynasties who patronized classical arts, music, and literature. The heart of the city is dominated by the majestic 1712 Vizianagaram Fort with its ornate Moti Mahal palace. The district also houses the ancient Ramatheertham complex and the musical heritage of Bobbili.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Vizianagaram Fort, Ramatheertham Buddhist Hills, Bobbili Fort & Veena",
      attractions: [
        {
          name: "Vizianagaram Fort & Moti Mahal",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Vizianagaram City Center, Vizianagaram",
          category: "Forts & Palaces",
          description: "Grand 18th-century stone fortress with massive bastions, the royal Moti Mahal palace, and clock tower reflecting French-Indian military architecture.",
          mapsQuery: "Vizianagaram+Fort+Andhra+Pradesh",
          highlights: "Moti Mahal Palace, Vijayarama Gajapati Bastions, Clock Tower",
          bestTimeToVisit: "October to March",
          accommodation: "Vizianagaram city hotels & Vizag stays (45 km)"
        },
        {
          name: "Ramatheertham & Bodhikonda Buddhist Remains",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Nellimarla Mandal, Vizianagaram",
          category: "Pilgrimage & Buddhist Archaeology",
          description: "Thousand-year-old pilgrimage site atop Bavikonda hill housing the historic Rama temple alongside 3rd-century Buddhist rock-cut monasteries.",
          mapsQuery: "Ramatheertham+Vizianagaram",
          highlights: "Ancient Rama Sanctum, Bodhikonda Buddhist Remains, Natural Springs",
          bestTimeToVisit: "October to March",
          accommodation: "Local pilgrim guesthouses & Vizianagaram hotels"
        },
        {
          name: "Bobbili Fort & Saraswati Veena Artisan Village",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Bobbili, Vizianagaram",
          category: "Heritage & Musical Craft",
          description: "19th-century royal citadel commemorating the epic 1757 Battle of Bobbili, surrounded by master craftsmen carving the world-renowned GI-tagged Bobbili Veena from single jackfruit logs.",
          mapsQuery: "Bobbili+Fort+Vizianagaram",
          highlights: "Royal Durbar Hall, GI Bobbili Veena Crafting, War Memorial",
          bestTimeToVisit: "October to March",
          accommodation: "Bobbili town lodgings & Vizianagaram hotels"
        }
      ]
    },
    {
      id: "west-godavari",
      name: "West Godavari",
      slug: "west-godavari",
      headquarters: "Bhimavaram",
      division: "Coastal Andhra",
      tagline: "The Land of Someswara Pancharama and Coastal Aqua Fields",
      shortDescription: "Celebrated for the Someswara Swamy Pancharama temple at Bhimavaram, Ksheerarama at Palakollu, and Perupalem beach.",
      fullDescription: "With Bhimavaram as its new headquarters, West Godavari is a flourishing agro-industrial and spiritual center. It is uniquely blessed with two of the five sacred Pancharama Kshetras: the Someswara Swamy Temple at Gunupudi-Bhimavaram, where the Shiva Lingam changes color with the lunar phases, and the Ksheera Ramalingeswara Swamy Temple at Palakollu.",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "October to March",
      knownFor: "Someswara Pancharama, Palakollu Ksheerarama, Perupalem Beach",
      attractions: [
        {
          name: "Sri Someswara Swamy Temple, Bhimavaram",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Gunupudi, Bhimavaram, West Godavari",
          category: "Pilgrimage & Pancharama",
          description: "Revered Pancharama Kshetra where the 5-foot crystal Shiva Lingam is believed to change color from white to black according to lunar phases, set around Chandra Kundam.",
          mapsQuery: "Someswara+Temple+Bhimavaram+West+Godavari",
          highlights: "Color-Changing Lingam, Chandra Kundam Tank, Annapurna Sanctum",
          bestTimeToVisit: "October to March",
          accommodation: "Comfortable business hotels in Bhimavaram"
        },
        {
          name: "Ksheera Ramalingeswara Swamy Temple, Palakollu",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Palakollu, West Godavari",
          category: "Pilgrimage & Pancharama",
          description: "Ancient Pancharama Kshetra featuring a towering 120-foot nine-tiered Rajagopuram constructed in the 14th century and a white marble Shiva Lingam sanctified by Lord Rama.",
          mapsQuery: "Ksheerarama+Temple+Palakollu+West+Godavari",
          highlights: "120-Foot Rajagopuram, White Marble Lingam, Sun Dial Inscriptions",
          bestTimeToVisit: "October to March",
          accommodation: "Palakollu and Bhimavaram town hotels (20 km)"
        },
        {
          name: "Perupalem Beach",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
          location: "Mogalthur Mandal, West Godavari",
          category: "Beaches & Coastline",
          description: "Scenic coastline on the Bay of Bengal featuring calm shallow waves and palm-shaded sands, favored by beach lovers and pilgrimage visitors.",
          mapsQuery: "Perupalem+Beach+West+Godavari",
          highlights: "Shallow Beach Waters, Coconut Palms, Coastal Sunset",
          bestTimeToVisit: "October to March",
          accommodation: "Bhimavaram hotels and beach guest houses"
        }
      ]
    },
    {
      id: "ysr-kadapa",
      name: "YSR Kadapa",
      slug: "ysr-kadapa",
      headquarters: "Kadapa",
      division: "Rayalaseema",
      tagline: "The Grand Canyon of India and Ancient Stone Citadels",
      shortDescription: "World-famous for Gandikota canyon on the Pennar River, Vontimitta Kodandarama Temple, and Ameen Peer Dargah.",
      fullDescription: "Kadapa (historically Gadapa, meaning threshold or gateway to Tirumala) is famed for Gandikota, celebrated globally as the Grand Canyon of India, where the Pennar River cuts deep into the Erramala hills beside a 12th-century stone fortress. The district is also renowned for the magnificent monolith carvings of Vontimitta Kodandarama Temple and the syncretic Ameen Peer Dargah.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=85",
      bestTimeToVisit: "September to March",
      knownFor: "Gandikota Grand Canyon, Vontimitta Temple, Ameen Peer Dargah",
      attractions: [
        {
          name: "Gandikota Canyon & Fort (The Grand Canyon of India)",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          location: "Gandikota, Jammalamadugu, YSR Kadapa",
          category: "Geo-Heritage & Canyons",
          description: "Breathtaking 300-foot red granite gorge carved by the Pennar River, crowned by a 12th-century fort, Madhavaraya temple, Jama Masjid, and cliffside sunset viewpoints.",
          mapsQuery: "Gandikota+Fort+and+Canyon+YSR+Kadapa",
          highlights: "Gorge Sunset Viewpoint, 12th-Century Fort Ramparts, Raghunatha Swamy Temple",
          bestTimeToVisit: "September to March",
          accommodation: "AP Tourism Haritha Resort Gandikota & adventure cliff camping"
        },
        {
          name: "Vontimitta Sri Kodandarama Swamy Temple",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
          location: "Vontimitta, YSR Kadapa",
          category: "Heritage & Vijayanagara Temples",
          description: "16th-century Vijayanagara architectural masterpiece carved out of a single stone (Ekashila), where Saint Potana composed the Andhra Maha Bhagavatam.",
          mapsQuery: "Vontimitta+Kodandarama+Temple+Kadapa",
          highlights: "Ekashila Carvings, Grand 32-Pillar Mandapam, State Rama Navami Celebrations",
          bestTimeToVisit: "October to March",
          accommodation: "Kadapa city hotels (25 km)"
        },
        {
          name: "Ameen Peer Dargah (Asthana-e-Maghdoom Elahi)",
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
          location: "Kadapa City, YSR Kadapa",
          category: "Spiritual & Syncretic Shrines",
          description: "Revered 300-year-old Sufi shrine preaching universal brotherhood, frequented by dignitaries and pilgrims of all faiths, known for its spiritual aura and annual Urs.",
          mapsQuery: "Ameen+Peer+Dargah+Kadapa",
          highlights: "Historic Sufi Shrine, Urs Celebrations, Symbol of Harmony",
          bestTimeToVisit: "October to March",
          accommodation: "Hotels and lodgings in Kadapa city center"
        },
        {
          name: "Devuni Kadapa Sri Lakshmi Venkateswara Temple",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
          location: "Devuni Kadapa, YSR Kadapa",
          category: "Pilgrimage & Sacred Shrines",
          description: "Ancient shrine recognized as the threshold to Tirumala, where pilgrims historically sought blessings before ascending the Seven Hills.",
          mapsQuery: "Devuni+Kadapa+Temple+YSR+Kadapa",
          highlights: "Threshold to Tirumala, Vijayanagara Sculptures, Sacred Temple Tank",
          bestTimeToVisit: "October to March",
          accommodation: "Kadapa city center hotels"
        }
      ]
    }
  ]
};

// State mapping dictionary
const STATES_DATA = {
  'west-bengal': WEST_BENGAL_DATA,
  'andhra-pradesh': ANDHRA_PRADESH_DATA
};

// Utility function to fetch state data based on state key or URL parameter
function getStateData(stateKey) {
  if (!stateKey) return WEST_BENGAL_DATA;
  const key = stateKey.trim().toLowerCase().replace(/_/g, '-');
  if (key === 'andhra-pradesh' || key === 'andhra' || key === 'ap' || key === 'andhrapradesh') {
    return ANDHRA_PRADESH_DATA;
  }
  return WEST_BENGAL_DATA;
}

// Utility lookup functions
function getDistrictBySlug(slug, stateHint) {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();

  // If a state hint was explicitly provided, search that state first
  if (stateHint) {
    const hintData = getStateData(stateHint);
    const match = hintData.districts.find(d => 
      d.slug.toLowerCase() === normalized || 
      d.name.toLowerCase() === normalized ||
      d.id.toLowerCase() === normalized
    );
    if (match) {
      return {
        ...match,
        stateName: hintData.state,
        stateSlug: hintData.state === 'Andhra Pradesh' ? 'andhra-pradesh' : 'west-bengal'
      };
    }
  }

  // 1. Search in Andhra Pradesh
  const matchAP = ANDHRA_PRADESH_DATA.districts.find(d => 
    d.slug.toLowerCase() === normalized || 
    d.name.toLowerCase() === normalized ||
    d.id.toLowerCase() === normalized
  );
  if (matchAP) {
    return {
      ...matchAP,
      stateName: ANDHRA_PRADESH_DATA.state,
      stateSlug: 'andhra-pradesh'
    };
  }

  // 2. Search in West Bengal
  const matchWB = WEST_BENGAL_DATA.districts.find(d => 
    d.slug.toLowerCase() === normalized || 
    d.name.toLowerCase() === normalized ||
    d.id.toLowerCase() === normalized
  );
  if (matchWB) {
    return {
      ...matchWB,
      stateName: WEST_BENGAL_DATA.state,
      stateSlug: 'west-bengal'
    };
  }

  return null;
}

function searchDistricts(query, stateKey) {
  const currentDataset = getStateData(stateKey);
  if (!query || !query.trim()) return currentDataset.districts;
  const term = query.trim().toLowerCase();
  return currentDataset.districts.filter(d => 
    d.name.toLowerCase().includes(term) ||
    d.headquarters.toLowerCase().includes(term) ||
    d.tagline.toLowerCase().includes(term) ||
    d.knownFor.toLowerCase().includes(term) ||
    d.attractions.some(a => a.name.toLowerCase().includes(term) || a.location.toLowerCase().includes(term))
  );
}

// Expose on global window object for accessibility across scripts
if (typeof window !== 'undefined') {
  window.WEST_BENGAL_DATA = WEST_BENGAL_DATA;
  window.ANDHRA_PRADESH_DATA = ANDHRA_PRADESH_DATA;
  window.STATES_DATA = STATES_DATA;
  window.getStateData = getStateData;
  window.getDistrictBySlug = getDistrictBySlug;
  window.searchDistricts = searchDistricts;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WEST_BENGAL_DATA,
    ANDHRA_PRADESH_DATA,
    STATES_DATA,
    getStateData,
    getDistrictBySlug,
    searchDistricts
  };
}
