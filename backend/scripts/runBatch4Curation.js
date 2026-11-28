import fs from 'fs';
import { curateState } from './curationCore.js';

const TRIPURA_CONFIG = {
  name: 'Tripura',
  slug: 'tripura',
  heroDesc: 'Splendid water palace of Neermahal floating gracefully in the middle of Rudrasagar Lake, Melaghar, Tripura',
  heroQueries: ['Neermahal Tripura', 'Neermahal Palace Tripura', 'Unakoti rock carvings Tripura'],
  cardDesc: 'Colossal 7th-century rock-cut stone relief sculptures of Lord Shiva at sacred Unakoti pilgrimage, Tripura',
  cardQueries: ['Unakoti rock carvings', 'Ujjayanta Palace Agartala', 'Tripura Sundari Temple Udaipur', 'Jampui Hills Tripura'],
  districts: [
    { slug: 'dhalai', location: 'Tranquil forested islands of Dumboor Lake and scenic Longtharai hill range in Dhalai', queries: ['Dumboor Lake Tripura', 'Dumboor water fall Tripura', 'Dhalai Tripura', 'Longtharai Mandir Tripura'] },
    { slug: 'gomati', location: 'Venerated 500-year-old 51-Shakti Peetha shrine of Tripura Sundari (Matabari) and Kalyan Sagar in Gomati (Udaipur)', queries: ['Tripura Sundari Temple Udaipur', 'Matabari Tripura', 'Udaipur Tripura temple', 'Gunabati group of temples'] },
    { slug: 'khowai', location: 'Lush tea gardens and scenic eco-park trails of Baramura Hills along the Khowai River', queries: ['Baramura Eco Park Tripura', 'Khowai Tripura', 'Khowai river Tripura', 'Barmura hills Tripura'] },
    { slug: 'north-tripura', location: 'Highest peak of Tripura at Betlingchhip and picturesque orange blossom viewpoints of Jampui Hills', queries: ['Jampui Hills Tripura', 'Jampui Hills', 'Rowa Wildlife Sanctuary', 'North Tripura landscape'] },
    { slug: 'sepahijala', location: 'Gleaming red-and-white royal pleasure palace of Neermahal and Clouded Leopard sanctuary at Sepahijala', queries: ['Neermahal Melaghar Tripura', 'Sepahijala Wildlife Sanctuary', 'Sepahijala Tripura', 'Neermahal Lake'] },
    { slug: 'south-tripura', location: 'Prehistoric 8th-century terracotta and Buddhist-Hindu archaeological treasures of Pilak in South Tripura', queries: ['Pilak archaeological site Tripura', 'Pilak Tripura', 'Trishna Wildlife Sanctuary', 'South Tripura heritage'] },
    { slug: 'unakoti', location: 'Primeval rock-hewn monumental bas-relief face of Unakotiswara Kal Bhairava carved along forest cliffs, Unakoti', queries: ['Unakoti Tripura Shiva', 'Unakoti rock carvings', 'Unakoti waterfall', 'Unakoti heritage'] },
    { slug: 'west-tripura', location: 'Magnificent neoclassical domes and Mughal gardens of Ujjayanta Palace (Tripura State Museum) in Agartala', queries: ['Ujjayanta Palace Agartala', 'Ujjayanta Palace Tripura', 'Heritage Park Agartala', 'Agartala city Tripura'] }
  ]
};

