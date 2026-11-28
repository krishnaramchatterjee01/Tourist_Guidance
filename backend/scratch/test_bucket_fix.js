const testUrls = [
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Gandikota_Fort_Cuddapah_Andhra_Pradesh_PIC_0156.JPG/1200px-Gandikota_Fort_Cuddapah_Andhra_Pradesh_PIC_0156.JPG',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Mahabodhi_temple_complex%2C_Bodhgaya_23.jpg/1200px-Mahabodhi_temple_complex%2C_Bodhgaya_23.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Chitrakut_waterfalls.jpg/1200px-Chitrakut_waterfalls.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Steps_in_Key_Gompa_monastery%2C_Spiti_Valley%2C_Himachal_Pradesh%2C_India.jpg/1200px-Steps_in_Key_Gompa_monastery%2C_Spiti_Valley%2C_Himachal_Pradesh%2C_India.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Hundru_Falls%2C_Jharkhand%2C_India_9.jpg/1200px-Hundru_Falls%2C_Jharkhand%2C_India_9.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/15th-16th_century_Vaishnavism_Hindu_temple_complex_architecture_Hampi_Karnataka_India_2.jpg/1200px-15th-16th_century_Vaishnavism_Hindu_temple_complex_architecture_Hampi_Karnataka_India_2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Make_Way_For_The_Houseboats_-_Alappuzha_-_Kerala.jpg/1200px-Make_Way_For_The_Houseboats_-_Alappuzha_-_Kerala.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Kandariya_Mahadeva_Temple_-_Khajuraho.jpg/1200px-Kandariya_Mahadeva_Temple_-_Khajuraho.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Ellora_caves_-_Kailasa_temple_overview.jpg/1200px-Ellora_caves_-_Kailasa_temple_overview.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Amber_Fort_Jaipur_india.jpg/1200px-Amber_Fort_Jaipur_india.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Tsomgo_Lake%2C_Sikkim.jpg/1200px-Tsomgo_Lake%2C_Sikkim.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Meenakshi_Temple_%286355447710%29.jpg/1200px-Meenakshi_Temple_%286355447710%29.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Charminar%2C_Hyderabad_%28India%29.jpg/1200px-Charminar%2C_Hyderabad_%28India%29.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Taj_Mahal_-Agra_-Uttar_Pradesh_-India.jpg/1200px-Taj_Mahal_-Agra_-Uttar_Pradesh_-India.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/The_Victoria_Memorial_Hall_Kolkata_West_Bengal_India.jpg/1200px-The_Victoria_Memorial_Hall_Kolkata_West_Bengal_India.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Chandigarh_Rock_Garden_4.jpg/1200px-Chandigarh_Rock_Garden_4.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/India_Gate%2C_New_Delhi%2C_India%2C_IMG-20180913.jpg/1200px-India_Gate%2C_New_Delhi%2C_India%2C_IMG-20180913.jpg'
];

async function testAll() {
  console.log('Testing replacement with 1280px and 960px:');
  for (const u of testUrls) {
    const u1280 = u.replace(/\/1200px-/g, '/1280px-');
    const u960 = u.replace(/\/1200px-/g, '/960px-');

    let r = await fetch(u1280, { headers: { 'User-Agent': 'Mozilla/5.0 ExploreIndia/2.0' } });
    let used = '1280px';
    if (!r.ok) {
      r = await fetch(u960, { headers: { 'User-Agent': 'Mozilla/5.0 ExploreIndia/2.0' } });
      used = '960px';
    }

    const filename = u.split('/').pop().replace('1200px-', '');
    console.log(`${r.status === 200 ? '✓ 200' : '❌ ' + r.status} (${used}) -> ${filename}`);
  }
}

testAll();
