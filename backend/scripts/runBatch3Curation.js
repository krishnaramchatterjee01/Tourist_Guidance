import fs from 'fs';
import { curateState } from './curationCore.js';

const SIKKIM_CONFIG = {
  name: 'Sikkim',
  slug: 'sikkim',
  heroDesc: 'Crystal turquoise glacial waters and snow-crowned Himalayan summits of sacred Gurudongmar Lake, North Sikkim',
  heroQueries: ['Gurudongmar Lake Sikkim', 'Gurudongmar Lake', 'Kanchenjunga Pelling Sikkim'],
  cardDesc: 'Ancient gilded roofs, sacred dharma wheels and Tibetan monastic courtyards of Rumtek Monastery, Sikkim',
  cardQueries: ['Rumtek Monastery Sikkim', 'Samdruptse Namchi Sikkim', 'Tsomgo Lake Sikkim', 'Kanchenjunga Gangtok'],
  districts: [
    { slug: 'gangtok', location: 'Golden stupa and monastic halls of Rumtek Monastery and high-altitude mirror waters of Tsomgo Lake, Gangtok', queries: ['Tsomgo Lake Sikkim', 'Rumtek Monastery Gangtok', 'Enchey Monastery Gangtok', 'Gangtok Sikkim landscape'] },
    { slug: 'gyalshing', location: 'Historic royal stone ruins of Rabdentse and sacred wish-fulfilling waters of Khecheopalri Lake, Gyalshing (Pelling)', queries: ['Rabdentse ruins Pelling', 'Khecheopalri Lake Sikkim', 'Pemayangtse Monastery Pelling', 'Pelling Sikkim Kanchenjunga'] },
    { slug: 'mangan', location: 'Breathtaking 17,800-ft alpine glacial vistas of Gurudongmar Lake and rhododendron sanctuary of Yumthang Valley, Mangan', queries: ['Gurudongmar Lake North Sikkim', 'Yumthang Valley Sikkim', 'Lachung Sikkim', 'Zero Point Sikkim'] },
    { slug: 'namchi', location: 'Colossal 135-ft gilded statue of Guru Padmasambhava atop Samdruptse Hill and sacred Char Dham pilgrimage, Namchi', queries: ['Samdruptse Namchi', 'Char Dham Namchi Sikkim', 'Temi Tea Garden Sikkim', 'Tarey Bhir Namchi'] },
    { slug: 'pakyong', location: 'Rolling green alpine foothills of Pakyong and sacred Buddhist heritage of Dikling Monastery', queries: ['Pakyong Sikkim', 'Saramsa Garden Sikkim', 'Pakyong Airport hills', 'Dikling Monastery Pakyong'] },
    { slug: 'soreng', location: 'Pristine blooming rhododendron forests of Barsey Sanctuary and panoramic Kanchenjunga viewpoints in Soreng', queries: ['Barsey Rhododendron Sanctuary Sikkim', 'Soreng Sikkim', 'Chakung Sikkim', 'Daramdin Sikkim'] }
  ]
};