const UTTARAKHAND_CONFIG = {
  name: 'Uttarakhand',
  slug: 'uttarakhand',
  heroDesc: 'Towering sacred stone sanctum of Kedarnath Temple framed by snow-bound Himalayan peaks of the Garhwal Range, Uttarakhand',
  heroQueries: ['Kedarnath Temple Uttarakhand snow', 'Kedarnath Temple Garhwal', 'Badrinath Temple Uttarakhand'],
  cardDesc: 'Vibrant evening Ganga Aarti and floating leaf lamps illuminated across Har Ki Pauri ghats, Haridwar, Uttarakhand',
  cardQueries: ['Har Ki Pauri Haridwar Ganga Aarti', 'Naini Lake Nainital Uttarakhand', 'Valley of Flowers Uttarakhand', 'Rishikesh Laxman Jhula'],
  districts: [
    { slug: 'almora', location: 'Ancient cluster of 124 9th-century Nagara stone temples of Jageshwar Dham amidst deodar forests, Almora', queries: ['Jageshwar Dham Almora', 'Jageshwar Temple Almora', 'Kasar Devi Temple Almora', 'Binsar Wildlife Sanctuary Almora'] },
    { slug: 'bageshwar', location: 'Sacred stone confluence shrine of Bagnath Temple at Saryu-Gomati and Baijnath temple group, Bageshwar', queries: ['Bagnath Temple Bageshwar', 'Baijnath Temple Uttarakhand', 'Bageshwar Uttarakhand', 'Kausani Uttarakhand'] },
    { slug: 'chamoli', location: 'Vibrant painted facade of sacred Badrinath Temple and UNESCO World Heritage alpine meadows of Valley of Flowers, Chamoli', queries: ['Badrinath Temple Chamoli', 'Valley of Flowers National Park Chamoli', 'Hemkund Sahib Chamoli', 'Auli ski resort Chamoli'] },
    { slug: 'champawat', location: 'Exquisite 12th-century stone filigree carving of Baleshwar Temple and misty pine ridge of Abbott Mount, Champawat', queries: ['Baleshwar Temple Champawat', 'Abbott Mount Champawat', 'Champawat Uttarakhand', 'Banasur Fort Champawat'] },
    { slug: 'dehradun', location: 'Grand Greco-Roman colonnades of Forest Research Institute and cool cavernous waters of Robbers Cave (Guchhupani), Dehradun', queries: ['Forest Research Institute Dehradun', 'Robbers Cave Dehradun', 'Mindrolling Monastery Dehradun', 'Mussoorie Kempty Falls'] },
    { slug: 'haridwar', location: 'Divine spiritual ambiance of Har Ki Pauri on the holy banks of Mother Ganga and Mansa Devi hill temple, Haridwar', queries: ['Har Ki Pauri Haridwar', 'Ganga Aarti Haridwar', 'Mansa Devi Temple Haridwar', 'Chandi Devi Haridwar'] },
    { slug: 'nainital', location: 'Iconic emerald eye-shaped waters of Naini Lake surrounded by seven green mountain peaks, Nainital', queries: ['Naini Lake Nainital', 'Nainital Lake Uttarakhand', 'Mukteshwar Dham Nainital', 'Bhimtal Lake Nainital'] },
    { slug: 'pauri-garhwal', location: 'Serene pine-shaded colonial church of St. Mary and mountain views from Tip-in-Top at Lansdowne, Pauri Garhwal', queries: ['Lansdowne Uttarakhand', 'Bhulla Lake Lansdowne', 'Tip In Top Lansdowne', 'Pauri Garhwal landscape'] },
    { slug: 'pithoragarh', location: 'Breathtaking Panchachuli glacier peaks from Munsiyari and subterranean stalactite caves of Patal Bhuvaneshwar, Pithoragarh', queries: ['Munsiyari Panchachuli peaks', 'Patal Bhuvaneshwar Pithoragarh', 'Pithoragarh Fort', 'Pithoragarh Uttarakhand'] },
    { slug: 'rudraprayag', location: 'Highest Shiva temple in the world at 12,073-ft Tungnath and heavenly alpine reflection pool of Deoria Tal, Rudraprayag', queries: ['Tungnath Temple Rudraprayag', 'Chopta Tungnath Uttarakhand', 'Deoria Tal lake', 'Kedarnath Temple Rudraprayag'] },
    { slug: 'tehri-garhwal', location: 'Colossal emerald waters of Tehri Dam reservoir and hilltop pilgrimage shrine of Surkanda Devi, Tehri Garhwal', queries: ['Tehri Dam lake Uttarakhand', 'Tehri Dam reservoir', 'Surkanda Devi Temple Tehri', 'Dhanaulti Tehri'] },
    { slug: 'udham-singh-nagar', location: 'Vast sacred waters of Nanakmatta Sahib Gurdwara and historic lake reservoir in Udham Singh Nagar', queries: ['Nanakmatta Gurdwara', 'Nanakmatta Dam', 'Udham Singh Nagar Uttarakhand', 'Rudrapur Uttarakhand'] },
    { slug: 'uttarkashi', location: 'Sacred Himalayan sanctum of Gangotri Temple nestled beneath snow-capped peaks at the source of Bhagirathi River, Uttarkashi', queries: ['Gangotri Temple Uttarkashi', 'Yamunotri Temple Uttarkashi', 'Dayara Bugyal Uttarkashi', 'Har Ki Doon valley Uttarkashi'] }
  ]
};

