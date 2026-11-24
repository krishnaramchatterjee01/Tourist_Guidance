/**
 * EXPLORE INDIA - Search Database & Directory Routing Maps
 */

export const searchDatabase = [
  // All 28 Indian States
  { name: 'Andhra Pradesh', type: 'State', state: 'Southern India • 28 Districts', url: '/state/andhra-pradesh' },
  { name: 'Arunachal Pradesh', type: 'State', state: 'Northeastern India • 27 Districts', url: '/state/arunachal-pradesh' },
  { name: 'Assam', type: 'State', state: 'Northeastern India • 35 Districts', url: '/state/assam' },
  { name: 'Bihar', type: 'State', state: 'Eastern India • 38 Districts', url: '/state/bihar' },
  { name: 'Chhattisgarh', type: 'State', state: 'Central India • 33 Districts', url: '/state/chhattisgarh' },
  { name: 'Goa', type: 'State', state: 'Western Coast • 3 Districts', url: '/state/goa' },
  { name: 'Gujarat', type: 'State', state: 'Western India • 34 Districts', url: '/state/gujarat' },
  { name: 'Haryana', type: 'State', state: 'Northern India • 23 Districts', url: '/state/haryana' },
  { name: 'Himachal Pradesh', type: 'State', state: 'Northern India • 12 Districts', url: '/state/himachal-pradesh' },
  { name: 'Jharkhand', type: 'State', state: 'Eastern India • 24 Districts', url: '/state/jharkhand' },
  { name: 'Karnataka', type: 'State', state: 'Southern India • 31 Districts', url: '/state/karnataka' },
  { name: 'Kerala', type: 'State', state: 'Southern India • 14 Districts', url: '/state/kerala' },
  { name: 'Madhya Pradesh', type: 'State', state: 'Central India • 55 Districts', url: '/state/madhya-pradesh' },
  { name: 'Maharashtra', type: 'State', state: 'Western India • 36 Districts', url: '/state/maharashtra' },
  { name: 'Manipur', type: 'State', state: 'Northeastern India • 16 Districts', url: '/state/manipur' },
  { name: 'Meghalaya', type: 'State', state: 'Northeastern India • 12 Districts', url: '/state/meghalaya' },
  { name: 'Mizoram', type: 'State', state: 'Northeastern India • 11 Districts', url: '/state/mizoram' },
  { name: 'Nagaland', type: 'State', state: 'Northeastern India • 17 Districts', url: '/state/nagaland' },
  { name: 'Odisha', type: 'State', state: 'Eastern India • 30 Districts', url: '/state/odisha' },
  { name: 'Punjab', type: 'State', state: 'Northern India • 23 Districts', url: '/state/punjab' },
  { name: 'Rajasthan', type: 'State', state: 'Northern India • 41 Districts', url: '/state/rajasthan' },
  { name: 'Sikkim', type: 'State', state: 'Northeastern India • 6 Districts', url: '/state/sikkim' },
  { name: 'Tamil Nadu', type: 'State', state: 'Southern India • 38 Districts', url: '/state/tamil-nadu' },
  { name: 'Telangana', type: 'State', state: 'Southern India • 33 Districts', url: '/state/telangana' },
  { name: 'Tripura', type: 'State', state: 'Northeastern India • 8 Districts', url: '/state/tripura' },
  { name: 'Uttar Pradesh', type: 'State', state: 'Northern India • 75 Districts', url: '/state/uttar-pradesh' },
  { name: 'Uttarakhand', type: 'State', state: 'Northern India • 13 Districts', url: '/state/uttarakhand' },
  { name: 'West Bengal', type: 'State', state: 'Eastern India • 23 Districts', url: '/state/west-bengal' },

  // 8 Union Territories
  { name: 'Andaman & Nicobar', type: 'Union Territory', state: 'Bay of Bengal Islands', url: '/coming-soon?title=Andaman%20and%20Nicobar%20Islands' },
  { name: 'Chandigarh', type: 'Union Territory', state: 'The City Beautiful', url: '/coming-soon?title=Chandigarh' },
  { name: 'Dadra & Nagar Haveli and Daman & Diu', type: 'Union Territory', state: 'Western Coast', url: '/coming-soon?title=Dadra%20and%20Nagar%20Haveli%20and%20Daman%20and%20Diu' },
  { name: 'Delhi', type: 'Union Territory', state: 'National Capital Territory', url: '/coming-soon?title=Delhi%20(National%20Capital%20Territory)' },
  { name: 'Jammu & Kashmir', type: 'Union Territory', state: 'Paradise on Earth', url: '/coming-soon?title=Jammu%20and%20Kashmir' },
  { name: 'Ladakh', type: 'Union Territory', state: 'Land of High Passes', url: '/coming-soon?title=Ladakh' },
  { name: 'Lakshadweep', type: 'Union Territory', state: 'Arabian Sea Coral Atolls', url: '/coming-soon?title=Lakshadweep' },
  { name: 'Puducherry', type: 'Union Territory', state: 'French Riviera of the East', url: '/coming-soon?title=Puducherry' },

  // Iconic Tourist Destinations & Districts
  { name: 'Taj Mahal', type: 'Tourist Wonder', state: 'Agra, Uttar Pradesh', url: '/top-places' },
  { name: 'Golden Temple', type: 'Tourist Wonder', state: 'Amritsar, Punjab', url: '/top-places' },
  { name: 'India Gate', type: 'Tourist Wonder', state: 'New Delhi', url: '/top-places' },
  { name: 'Hawa Mahal', type: 'Tourist Wonder', state: 'Jaipur, Rajasthan', url: '/top-places' },
  { name: 'Dal Lake', type: 'Tourist Wonder', state: 'Srinagar, Jammu & Kashmir', url: '/top-places' },
  { name: 'Victoria Memorial', type: 'Tourist Wonder', state: 'Kolkata, West Bengal', url: '/district/kolkata?state=west-bengal' },
  { name: 'Udaipur', type: 'Destination', state: 'City of Lakes, Rajasthan', url: '/explore' },
  { name: 'Rishikesh', type: 'Destination', state: 'Ganges Valley, Uttarakhand', url: '/explore' },
  { name: 'Hampi', type: 'Destination', state: 'UNESCO Ruins, Karnataka', url: '/explore' },
  { name: 'Munnar', type: 'Destination', state: 'Tea Gardens, Kerala', url: '/explore' },
  { name: 'Darjeeling', type: 'District', state: 'Tea Hills, West Bengal', url: '/district/darjeeling?state=west-bengal' },
  { name: 'Manali', type: 'Destination', state: 'Snow Peaks, Himachal', url: '/explore' },
  { name: 'Varanasi', type: 'Destination', state: 'Sacred Ganges Ghats, UP', url: '/top-places' },
  { name: 'Tirupati', type: 'District', state: 'Seven Hills, Andhra Pradesh', url: '/district/tirupati?state=andhra-pradesh' },
  { name: 'Visakhapatnam', type: 'District', state: 'Jewel of the East Coast, Andhra Pradesh', url: '/district/visakhapatnam?state=andhra-pradesh' },
  { name: 'Gandikota', type: 'Tourist Wonder', state: 'Grand Canyon of India, Andhra Pradesh', url: '/district/ysr-kadapa?state=andhra-pradesh' },
  { name: 'Araku Valley', type: 'Destination', state: 'Eastern Ghats, Andhra Pradesh', url: '/district/alluri-sitharama-raju?state=andhra-pradesh' },
  { name: 'Srisailam', type: 'Tourist Wonder', state: 'Jyotirlinga, Andhra Pradesh', url: '/district/nandyal?state=andhra-pradesh' },
  { name: 'Lepakshi', type: 'Tourist Wonder', state: 'Vijayanagara Heritage, Andhra Pradesh', url: '/district/ananthapuramu?state=andhra-pradesh' },
  { name: 'Vijayawada', type: 'District', state: 'Kanaka Durga, Andhra Pradesh', url: '/district/ntr?state=andhra-pradesh' },

  // Popular PIN Codes
  { name: '110001', type: 'PIN Code', state: 'Connaught Place, New Delhi', url: '/coming-soon?title=PIN%20110001' },
  { name: '700001', type: 'PIN Code', state: 'BBD Bagh, Kolkata, West Bengal', url: '/state/west-bengal' },
  { name: '302001', type: 'PIN Code', state: 'Jaipur GPO, Rajasthan', url: '/coming-soon?title=Jaipur' },
  { name: '400001', type: 'PIN Code', state: 'Fort, Mumbai, Maharashtra', url: '/coming-soon?title=Mumbai' },
  { name: '682001', type: 'PIN Code', state: 'Kochi HPO, Kerala', url: '/coming-soon?title=Kochi' }
];