const TAMIL_NADU_CONFIG = {
  name: 'Tamil Nadu',
  slug: 'tamil-nadu',
  heroDesc: 'Towering 216-ft granite vimana of 11th-century Brihadisvara Temple (UNESCO Great Living Chola Temples), Thanjavur, Tamil Nadu',
  heroQueries: ['Brihadisvara Temple Thanjavur', 'Thanjavur Big Temple', 'Meenakshi Temple Madurai gopuram'],
  cardDesc: 'Dramatic ocean memorial of Vivekananda Rock Memorial surrounded by the confluence of three oceans at Kanyakumari',
  cardQueries: ['Vivekananda Rock Memorial Kanyakumari', 'Shore Temple Mahabalipuram', 'Nilgiri Mountain Railway', 'Dhanushkodi Pamban Bridge'],
  districts: [
    { slug: 'ariyalur', location: 'UNESCO World Heritage living stone poetry of Gangaikonda Cholapuram Brihadisvara Temple, Ariyalur', queries: ['Gangaikonda Cholapuram Temple', 'Brihadisvara Temple Gangaikonda', 'Ariyalur Tamil Nadu', 'Chola temple Ariyalur'] },
    { slug: 'chengalpattu', location: '7th-century rock-cut monolithic Five Rathas and Shore Temple of Mamallapuram (Mahabalipuram UNESCO)', queries: ['Mahabalipuram Shore Temple', 'Pancha Rathas Mahabalipuram', 'Arjuna Penance Mahabalipuram', 'Mamallapuram rock cut'] },
    { slug: 'chennai', location: 'Iconic golden shoreline of Marina Beach and historic 7th-century Dravidian gopuram of Kapaleeshwarar Temple, Chennai', queries: ['Marina Beach Chennai', 'Kapaleeshwarar Temple Chennai', 'San Thome Basilica Chennai', 'Fort St George Chennai'] },
    { slug: 'coimbatore', location: 'Monumental 112-ft steel bust of Adiyogi Shiva and verdant rainforest streams of Siruvani Waterfalls, Coimbatore', queries: ['Adiyogi Shiva statue Coimbatore', 'Siruvani Waterfalls Coimbatore', 'Marudhamalai Temple Coimbatore', 'Coimbatore landscape'] },
    { slug: 'cuddalore', location: 'Cosmic dance sanctum of Nataraja Temple in Chidambaram and world’s second largest mangrove forest at Pichavaram, Cuddalore', queries: ['Thillai Nataraja Temple Chidambaram', 'Pichavaram Mangrove Forest', 'Chidambaram Temple', 'Silver Beach Cuddalore'] },
    { slug: 'dharmapuri', location: 'Spectacular thundering cascades and coracle boat rides of Hogenakkal Falls on the Kaveri River, Dharmapuri', queries: ['Hogenakkal Falls Dharmapuri', 'Hogenakkal Waterfall Tamil Nadu', 'Hogenakkal boat', 'Dharmapuri Tamil Nadu'] },
    { slug: 'dindigul', location: 'Misty pine-clad slopes of Kodaikanal Lake and sheer granite monolith of Pillar Rocks in Dindigul', queries: ['Kodaikanal Lake Pillar Rocks', 'Kodaikanal Pillar Rocks', 'Dindigul Rock Fort', 'Kodaikanal Tamil Nadu'] },
    { slug: 'erode', location: 'Sprawling reservoir gardens of Bhavanisagar Dam and scenic hillside shrine of Chennimalai Murugan Temple, Erode', queries: ['Bhavanisagar Dam Erode', 'Kodiveri Dam Erode', 'Chennimalai Murugan Temple', 'Erode Tamil Nadu'] },
    { slug: 'kallakurichi', location: 'Cascading forest waters of Megam Falls and serene green ridges of Kalvarayan Hills in Kallakurichi', queries: ['Kalvarayan Hills Tamil Nadu', 'Megam Falls Kallakurichi', 'Gomukhi Dam Kallakurichi', 'Kallakurichi hills'] },
    { slug: 'kanchipuram', location: 'Sublime 8th-century Pallava stone temple of Kailasanathar and towering white gopuram of Ekambareswarar, Kanchipuram', queries: ['Kailasanathar Temple Kanchipuram', 'Ekambareswarar Temple Kanchipuram', 'Varadharaja Perumal Temple', 'Kanchipuram temple'] },
    { slug: 'kanyakumari', location: 'Confluence of three oceans at Vivekananda Rock Memorial and monumental 133-ft stone statue of Thiruvalluvar, Kanyakumari', queries: ['Vivekananda Rock Memorial Kanyakumari', 'Thiruvalluvar Statue Kanyakumari', 'Kanyakumari sunrise sunset', 'Padmanabhapuram Palace'] },
    { slug: 'karur', location: 'Ancient Chola stone heritage of Pasupatheeswarar Temple and scenic Kaveri river barrage at Mayanur, Karur', queries: ['Pasupatheeswarar Temple Karur', 'Mayanur Barrage Karur', 'Karur Tamil Nadu', 'Pugazhimalai Murugan Karur'] },
    { slug: 'krishnagiri', location: 'Imposing hill battlements of Rayakottai Fort and tranquil scenic waters of Krishnagiri Reservoir Project (KRP Dam)', queries: ['Krishnagiri Dam KRP', 'Rayakottai Fort Krishnagiri', 'Krishnagiri Tamil Nadu', 'Krishnagiri fort'] },
    { slug: 'madurai', location: 'World-renowned 14 colorful monumental gateway towers and thousand-pillar hall of Meenakshi Amman Temple, Madurai', queries: ['Meenakshi Amman Temple Madurai', 'Meenakshi Temple gopuram', 'Thirumalai Nayakkar Mahal Madurai', 'Alagar Kovil Madurai'] },
    { slug: 'mayiladuthurai', location: 'Historic Danish coastal stronghold of Fort Dansborg at Tharangambadi (Tranquebar) and ancient Poompuhar shores, Mayiladuthurai', queries: ['Fort Dansborg Tranquebar', 'Tranquebar Tharangambadi', 'Poompuhar beach', 'Mayuranathaswami Temple'] },
    { slug: 'nagapattinam', location: 'Gleaming white gothic towers of Basilica of Our Lady of Good Health at Velankanni and Point Calimere sanctuary, Nagapattinam', queries: ['Velankanni Church Nagapattinam', 'Nagapattinam lighthouse', 'Nagore Dargah Nagapattinam', 'Point Calimere sanctuary'] },
    { slug: 'namakkal', location: 'Monumental single-stone hill fortress of Namakkal Rock Fort and 18-ft monolithic Anjaneyar statue, Namakkal', queries: ['Namakkal Rock Fort', 'Namakkal Anjaneyar Temple', 'Kolli Hills Agaya Gangai', 'Namakkal Fort'] },
    { slug: 'nilgiris', location: 'UNESCO World Heritage blue steam locomotive of Nilgiri Mountain Railway traversing tea gardens of Ooty and Coonoor', queries: ['Nilgiri Mountain Railway Ooty', 'Ooty Lake Nilgiris', 'Doddabetta Peak Nilgiris', 'Coonoor tea gardens'] },
    { slug: 'perambalur', location: 'Historical 14th-century stone bastions and palace ruins of Ranjankudi Fort in Perambalur', queries: ['Ranjankudi Fort Perambalur', 'Ranjankudi Fort', 'Chettikulam Temple Perambalur', 'Perambalur Tamil Nadu'] },
    { slug: 'pudukkottai', location: 'Ancient 7th-century Jain rock-cut cave paintings of Sittannavasal and towering hill fort of Thirumayam, Pudukkottai', queries: ['Sittannavasal Cave Pudukkottai', 'Thirumayam Fort Pudukkottai', 'Pudukkottai Palace', 'Viralimalai Murugan'] },
    { slug: 'ramanathapuram', location: 'Monumental 1,200-meter pillared corridors of Ramanathaswamy Temple Rameswaram and engineering marvel of Pamban Bridge', queries: ['Ramanathaswamy Temple Rameswaram', 'Pamban Bridge Rameswaram', 'Dhanushkodi beach', 'Rameswaram corridor'] },
    { slug: 'ranipet', location: 'Historic 18th-century battle bastion of Delhi Gate in Arcot and hilltop temple of Rathnagiri Murugan, Ranipet', queries: ['Delhi Gate Arcot Ranipet', 'Rathnagiri Murugan Temple', 'Ranipet Tamil Nadu', 'Arcot fort'] },
    { slug: 'salem', location: 'Scenic emerald waters of Yercaud Lake nestled in the Shevaroy Hills and engineering grandeur of Mettur Dam, Salem', queries: ['Yercaud Lake Salem', 'Mettur Dam Salem', 'Lady Seat Yercaud', 'Kottai Mariamman Salem'] },
    { slug: 'sivaganga', location: 'Palatial Italian marble courtyards and Burma teak pillars of heritage Chettinad Mansions in Kanadukathan, Sivaganga', queries: ['Chettinad Palace Kanadukathan', 'Chettinad Mansions Sivaganga', 'Vettangudi Bird Sanctuary', 'Sivaganga Palace'] },
    { slug: 'tenkasi', location: 'Therapeutic medicinal mineral waters of Courtallam (Kutralam) Waterfalls and ancient Kasi Viswanathar Temple, Tenkasi', queries: ['Courtallam Falls Tenkasi', 'Kutralam Waterfall Tenkasi', 'Kasi Viswanathar Temple Tenkasi', 'Tenkasi Temple'] },
    { slug: 'thanjavur', location: 'Unrivaled 1,000-year-old architectural grandeur of Brihadisvara Temple (Big Temple) and Maratha Palace, Thanjavur', queries: ['Brihadisvara Temple Thanjavur', 'Thanjavur Big Temple', 'Thanjavur Maratha Palace', 'Thanjavur Royal Palace'] },
    { slug: 'theni', location: 'Cloud-shrouded virgin tea estates of Meghamalai (Highwavys) and perennial cascades of Suruli Falls, Theni', queries: ['Meghamalai Theni', 'Suruli Falls Theni', 'Kumbakkarai Falls Theni', 'Vaigai Dam Theni'] },
    { slug: 'thoothukudi', location: 'Ancient seaside Dravidian temple of Thiruchendur Murugan Temple facing the rolling waves of the Bay of Bengal, Thoothukudi', queries: ['Thiruchendur Murugan Temple', 'Tiruchendur Temple Thoothukudi', 'Manapad Church Thoothukudi', 'Tuticorin port'] },
    { slug: 'tiruchirappalli', location: 'Ancient 83-meter fortress rock of Tiruchirappalli Rock Fort and sprawling 156-acre island temple of Srirangam (UNESCO)', queries: ['Rockfort Temple Trichy', 'Sri Ranganathaswamy Temple Srirangam', 'Srirangam Temple Trichy', 'Uchi Pillayar Temple'] },
    { slug: 'tirunelveli', location: 'Musical stone pillars of 7th-century Swami Nellaiappar Temple and cascading waters of Agasthiyar Falls, Tirunelveli', queries: ['Nellaiappar Temple Tirunelveli', 'Manimuthar Falls Tirunelveli', 'Agasthiyar Falls Papanasam', 'Tirunelveli Tamil Nadu'] },
    { slug: 'tirupathur', location: 'Serene pine-fringed boating lake of Yelagiri Hills and cascading waters of Jalagamparai Falls in Tirupathur', queries: ['Yelagiri Hills Tamil Nadu', 'Jalagamparai Falls Yelagiri', 'Vainu Bappu Observatory Kavalur', 'Tirupathur Tamil Nadu'] },
    { slug: 'tiruppur', location: 'Picturesque temple foothills of Thirumoorthy Hills and waterbird haven of Amaravathi Dam, Tiruppur', queries: ['Thirumoorthy Dam Tiruppur', 'Amaravathi Dam Tiruppur', 'Avinashi Temple Tiruppur', 'Tiruppur Tamil Nadu'] },
    { slug: 'tiruvallur', location: 'Sacred waters of Hrit-Tapanasini tank at Veeraraghava Swamy Temple and flamingo sanctuary of Pulicat Lake, Tiruvallur', queries: ['Veeraraghava Swamy Temple Tiruvallur', 'Pulicat Lake Tamil Nadu', 'Poondi Reservoir Tiruvallur', 'Tiruvallur temple'] },
    { slug: 'tiruvannamalai', location: 'One of the Pancha Bhoota Stalas dedicated to the element of fire at holy Arunachaleswarar Temple, Tiruvannamalai', queries: ['Annamalaiyar Temple Tiruvannamalai', 'Arunachaleswarar Temple', 'Arunachala hill Tiruvannamalai', 'Sathanur Dam'] },
    { slug: 'tiruvarur', location: 'Colossal temple chariot and sprawling 33-acre Kamalalayam sacred temple tank of Thyagaraja Temple, Tiruvarur', queries: ['Thyagaraja Temple Tiruvarur', 'Tiruvarur temple chariot', 'Muthupet Mangroves Tiruvarur', 'Kamalalayam tank'] },
    { slug: 'vellore', location: 'Grand 16th-century stone-moated ramparts of Vellore Fort and golden sanctuary of Sripuram Mahalakshmi Temple, Vellore', queries: ['Vellore Fort Tamil Nadu', 'Golden Temple Sripuram Vellore', 'Jalakandeswarar Temple Vellore', 'Vellore Fort moat'] },
    { slug: 'viluppuram', location: 'Impregnable three-citadel hill battlements of historic Gingee Fort (Troy of the East), Viluppuram', queries: ['Gingee Fort Tamil Nadu', 'Gingee Fort Viluppuram', 'Rajagiri Fort Gingee', 'Kalyana Mahal Gingee'] },
    { slug: 'virudhunagar', location: 'Spectacular 193-ft 11-tiered rajagopuram of Srivilliputhur Andal Temple depicted on the Tamil Nadu State Emblem', queries: ['Srivilliputhur Andal Temple', 'Srivilliputhur Gopuram', 'Ayyanar Falls Virudhunagar', 'Virudhunagar Tamil Nadu'] }
  ]
};