const UTTAR_PRADESH_CONFIG = {
  name: 'Uttar Pradesh',
  slug: 'uttar-pradesh',
  heroDesc: 'World Wonder of the Taj Mahal glowing with white Makrana marble reflections on the Yamuna riverbank, Agra, Uttar Pradesh',
  heroQueries: ['Taj Mahal Agra Uttar Pradesh', 'Taj Mahal Agra sunrise', 'Varanasi ghats Ganga Aarti'],
  cardDesc: 'Ancient illuminated riverfront ghats and evening Ganga Aarti ceremonies along the sacred river at Varanasi, Uttar Pradesh',
  cardQueries: ['Varanasi ghats river Ganga', 'Bara Imambara Lucknow', 'Sarnath Dhamek Stupa', 'Fatehpur Sikri Buland Darwaza'],
  districts: [
    { slug: 'agra', location: 'Matchless white marble symmetry of the Taj Mahal and royal red sandstone pavilions of Agra Fort (UNESCO)', queries: ['Taj Mahal Agra', 'Agra Fort Rajasthan Uttar Pradesh', 'Fatehpur Sikri Buland Darwaza', 'Itmad-ud-Daulah Agra'] },
    { slug: 'aligarh', location: 'Historic 16th-century ramparts of Aligarh Fort and stately British-era Victoria Gate of AMU in Aligarh', queries: ['Aligarh Fort Uttar Pradesh', 'Victoria Gate Aligarh', 'Aligarh Muslim University', 'Aligarh heritage'] },
    { slug: 'ambedkar-nagar', location: 'Historic Sufi shrine of Dargah Syed Makhdoom Ashraf Jahangir Semnani at Kichhauchha, Ambedkar Nagar', queries: ['Kichhauchha Dargah Ambedkar Nagar', 'Ambedkar Nagar Uttar Pradesh', 'Tanda Ambedkar Nagar', 'Saryu Ambedkar Nagar'] },
    { slug: 'amethi', location: 'Historic royal battlements of Ramnagar Fort and revered shrine of Kalikan Dham in Amethi', queries: ['Amethi Uttar Pradesh', 'Kalikan Dham Amethi', 'Ramnagar Fort Amethi', 'Amethi heritage'] },
    { slug: 'amroha', location: 'Revered Sufi shrine of Dargah Shah Wilayat and historic 17th-century Moradabadi-style gates of Amroha', queries: ['Dargah Shah Wilayat Amroha', 'Amroha Uttar Pradesh', 'Vasudev Mandir Amroha', 'Amroha heritage'] },
    { slug: 'auraiya', location: 'Sacred Yamuna river confluence of Pachnada and ancient Devkali Temple in Auraiya', queries: ['Pachnada Auraiya', 'Devkali Temple Auraiya', 'Auraiya Uttar Pradesh', 'Yamuna river Auraiya'] },
    { slug: 'ayodhya', location: 'Grand Nagara architectural masterpiece of Ram Janmabhoomi Mandir and sacred ghats of Saryu River in Ayodhya', queries: ['Ayodhya Ram Mandir', 'Ram Janmabhoomi Ayodhya', 'Saryu Ghat Ayodhya', 'Hanuman Garhi Ayodhya'] },
    { slug: 'azamgarh', location: 'Sacred river confluence of Tamsa and Kunwar at Dattatreya Ashram and Nizamabad black pottery heritage, Azamgarh', queries: ['Nizamabad black pottery Azamgarh', 'Dattatreya Ashram Azamgarh', 'Azamgarh Uttar Pradesh', 'Tamsa river Azamgarh'] },
    { slug: 'baghpat', location: 'Prehistoric Mahabharata archaeological site of Lakshagriha at Barnawa and historic Trilok Teerth Dham, Baghpat', queries: ['Barnawa Lakshagriha Baghpat', 'Trilok Teerth Dham Bada Gaon', 'Baghpat Uttar Pradesh', 'Yamuna river Baghpat'] },
    { slug: 'bahraich', location: 'Historic Dargah of Ghazi Saiyyad Salar Masud and rich Sal forest wilderness of Katarniaghat Wildlife Sanctuary, Bahraich', queries: ['Katarniaghat Wildlife Sanctuary Bahraich', 'Dargah Salar Masud Bahraich', 'Bahraich Uttar Pradesh', 'Katarniaghat tiger'] },
    { slug: 'ballia', location: 'Sacred Ganga-Ghaghara river confluence at Bhrigu Ashram and scenic migratory wetlands of Surha Taal bird sanctuary, Ballia', queries: ['Bhrigu Mandir Ballia', 'Surha Taal Ballia', 'Ballia Uttar Pradesh', 'Ganga river Ballia'] },
    { slug: 'balrampur', location: 'Sacred 51-Shakti Peetha shrine of Maa Pateshwari Devi Patan Temple and Buddhist ruins of Sahet-Mahet, Balrampur', queries: ['Devi Patan Temple Balrampur', 'Sahet Mahet Balrampur', 'Balrampur Uttar Pradesh', 'Tulsipur Devi Patan'] },
    { slug: 'banda', location: 'Mighty hill fortress of Kalinjar Fort (UNESCO Tentative) with colossal rock-cut Neelkanth Shiva sculpture, Banda', queries: ['Kalinjar Fort Banda', 'Kalinjar Fort Uttar Pradesh', 'Neelkanth Temple Kalinjar', 'Ken river Banda'] },
    { slug: 'barabanki', location: 'Universal brotherhood pilgrimage of Dargah Haji Waris Ali Shah at Deva Sharif and ancient Parijaat Tree, Barabanki', queries: ['Deva Sharif Barabanki', 'Parijaat tree Barabanki', 'Lodheshwar Mahadev Barabanki', 'Barabanki Uttar Pradesh'] },
    { slug: 'bareilly', location: 'Historic Seven Shiva temples (Nath Nagari) including Alakhnath and Trivatinath and Dargah-e-Aala Hazrat, Bareilly', queries: ['Alakhnath Temple Bareilly', 'Bareilly Uttar Pradesh', 'Dargah Ala Hazrat Bareilly', 'Trivatinath Temple Bareilly'] },
    { slug: 'basti', location: 'Ancient sage Vashistha hermitage at Chando Tal lake and historic Buddhist stupa sites in Basti', queries: ['Chando Tal Basti', 'Basti Uttar Pradesh', 'Basti heritage', 'Kaptanganj Basti'] },
    { slug: 'bhadohi', location: 'Sacred Sita Samahit Sthal (Sitamarhi) on the banks of Ganga and world-famous handmade carpet looms of Bhadohi', queries: ['Sitamarhi Bhadohi', 'Sita Samahit Sthal', 'Bhadohi carpet Uttar Pradesh', 'Bhadohi Uttar Pradesh'] },
    { slug: 'bijnor', location: 'Ancient Mahabharata capital ruins of Kanva Ashram and pristine wetland habitats of Haiderpur, Bijnor', queries: ['Haiderpur Wetland Bijnor', 'Vidur Kuti Bijnor', 'Kanva Ashram Bijnor', 'Bijnor Uttar Pradesh'] },
    { slug: 'budaun', location: 'Magnificent 13th-century Shamsi Jama Masjid (built by Iltutmish) and sacred shrines of Budaun', queries: ['Shamsi Jama Masjid Budaun', 'Budaun Uttar Pradesh', 'Badaun Jama Masjid', 'Budaun heritage'] },
    { slug: 'bulandshahr', location: 'Historic Ganga riverbank ghats of Anupshahr (Chhoti Kashi) and industrial pottery town of Khurja, Bulandshahr', queries: ['Khurja Pottery Bulandshahr', 'Anupshahr Ganga ghat', 'Bulandshahr Uttar Pradesh', 'Khurja ceramic'] },
    { slug: 'chandauli', location: 'Breathtaking 100-meter canyon waterfalls of Rajdari and Devdari inside Chandraprabha Wildlife Sanctuary, Chandauli', queries: ['Rajdari Waterfall Chandauli', 'Devdari Waterfall Chandauli', 'Chandraprabha Wildlife Sanctuary', 'Chandauli Uttar Pradesh'] },
    { slug: 'chitrakoot', location: 'Sacred Mandakini riverbank ghats of Ramghat and tranquil forest cascades of Gupt Godavari in holy Chitrakoot', queries: ['Ramghat Chitrakoot', 'Gupt Godavari Chitrakoot', 'Kamadgiri Chitrakoot', 'Hanuman Dhara Chitrakoot'] },
    { slug: 'deoria', location: 'Sacred 1,500-year-old Gupta-era Sun Temple at Dugdheshwar Nath and riverbanks of Little Gandak, Deoria', queries: ['Dugdheshwar Nath Temple Deoria', 'Deoria Uttar Pradesh', 'Deoria temple', 'Deoria heritage'] },
    { slug: 'etah', location: 'Ancient heritage mounds of Atranji Khera and serene waterbird sanctuary of Patna Bird Sanctuary, Etah', queries: ['Patna Bird Sanctuary Etah', 'Atranji Khera Etah', 'Etah Uttar Pradesh', 'Etah temple'] },
    { slug: 'etawah', location: 'Scenic badlands and lion breeding safari of Etawah Safari Park and Chambal-Yamuna river confluence, Etawah', queries: ['Etawah Safari Park', 'National Chambal Sanctuary Etawah', 'Etawah Uttar Pradesh', 'Chambal river Etawah'] },
    { slug: 'farrukhabad', location: 'Historic Buddhist pilgrimage site of Sankisa (where Buddha descended from heaven) and Kampil Jain temple, Farrukhabad', queries: ['Sankisa Farrukhabad', 'Kampil Farrukhabad', 'Farrukhabad Uttar Pradesh', 'Sankassa stupa'] },
    { slug: 'fatehpur', location: 'Historic 16th-century royal masonry baolis of Bhitaura and Asothar Fort along the Yamuna and Ganga, Fatehpur', queries: ['Fatehpur Uttar Pradesh', 'Bhitaura Ganga Fatehpur', 'Bavan Imli Fatehpur', 'Fatehpur heritage'] },
    { slug: 'firozabad', location: 'Centuries-old glassblowing furnace workshops of the City of Bangles and Sufi shrine of Sufi Shah, Firozabad', queries: ['Firozabad glass bangles', 'Firozabad Uttar Pradesh', 'Chandrawar Firozabad', 'Firozabad craft'] },
    { slug: 'gautam-buddha-nagar', location: 'Ultra-modern skyline of Noida and pristine birdwatching paradise of Okhla Bird Sanctuary, Gautam Buddha Nagar', queries: ['Okhla Bird Sanctuary Noida', 'Noida skyline Uttar Pradesh', 'Buddh International Circuit Noida', 'Gautam Buddha Nagar'] },
    { slug: 'ghaziabad', location: 'Historic 18th-century temple of Dudheshwar Nath dedicated to Lord Shiva and Hindon riverfront, Ghaziabad', queries: ['Dudheshwar Nath Temple Ghaziabad', 'Ghaziabad Uttar Pradesh', 'Swarna Jayanti Park Ghaziabad', 'Hindon river'] },
    { slug: 'ghazipur', location: 'Grecian-columned mausoleum of British Governor-General Lord Cornwallis and opium factory heritage, Ghazipur', queries: ['Lord Cornwallis Tomb Ghazipur', 'Ghazipur Uttar Pradesh', 'Ghazipur Ganga ghat', 'Cornwallis Tomb'] },
    { slug: 'gonda', location: 'Sacred birth shrine of Lord Swaminarayan at Chhapaiya and Paska Parikrama on the Sarayu, Gonda', queries: ['Swaminarayan Temple Chhapaiya Gonda', 'Parvati Arga Bird Sanctuary Gonda', 'Gonda Uttar Pradesh', 'Chhapaiya temple'] },
    { slug: 'gorakhpur', location: 'Sprawling 52-acre headquarters of Nath monastic tradition at Gorakhnath Temple and serene Ramgarh Taal, Gorakhpur', queries: ['Gorakhnath Temple Gorakhpur', 'Ramgarh Taal Gorakhpur', 'Gorakhpur Uttar Pradesh', 'Gorakhnath Math'] },
    { slug: 'hamirpur', location: 'Historic confluence of the holy Yamuna and Betwa rivers and ancient Kalp Vriksha tree in Hamirpur', queries: ['Hamirpur Uttar Pradesh', 'Yamuna Betwa Sangam Hamirpur', 'Hamirpur fort', 'Betwa river Hamirpur'] },
    { slug: 'hapur', location: 'Sacred holy bathing ghats of Garhmukteshwar on the River Ganga during Kartik Purnima fair, Hapur', queries: ['Garhmukteshwar Ganga Hapur', 'Garhmukteshwar Hapur', 'Mukteshwar Mahadev Hapur', 'Hapur Uttar Pradesh'] },
    { slug: 'hardoi', location: 'Biodiversity-rich wetland bird sanctuary of Sandi Bird Sanctuary and historic Victoria Hall in Hardoi', queries: ['Sandi Bird Sanctuary Hardoi', 'Hardoi Uttar Pradesh', 'Sandi sanctuary', 'Hardoi heritage'] },
    { slug: 'hathras', location: 'Historic mud-brick battlements of Raja Dayaram Fort and traditional hing (asafoetida) trade market of Hathras', queries: ['Hathras Uttar Pradesh', 'Raja Dayaram Fort Hathras', 'Hathras heritage', 'Hathras temple'] },
    { slug: 'jalaun', location: 'Ancient five-river confluence (Panchrada) at Jagammangad and historic Rampura Fort in Jalaun (Orai)', queries: ['Jalaun Uttar Pradesh', 'Orai Uttar Pradesh', 'Pachnada Jalaun', 'Rampura Fort Jalaun'] },
    { slug: 'jaunpur', location: 'Unique Sharqi architectural marvel of 15th-century Atala Mosque and massive stone Shahi Bridge, Jaunpur', queries: ['Atala Mosque Jaunpur', 'Shahi Bridge Jaunpur', 'Jaunpur Fort Uttar Pradesh', 'Shahi Qila Jaunpur'] },
    { slug: 'jhansi', location: 'Legendary hill ramparts of Jhansi Fort where Rani Lakshmibai fought and regal Rani Mahal in Jhansi', queries: ['Jhansi Fort Uttar Pradesh', 'Rani Mahal Jhansi', 'Jhansi Fort India', 'Rani Lakshmibai Jhansi'] },
    { slug: 'kannauj', location: 'Centuries-old copper deg-bapka sandalwood attar distilleries in the historic Perfume Capital of India, Kannauj', queries: ['Kannauj perfume attar', 'Kannauj Uttar Pradesh', 'Gauri Shankar Temple Kannauj', 'Lakh Bahosi Sanctuary Kannauj'] },
    { slug: 'kanpur-dehat', location: 'Rare 5th-century Gupta-period terraced brick temple of Bhitargaon (oldest surviving brick shrine in India), Kanpur Dehat', queries: ['Bhitargaon Temple Kanpur Dehat', 'Bhitargaon brick temple', 'Kanpur Dehat Uttar Pradesh', 'Bhitargaon Gupta'] },
    { slug: 'kanpur-nagar', location: 'Historic Ganga riverfront ghats of Bithoor (birthplace of Luv-Kush) and JK Temple marble spire in Kanpur', queries: ['Bithoor Kanpur Ganga', 'JK Temple Kanpur', 'Brahmavart Ghat Bithoor', 'Kanpur Memorial Church'] },
    { slug: 'kasganj', location: 'Sacred Varaha incarnation temple of Soron Shookar Kshetra along the holy Haripadi Ganga ghats, Kasganj', queries: ['Soron Kasganj', 'Soron Shookar Kshetra', 'Kasganj Uttar Pradesh', 'Haripadi Ganga Soron'] },
    { slug: 'kaushambi', location: 'Massive brick defense walls of ancient 6th-century BC Vatsa Kingdom capital and Ghoshitarama Monastery, Kaushambi', queries: ['Kaushambi archaeological ruins', 'Ghoshitarama Monastery Kaushambi', 'Kaushambi Uttar Pradesh', 'Kaushambi Ashoka pillar'] },
    { slug: 'kheri', location: 'Pristine Terai grasslands and royal Bengal tiger corridors of Dudhwa National Park and Frog Temple Oel, Lakhimpur Kheri', queries: ['Dudhwa National Park', 'Dudhwa tiger reserve', 'Frog Temple Oel Lakhimpur', 'Lakhimpur Kheri Uttar Pradesh'] },
    { slug: 'kushinagar', location: 'Sacred Mahaparinirvana Temple and colossal 5th-century reclining Buddha statue where Gautama Buddha entered Nirvana', queries: ['Mahaparinirvana Temple Kushinagar', 'Kushinagar reclining Buddha', 'Ramabhar Stupa Kushinagar', 'Kushinagar Buddhist'] },
    { slug: 'lalitpur', location: 'Exquisite 6th-century Gupta masterpiece of Dashavatara Temple Deogarh and 31 Jain temples along the Betwa, Lalitpur', queries: ['Dashavatara Temple Deogarh', 'Deogarh Lalitpur Uttar Pradesh', 'Deogarh Betwa river', 'Lalitpur Uttar Pradesh'] },
    { slug: 'lucknow', location: 'Grand vaulted arch of Asfi Mosque, labyrinthine Bhool Bhulaiya at Bara Imambara and British Residency, Lucknow', queries: ['Bara Imambara Lucknow', 'Rumi Darwaza Lucknow', 'Chota Imambara Lucknow', 'British Residency Lucknow'] },
    { slug: 'maharajganj', location: 'Tropical dense Sal forests of Sohagibarwa Wildlife Sanctuary and historic Lehra Devi Temple, Maharajganj', queries: ['Sohagibarwa Wildlife Sanctuary', 'Maharajganj Uttar Pradesh', 'Lehra Devi Maharajganj', 'Sohagi Barwa'] },
    { slug: 'mahoba', location: 'Scenic medieval Chandela dynasty artificial lake of Rahila Sagar and Sun Temple ruins in historical Mahoba', queries: ['Rahila Sun Temple Mahoba', 'Sun Temple Mahoba', 'Madan Sagar Mahoba', 'Mahoba Uttar Pradesh'] },
    { slug: 'mainpuri', location: 'Important Sarus crane wetland sanctuary at Saman Bird Sanctuary and ancient Sheetla Devi Temple in Mainpuri', queries: ['Saman Bird Sanctuary Mainpuri', 'Mainpuri Uttar Pradesh', 'Mainpuri temple', 'Saman sanctuary'] },
    { slug: 'mathura', location: 'Sacred birthplace of Lord Krishna at Shri Krishna Janmabhoomi and Yamuna ghats of holy Mathura and Vrindavan', queries: ['Krishna Janmabhoomi Mathura', 'Vishram Ghat Mathura', 'Prem Mandir Vrindavan', 'Banke Bihari Vrindavan'] },
    { slug: 'mau', location: 'Historic weaving town of Mau Nath Bhanjan along the Tamsa River and ancient Shitala Mata Dham in Mau', queries: ['Mau Uttar Pradesh', 'Tamsa river Mau', 'Mau saree weaving', 'Mau Nath Bhanjan'] },
    { slug: 'meerut', location: 'Historic birthplace of 1857 First War of Indian Independence at Augharnath Mandir and Sardhana Church, Meerut', queries: ['Augharnath Temple Meerut', 'Basilica of Our Lady of Graces Sardhana', 'Meerut Uttar Pradesh', 'Sardhana Church Meerut'] },
    { slug: 'mirzapur', location: 'Revered Shakti Peetha of Vindhyavasani Temple at Vindhyachal and breathtaking cascades of Wyndham Falls, Mirzapur', queries: ['Vindhyavasani Temple Vindhyachal', 'Vindhyachal Mirzapur', 'Wyndham Falls Mirzapur', 'Chunar Fort Mirzapur'] },
    { slug: 'moradabad', location: 'Master craftsmen engraving intricate floral brassware in the City of Brass and historic Jama Masjid, Moradabad', queries: ['Moradabad brass craft', 'Jama Masjid Moradabad', 'Moradabad Uttar Pradesh', 'Moradabad brassware'] },
    { slug: 'muzaffarnagar', location: 'Sacred Sukhdev Temple where Rishi Sukhdev recited the Bhagavata Purana at Shukratal on the Ganga, Muzaffarnagar', queries: ['Shukratal Muzaffarnagar', 'Shukdev Temple Shukratal', 'Muzaffarnagar Uttar Pradesh', 'Vat Vriksha Shukratal'] },
    { slug: 'pilibhit', location: 'Dense tiger forest canopy and scenic lake reaches of Sharda Sagar Dam at Pilibhit Tiger Reserve', queries: ['Pilibhit Tiger Reserve', 'Chuka Beach Pilibhit', 'Sharda Sagar Dam Pilibhit', 'Pilibhit forest'] },
    { slug: 'pratapgarh', location: 'Revered Maa Belha Devi Temple on the banks of Sai River and historic Bhakti Dham in Mangarh, Pratapgarh', queries: ['Belha Devi Temple Pratapgarh', 'Bhakti Dham Mangarh', 'Pratapgarh Uttar Pradesh', 'Sai river Pratapgarh'] },
    { slug: 'prayagraj', location: 'Sacred Triveni Sangam of Ganga, Yamuna, and Saraswati and mighty Mughal ramparts of Allahabad Fort, Prayagraj', queries: ['Triveni Sangam Prayagraj', 'Allahabad Fort Prayagraj', 'Khusro Bagh Prayagraj', 'Anand Bhavan Prayagraj'] },
    { slug: 'raebareli', location: 'Picturesque bird sanctuary lake of Samaspur Bird Sanctuary and 15th-century royal palace of Dalmau on the Ganga, Raebareli', queries: ['Samaspur Bird Sanctuary Raebareli', 'Dalmau Raebareli Ganga', 'Raebareli Uttar Pradesh', 'Dalmau Fort'] },
    { slug: 'rampur', location: 'Indo-Islamic architectural splendor of Raza Library housing rare royal manuscripts and Rampur Fort', queries: ['Raza Library Rampur', 'Rampur Palace Uttar Pradesh', 'Rampur Fort', 'Rampur Uttar Pradesh'] },
    { slug: 'saharanpur', location: 'Famed Shakambhari Devi Temple nestled in Shivalik foothills and exquisite wood carving workshops of Saharanpur', queries: ['Shakambhari Devi Temple Saharanpur', 'Saharanpur wood carving', 'Saharanpur Uttar Pradesh', 'Saharanpur Botanical Garden'] },
    { slug: 'sambhal', location: 'Historic 16th-century Mughal architecture of Baburi Jama Masjid and ancient Kalki Vishnu Temple in Sambhal', queries: ['Jama Masjid Sambhal', 'Sambhal Uttar Pradesh', 'Kalki Temple Sambhal', 'Sambhal heritage'] },
    { slug: 'sant-kabir-nagar', location: 'Sacred samadhi and mausoleum of great mystic poet-saint Kabir Das at historic Maghar, Sant Kabir Nagar', queries: ['Kabir Samadhi Maghar', 'Maghar Sant Kabir Nagar', 'Sant Kabir Nagar Uttar Pradesh', 'Kabir Chaura Maghar'] },
    { slug: 'shahjahanpur', location: 'Historic martyr memorial honoring Ram Prasad Bismil, Ashfaqulla Khan and Thakur Roshan Singh in Shahjahanpur', queries: ['Shahjahanpur Uttar Pradesh', 'Shaheed Smarak Shahjahanpur', 'Shahjahanpur heritage', 'Ram Prasad Bismil memorial'] },
    { slug: 'shamli', location: 'Historic town of Kairana famous for Kirana Gharana classical music and ancient Hanuman Tilla, Shamli', queries: ['Shamli Uttar Pradesh', 'Kairana Shamli', 'Hanuman Tilla Shamli', 'Shamli heritage'] },
    { slug: 'shravasti', location: 'Sacred Jetavana Monastery where Gautama Buddha spent 24 monsoon retreats and ancient Anathapindika Stupa, Shravasti', queries: ['Jetavana Monastery Shravasti', 'Anathapindika Stupa Shravasti', 'Shravasti Buddhist', 'Shravasti Uttar Pradesh'] },
    { slug: 'siddharthnagar', location: 'Ancient Shakya republic capital of Kapilavastu (Piprahwa) where Prince Siddhartha Gautama spent his youth', queries: ['Kapilavastu Piprahwa', 'Piprahwa Stupa Siddharthnagar', 'Siddharthnagar Uttar Pradesh', 'Kapilavastu ruins'] },
    { slug: 'sitapur', location: 'Sacred forest pilgrimage of Naimisharanya (Chakra Teerth) where the 18 Puranas were composed by Veda Vyasa, Sitapur', queries: ['Naimisharanya Chakra Teerth Sitapur', 'Naimisharanya Sitapur', 'Lalita Devi Naimisharanya', 'Sitapur Uttar Pradesh'] },
    { slug: 'sonbhadra', location: 'Ancient Vijaygarh Fort and magnificent multi-tier water cascades of Mukha Falls amidst Son river gorges, Sonbhadra', queries: ['Vijaygarh Fort Sonbhadra', 'Rihand Dam Sonbhadra', 'Son river Sonbhadra', 'Mukha Falls Sonbhadra'] },
    { slug: 'sultanpur', location: 'Historical Parijat tree and ancient Victoria Manzil along the meandering banks of Gomti River, Sultanpur', queries: ['Sultanpur Uttar Pradesh', 'Gomti river Sultanpur', 'Parijat tree Sultanpur', 'Sultanpur heritage'] },
    { slug: 'unnao', location: 'Holy Valmiki Ashram at Pariyar on the Ganga and birdwatcher paradise of Nawabganj Bird Sanctuary, Unnao', queries: ['Nawabganj Bird Sanctuary Unnao', 'Pariyar Valmiki Ashram Unnao', 'Unnao Uttar Pradesh', 'Nawabganj sanctuary'] },
    { slug: 'varanasi', location: 'Timeless spiritual majesty of Dashashwamedh Ghat Ganga Aarti and golden spire of Kashi Vishwanath Temple, Varanasi', queries: ['Dashashwamedh Ghat Varanasi', 'Kashi Vishwanath Temple Varanasi', 'Ganga Aarti Varanasi', 'Manikarnika Ghat Varanasi'] }
  ]
};

async function run() {
  const tripura = await curateState(TRIPURA_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedTripuraDataset.json', JSON.stringify(tripura, null, 2));
  console.log('Saved verifiedTripuraDataset.json');

  const uttarakhand = await curateState(UTTARAKHAND_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedUttarakhandDataset.json', JSON.stringify(uttarakhand, null, 2));
  console.log('Saved verifiedUttarakhandDataset.json');

  const uttarPradesh = await curateState(UTTAR_PRADESH_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedUttarPradeshDataset.json', JSON.stringify(uttarPradesh, null, 2));
  console.log('Saved verifiedUttarPradeshDataset.json');

  console.log('\n=== BATCH 4 (TRIPURA, UTTARAKHAND, UTTAR PRADESH) COMPLETED ===');
}

run().catch(console.error);
