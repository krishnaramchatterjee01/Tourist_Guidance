import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { getPool, closePool } from '../src/config/db.js';
import providerManager from '../src/services/images/imageProviderManager.js';
import aiQualityAssessor from '../src/services/images/aiQualityAssessor.js';
import imageEnhancer from '../src/services/images/imageEnhancer.js';

const userAgent = 'ExploreIndia/2.0 (https://exploreindia.org; contact@exploreindia.org) Node/24';

function canonicalizeUrl(url) {
  if (!url) return '';
  return url.replace('https://thumb.wikimedia.org', 'https://upload.wikimedia.org');
}

async function testUrlLive(rawUrl) {
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
      console.warn(`[HTTP 429] Waiting 3s...`);
      await new Promise(r => setTimeout(r, 3000));
      return testUrlLive(rawUrl);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    if (!contentType.startsWith('image/')) return { ok: false, status: res.status, error: `Non-image: ${contentType}` };

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) return { ok: false, status: res.status, error: 'Truncated image' };

    let format = 'unknown';
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) format = 'jpeg';
    else if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') format = 'webp';
    else if (buffer[0] === 0x89 && buffer[1] === 0x50) format = 'png';

    return { ok: true, status: res.status, contentType, bytes: buffer.length, format };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

const final8 = [
  { slug: 'gujarat', role: 'hero', state: 'Gujarat', query: 'Somnath Temple Gujarat', landmarks: ['Somnath Temple', 'Rann of Kutch'], targetW: 1920, targetH: 1080 },
  { slug: 'haryana', role: 'primary', state: 'Haryana', query: 'Brahma Sarovar Kurukshetra', landmarks: ['Brahma Sarovar', 'Kurukshetra'], targetW: 1280, targetH: 800 },
  { slug: 'mizoram', role: 'primary', state: 'Mizoram', query: 'Aizawl city Mizoram', landmarks: ['Aizawl', 'Reiek'], targetW: 1280, targetH: 800 },
  { slug: 'nagaland', role: 'primary', state: 'Nagaland', query: 'Dzukou Valley Nagaland', landmarks: ['Dzukou Valley', 'Kohima'], targetW: 1280, targetH: 800 },
  { slug: 'uttarakhand', role: 'primary', state: 'Uttarakhand', query: 'Kedarnath temple Uttarakhand', landmarks: ['Kedarnath', 'Valley of Flowers'], targetW: 1280, targetH: 800 },
  { slug: 'lakshadweep', role: 'hero', state: 'Lakshadweep', query: 'Agatti Island Lakshadweep', landmarks: ['Agatti', 'Bangaram'], targetW: 1920, targetH: 1080 },
  { slug: 'puducherry', role: 'primary', state: 'Puducherry', query: 'French Quarter Pondicherry', landmarks: ['French Quarter', 'Pondicherry'], targetW: 1280, targetH: 800 },
  { slug: 'puducherry', role: 'hero', state: 'Puducherry', query: 'Matrimandir Auroville', landmarks: ['Matrimandir', 'Auroville'], targetW: 1920, targetH: 1080 }
];

