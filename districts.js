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

// Expose on global window object for accessibility across scripts
if (typeof window !== 'undefined') {
  window.WEST_BENGAL_DATA = WEST_BENGAL_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WEST_BENGAL_DATA;
}

// Utility lookup functions
function getDistrictBySlug(slug) {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  return WEST_BENGAL_DATA.districts.find(d => 
    d.slug.toLowerCase() === normalized || 
    d.name.toLowerCase() === normalized ||
    d.id.toLowerCase() === normalized
  ) || null;
}

function searchDistricts(query) {
  if (!query || !query.trim()) return WEST_BENGAL_DATA.districts;
  const term = query.trim().toLowerCase();
  return WEST_BENGAL_DATA.districts.filter(d => 
    d.name.toLowerCase().includes(term) ||
    d.headquarters.toLowerCase().includes(term) ||
    d.tagline.toLowerCase().includes(term) ||
    d.knownFor.toLowerCase().includes(term)
  );
}
