import fs from 'fs';
import { curateState } from './curationCore.js';

const ODISHA_CONFIG = {
  name: 'Odisha',
  slug: 'odisha',
  heroDesc: 'Magnificent 13th-century stone chariot wheels and sun god sculptures of Konark Sun Temple (UNESCO), Odisha',
  heroQueries: ['Konark Sun Temple wheel', 'Konark Sun Temple Odisha', 'Jagannath Temple Puri Odisha'],
  cardDesc: 'Vast glistening waters, red crabs and migratory flamingos at Chilika Lake lagoon, Odisha',
  cardQueries: ['Chilika Lake Odisha', 'Dhauli Shanti Stupa Odisha', 'Lingaraj Temple Bhubaneswar', 'Puri beach Odisha'],
  districts: [
    { slug: 'angul', location: 'Deep forested gorges of Mahanadi at Satkosia Tiger Reserve and Tikarpada sanctuary, Angul', queries: ['Satkosia Gorge', 'Tikarpada Mahanadi', 'Satkosia Tiger Reserve', 'Angul Odisha'] },
    { slug: 'balangir', location: 'Sacred foothills and perpetual spring streams of Harishankar Temple on Gandhamardan Hills, Balangir', queries: ['Harishankar Temple Balangir', 'Gandhamardan Hills', 'Sailashree Palace', 'Balangir Odisha'] },
    { slug: 'balasore', location: 'Unique receding tide phenomenon at Chandipur Beach and pristine casuarina shores of Balasore', queries: ['Chandipur Beach Odisha', 'Talasari Beach Balasore', 'Emami Jagannath Temple Balasore', 'Balasore Odisha'] },
    { slug: 'bargarh', location: 'Wildlife habitats of Debrigarh Sanctuary and historic sacred Nrusinghanath Temple, Bargarh', queries: ['Nrusinghanath Temple', 'Debrigarh Wildlife Sanctuary', 'Bargarh Odisha', 'Hirakud Bargarh'] },
    { slug: 'bhadrak', location: 'Ancient sacred shrine of Akhandalamani Temple at Aradi on the banks of Baitarani River, Bhadrak', queries: ['Akhandalamani Temple Aradi', 'Bhadrak Odisha', 'Dhamra Port Odisha', 'Baitarani River'] },
    { slug: 'boudh', location: 'Centuries-old stone Nabagrah Temple and colossal meditative Buddha sculptures of Boudh', queries: ['Nabagrah Temple Boudh', 'Boudh Buddha statue', 'Boudh Odisha', 'Mahanadi Boudh'] },
    { slug: 'cuttack', location: 'Moated historic ramparts of 14th-century Barabati Fort and silver filigree heritage city of Cuttack', queries: ['Barabati Fort Cuttack', 'Cuttack Chandi Temple', 'Mahanadi Barrage Cuttack', 'Cuttack Odisha'] },
    { slug: 'deogarh', location: 'Roaring crystalline torrents of Pradhanpat Waterfalls amidst scenic sal forests of Deogarh', queries: ['Pradhanpat Waterfall Deogarh', 'Pradhanpat Falls', 'Deogarh Odisha', 'Deogarh waterfall'] },
    { slug: 'dhenkanal', location: 'Hilltop abode of Lord Shiva at Kapilash Temple and sacred fire monastery of Joranda Gadi, Dhenkanal', queries: ['Kapilash Temple Dhenkanal', 'Joranda Gadi Dhenkanal', 'Saranga Vishnu Dhenkanal', 'Dhenkanal Odisha'] },
    { slug: 'gajapati', location: 'Cascading natural beauty of Gandahati Waterfall and mythical peaks of Mahendragiri in Gajapati', queries: ['Gandahati Waterfall', 'Mahendragiri Odisha', 'Paralakhemundi Palace', 'Gajapati Odisha'] },
    { slug: 'ganjam', location: 'Historic lighthouse and sea breeze at Gopalpur-on-Sea beach and twin hill shrine of Tara Tarini, Ganjam', queries: ['Gopalpur Beach Odisha', 'Tara Tarini Temple', 'Tampara Lake Ganjam', 'Rambha Chilika Ganjam'] },
    { slug: 'jagatsinghpur', location: 'Famed Shakta pilgrimage center of Sarala Temple at Jhankad and deep-sea port beach of Paradip', queries: ['Sarala Temple Jhankad', 'Paradip Beach Odisha', 'Paradip Port', 'Jagatsinghpur Odisha'] },
    { slug: 'jajpur', location: 'Sacred Shakti Peetha of Biraja Temple and Buddhist monastic excavations of Ratnagiri, Jajpur', queries: ['Biraja Temple Jajpur', 'Ratnagiri Buddhist Odisha', 'Udayagiri Buddhist Odisha', 'Jajpur Odisha'] },
    { slug: 'jharsuguda', location: 'Scenic waterfronts of Hirakud reservoir backwaters and ancient Jhadeswar Temple in Jharsuguda', queries: ['Jharsuguda Odisha', 'Kolabira Fort', 'Jhadeswar Temple Jharsuguda', 'Ib river Jharsuguda'] },
    { slug: 'kalahandi', location: 'Perennial cascades of Phurlijharan Falls and lush dense sal forest wilderness of Karlapat, Kalahandi', queries: ['Phurlijharan Falls Kalahandi', 'Karlapat Wildlife Sanctuary', 'Asurgarh Fort Kalahandi', 'Kalahandi Odisha'] },
    { slug: 'kandhamal', location: 'Pine-fringed cool hill station valleys and coffee plantations of Daringbadi (Kashmir of Odisha)', queries: ['Daringbadi Odisha', 'Daringbadi hill station', 'Belghar Sanctuary', 'Kandhamal Odisha'] },
    { slug: 'kendrapara', location: 'Mangrove swamps and estuarine giant saltwater crocodiles of Bhitarkanika National Park, Kendrapara', queries: ['Bhitarkanika National Park', 'Bhitarkanika crocodile', 'Baladevjew Temple Kendrapara', 'Kendrapara Odisha'] },
    { slug: 'kendujhar', location: 'Step-cascading waters of Sanaghagara and Badaghagara Falls amidst mineral-rich hills of Kendujhar', queries: ['Sanaghagara Waterfall Kendujhar', 'Badaghagara Falls', 'Gonasika Kendujhar', 'Tarini Temple Ghatgaon'] },
    { slug: 'khordha', location: 'Magnificent 11th-century Kalinga architecture of Lingaraj Temple and Buddhist Peace Pagoda at Dhauli', queries: ['Lingaraj Temple Bhubaneswar', 'Dhauli Shanti Stupa', 'Khandagiri Caves', 'Udayagiri Caves Bhubaneswar'] },
    { slug: 'koraput', location: 'Majestic cloud-touching peak of Deomali (highest point in Odisha) and Duduma Falls, Koraput', queries: ['Deomali Peak Koraput', 'Duduma Waterfall Koraput', 'Gupteswar Cave Temple', 'Kolab Dam Koraput'] },
    { slug: 'malkangiri', location: 'Picturesque turquoise reservoir expanse of Balimela Dam and tribal highlands of Malkangiri', queries: ['Balimela Dam Malkangiri', 'Balimela Reservoir', 'Satiguda Dam Malkangiri', 'Malkangiri Odisha'] },
    { slug: 'mayurbhanj', location: 'Spectacular two-tiered Barehipani Waterfall and royal palace heritage of Similipal National Park', queries: ['Barehipani Falls Similipal', 'Similipal National Park', 'Joranda Falls Similipal', 'Khiching Temple Mayurbhanj'] },
    { slug: 'nabarangpur', location: 'Scenic forest cascades of Chandandhara Falls and peaceful valleys of Indravati basin, Nabarangpur', queries: ['Chandandhara Falls', 'Nabarangpur Odisha', 'Indravati Nabarangpur', 'Papadahandi Shahid Minar'] },
    { slug: 'nayagarh', location: 'Historic Kantilo Nilamadhab Temple perched beside Mahanadi River and royal heritage of Nayagarh', queries: ['Kantilo Nilamadhab Temple', 'Nayagarh Odisha', 'Ranpur Palace Nayagarh', 'Mahanadi Kantilo'] },
    { slug: 'nuapada', location: 'Scenic reservoir panorama of Patora Dam and wildlife rich plateau of Sunabeda Sanctuary, Nuapada', queries: ['Patora Dam Nuapada', 'Sunabeda Sanctuary', 'Yogeswar Temple Patora', 'Nuapada Odisha'] },
    { slug: 'puri', location: 'World-famous 12th-century Shree Jagannath Temple and sun-drenched golden shores of Puri Beach', queries: ['Jagannath Temple Puri', 'Puri Beach Odisha', 'Konark Sun Temple Puri', 'Chilika Satapada Puri'] },
    { slug: 'rayagada', location: 'Sacred Maa Majhigouri Temple and scenic suspension bridge across Nagavali River in Rayagada', queries: ['Majhigouri Temple Rayagada', 'Chatikona Waterfall Rayagada', 'Rayagada Odisha', 'Nagavali River Rayagada'] },
    { slug: 'sambalpur', location: 'World’s longest earthen dam at Hirakud on the mighty Mahanadi and sacred Samaleswari Temple, Sambalpur', queries: ['Hirakud Dam Sambalpur', 'Samaleswari Temple Sambalpur', 'Ghanteswari Temple Sambalpur', 'Sambalpur Odisha'] },
    { slug: 'subarnapur', location: 'Exquisite terracotta carving of Subarnapur (Sonepur) temples and confluence of Mahanadi and Tel rivers', queries: ['Sonepur Odisha Temple', 'Subarnapur Odisha', 'Kosaleswara Temple', 'Sonepur Mahanadi'] },
    { slug: 'sundargarh', location: 'Massive horseshoe plunge of Khandadhar Waterfall and tranquil lake waters of Mandira Dam, Sundargarh', queries: ['Khandadhar Waterfall Sundargarh', 'Mandira Dam Rourkela', 'Vedvyas Rourkela', 'Sundargarh Odisha'] }
  ]
};

