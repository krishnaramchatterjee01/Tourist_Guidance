import app from '../src/app.js';
import http from 'http';
import { closePool } from '../src/config/db.js';

async function testLive() {
  const server = http.createServer(app);
  server.listen(0, async () => {
    const port = server.address().port;
    console.log(`Live test server listening on port ${port}...`);

    try {
      // 1. GET /api/states
      const res1 = await fetch(`http://127.0.0.1:${port}/api/states`);
      const json1 = await res1.json();
      console.log(`GET /api/states -> HTTP ${res1.status}, success: ${json1.success}, returned: ${json1.data?.length} states`);

      // 2. Sample individual states
      const slugs = ['goa', 'west-bengal', 'rajasthan', 'andhra-pradesh', 'delhi', 'ladakh'];
      for (const slug of slugs) {
        const res = await fetch(`http://127.0.0.1:${port}/api/states/${slug}`);
        const json = await res.json();
        const d = json.data;
        console.log(`GET /api/states/${slug} -> HTTP ${res.status}`);
        console.log(`   Card Image: ${d?.image?.substring(0, 75)}...`);
        console.log(`   Hero Image: ${d?.heroImage?.substring(0, 75)}...`);
      }
    } catch (err) {
      console.error('Live test error:', err);
    } finally {
      server.close();
      await closePool();
      process.exit(0);
    }
  });
}

testLive();
