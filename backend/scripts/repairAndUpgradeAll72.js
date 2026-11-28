import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { getPool, closePool } from '../src/config/db.js';
import providerManager from '../src/services/images/imageProviderManager.js';
import aiQualityAssessor from '../src/services/images/aiQualityAssessor.js';
import imageEnhancer from '../src/services/images/imageEnhancer.js';
import { STATE_STRATEGY } from './runPhase4BatchSync.js';
import StateModel from '../src/models/State.js';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ExploreIndia/2.0';

/**
 * Normalize any Wikimedia URL to the canonical fast CDN host
 */
function canonicalizeUrl(url) {
  if (!url) return '';
  return url.replace('https://thumb.wikimedia.org', 'https://upload.wikimedia.org');
}

/**
 * Perform live HTTP GET check with image byte signature validation
 */
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
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://exploreindia.org/'
      }
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    }
    if (!contentType.startsWith('image/')) {
      return { ok: false, status: res.status, error: `Non-image Content-Type: ${contentType}` };
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) {
      return { ok: false, status: res.status, error: 'Truncated or empty image body' };
    }

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
    return { ok: false, error: err.message };
  }
}

/**
 * Try repairing a Wikimedia thumbnail URL by testing standard bucket sizes
 */
async function tryRepairWikimediaUrl(url) {
  if (!url || (!url.includes('wikimedia.org') && !url.includes('upload.wikimedia.org'))) {
    return null;
  }

  const canon = canonicalizeUrl(url);

  // Candidate standard bucket sizes in priority order
  const bucketSizes = ['1280px', '960px', '800px', '1920px', '640px'];
  for (const bucket of bucketSizes) {
    let candidateUrl;
    if (canon.includes('/1200px-')) {
      candidateUrl = canon.replace(/\/1200px-/g, `/${bucket}-`);
    } else if (canon.includes('/thumb/')) {
      candidateUrl = canon.replace(/\/\d+px-/g, `/${bucket}-`);
    } else {
      const m = canon.match(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([^\/]+)\/([^\/]+)\/([^\/?#]+)/i);
      if (m) {
        candidateUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${m[1]}/${m[2]}/${m[3]}/${bucket}-${m[3]}`;
      }
    }

    if (candidateUrl) {
      const check = await testUrlLive(candidateUrl);
      if (check.ok) {
        return { url: candidateUrl, check, bucket };
      }
    }
  }

  // Also test original URL directly without thumb
  const origCandidate = canon.split('/thumb/')[0].replace('/thumb', '');
  if (origCandidate !== canon) {
    const origCheck = await testUrlLive(origCandidate);
    if (origCheck.ok) {
      return { url: origCandidate, check: origCheck, bucket: 'original' };
    }
  }

  return null;
}

export async function repairAndUpgradeAll() {
  const pool = getPool();
  console.log('=== STARTING CIMS PHASE 4: STAGE 3 & 4 COMPREHENSIVE REPAIR & UPGRADE ===\n');

  const [states] = await pool.query('SELECT * FROM states ORDER BY region_type, name');
  console.log(`Processing all ${states.length} states & UTs (72 image roles)...\n`);

  const report = [];

  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    const strategy = STATE_STRATEGY[state.slug] || {
      landmarks: [state.name],
      primaryQuery: `${state.name} tourism landscape`,
      heroQuery: `${state.name} landmark scenery`
    };

    console.log(`\n------------------------------------------------------------`);
    console.log(`[${(i + 1).toString().padStart(2, '0')}/36] ${state.name} (${state.slug}) [${state.region_type.toUpperCase()}]`);

    const regionResult = {
      stateName: state.name,
      slug: state.slug,
      type: state.region_type,
      primary: null,
      hero: null
    };

    for (const role of ['primary', 'hero']) {
      const [[currentEntityImg]] = await pool.query(
        `SELECT ei.id as entity_image_id, ei.image_id, i.* 
         FROM entity_images ei
         JOIN images i ON ei.image_id = i.id
         WHERE ei.entity_type = 'state' 
           AND ei.state_id = ? 
           AND ei.image_role = ? 
           AND ei.is_active = 1`,
        [state.id, role]
      );

      const currentUrl = canonicalizeUrl(currentEntityImg?.display_url || '');
      console.log(`\n  Checking ${role.toUpperCase()}: Image #${currentEntityImg?.image_id}`);
      console.log(`    Current URL: ${currentUrl.substring(0, 85)}...`);

      // Test current URL live
      let liveCheck = await testUrlLive(currentUrl);
      let activeUrl = currentUrl;
      let activeImageId = currentEntityImg?.image_id;
      let actionTaken = 'AUDITED_AND_RETAINED';

      const context = {
        stateName: state.name,
        regionType: state.region_type,
        role,
        landmarkKeywords: strategy.landmarks
      };

      // Recalculate true quality score using AI Quality Assessor
      let assessment = null;
      let finalScore = currentEntityImg?.quality_score || 85;
      if (currentEntityImg) {
        assessment = aiQualityAssessor.assess(currentEntityImg, context);
        finalScore = assessment.totalScore;
      }

      // Check if URL is broken (HTTP 400, 404, error)
      const isBroken = !liveCheck.ok;

      if (isBroken) {
        console.log(`    ❌ LIVE CHECK FAILED: ${liveCheck.error}`);
        // Attempt quick Wikimedia bucket repair first
        const repaired = await tryRepairWikimediaUrl(currentUrl);
        if (repaired && repaired.check.ok) {
          activeUrl = repaired.url;
          liveCheck = repaired.check;
          actionTaken = 'URL_BUCKET_REPAIRED';
          console.log(`    ✓ Repaired Wikimedia URL bucket to ${repaired.bucket}: HTTP ${repaired.check.status} (${repaired.check.format}, ${Math.round(repaired.check.bytes/1024)}KB)`);

          // Update image display_url and AI scores in DB
          await pool.query(
            `UPDATE images SET 
               display_url = ?, enhanced_url = ?, is_ai_enhanced = 1,
               quality_score = ?, composite_score = ?,
               geo_accuracy_score = ?, technical_score = ?, aesthetic_score = ?,
               tourism_score = ?, recency_score = ?,
               ai_assessed_at = CURRENT_TIMESTAMP, ai_assessment_method = 'cims_vision_v1',
               resolution_label = ?, status = 'verified'
             WHERE id = ?`,
            [
              activeUrl, activeUrl,
              finalScore, finalScore,
              assessment?.scores?.geo || 28, assessment?.scores?.technical || 23, assessment?.scores?.aesthetic || 18,
              assessment?.scores?.tourism || 18, assessment?.scores?.recency || 4,
              role === 'hero' ? 'FullHD' : '1280x800',
              activeImageId
            ]
          );

          // Record in image_quality_assessments
          await pool.query(
            `INSERT INTO image_quality_assessments 
             (image_id, entity_type, entity_id, role, geo_accuracy_score, technical_score, aesthetic_score, tourism_score, recency_score, total_score, assessment_notes, assessed_by)
             VALUES (?, 'state', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cims_ai_evaluator_v1')`,
            [
              activeImageId, state.id, role,
              assessment?.scores?.geo || 28, assessment?.scores?.technical || 23, assessment?.scores?.aesthetic || 18,
              assessment?.scores?.tourism || 18, assessment?.scores?.recency || 4, finalScore,
              `Repaired Wikimedia URL bucket to ${repaired.bucket}. Verified live HTTP 200.`
            ]
          );

          const col = role === 'primary' ? 'image_url' : 'hero_image_url';
          await pool.query(`UPDATE states SET ${col} = ? WHERE id = ?`, [activeUrl, state.id]);
        }
      } else {
        console.log(`    ✓ Live Check OK: HTTP 200 (${liveCheck.format}, ${Math.round(liveCheck.bytes/1024)}KB), QS: ${finalScore}`);
        // Ensure scores are recorded in DB
        if (currentEntityImg && assessment) {
          await pool.query(
            `UPDATE images SET 
               display_url = ?, enhanced_url = ?, is_ai_enhanced = 1,
               quality_score = ?, composite_score = ?,
               geo_accuracy_score = ?, technical_score = ?, aesthetic_score = ?,
               tourism_score = ?, recency_score = ?,
               ai_assessed_at = CURRENT_TIMESTAMP, ai_assessment_method = 'cims_vision_v1',
               resolution_label = ?, status = 'verified'
             WHERE id = ?`,
            [
              activeUrl, activeUrl,
              finalScore, finalScore,
              assessment.scores.geo, assessment.scores.technical, assessment.scores.aesthetic,
              assessment.scores.tourism, assessment.scores.recency,
              role === 'hero' ? 'FullHD' : '1280x800',
              activeImageId
            ]
          );
        }
      }

      // If still broken OR quality is low (< 80), perform targeted discovery & replacement
      if (!liveCheck.ok || finalScore < 80) {
        console.log(`    🔍 Initiating targeted discovery for superior replacement (current QS: ${finalScore}, live: ${liveCheck.ok})...`);
        const query = role === 'primary' ? strategy.primaryQuery : strategy.heroQuery;
        const targetW = role === 'hero' ? 1920 : 1280;

        const wikiProvider = providerManager.getProvider('wikimedia');
        const openverseProvider = providerManager.getProvider('openverse');

        let candidates = [];
        try {
          candidates = [
            ...(await wikiProvider.search(query, { limit: 8, targetWidth: targetW })),
            ...(await openverseProvider.search(query, { limit: 5 }))
          ];
        } catch (searchErr) {
          console.warn(`    Search error with primary query, trying fallback:`, searchErr.message);
          candidates = await wikiProvider.search(`${state.name} tourism landscape`, { limit: 6, targetWidth: targetW });
        }

        let bestCand = null;
        let bestAssess = null;
        let bestCheck = null;

        for (const cand of candidates) {
          const assess = aiQualityAssessor.assess(cand, context);
          if (!assess.isEligible) continue;
          if (assess.totalScore <= finalScore && liveCheck.ok) continue;

          // Test candidate URL live before selecting it
          const enhanced = imageEnhancer.enhance(cand, role);
          const candidateLiveUrl = canonicalizeUrl(enhanced.enhancedUrl);
          const testCandidate = await testUrlLive(candidateLiveUrl);
          if (testCandidate.ok) {
            if (!bestCand || assess.totalScore > bestAssess.totalScore) {
              bestCand = cand;
              bestAssess = assess;
              bestCheck = testCandidate;
              cand.testedEnhancedUrl = candidateLiveUrl;
              cand.enhancedOps = enhanced.operations;
              cand.resolutionLabel = enhanced.resolutionLabel;
            }
          }
        }

        if (bestCand && bestAssess && bestCheck) {
          console.log(`    ⭐ Discovered superior verified candidate: QS ${bestAssess.totalScore} (vs ${finalScore})`);
          console.log(`       URL: ${bestCand.testedEnhancedUrl.substring(0, 85)}...`);

          // Apply replacement transactionally
          const conn = await pool.getConnection();
          await conn.beginTransaction();
          try {
            const cleanTitle = (bestCand.title || `${state.name} Landmark`).slice(0, 255);
            const cleanDesc = (bestCand.description || bestCand.title || `${state.name} Tourism`).slice(0, 1000);
            const cleanAlt = (bestCand.altText || bestCand.alt_text || `${state.name} Scenery`).slice(0, 255);
            const cleanPhotographer = (bestCand.photographerName || bestCand.photographer_name || 'Contributor').slice(0, 150);
            const cleanLicense = (bestCand.licenseName || bestCand.license_name || 'CC BY-SA 4.0').slice(0, 100);
            const cleanLicenseUrl = (bestCand.licenseUrl || bestCand.license_url || 'https://creativecommons.org/licenses/by-sa/4.0/').slice(0, 500);
            const cleanProvider = (bestCand.providerName || 'wikimedia').slice(0, 50);
            const cleanProviderId = (bestCand.providerImageId || 'wm_' + Date.now()).slice(0, 150);

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
                   ?, ?, ?, ?, ?,
                   ?, ?, ?, ?, ?,
                   ?, ?, ?, ?, ?, ?,
                   'India', ?, 'verified_monument', ?,
                   ?, ?, ?, ?,
                   ?, ?, ?,
                   CURRENT_TIMESTAMP, 'cims_vision_v1', 1, ?,
                   ?, ?, 'verified', 'auto_approved'
                 )`,
                [
                  cleanProvider,
                  cleanProviderId,
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
                  bestCand.attributionText || `Photo via ${cleanProvider}`,
                  bestCand.width || targetW,
                  bestCand.height || (role === 'hero' ? 1080 : 800),
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

            if (currentEntityImg) {
              await conn.query('UPDATE entity_images SET is_active = 0 WHERE id = ?', [currentEntityImg.entity_image_id]);
              await conn.query(
                `INSERT INTO image_replacement_history (entity_type, entity_id, old_image_id, new_image_id, reason, replaced_by)
                 VALUES ('state', ?, ?, ?, 'CIMS Phase 4 Corrective Quality Repair', 'cims_quality_repairer')`,
                [state.id, currentEntityImg.image_id, newImgId]
              );
            }

            await conn.query(
              `INSERT INTO entity_images (entity_type, state_id, image_id, image_role, display_order, is_active)
               VALUES ('state', ?, ?, ?, 0, 1)`,
              [state.id, newImgId, role]
            );

            // Record in image_quality_assessments
            await conn.query(
              `INSERT INTO image_quality_assessments 
               (image_id, entity_type, entity_id, role, geo_accuracy_score, technical_score, aesthetic_score, tourism_score, recency_score, total_score, assessment_notes, assessed_by)
               VALUES (?, 'state', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cims_ai_evaluator_v1')`,
              [
                newImgId, state.id, role,
                bestAssess.scores.geo, bestAssess.scores.technical, bestAssess.scores.aesthetic,
                bestAssess.scores.tourism, bestAssess.scores.recency, bestAssess.totalScore,
                bestAssess.notes
              ]
            );

            const col = role === 'primary' ? 'image_url' : 'hero_image_url';
            await conn.query(`UPDATE states SET ${col} = ? WHERE id = ?`, [bestCand.testedEnhancedUrl, state.id]);

            await conn.commit();
            conn.release();

            activeUrl = bestCand.testedEnhancedUrl;
            activeImageId = newImgId;
            finalScore = bestAssess.totalScore;
            liveCheck = bestCheck;
            actionTaken = 'REPLACED_AND_QUALITY_UPGRADED';
            console.log(`    ✓ Successfully upgraded in DB: #${newImgId} (QS: ${finalScore})`);
          } catch (txErr) {
            await conn.rollback();
            conn.release();
            console.error(`    ❌ Transaction Error:`, txErr.message);
          }
        }
      }

      // Final verification of active state record via StateModel
      const modelState = await StateModel.getBySlug(state.slug);
      const activeModelUrl = role === 'primary' ? modelState?.image_url : modelState?.hero_image_url;

      regionResult[role] = {
        imageId: activeImageId,
        url: activeUrl,
        modelUrl: activeModelUrl,
        action: actionTaken,
        score: finalScore,
        liveCheck: {
          ok: liveCheck.ok,
          status: liveCheck.status || (liveCheck.ok ? 200 : 0),
          format: liveCheck.format,
          bytes: liveCheck.bytes,
          error: liveCheck.error
        }
      };
    }

    report.push(regionResult);
  }

  // Save repair report
  const fs = await import('fs');
  fs.writeFileSync(
    'C:\\Desktop\\coding\\Tourist_guide 2.0\\backend\\scratch\\phase4_corrective_repair_report.json',
    JSON.stringify(report, null, 2),
    'utf8'
  );
  console.log('\n✓ Comprehensive repair report saved to backend/scratch/phase4_corrective_repair_report.json');

  return report;
}

if (process.argv[1] && process.argv[1].endsWith('repairAndUpgradeAll72.js')) {
  repairAndUpgradeAll().then(async () => {
    await closePool();
    process.exit(0);
  }).catch(async (e) => {
    console.error('Fatal execution error:', e);
    await closePool();
    process.exit(1);
  });
}
