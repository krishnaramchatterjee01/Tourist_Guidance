import { getPool, closePool } from '../src/config/db.js';

async function auditUrls() {
  const pool = getPool();
  try {
    console.log('=== AUDITING ALL 72 STATE & UT IMAGE URLS ===\n');

    const [rows] = await pool.query(`
      SELECT 
        s.id as state_id, s.name as state_name, s.slug, s.region_type,
        ei_p.image_role as p_role, i_p.id as p_id, i_p.provider_name as p_provider, i_p.display_url as p_url, i_p.quality_score as p_qs,
        ei_h.image_role as h_role, i_h.id as h_id, i_h.provider_name as h_provider, i_h.display_url as h_url, i_h.quality_score as h_qs
      FROM states s
      LEFT JOIN entity_images ei_p ON (ei_p.state_id = s.id AND ei_p.entity_type = 'state' AND ei_p.image_role = 'primary' AND ei_p.is_active = 1)
      LEFT JOIN images i_p ON ei_p.image_id = i_p.id
      LEFT JOIN entity_images ei_h ON (ei_h.state_id = s.id AND ei_h.entity_type = 'state' AND ei_h.image_role = 'hero' AND ei_h.is_active = 1)
      LEFT JOIN images i_h ON ei_h.image_id = i_h.id
      ORDER BY s.region_type, s.name
    `);

    console.log(`Auditing ${rows.length} regions (${rows.length * 2} roles)...\n`);

    const results = [];
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ExploreIndia/2.0';

    async function testUrl(url, label) {
      if (!url) return { ok: false, error: 'Empty URL' };
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': userAgent,
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Referer': 'https://exploreindia.org/'
          }
        });
        clearTimeout(timeoutId);

        const contentType = res.headers.get('content-type') || '';
        const contentLength = res.headers.get('content-length') || '0';

        if (!res.ok) {
          return {
            ok: false,
            status: res.status,
            contentType,
            error: `HTTP ${res.status}`
          };
        }

        // Check if content-type is image
        if (!contentType.startsWith('image/')) {
          return {
            ok: false,
            status: res.status,
            contentType,
            error: `Non-image Content-Type: ${contentType}`
          };
        }

        // Read first few bytes to verify image signature
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        let format = 'unknown';

        if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
          format = 'jpeg';
        } else if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
          format = 'webp';
        } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
          format = 'png';
        }

        return {
          ok: true,
          status: res.status,
          contentType,
          bytes: buffer.length,
          format
        };
      } catch (err) {
        return {
          ok: false,
          error: err.message
        };
      }
    }

    let brokenCount = 0;
    let workingCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const pTest = await testUrl(r.p_url, `${r.slug}-primary`);
      const hTest = await testUrl(r.h_url, `${r.slug}-hero`);

      if (!pTest.ok) brokenCount++; else workingCount++;
      if (!hTest.ok) brokenCount++; else workingCount++;

      results.push({
        region: r.state_name,
        slug: r.slug,
        type: r.region_type,
        primary: {
          id: r.p_id,
          url: r.p_url,
          provider: r.p_provider,
          qs: r.p_qs,
          test: pTest
        },
        hero: {
          id: r.h_id,
          url: r.h_url,
          provider: r.h_provider,
          qs: r.h_qs,
          test: hTest
        }
      });

      const pStatus = pTest.ok ? `✓ OK (${pTest.format}, ${Math.round(pTest.bytes/1024)}KB)` : `❌ FAILED: ${pTest.error} (${pTest.status || ''})`;
      const hStatus = hTest.ok ? `✓ OK (${hTest.format}, ${Math.round(hTest.bytes/1024)}KB)` : `❌ FAILED: ${hTest.error} (${hTest.status || ''})`;

      console.log(`[${(i+1).toString().padStart(2, '0')}/36] ${(r.state_name || '').padEnd(30)}:`);
      console.log(`   Primary: ${pStatus} -> ${r.p_url?.substring(0, 80)}`);
      console.log(`   Hero:    ${hStatus} -> ${r.h_url?.substring(0, 80)}`);
    }

    console.log('\n=============================================');
    console.log(`AUDIT COMPLETE: ${workingCount} working, ${brokenCount} BROKEN / INACCESSIBLE`);
    console.log('=============================================\n');

    import('fs').then(fs => {
      fs.writeFileSync(
        'C:\\Desktop\\coding\\Tourist_guide 2.0\\backend\\scratch\\live_url_audit.json',
        JSON.stringify({ workingCount, brokenCount, results }, null, 2),
        'utf8'
      );
      console.log('Saved audit report to backend/scratch/live_url_audit.json');
    });

  } catch (err) {
    console.error('Audit Error:', err);
  } finally {
    await closePool();
  }
}

auditUrls();