const TELANGANA_CONFIG = {
  name: 'Telangana',
  slug: 'telangana',
  heroDesc: 'UNESCO World Heritage 13th-century Kakatiya floating brick sanctuary of Ramappa Temple, Mulugu, Telangana',
  heroQueries: ['Ramappa Temple Mulugu Telangana', 'Ramappa Temple Kakatiya', 'Charminar Hyderabad Telangana'],
  cardDesc: 'Colossal hilltop medieval diamond fortress citadel of Golconda Fort with acoustic clapping portico, Telangana',
  cardQueries: ['Golconda Fort Hyderabad', 'Thousand Pillar Temple Warangal', 'Charminar Hyderabad night', 'Bhongir Fort monolithic'],
  districts: [
    { slug: 'adilabad', location: 'Spectacular 150-ft multi-tiered jungle plunge of Kuntala Waterfalls on the Kadam River, Adilabad', queries: ['Kuntala Waterfall Adilabad', 'Kuntala Falls Telangana', 'Pochera Falls Adilabad', 'Kawal Tiger Reserve'] },
    { slug: 'bhadradri-kothagudem', location: 'Historic riverside pilgrimage complex of Sri Sita Ramachandra Swamy Temple on Godavari at Bhadrachalam', queries: ['Bhadrachalam Temple Telangana', 'Bhadrachalam Rama Temple', 'Parnasala Bhadradri', 'Kinnerasani Dam'] },
    { slug: 'hanumakonda', location: 'Exquisitely carved 12th-century star-shaped Thousand Pillar Temple and sacred rock-cut Bhadrakali shrine, Hanumakonda', queries: ['Thousand Pillar Temple Hanamkonda', 'Thousand Pillar Temple Warangal', 'Bhadrakali Temple Warangal', 'Hanamkonda Telangana'] },
    { slug: 'hyderabad', location: 'Global 16th-century monument of Charminar with four grand minarets and royal ramparts of Golconda Fort, Hyderabad', queries: ['Charminar Hyderabad', 'Golconda Fort Hyderabad', 'Hussain Sagar Buddha statue', 'Qutb Shahi Tombs Hyderabad'] },
    { slug: 'jagtial', location: 'Hilltop shrine of Kondagattu Anjaneya Swamy Temple surrounded by thick scenic forest ridges in Jagtial', queries: ['Kondagattu Temple Jagtial', 'Kotilingala Telangana', 'Jagtial Fort Telangana', 'Jagtial Telangana'] },
    { slug: 'jangaon', location: '2,000-year-old historic Svetambara Jain pilgrimage center of Kolanupaka Temple and Pembarti metalcrafts, Jangaon', queries: ['Kolanupaka Jain Temple Jangaon', 'Kulpakji Jain Temple', 'Pembarti brass craft', 'Jangaon Telangana'] },
    { slug: 'jayashankar-bhupalpally', location: 'Cascading forest waters of Bogatha Waterfall (Niagara of Telangana) and prehistoric rock art at Pandavula Gutta', queries: ['Bogatha Waterfall Telangana', 'Kaleshwaram Temple Godavari', 'Pandavula Gutta Bhupalpally', 'Jayashankar Bhupalpally'] },
    { slug: 'jogulamba-gadwal', location: '7th-century Badami Chalukyan Navabrahma Temples and 5th Shakti Peetha at Alampur confluence, Jogulamba Gadwal', queries: ['Alampur Navabrahma Temples', 'Alampur Jogulamba Temple', 'Gadwal Fort Telangana', 'Jurala Dam Gadwal'] },
    { slug: 'kamareddy', location: 'Magnificent 18th-century fortified citadel of Domakonda Fort with water palaces and Koulas Fort, Kamareddy', queries: ['Domakonda Fort Kamareddy', 'Koulas Fort Kamareddy', 'Nizam Sagar Dam Kamareddy', 'Kamareddy Telangana'] },
    { slug: 'karimnagar', location: 'Hilltop fortifications of Elgandal Fort surrounded by palm groves and sprawling waters of Lower Manair Dam, Karimnagar', queries: ['Elgandal Fort Karimnagar', 'Lower Manair Dam Karimnagar', 'Ujwala Park Karimnagar', 'Karimnagar Telangana'] },
    { slug: 'khammam', location: 'Majestic 10th-century Kakatiya stone fortress of Khammam Fort atop Stambhadri hill and Lakaram Lake, Khammam', queries: ['Khammam Fort Telangana', 'Nelakondapalli Buddhist Stupa', 'Lakaram Lake Khammam', 'Khammam Telangana'] },
    { slug: 'kumuram-bheem-asifabad', location: 'Breathtaking rolling green valleys of Kerameri Ghats and tribal revolutionary memorial at Jodeghat, Asifabad', queries: ['Kerameri Ghats Asifabad', 'Jodeghat Asifabad', 'Komaram Bheem Asifabad', 'Asifabad Telangana'] },
    { slug: 'mahabubabad', location: 'Ancient 9th-century Shiva shrine of Kuravi Veerabhadra Swamy and forest cascades of Bheemuni Paadam, Mahabubabad', queries: ['Kuravi Veerabhadra Temple', 'Bheemuni Paadam Waterfalls', 'Bayyaram Cheruvu', 'Mahabubabad Telangana'] },
    { slug: 'mahabubnagar', location: 'Legendary 800-year-old giant Banyan tree sprawling across 4 acres at Pillalamarri, Mahabubnagar', queries: ['Pillalamarri Banyan Tree Mahabubnagar', 'Koilkonda Fort Mahabubnagar', 'Manyamkonda Temple', 'Mahabubnagar Telangana'] },
    { slug: 'mancherial', location: 'Lush deciduous forest wilderness and crocodile habitats along Pranahita Wildlife Sanctuary, Mancherial', queries: ['Pranahita Wildlife Sanctuary', 'Sripada Yellampalli Dam', 'Gudem Gutta Temple', 'Mancherial Telangana'] },
    { slug: 'medak', location: 'Colossal 175-ft gothic spire and stained-glass biblical windows of historic Medak Cathedral, Medak', queries: ['Medak Cathedral church', 'Medak Fort Telangana', 'Pocharam Wildlife Sanctuary', 'Medak church Telangana'] },
    { slug: 'medchal-malkajgiri', location: 'Ancient rock-hewn lingams of Sri Ramalingeswara Temple atop Keesaragutta hill and Shamirpet Lake, Medchal', queries: ['Keesaragutta Temple Medchal', 'Shamirpet Lake Telangana', 'Medchal Telangana', 'Fox Sagar Lake'] },
    { slug: 'mulugu', location: 'UNESCO World Heritage 13th-century Kakatiya floating brick marvel of Ramappa Temple and Laknavaram Lake, Mulugu', queries: ['Ramappa Temple Mulugu', 'Laknavaram Lake suspension bridge', 'Laknavaram Lake Mulugu', 'Ramappa Lake Telangana'] },
    { slug: 'nagarkurnool', location: 'Untamed Nallamala forest gorges of Amrabad Tiger Reserve and sacred waterfall of Mallela Theertham, Nagarkurnool', queries: ['Amrabad Tiger Reserve', 'Mallela Theertham Waterfall', 'Uma Maheshwaram Temple', 'Nagarkurnool Telangana'] },
    { slug: 'nalgonda', location: 'World’s tallest masonry dam at Nagarjuna Sagar and impregnable hilltop citadel of Devarakonda Fort, Nalgonda', queries: ['Nagarjuna Sagar Dam Nalgonda', 'Devarakonda Fort Nalgonda', 'Chaya Someswara Temple Nalgonda', 'Nalgonda Telangana'] },
    { slug: 'narayanpet', location: 'Historic silk weaving heritage center and picturesque Krishna river reaches at Jurala border, Narayanpet', queries: ['Narayanpet Telangana', 'Narayanpet handloom', 'Jurala Krishna river', 'Narayanpet hills'] },
    { slug: 'nirmal', location: 'World-renowned 400-year-old wooden toy craft tradition of Nirmal and 17th-century French-engineered Nirmal Fort', queries: ['Nirmal Toys craft', 'Nirmal Fort Telangana', 'Kadam Dam Nirmal', 'Nirmal Telangana'] },
    { slug: 'nizamabad', location: 'Historic 10th-century hilltop fortress of Nizamabad Fort (Quilla Ramalayam) and Ashok Sagar lake gardens, Nizamabad', queries: ['Nizamabad Fort Telangana', 'Ashok Sagar Nizamabad', 'Alisagar Nizamabad', 'Sriram Sagar Dam Nizamabad'] },
    { slug: 'peddapalli', location: 'Prehistoric 3rd-century BC Buddhist Mahastupa excavations at Dhulikatta and Sabitham Waterfall, Peddapalli', queries: ['Dhulikatta Buddhist Stupa', 'Sabitham Waterfall Peddapalli', 'Peddapalli Telangana', 'Ramagundam Godavari'] },
    { slug: 'rajanna-sircilla', location: 'Famed pilgrimage shrine of Sri Raja Rajeshwara Swamy Temple (Dakshina Kasi) at Vemulawada, Rajanna Sircilla', queries: ['Vemulawada Raja Rajeshwara Temple', 'Mid Manair Dam Sircilla', 'Rajanna Sircilla Telangana', 'Vemulawada temple'] },
    { slug: 'rangareddy', location: 'Dense herbal forests and trekking trails of Ananthagiri Hills and historic Osman Sagar lake (Gandipet), Rangareddy', queries: ['Ananthagiri Hills Vikarabad Rangareddy', 'Osman Sagar Gandipet', 'Chilkur Balaji Temple', 'Himayat Sagar Rangareddy'] },
    { slug: 'sangareddy', location: 'Pristine marshland bird sanctuary and freshwater mugger crocodile breeding grounds at Manjeera Reservoir, Sangareddy', queries: ['Manjeera Wildlife Sanctuary Sangareddy', 'Singur Dam Sangareddy', 'Sangareddy Heritage Jail', 'Manjeera Dam'] },
    { slug: 'siddipet', location: 'Sacred hillside cave temple of Komuravelli Mallanna Temple and vast shimmering waters of Ranganayaka Sagar, Siddipet', queries: ['Komuravelli Mallanna Temple', 'Ranganayaka Sagar Siddipet', 'Komuravelli Temple', 'Siddipet Telangana'] },
    { slug: 'suryapet', location: 'Ancient Kakatiya pillars of Pillalamarri Chennakesava Temple and Buddhist monastic hill of Phanigiri, Suryapet', queries: ['Phanigiri Buddhist stupa', 'Pillalamarri Temple Suryapet', 'Mattapalli Temple Suryapet', 'Suryapet Telangana'] },
    { slug: 'vikarabad', location: 'Scenic birthplace of Musi River amidst pristine wooded ridges of Ananthagiri Hills and Kotepally Reservoir, Vikarabad', queries: ['Ananthagiri Hills Vikarabad', 'Kotepally Kayaking Vikarabad', 'Bugga Ramalingeswara Vikarabad', 'Vikarabad hills'] },
    { slug: 'wanaparthy', location: 'Magnificent 19th-century royal palace architecture of Wanaparthy Palace and historic Sarala Sagar Dam siphons', queries: ['Wanaparthy Palace Telangana', 'Sarala Sagar Dam Wanaparthy', 'Beechupalli Temple Krishna', 'Wanaparthy Telangana'] },
    { slug: 'warangal', location: 'Iconic 12th-century carved stone gateway arches of Kakatiya Kala Thoranam at historic Warangal Fort, Warangal', queries: ['Warangal Fort Kakatiya Thoranam', 'Warangal Fort ruins', 'Khush Mahal Warangal', 'Warangal Telangana'] },
    { slug: 'yadadri-bhuvanagiri', location: 'Magnificent gold-plated stone gopurams of Sri Lakshmi Narasimha Swamy Temple at Yadagirigutta and Bhongir Fort rock', queries: ['Yadagirigutta Temple Telangana', 'Bhongir Fort Telangana', 'Bhongir Fort rock monolith', 'Yadadri Temple'] }
  ]
};

async function run() {
  const sikkim = await curateState(SIKKIM_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedSikkimDataset.json', JSON.stringify(sikkim, null, 2));
  console.log('Saved verifiedSikkimDataset.json');

  const tamilNadu = await curateState(TAMIL_NADU_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedTamilNaduDataset.json', JSON.stringify(tamilNadu, null, 2));
  console.log('Saved verifiedTamilNaduDataset.json');

  const telangana = await curateState(TELANGANA_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedTelanganaDataset.json', JSON.stringify(telangana, null, 2));
  console.log('Saved verifiedTelanganaDataset.json');

  console.log('\n=== BATCH 3 (SIKKIM, TAMIL NADU, TELANGANA) COMPLETED ===');
}

run().catch(console.error);
