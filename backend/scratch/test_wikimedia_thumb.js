const test1 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/The_Victoria_Memorial_Hall%2C_Kolkata.jpg/960px-The_Victoria_Memorial_Hall%2C_Kolkata.jpg';
const test2 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/The_Victoria_Memorial_Hall%2C_Kolkata.jpg/1200px-The_Victoria_Memorial_Hall%2C_Kolkata.jpg';
const test3 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/The_Victoria_Memorial_Hall%2C_Kolkata.jpg/1024px-The_Victoria_Memorial_Hall%2C_Kolkata.jpg';
const test4 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/The_Victoria_Memorial_Hall%2C_Kolkata.jpg/800px-The_Victoria_Memorial_Hall%2C_Kolkata.jpg';

async function check() {
  for (const u of [test1, test2, test3, test4]) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' } });
      console.log(u.split('/').pop(), '-> status:', res.status, res.statusText);
      if (!res.ok) {
        const text = await res.text();
        console.log('Error text:', text.slice(0, 300));
      }
    } catch (e) {
      console.log('Fetch error for', u.split('/').pop(), e.message);
    }
  }
}
check();
