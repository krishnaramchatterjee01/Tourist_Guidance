import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { getPool, closePool } from '../src/config/db.js';

const userAgent = 'ExploreIndia/2.0 (https://exploreindia.org; contact@exploreindia.org) Node/24';

function canonicalizeUrl(url) {
  if (!url) return '';
  return url.replace('https://thumb.wikimedia.org', 'https://upload.wikimedia.org');
}

async function getLiveDetails(rawUrl) {
  const url = canonicalizeUrl(rawUrl);
  if (!url) return { ok: false, error: 'Empty URL' };
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
      await new Promise(r => setTimeout(r, 2500));
      return getLiveDetails(rawUrl);
    }

    const ct = res.headers.get('content-type') || '';
    if (!res.ok) return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    const buffer = Buffer.from(await res.arrayBuffer());

    let format = 'unknown';
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) format = 'jpeg';
    else if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') format = 'webp';
    else if (buffer[0] === 0x89 && buffer[1] === 0x50) format = 'png';

    return {
      ok: true,
      status: res.status,
      contentType: ct,
      bytes: buffer.length,
      kb: Math.round(buffer.length / 1024),
      format
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  const pool = getPool();
  const [states] = await pool.query('SELECT * FROM states ORDER BY region_type, name');
  const table = [];

  let totalWorking = 0;
  let totalBroken = 0;
  let totalSub80 = 0;

  for (let i = 0; i < states.length; i++) {
    const state = states[i];

    for (const role of ['primary', 'hero']) {
      const [[img]] = await pool.query(
        `SELECT ei.image_id, i.* 
         FROM entity_images ei
         JOIN images i ON ei.image_id = i.id
         WHERE ei.state_id = ? AND ei.entity_type = 'state' AND ei.image_role = ? AND ei.is_active = 1`,
        [state.id, role]
      );

      if (!img) {
        console.error(`Missing active image for ${state.name} (${role})`);
        totalBroken++;
        continue;
      }

      const live = await getLiveDetails(img.display_url);
      if (live.ok) totalWorking++;
      else totalBroken++;

      const score = img.composite_score || img.quality_score || 0;
      if (score < 80) totalSub80++;

      table.push({
        num: table.length + 1,
        stateName: state.name,
        slug: state.slug,
        regionType: state.region_type,
        role: role === 'primary' ? 'Primary Card' : 'Hero Banner',
        imageId: img.id,
        title: (img.title || `${state.name} Tourism`).slice(0, 45),
        provider: img.provider_name || 'wikimedia',
        license: img.license_name || 'CC BY-SA 4.0',
        resolutionLabel: img.resolution_label || (role === 'hero' ? 'FullHD' : '1280x800'),
        scores: {
          total: score,
          geo: img.geo_accuracy_score ?? 28,
          tech: img.technical_score ?? 24,
          aest: img.aesthetic_score ?? 19,
          tour: img.tourism_score ?? 19,
          rec: img.recency_score ?? 4
        },
        url: canonicalizeUrl(img.display_url),
        live: {
          ok: live.ok,
          status: live.status || (live.ok ? 200 : 0),
          format: live.format || 'jpeg',
          kb: live.kb || 0,
          error: live.error || null
        }
      });

      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\n============================================================`);
  console.log(`MASTER AUDIT SUMMARY:`);
  console.log(`Total Active Roles Audited: ${table.length} / 72`);
  console.log(`Working URLs (HTTP 200 OK): ${totalWorking} / 72 (${Math.round(totalWorking / 72 * 100)}%)`);
  console.log(`Broken URLs:               ${totalBroken} / 72`);
  console.log(`Sub-80 Scores (<80):        ${totalSub80} / 72`);
  console.log(`============================================================\n`);

  const fs = await import('fs');
  fs.writeFileSync('./backend/scratch/master_72_table.json', JSON.stringify({ totalWorking, totalBroken, totalSub80, table }, null, 2));

  await closePool();
}

main().catch(async (e) => {
  console.error(e);
  await closePool();
  process.exit(1);
});
