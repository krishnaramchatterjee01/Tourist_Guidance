import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { getPool, closePool } from '../src/config/db.js';

const userAgent = 'ExploreIndia/2.0 (https://exploreindia.org; contact@exploreindia.org) Node/24';

function canonicalizeUrl(url) {
  if (!url) return '';
  return url.replace('https://thumb.wikimedia.org', 'https://upload.wikimedia.org');
}

async function main() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT s.name, s.slug, ei.image_role, i.id, i.display_url, i.quality_score, i.composite_score
    FROM states s
    JOIN entity_images ei ON ei.state_id = s.id AND ei.entity_type = 'state' AND ei.is_active = 1
    JOIN images i ON ei.image_id = i.id
    WHERE ei.image_role IN ('primary', 'hero')
    ORDER BY s.region_type, s.name, ei.image_role
  `);

  console.log(`Testing all ${rows.length} active roles with compliant UA and gentle pacing...\n`);

  let ok = 0;
  let fail = 0;
  const failures = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const canonUrl = canonicalizeUrl(r.display_url);

    try {
      const res = await fetch(canonUrl, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });

      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.startsWith('image/')) {
        ok++;
        console.log(`[${(i + 1).toString().padStart(2, '0')}/72] ✓ 200 OK | ${r.name.padEnd(20)} [${r.image_role.padEnd(7)}] #${r.id} (${ct})`);
      } else {
        fail++;
        console.log(`[${(i + 1).toString().padStart(2, '0')}/72] ❌ ${res.status} | ${r.name.padEnd(20)} [${r.image_role.padEnd(7)}] #${r.id} | ${canonUrl.slice(0, 70)}`);
        failures.push({ name: r.name, slug: r.slug, role: r.image_role, id: r.id, status: res.status, url: canonUrl });
      }
    } catch (e) {
      fail++;
      console.log(`[${(i + 1).toString().padStart(2, '0')}/72] ❌ ERR: ${e.message} | ${r.name.padEnd(20)} [${r.image_role.padEnd(7)}] #${r.id}`);
      failures.push({ name: r.name, slug: r.slug, role: r.image_role, id: r.id, error: e.message, url: canonUrl });
    }

    // 250ms delay between requests to stay well within Wikimedia guidelines
    await new Promise(res => setTimeout(res, 250));
  }

  console.log('\n============================================================');
  console.log(`TOTAL WORKING: ${ok} / 72 (${Math.round(ok / 72 * 100)}%)`);
  console.log(`TOTAL FAILING: ${fail} / 72`);
  console.log('FAILURES DETAIL:', JSON.stringify(failures, null, 2));
  console.log('============================================================\n');

  const fs = await import('fs');
  fs.writeFileSync('./backend/scratch/live_72_audit_result.json', JSON.stringify({ ok, fail, failures }, null, 2));

  await closePool();
}

main().catch(async (e) => {
  console.error(e);
  await closePool();
  process.exit(1);
});
