/**
 * Single source of truth for verified, distinct images for all 28 States and 8 Union Territories.
 * Every destination features a geographically accurate, verified landmark photograph served locally.
 * Zero duplicate images across regions. Zero third-party network failure points.
 */

export const STATE_IMAGES = {
  // 28 Indian States
  'andhra-pradesh': '/images/states/andhra-pradesh.jpg',
  'arunachal-pradesh': '/images/states/arunachal-pradesh.jpg',
  'assam': '/images/states/assam.jpg',
  'bihar': '/images/states/bihar.jpg',
  'chhattisgarh': '/images/states/chhattisgarh.jpg',
  'goa': '/images/states/goa.jpg',
  'gujarat': '/images/states/gujarat.jpg',
  'haryana': '/images/states/haryana.jpg',
  'himachal-pradesh': '/images/states/himachal-pradesh.jpg',
  'jharkhand': '/images/states/jharkhand.jpg',
  'karnataka': '/images/states/karnataka.jpg',
  'kerala': '/images/states/kerala.jpg',
  'madhya-pradesh': '/images/states/madhya-pradesh.jpg',
  'maharashtra': '/images/states/maharashtra.jpg',
  'manipur': '/images/states/manipur.jpg',
  'meghalaya': '/images/states/meghalaya.jpg',
  'mizoram': '/images/states/mizoram.jpg',
  'nagaland': '/images/states/nagaland.jpg',
  'odisha': '/images/states/odisha.jpg',
  'punjab': '/images/states/punjab.jpg',
  'rajasthan': '/images/states/rajasthan.jpg',
  'sikkim': '/images/states/sikkim.jpg',
  'tamil-nadu': '/images/states/tamil-nadu.jpg',
  'telangana': '/images/states/telangana.jpg',
  'tripura': '/images/states/tripura.jpg',
  'uttar-pradesh': '/images/states/uttar-pradesh.jpg',
  'uttarakhand': '/images/states/uttarakhand.jpg',
  'west-bengal': '/images/states/west-bengal.jpg',

  // 8 Union Territories
  'andaman-and-nicobar-islands': '/images/union-territories/andaman-and-nicobar-islands.jpg',
  'chandigarh': '/images/union-territories/chandigarh.jpg',
  'dadra-and-nagar-haveli-and-daman-and-diu': '/images/union-territories/dadra-and-nagar-haveli-and-daman-and-diu.jpg',
  'delhi': '/images/union-territories/delhi.jpg',
  'jammu-and-kashmir': '/images/union-territories/jammu-and-kashmir.jpg',
  'ladakh': '/images/union-territories/ladakh.jpg',
  'lakshadweep': '/images/union-territories/lakshadweep.jpg',
  'puducherry': '/images/union-territories/puducherry.jpg'
};

/**
 * Get verified image for any State or Union Territory by slug or name.
 */
export function getStateImage(slugOrName) {
  if (!slugOrName) return null;
  const key = slugOrName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-');
  return STATE_IMAGES[key] || null;
}

export default STATE_IMAGES;
