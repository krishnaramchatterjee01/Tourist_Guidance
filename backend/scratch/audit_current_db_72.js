import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { getPool, closePool } from '../src/config/db.js';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ExploreIndia/2.0';

function canonicalizeUrl(url) {
  if (!url) return '';
  return url.replace('https://thumb.wikimedia.org', 'https://upload.wikimedia.org');
}

async function testUrl(rawUrl) {
  const url = canonicalizeUrl(rawUrl);
  if (!url) return { ok: false, error: 'Empty URL' };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgent,
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      clearTimeout(timeoutId);

      if (res.status === 429) {
        // Rate limited - back off and retry
        console.warn(`[HTTP 429 Rate Limit] Backing off 2.5s for attempt ${attempt}...`);
        await new Promise(r => setTimeout(r, 2500));
        continue;
      }

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        return { ok: false, status: res.status, error: `HTTP ${res.status}` };
      }
      if (!contentType.startsWith('image/')) {
        return { ok: false, status: res.status, error: `Non-image: ${contentType}` };
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      let format = 'unknown';
      if (buffer[0] === 0xFF && buffer[1] === 0xD8) format = 'jpeg';
      else if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') format = 'webp';
      else if (buffer[0] === 0x89 && buffer[1] === 0x50) format = 'png';

      return {
        ok: true,
        status: res.status,
        contentType,
        bytes: buffer.length,
        format
      };
    } catch (err) {
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      return { ok: false, error: err.message };
    }
  }
  return { ok: false, error: 'Failed after 3 attempts' };
}

async function main() {
  const pool = getPool();
  const [states] = await pool.query('SELECT * FROM states ORDER BY region_type, name');
  console.log(`Auditing all ${states.length} states & UTs (72 active roles)...\n`);

  const results = [];
  let workingCount = 0;
  let brokenCount = 0;
  let sub80Count = 0;

  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    const item = {
      state: state.name,
      slug: state.slug,
      type: state.region_type,
      primary: null,
      hero: null
    };

    for (const role of ['primary', 'hero']) {
      const [[row]] = await pool.query(
        `SELECT ei.image_id, i.id, i.display_url, i.quality_score, i.composite_score,
                i.geo_accuracy_score, i.technical_score, i.aesthetic_score, i.tourism_score, i.recency_score
         FROM entity_images ei
         JOIN images i ON ei.image_id = i.id
         WHERE ei.state_id = ? AND ei.image_role = ? AND ei.is_active = 1`,
        [state.id, role]
      );

      if (!row) {
        item[role] = { missing: true };
        brokenCount++;
        continue;
      }

      const canonUrl = canonicalizeUrl(row.display_url);
      const test = await testUrl(canonUrl);
      const score = row.composite_score || row.quality_score || 0;

      item[role] = {
        imageId: row.image_id,
        url: canonUrl,
        score,
        test
      };

      if (test.ok) workingCount++;
      else brokenCount++;

      if (score < 80) sub80Count++;

      // Polite pacing delay between checks
      await new Promise(r => setTimeout(r, 200));
    }

    console.log(
      `[${(i + 1).toString().padStart(2, '0')}/36] ${state.name.padEnd(25)} | ` +
      `PRI: #${item.primary?.imageId} (QS ${item.primary?.score}, ${item.primary?.test.ok ? '✓ OK' : '❌ ' + item.primary?.test.error}) | ` +
      `HERO: #${item.hero?.imageId} (QS ${item.hero?.score}, ${item.hero?.test.ok ? '✓ OK' : '❌ ' + item.hero?.test.error})`
    );

    results.push(item);
  }

  console.log(`\n============================================================`);
  console.log(`AUDIT COMPLETE:`);
  console.log(`Working URLs: ${workingCount} / 72 (${Math.round(workingCount / 72 * 100)}%)`);
  console.log(`Broken URLs:  ${brokenCount} / 72`);
  console.log(`Sub-80 Scores: ${sub80Count} / 72`);
  console.log(`============================================================\n`);

  const fs = await import('fs');
  fs.writeFileSync('./backend/scratch/current_72_status.json', JSON.stringify({ workingCount, brokenCount, sub80Count, results }, null, 2));

  await closePool();
}

main().catch(async (e) => {
  console.error(e);
  await closePool();
  process.exit(1);
});