const PUNJAB_CONFIG = {
  name: 'Punjab',
  slug: 'punjab',
  heroDesc: 'Radiant gold-leaf sanctum and tranquil sacred Amrit Sarovar pool of Sri Harmandir Sahib (Golden Temple), Amritsar, Punjab',
  heroQueries: ['Golden Temple Amritsar night', 'Harmandir Sahib Amritsar', 'Golden Temple Punjab'],
  cardDesc: 'Modern sandstone architectural wonder of Virasat-e-Khalsa museum at the holy city of Anandpur Sahib, Punjab',
  cardQueries: ['Virasat-e-Khalsa Anandpur Sahib', 'Qila Mubarak Patiala', 'Wagah Border Amritsar', 'Jallianwala Bagh'],
  districts: [
    { slug: 'amritsar', location: 'Gilded sanctum of Harmandir Sahib (Golden Temple) and patriotic fervor of Wagah Border retreat, Amritsar', queries: ['Harmandir Sahib Amritsar', 'Golden Temple Amritsar', 'Wagah Border ceremony', 'Jallianwala Bagh Amritsar'] },
    { slug: 'barnala', location: 'Historical Sikh heritage gurdwara of Sekha and ancient Baba Kala Mehar shrine in Barnala', queries: ['Barnala Punjab', 'Gurdwara Sekha Barnala', 'Barnala Gurdwara', 'Punjab countryside Barnala'] },
    { slug: 'bathinda', location: 'Ancient 6th-century brick ramparts of Qila Mubarak where Razia Sultana was held, Bathinda', queries: ['Qila Mubarak Bathinda', 'Bathinda Fort', 'Takht Sri Damdama Sahib Talwandi Sabo', 'Bathinda lake Punjab'] },
    { slug: 'faridkot', location: 'Grand Indo-Saracenic royal architecture of Raj Mahal and Qila Mubarak in Faridkot', queries: ['Qila Mubarak Faridkot', 'Raj Mahal Faridkot', 'Tilla Baba Farid', 'Faridkot Punjab'] },
    { slug: 'fatehgarh-sahib', location: 'Sacred towering marble complex of Gurdwara Fatehgarh Sahib and Mughal ruins of Aam Khas Bagh', queries: ['Gurdwara Fatehgarh Sahib', 'Aam Khas Bagh Sirhind', 'Fatehgarh Sahib Punjab', 'Sanghol stupa'] },
    { slug: 'fazilka', location: 'Patriotic retreat ceremony at Sadqi Border and historic Asafwala War Memorial in Fazilka', queries: ['Sadqi Border Fazilka', 'Asafwala War Memorial', 'Fazilka Punjab', 'Fazilka border'] },
    { slug: 'ferozepur', location: 'National Martyrs Memorial honoring Bhagat Singh, Rajguru, and Sukhdev at Hussainiwala, Ferozepur', queries: ['Hussainiwala National Martyrs Memorial', 'Saragarhi Memorial Gurdwara', 'Ferozepur Punjab', 'Hussainiwala border'] },
    { slug: 'gurdaspur', location: 'Sacred Gurdwara Dera Baba Nanak near the international border and Kartarpur Corridor, Gurdaspur', queries: ['Dera Baba Nanak Gurdwara', 'Gurdas Nangal Gurdaspur', 'Gurdaspur Punjab', 'Kartarpur Corridor border'] },
    { slug: 'hoshiarpur', location: 'Wooded wildlife sanctuary trails of Takhni-Rehmapur and citrus groves of scenic Hoshiarpur', queries: ['Takhni-Rehmapur Wildlife Sanctuary', 'Dholbaha Hoshiarpur', 'Hoshiarpur Punjab', 'Kamahi Devi Hoshiarpur'] },
    { slug: 'jalandhar', location: 'Historic sacred sarovar of Devi Talab Mandir and science learning domes of Science City, Jalandhar', queries: ['Devi Talab Mandir Jalandhar', 'Wonderland Jalandhar', 'St Mary Cathedral Jalandhar', 'Jalandhar Punjab'] },
    { slug: 'kapurthala', location: 'French Versailles-inspired Jagatjit Palace and unique Moorish Mosque in the City of Palaces, Kapurthala', queries: ['Jagatjit Palace Kapurthala', 'Moorish Mosque Kapurthala', 'Kanjli Wetland Kapurthala', 'Shalimar Garden Kapurthala'] },
    { slug: 'ludhiana', location: 'Historic red-brick Clock Tower and heritage ramparts of Lodhi Fort in Ludhiana', queries: ['Clock Tower Ludhiana', 'Lodhi Fort Ludhiana', 'Maharaja Ranjit Singh War Museum', 'Gurdwara Manji Sahib Alamgir'] },
    { slug: 'malerkotla', location: 'Royal courtly facade of Mubarak Manzil Palace and historic Dargah Hazrat Sheikh in Malerkotla', queries: ['Mubarak Manzil Palace Malerkotla', 'Malerkotla Punjab', 'Jamia Masjid Malerkotla', 'Malerkotla palace'] },
    { slug: 'mansa', location: 'Historic Sikh heritage shrine of Gurdwara Bhai Behlo and archaeological sites of Mansa', queries: ['Mansa Punjab', 'Budhlada Mansa', 'Gurdwara Mansa Punjab', 'Sardulgarh Fort'] },
    { slug: 'moga', location: 'Gleaming white domed complex of Gurdwara Nanaksar Kaleran and sacred sarovar in Moga', queries: ['Gurdwara Nanaksar Kaleran Moga', 'Geeta Bhawan Moga', 'Moga Punjab', 'Nanaksar Moga'] },
    { slug: 'pathankot', location: 'Spectacular reservoir vistas of Ranjit Sagar Dam and historic 16th-century Shahpurkandi Fort, Pathankot', queries: ['Ranjit Sagar Dam Pathankot', 'Shahpurkandi Fort Pathankot', 'Mukteshwar Mahadev Pathankot', 'Pathankot Punjab'] },
    { slug: 'patiala', location: 'Monumental royal citadel of Qila Mubarak and palace reflections at Sheesh Mahal, Patiala', queries: ['Qila Mubarak Patiala', 'Sheesh Mahal Patiala', 'Bahadurgarh Fort Patiala', 'Baradari Garden Patiala'] },
    { slug: 'rupnagar', location: 'Ancient Indus Valley Harappan archaeological excavation site and pristine riverside of Rupnagar (Ropar)', queries: ['Ropar Archaeological Museum', 'Rupnagar Punjab', 'Bhakra Nangal Dam border', 'Ropar wetland'] },
    { slug: 'sahibzada-ajit-singh-nagar', location: 'Towering victory monument of Fateh Burj at Chappar Chiri and Gurdwara Amb Sahib, Mohali', queries: ['Fateh Burj Chappar Chiri', 'Gurdwara Amb Sahib Mohali', 'Mohali Punjab', 'Chappar Chiri Mohali'] },
    { slug: 'sangrur', location: 'Royal marble pavilion of Banasar Bagh and heritage monuments of the princely state of Sangrur', queries: ['Banasar Bagh Sangrur', 'Sangrur Punjab', 'Gurdwara Nankiana Sahib Sangrur', 'Sangrur heritage'] },
    { slug: 'shahid-bhagat-singh-nagar', location: 'Memorial museum and preserved ancestral home of legendary martyr Shaheed Bhagat Singh at Khatkar Kalan', queries: ['Khatkar Kalan Bhagat Singh', 'Shaheed Bhagat Singh Museum', 'Nawanshahr Punjab', 'Khatkar Kalan Punjab'] },
    { slug: 'sri-muktsar-sahib', location: 'Sacred historic shrine of Gurdwara Sri Darbar Sahib (Tuti Gandi) commemorating the Forty Martyrs in Muktsar', queries: ['Gurdwara Darbar Sahib Muktsar', 'Sri Muktsar Sahib', 'Muktsar Sarovar', 'Muktsar Punjab'] },
    { slug: 'tarn-taran', location: 'Magnificent golden shrine of Gurdwara Sri Tarn Taran Sahib featuring the world’s largest holy sarovar pool', queries: ['Gurdwara Tarn Taran Sahib', 'Tarn Taran Sarovar', 'Harike Pattan Wetland', 'Tarn Taran Punjab'] }
  ]
};