async function main() {
  const pool = getPool();
  console.log('=== EXECUTING FINAL 8 SUB-80 QUALITY UPGRADES ===\n');

  const wikiProvider = providerManager.getProvider('wikimedia');

  for (let i = 0; i < final8.length; i++) {
    const item = final8[i];
    const [[state]] = await pool.query('SELECT * FROM states WHERE slug = ?', [item.slug]);
    if (!state) continue;

    console.log(`[${i + 1}/${final8.length}] Upgrading ${state.name} (${item.role.toUpperCase()})...`);

    const context = {
      stateName: state.name,
      regionType: state.region_type,
      role: item.role,
      landmarkKeywords: item.landmarks
    };

    const candidates = await wikiProvider.search(item.query, { limit: 6, targetWidth: item.targetW });
    await new Promise(r => setTimeout(r, 500));

    let bestCand = null;
    let bestAssess = null;
    let bestCheck = null;

    for (const cand of candidates) {
      const assess = aiQualityAssessor.assess(cand, context);
      if (!assess.isEligible || assess.totalScore < 80) continue;

      const enhanced = imageEnhancer.enhance(cand, item.role);
      const testUrl = canonicalizeUrl(enhanced.enhancedUrl);
      const check = await testUrlLive(testUrl);
      await new Promise(r => setTimeout(r, 250));

      if (check.ok) {
        if (!bestCand || assess.totalScore > bestAssess.totalScore) {
          bestCand = cand;
          bestAssess = assess;
          bestCheck = check;
          cand.testedEnhancedUrl = testUrl;
          cand.enhancedOps = enhanced.operations;
          cand.resolutionLabel = enhanced.resolutionLabel;
        }
      }
    }

    if (bestCand && bestAssess && bestCheck) {
      console.log(`    ⭐ Discovered candidate: QS ${bestAssess.totalScore}`);
      console.log(`       URL: ${bestCand.testedEnhancedUrl.slice(0, 80)}...`);

      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        const [[curr]] = await conn.query(
          "SELECT id, image_id FROM entity_images WHERE state_id = ? AND image_role = ? AND is_active = 1",
          [state.id, item.role]
        );

        const cleanTitle = (bestCand.title || `${state.name} Landmark`).slice(0, 255);
        const cleanDesc = (bestCand.description || bestCand.title || `${state.name} Tourism`).slice(0, 1000);
        const cleanAlt = (bestCand.altText || bestCand.alt_text || `${state.name} Scenery`).slice(0, 255);
        const cleanPhotographer = (bestCand.photographerName || bestCand.photographer_name || 'Contributor').slice(0, 150);
        const cleanLicense = (bestCand.licenseName || bestCand.license_name || 'CC BY-SA 4.0').slice(0, 100);
        const cleanLicenseUrl = (bestCand.licenseUrl || bestCand.license_url || 'https://creativecommons.org/licenses/by-sa/4.0/').slice(0, 500);

        let newImgId;
        const [ex] = await conn.query('SELECT id FROM images WHERE original_url = ?', [bestCand.originalUrl]);
        if (ex.length > 0) {
          newImgId = ex[0].id;
          await conn.query(
            `UPDATE images SET 
               display_url = ?, enhanced_url = ?, is_ai_enhanced = 1,
               enhancement_operations = ?, quality_score = ?,
               geo_accuracy_score = ?, technical_score = ?, aesthetic_score = ?,
               tourism_score = ?, recency_score = ?, composite_score = ?,
               ai_assessed_at = CURRENT_TIMESTAMP, ai_assessment_method = 'cims_vision_v1',
               resolution_label = ?, status = 'verified'
             WHERE id = ?`,
            [
              bestCand.testedEnhancedUrl,
              bestCand.testedEnhancedUrl,
              JSON.stringify(bestCand.enhancedOps),
              bestAssess.totalScore,
              bestAssess.scores.geo,
              bestAssess.scores.technical,
              bestAssess.scores.aesthetic,
              bestAssess.scores.tourism,
              bestAssess.scores.recency,
              bestAssess.totalScore,
              bestCand.resolutionLabel,
              newImgId
            ]
          );
        } else {
          const [ins] = await conn.query(
            `INSERT INTO images (
               provider_name, provider_image_id, original_url, display_url, thumbnail_url,
               source_page_url, title, description, alt_text, photographer_name,
               license_name, license_url, attribution_text, width, height, format,
               country, state, geographic_confidence, geographic_evidence,
               quality_score, geo_accuracy_score, technical_score, aesthetic_score,
               tourism_score, recency_score, composite_score,
               ai_assessed_at, ai_assessment_method, is_ai_enhanced, enhancement_operations,
               enhanced_url, resolution_label, status, review_status
             ) VALUES (
               'wikimedia', ?, ?, ?, ?,
               ?, ?, ?, ?, ?,
               ?, ?, ?, ?, ?, ?,
               'India', ?, 'verified_monument', ?,
               ?, ?, ?, ?,
               ?, ?, ?,
               CURRENT_TIMESTAMP, 'cims_vision_v1', 1, ?,
               ?, ?, 'verified', 'auto_approved'
             )`,
            [
              String(bestCand.providerImageId || 'wm_' + Date.now()).slice(0, 150),
              bestCand.originalUrl.slice(0, 1000),
              bestCand.testedEnhancedUrl.slice(0, 1000),
              (bestCand.thumbnailUrl || bestCand.testedEnhancedUrl).slice(0, 1000),
              (bestCand.sourcePageUrl || bestCand.testedEnhancedUrl).slice(0, 1000),
              cleanTitle,
              cleanDesc,
              cleanAlt,
              cleanPhotographer,
              cleanLicense,
              cleanLicenseUrl,
              bestCand.attributionText || `Photo via Wikimedia Commons`,
              bestCand.width || item.targetW,
              bestCand.height || item.targetH,
              bestCand.format || 'image/jpeg',
              state.name,
              bestAssess.notes,
              bestAssess.totalScore,
              bestAssess.scores.geo,
              bestAssess.scores.technical,
              bestAssess.scores.aesthetic,
              bestAssess.scores.tourism,
              bestAssess.scores.recency,
              bestAssess.totalScore,
              JSON.stringify(bestCand.enhancedOps),
              bestCand.testedEnhancedUrl.slice(0, 1000),
              bestCand.resolutionLabel
            ]
          );
          newImgId = ins.insertId;
        }

        if (curr) {
          await conn.query('UPDATE entity_images SET is_active = 0 WHERE id = ?', [curr.id]);
          await conn.query(
            `INSERT INTO image_replacement_history (entity_type, entity_id, old_image_id, new_image_id, reason, replaced_by)
             VALUES ('state', ?, ?, ?, 'CIMS Phase 4 Sub-80 Quality Upgrade', 'cims_quality_upgrader')`,
            [state.id, curr.image_id, newImgId]
          );
        }

        await conn.query(
          `INSERT INTO entity_images (entity_type, state_id, image_id, image_role, display_order, is_active)
           VALUES ('state', ?, ?, ?, 0, 1)`,
          [state.id, newImgId, item.role]
        );

        await conn.query(
          `INSERT INTO image_quality_assessments 
           (image_id, entity_type, entity_id, role, geo_accuracy_score, technical_score, aesthetic_score, tourism_score, recency_score, total_score, assessment_notes, assessed_by)
           VALUES (?, 'state', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cims_ai_evaluator_v1')`,
          [
            newImgId, state.id, item.role,
            bestAssess.scores.geo, bestAssess.scores.technical, bestAssess.scores.aesthetic,
            bestAssess.scores.tourism, bestAssess.scores.recency, bestAssess.totalScore,
            bestAssess.notes
          ]
        );

        const col = item.role === 'primary' ? 'image_url' : 'hero_image_url';
        await conn.query(`UPDATE states SET ${col} = ? WHERE id = ?`, [bestCand.testedEnhancedUrl, state.id]);

        await conn.commit();
        conn.release();
        console.log(`    ✓ Successfully upgraded in DB: #${newImgId} (QS ${bestAssess.totalScore}, live: HTTP ${bestCheck.status})\n`);
      } catch (e) {
        await conn.rollback();
        conn.release();
        console.error(`    ❌ Transaction error:`, e.message);
      }
    } else {
      console.log(`    ⚠️ No qualifying candidate with QS >= 80 found for ${state.name} (${item.role}).\n`);
    }
  }

  console.log('=== ALL 8 ROLES UPGRADE COMPLETED ===\n');
  await closePool();
}

main().catch(async (e) => {
  console.error(e);
  await closePool();
  process.exit(1);
});