export const STATE_DIRECTORY_MAP = {
  'west bengal': '/state/west-bengal',
  'westbengal': '/state/west-bengal',
  'wb': '/state/west-bengal',
  'bengal': '/state/west-bengal',
  'andhra pradesh': '/state/andhra-pradesh',
  'andhra': '/state/andhra-pradesh',
  'ap': '/state/andhra-pradesh',
  'arunachal pradesh': '/state/arunachal-pradesh',
  'arunachal': '/state/arunachal-pradesh',
  'assam': '/state/assam',
  'bihar': '/state/bihar',
  'chhattisgarh': '/state/chhattisgarh',
  'goa': '/state/goa',
  'gujarat': '/state/gujarat',
  'haryana': '/state/haryana',
  'himachal pradesh': '/state/himachal-pradesh',
  'himachal': '/state/himachal-pradesh',
  'hp': '/state/himachal-pradesh',
  'jharkhand': '/state/jharkhand',
  'karnataka': '/state/karnataka',
  'kerala': '/state/kerala',
  'madhya pradesh': '/state/madhya-pradesh',
  'mp': '/state/madhya-pradesh',
  'maharashtra': '/state/maharashtra',
  'mh': '/state/maharashtra',
  'manipur': '/state/manipur',
  'meghalaya': '/state/meghalaya',
  'mizoram': '/state/mizoram',
  'nagaland': '/state/nagaland',
  'odisha': '/state/odisha',
  'orissa': '/state/odisha',
  'punjab': '/state/punjab',
  'rajasthan': '/state/rajasthan',
  'rj': '/state/rajasthan',
  'sikkim': '/state/sikkim',
  'tamil nadu': '/state/tamil-nadu',
  'tn': '/state/tamil-nadu',
  'tamilnadu': '/state/tamil-nadu',
  'telangana': '/state/telangana',
  'tripura': '/state/tripura',
  'uttar pradesh': '/state/uttar-pradesh',
  'up': '/state/uttar-pradesh',
  'uttarpradesh': '/state/uttar-pradesh',
  'uttarakhand': '/state/uttarakhand',
  'uk': '/state/uttarakhand'
};

export function getStateDirectoryUrl(val) {
  if (!val) return null;
  const clean = val.trim().toLowerCase().replace(/_/g, '-');
  if (STATE_DIRECTORY_MAP[clean]) return STATE_DIRECTORY_MAP[clean];
  const slugKey = clean.replace(/\s+/g, '-');
  if (STATE_DIRECTORY_MAP[slugKey]) return STATE_DIRECTORY_MAP[slugKey];
  return null;
}

export function isDarjeelingQuery(val) {
  if (!val) return false;
  const clean = val.trim().toLowerCase();
  return clean === 'darjeeling' || clean === 'darjeeling district';
}