const RAJASTHAN_CONFIG = {
  name: 'Rajasthan',
  slug: 'rajasthan',
  heroDesc: 'Iconic honeycomb facade of pink-painted sandstone windows at Hawa Mahal (Palace of Winds), Jaipur, Rajasthan',
  heroQueries: ['Hawa Mahal Jaipur Rajasthan', 'Amber Fort Jaipur Rajasthan', 'Kumbhalgarh Fort wall Rajasthan'],
  cardDesc: 'Colossal hill fortress of Mehrangarh Fort towering above the blue city of Jodhpur, Rajasthan',
  cardQueries: ['Mehrangarh Fort Jodhpur', 'Lake Palace Udaipur Rajasthan', 'Jaisalmer Fort sand dunes', 'Chittorgarh Fort'],
  districts: [
    { slug: 'ajmer', location: 'Scenic waters of Ana Sagar Lake and venerable Mughal pavilion terraces in Ajmer', queries: ['Ana Sagar Lake Ajmer', 'Ajmer Sharif Dargah', 'Adhai Din Ka Jhonpra Ajmer', 'Taragarh Fort Ajmer'] },
    { slug: 'alwar', location: 'Mighty hill battlements of Bala Qila and royal marble cenotaph of Moosi Maharani ki Chhatri in Alwar', queries: ['Moosi Maharani ki Chhatri Alwar', 'Bala Qila Alwar', 'Sariska Tiger Reserve Alwar', 'Siliserh Lake Alwar'] },
    { slug: 'balotra', location: 'Ancient Jain pilgrimage shrine of Nakoda Ji and rugged heights of Siwana Fort in Balotra', queries: ['Nakoda Ji Balotra', 'Nakoda Jain Temple', 'Siwana Fort Balotra', 'Balotra Rajasthan'] },
    { slug: 'banswara', location: 'Breathtaking reservoir islands of Mahi Bajaj Sagar Dam in the City of a Hundred Islands, Banswara', queries: ['Mahi Bajaj Sagar Dam Banswara', 'Tripura Sundari Temple Banswara', 'Banswara Rajasthan', 'Kagdi Pick Up Banswara'] },
    { slug: 'baran', location: 'Ancient 10th-century temples of Bhand Devara inside Ramgarh Meteor Crater and Shergarh Fort, Baran', queries: ['Bhand Devara Ramgarh Baran', 'Shergarh Fort Baran', 'Shahabad Fort Baran', 'Baran Rajasthan'] },
    { slug: 'barmer', location: 'Exquisitely sculpted 11th-century Solanki architecture of Kiradu Temples and Thar Desert dunes of Barmer', queries: ['Kiradu Temples Barmer', 'Barmer Fort Rajasthan', 'Mahabar Sand Dunes Barmer', 'Barmer Rajasthan'] },
    { slug: 'beawar', location: 'Historic sandstone gateway of Chang Gate and rugged panoramic heights of Badnor Fort, Beawar', queries: ['Badnor Fort Beawar', 'Chang Gate Beawar', 'Beawar Rajasthan', 'Beawar heritage'] },
    { slug: 'bharatpur', location: 'UNESCO World Heritage wetlands of Keoladeo National Park (Bharatpur Bird Sanctuary) and Lohagarh Fort', queries: ['Keoladeo National Park Bharatpur', 'Bharatpur Bird Sanctuary', 'Lohagarh Fort Bharatpur', 'Deeg Palace Bharatpur'] },
    { slug: 'bhilwara', location: 'Spectacular monsoonal canyon plunge of Menal Waterfall and ancient Mahanaleshvara Shiva Temple, Bhilwara', queries: ['Menal Waterfall Bhilwara', 'Menal Shiva Temple', 'Badnore Fort Bhilwara', 'Bhilwara Rajasthan'] },
    { slug: 'bikaner', location: 'Impregnable sandstone palaces and painted courtyards of Junagarh Fort, Bikaner', queries: ['Junagarh Fort Bikaner', 'Karni Mata Temple Deshnoke', 'Lalgarh Palace Bikaner', 'Bikaner Rajasthan'] },
    { slug: 'bundi', location: 'Intricately carved subterranean architecture of Raniji ki Baori stepwell and Taragarh Fort in Bundi', queries: ['Raniji ki Baori Bundi', 'Taragarh Fort Bundi', 'Bundi Palace Rajasthan', 'Sukh Mahal Bundi'] },
    { slug: 'chittorgarh', location: 'Tower of Victory (Vijay Stambha) towering over the legendary UNESCO World Heritage Chittorgarh Fort', queries: ['Vijay Stambha Chittorgarh', 'Chittorgarh Fort Rajasthan', 'Kirti Stambha Chittorgarh', 'Padmini Palace Chittorgarh'] },
    { slug: 'churu', location: 'Vast grasslands of Tal Chhapar Blackbuck Sanctuary and frescoed havelis of Shekhawati, Churu', queries: ['Tal Chhapar Sanctuary Churu', 'Salasar Balaji Temple Churu', 'Churu haveli Rajasthan', 'Churu Rajasthan'] },
    { slug: 'dausa', location: 'Stunning geometric labyrinth of 3,500 steps at ancient 8th-century Chand Baori in Abhaneri, Dausa', queries: ['Chand Baori Abhaneri Dausa', 'Abhaneri stepwell', 'Harshat Mata Temple Abhaneri', 'Dausa Rajasthan'] },
    { slug: 'deeg', location: 'Majestic Mughal-Rajput fountains and ornate summer pleasure palaces of Deeg Jal Mahal', queries: ['Deeg Jal Mahal Rajasthan', 'Deeg Palace Bharatpur', 'Deeg Fort Rajasthan', 'Deeg fountains'] },
    { slug: 'dholpur', location: 'Sacred lotus-shaped volcanic water tank of Machkund and Mughal lake pavilion at Talab-e-Shahi, Dholpur', queries: ['Machkund Dholpur', 'Talab-e-Shahi Dholpur', 'Nihal Tower Dholpur', 'Dholpur Palace'] },
    { slug: 'didwana-kuchaman', location: 'Towering cliff fortress of Kuchaman Fort and historic salt lake horizons of Didwana', queries: ['Kuchaman Fort Rajasthan', 'Didwana Salt Lake', 'Kuchaman City', 'Didwana Rajasthan'] },
    { slug: 'dungarpur', location: 'Ornate mirrored glasswork of Juna Mahal and picturesque palace reflections across Gaib Sagar Lake, Dungarpur', queries: ['Juna Mahal Dungarpur', 'Udai Bilas Palace Dungarpur', 'Gaib Sagar Lake Dungarpur', 'Deo Somnath Temple'] },
    { slug: 'ganganagar', location: 'Historic border outpost of Hindumalkot and lush canal-irrigated farmland oasis of Sri Ganganagar', queries: ['Hindumalkot Border Ganganagar', 'Sri Ganganagar Rajasthan', 'Anupgarh Fort Ganganagar', 'Ganganagar canal'] },
    { slug: 'hanumangarh', location: 'Massive 1,700-year-old burnt brick ramparts of Bhatner Fort overlooking Ghaggar river in Hanumangarh', queries: ['Bhatner Fort Hanumangarh', 'Kalibangan excavation', 'Hanumangarh Rajasthan', 'Bhatner Fort'] },
    { slug: 'jaipur', location: 'Grand Rajput-Mughal battlements of Amer Fort and iconic honeycomb jharokha screens of Hawa Mahal, Jaipur', queries: ['Amer Fort Jaipur', 'Hawa Mahal Jaipur', 'Jal Mahal Jaipur', 'City Palace Jaipur'] },
    { slug: 'jaisalmer', location: 'Living golden sandstone citadel of Jaisalmer Fort (Sonar Qila) rising above Thar Desert sand dunes', queries: ['Jaisalmer Fort Rajasthan', 'Sam Sand Dunes Jaisalmer', 'Patwon ki Haveli Jaisalmer', 'Gadisar Lake Jaisalmer'] },
    { slug: 'jalore', location: 'Imposing mountain fortress of Jalore Fort and historic Topkhana pavilion architecture in Jalore', queries: ['Jalore Fort Rajasthan', 'Sundha Mata Temple Jalore', 'Jalore Rajasthan', 'Topkhana Jalore'] },
    { slug: 'jhalawar', location: 'UNESCO World Heritage water fortress of Gagron Fort surrounded on three sides by Ahu and Mukundara rivers', queries: ['Gagron Fort Jhalawar', 'Kolvi Caves Jhalawar', 'Jhalawar Fort Palace', 'Sun Temple Jhalrapatan'] },
    { slug: 'jhunjhunu', location: 'World-renowned painted Shekhawati frescoes of Mandawa havelis and sacred temple of Rani Sati, Jhunjhunu', queries: ['Mandawa Haveli Jhunjhunu', 'Rani Sati Temple Jhunjhunu', 'Nawalgarh Haveli', 'Shekhawati fresco Jhunjhunu'] },
    { slug: 'jodhpur', location: 'Towering desert citadel of Mehrangarh Fort and white marble royal cenotaph of Jaswant Thada, Jodhpur', queries: ['Mehrangarh Fort Jodhpur', 'Jaswant Thada Jodhpur', 'Umaid Bhawan Palace Jodhpur', 'Mandore Gardens Jodhpur'] },
    { slug: 'karauli', location: 'Revered Shakti shrine of Kaila Devi Temple and intricately carved red sandstone City Palace of Karauli', queries: ['Kaila Devi Temple Karauli', 'Karauli City Palace', 'Madan Mohan Temple Karauli', 'Timangarh Fort'] },
    { slug: 'khairthal-tijara', location: 'Majestic heritage battlements of 19th-century Tijara Fort Palace and sacred Chandraprabhu Jain Temple', queries: ['Tijara Fort Palace', 'Tijara Jain Temple', 'Khairthal Tijara', 'Tijara Rajasthan'] },
    { slug: 'kota', location: 'Grand riverside architectural marvel of Chambal Riverfront and illuminated island palace of Jagmandir, Kota', queries: ['Kota Chambal Riverfront', 'Seven Wonders Park Kota', 'Jagmandir Palace Kota', 'Garh Palace Kota'] },
    { slug: 'kotputli-behror', location: 'Spectacular 15th-century tiered hill fortress of Neemrana Fort Palace in Kotputli-Behror', queries: ['Neemrana Fort Palace', 'Neemrana Rajasthan', 'Kotputli Rajasthan', 'Neemrana stepwell'] },
    { slug: 'nagaur', location: 'UNESCO Award-winning restored palace courtyards and fountains of Nagaur Fort (Ahichhatragarh)', queries: ['Nagaur Fort Rajasthan', 'Ahichhatragarh Fort Nagaur', 'Nagaur Cattle Fair', 'Khinvsar Fort Nagaur'] },
    { slug: 'pali', location: 'World-famous 1,444 uniquely carved marble pillars of 15th-century Ranakpur Jain Temple, Pali', queries: ['Ranakpur Jain Temple Pali', 'Ranakpur Temple Rajasthan', 'Jawai Dam Pali', 'Om Banna Pali'] },
    { slug: 'phalodi', location: 'Global winter bird sanctuary for thousands of migratory Demoiselle cranes at Khichan, Phalodi', queries: ['Khichan Bird Sanctuary', 'Khichan Cranes Phalodi', 'Phalodi Fort Rajasthan', 'Phalodi salt'] },
    { slug: 'pratapgarh', location: 'Dense teak forest biodiversity of Sita Mata Wildlife Sanctuary and soaring Jakham Dam in Pratapgarh', queries: ['Sita Mata Wildlife Sanctuary', 'Jakham Dam Pratapgarh', 'Pratapgarh Rajasthan', 'Devgarh Fort Pratapgarh'] },
    { slug: 'rajsamand', location: 'Legendary 36-kilometer continuous wall of Kumbhalgarh Fort and tranquil marble ghats of Rajsamand Lake', queries: ['Kumbhalgarh Fort Rajasthan', 'Rajsamand Lake Rajasthan', 'Nathdwara Temple Rajsamand', 'Kumbhalgarh wall'] },
    { slug: 'salumbar', location: 'Vast island-dotted blue expanse of Jaisamand Lake (Dhebar Lake) and royal Hawa Mahal pavilion in Salumbar', queries: ['Jaisamand Lake Rajasthan', 'Dhebar Lake Salumbar', 'Hawa Mahal Salumbar', 'Salumbar Rajasthan'] },
    { slug: 'sawai-madhopur', location: 'Ancient hill citadel of Ranthambore Fort overlooking tiger wetlands of Ranthambore National Park', queries: ['Ranthambore Fort Rajasthan', 'Ranthambore Tiger Reserve', 'Trinetra Ganesh Ranthambore', 'Sawai Madhopur Rajasthan'] },
    { slug: 'sikar', location: 'Ancient 10th-century Chauhan shrine of Harshnath Temple atop Harsh Hills and Khatu Shyam Temple, Sikar', queries: ['Harshnath Temple Sikar', 'Khatu Shyamji Temple Sikar', 'Laxmangarh Fort Sikar', 'Fatehpur Haveli Sikar'] },
    { slug: 'sirohi', location: 'Unsurpassed marble filigree carvings of Dilwara Temples and highest peak of Aravalli at Guru Shikhar, Mount Abu', queries: ['Dilwara Temples Mount Abu', 'Nakki Lake Mount Abu', 'Guru Shikhar Mount Abu', 'Sirohi Rajasthan'] },
    { slug: 'tonk', location: 'Gilded stained-glass and mirror palace hall of Sunehri Kothi and scenic waters of Bisalpur Dam in Tonk', queries: ['Sunehri Kothi Tonk', 'Bisalpur Dam Tonk', 'Rasiya ke Tekri Tonk', 'Tonk Rajasthan'] },
    { slug: 'udaipur', location: 'Floating white marble grandeur of Lake Palace (Jag Niwas) amidst shimmering waters of Lake Pichola, Udaipur', queries: ['Lake Palace Udaipur', 'City Palace Udaipur', 'Lake Pichola Udaipur', 'Jag Mandir Udaipur'] }
  ]
};

async function run() {
  const odisha = await curateState(ODISHA_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedOdishaDataset.json', JSON.stringify(odisha, null, 2));
  console.log('Saved verifiedOdishaDataset.json');

  const punjab = await curateState(PUNJAB_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedPunjabDataset.json', JSON.stringify(punjab, null, 2));
  console.log('Saved verifiedPunjabDataset.json');

  const rajasthan = await curateState(RAJASTHAN_CONFIG);
  fs.writeFileSync('backend/src/services/images/verifiedRajasthanDataset.json', JSON.stringify(rajasthan, null, 2));
  console.log('Saved verifiedRajasthanDataset.json');

  console.log('\n=== BATCH 2 (ODISHA, PUNJAB, RAJASTHAN) COMPLETED ===');
}

run().catch(console.error);
