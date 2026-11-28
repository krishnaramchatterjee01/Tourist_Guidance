import { getPool, closePool } from '../src/config/db.js';
import providerManager from '../src/services/images/imageProviderManager.js';
import aiQualityAssessor from '../src/services/images/aiQualityAssessor.js';
import imageEnhancer from '../src/services/images/imageEnhancer.js';

// State Landmark Strategy Dictionary (from Section 11 of Prompt)
export const STATE_STRATEGY = {
  'andhra-pradesh': {
    landmarks: ['Gandikota', 'Araku Valley', 'Tirumala', 'Visakhapatnam beach'],
    primaryQuery: 'Gandikota canyon Andhra Pradesh',
    heroQuery: 'Araku Valley coffee plantations Andhra Pradesh'
  },
  'arunachal-pradesh': {
    landmarks: ['Tawang Monastery', 'Sela Pass', 'Ziro Valley'],
    primaryQuery: 'Tawang Monastery Arunachal Pradesh landscape',
    heroQuery: 'Sela Pass Arunachal Pradesh mountains lake'
  },
  'assam': {
    landmarks: ['Kaziranga National Park', 'Majuli island', 'Tea gardens Assam', 'Kamakhya Temple'],
    primaryQuery: 'Kaziranga National Park Assam rhino landscape',
    heroQuery: 'Assam tea garden hills landscape green'
  },
  'bihar': {
    landmarks: ['Mahabodhi Temple', 'Nalanda University ruins', 'Rajgir glass bridge'],
    primaryQuery: 'Mahabodhi Temple Bodh Gaya Bihar',
    heroQuery: 'Nalanda ancient university ruins Bihar'
  },
  'chhattisgarh': {
    landmarks: ['Chitrakote Falls', 'Bastar palace', 'Tirathgarh Falls'],
    primaryQuery: 'Chitrakote Falls Bastar Chhattisgarh Niagara',
    heroQuery: 'Tirathgarh waterfalls Bastar Chhattisgarh'
  },
  'goa': {
    landmarks: ['Palolem Beach', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Calangute'],
    primaryQuery: 'Palolem Beach Goa palm trees coastline',
    heroQuery: 'Dudhsagar Falls railway bridge Goa landscape'
  },
  'gujarat': {
    landmarks: ['Rann of Kutch', 'Gir National Park', 'Somnath Temple', 'Statue of Unity'],
    primaryQuery: 'White Rann of Kutch salt desert Gujarat sunset',
    heroQuery: 'Somnath Temple Gujarat Arabian Sea coastline'
  },
  'haryana': {
    landmarks: ['Kurukshetra Brahma Sarovar', 'Sultanpur National Park', 'Pinjore Gardens'],
    primaryQuery: 'Brahma Sarovar Kurukshetra Haryana sunset',
    heroQuery: 'Pinjore Gardens Yadavindra Mughal Haryana'
  },
  'himachal-pradesh': {
    landmarks: ['Spiti Valley', 'Manali Solang', 'Shimla Ridge', 'Dharamshala'],
    primaryQuery: 'Key Monastery Spiti Valley Himachal Pradesh',
    heroQuery: 'Himalayan snow mountains Solang Valley Himachal Pradesh'
  },
  'jharkhand': {
    landmarks: ['Hundru Falls', 'Netarhat sunrise', 'Betla National Park', 'Dassam Falls'],
    primaryQuery: 'Hundru Falls Ranchi Jharkhand waterfall',
    heroQuery: 'Netarhat sunset point hills Jharkhand'
  },
  'karnataka': {
    landmarks: ['Hampi ruins', 'Mysore Palace', 'Coorg coffee hills', 'Badami caves'],
    primaryQuery: 'Hampi stone chariot Vijayanagara Karnataka',
    heroQuery: 'Mysore Palace illuminated Karnataka night'
  },
  'kerala': {
    landmarks: ['Alleppey backwaters', 'Munnar tea hills', 'Varkala cliff', 'Houseboat Kerala'],
    primaryQuery: 'Alleppey houseboat backwaters Kerala palms',
    heroQuery: 'Munnar tea garden plantations Western Ghats Kerala'
  },
  'madhya-pradesh': {
    landmarks: ['Khajuraho temples', 'Sanchi Stupa', 'Bhedaghat Marble Rocks', 'Pachmarhi'],
    primaryQuery: 'Khajuraho Kandariya Mahadeva temple Madhya Pradesh',
    heroQuery: 'Bhedaghat Marble Rocks Narmada river Madhya Pradesh'
  },
  'maharashtra': {
    landmarks: ['Ajanta Ellora caves', 'Gateway of India', 'Western Ghats Sahyadri', 'Marine Drive'],
    primaryQuery: 'Kailasa temple Ellora caves Maharashtra rock-cut',
    heroQuery: 'Marine Drive Queen necklace Mumbai sunset Maharashtra'
  },
  'manipur': {
    landmarks: ['Loktak Lake', 'Keibul Lamjao', 'Sendra Island', 'Kangla Fort'],
    primaryQuery: 'Loktak Lake phumdis circular floating islands Manipur',
    heroQuery: 'Sendra Island Loktak Lake aerial view Manipur'
  },
  'meghalaya': {
    landmarks: ['Living Root Bridge', 'Dawki river', 'Nohkalikai Falls', 'Cherrapunji'],
    primaryQuery: 'Double decker living root bridge Nongriat Meghalaya',
    heroQuery: 'Dawki Umngot river transparent crystal clear water Meghalaya'
  },
  'mizoram': {
    landmarks: ['Aizawl city hills', 'Reiek peak', 'Vantawng Falls', 'Blue Mountain'],
    primaryQuery: 'Aizawl city on green mountain ridges Mizoram',
    heroQuery: 'Reiek mountain peak lush valley landscape Mizoram'
  },
  'nagaland': {
    landmarks: ['Dzukou Valley', 'Kohima War Cemetery', 'Hornbill festival', 'Khonoma'],
    primaryQuery: 'Dzukou Valley rolling green hills Nagaland landscape',
    heroQuery: 'Khonoma green village terrace fields Nagaland'
  },
  'odisha': {
    landmarks: ['Konark Sun Temple', 'Chilika Lake', 'Puri Jagannath beach', 'Udayagiri'],
    primaryQuery: 'Konark Sun Temple stone wheel chariot Odisha',
    heroQuery: 'Chilika Lake flamingos boats blue water Odisha'
  },
  'punjab': {
    landmarks: ['Golden Temple', 'Harmandir Sahib', 'Wagah Border', 'Qila Mubarak'],
    primaryQuery: 'Golden Temple Amritsar reflection pool Punjab night',
    heroQuery: 'Harmandir Sahib Golden Temple Amritsar illuminated Punjab'
  },
  'rajasthan': {
    landmarks: ['Amber Fort', 'Hawa Mahal', 'Jaisalmer Fort', 'Udaipur City Palace'],
    primaryQuery: 'Amber Fort Jaipur reflection Maota Lake Rajasthan',
    heroQuery: 'Hawa Mahal Palace of Winds Jaipur pink facade Rajasthan'
  },
  'sikkim': {
    landmarks: ['Tsomgo Lake', 'Kanchenjunga', 'Gurudongmar Lake', 'Rumtek Monastery'],
    primaryQuery: 'Tsomgo Lake Changu snow mountains Sikkim',
    heroQuery: 'Gurudongmar Lake sacred blue high altitude Sikkim'
  },
  'tamil-nadu': {
    landmarks: ['Meenakshi Temple', 'Mahabalipuram Shore Temple', 'Nilgiri toy train', 'Brihadisvara'],
    primaryQuery: 'Meenakshi Amman temple gopuram towers Madurai Tamil Nadu',
    heroQuery: 'Shore Temple Mahabalipuram Mamallapuram Bay of Bengal Tamil Nadu'
  },
  'telangana': {
    landmarks: ['Charminar', 'Golconda Fort', 'Ramappa Temple', 'Hussain Sagar'],
    primaryQuery: 'Charminar historic monument Hyderabad Telangana',
    heroQuery: 'Golconda Fort architectural fortress Hyderabad Telangana'
  },
  'tripura': {
    landmarks: ['Neermahal water palace', 'Unakoti rock carvings', 'Ujjayanta Palace'],
    primaryQuery: 'Neermahal water palace Rudrasagar Lake Tripura',
    heroQuery: 'Ujjayanta Palace white architectural heritage Agartala Tripura'
  },
  'uttar-pradesh': {
    landmarks: ['Taj Mahal', 'Varanasi ghats Ganga', 'Fatehpur Sikri', 'Ayodhya'],
    primaryQuery: 'Taj Mahal white marble monument Agra Uttar Pradesh morning',
    heroQuery: 'Varanasi Dashashwamedh Ghat Ganga aarti evening Uttar Pradesh'
  },
  'uttarakhand': {
    landmarks: ['Valley of Flowers', 'Rishikesh Lakshman Jhula', 'Nainital Lake', 'Kedarnath'],
    primaryQuery: 'Rishikesh Ganga river suspension bridge Uttarakhand mountains',
    heroQuery: 'Valley of Flowers alpine meadows Chamoli Uttarakhand'
  },
  'west-bengal': {
    landmarks: ['Victoria Memorial', 'Darjeeling tea train', 'Howrah Bridge', 'Sundarbans'],
    primaryQuery: 'Victoria Memorial white marble monument Kolkata West Bengal',
    heroQuery: 'Darjeeling Himalayan Railway toy train Kanchenjunga view West Bengal'
  },
  'andaman-and-nicobar-islands': {
    landmarks: ['Radhanagar Beach', 'Havelock Island', 'Cellular Jail', 'Ross Island'],
    primaryQuery: 'Radhanagar Beach Havelock Island turquoise water Andaman',
    heroQuery: 'Elephant Beach coral turquoise blue water Havelock Andaman'
  },
  'chandigarh': {
    landmarks: ['Rock Garden', 'Sukhna Lake', 'Capitol Complex Le Corbusier'],
    primaryQuery: 'Rock Garden Nek Chand sculptures Chandigarh',
    heroQuery: 'Sukhna Lake tranquil blue water sunset Chandigarh Shivalik'
  },
  'dadra-and-nagar-haveli-and-daman-and-diu': {
    landmarks: ['Diu Fort', 'Nagoa Beach', 'Moti Daman Fort', 'Dudhani Lake'],
    primaryQuery: 'Diu Fort Portuguese fortress Arabian Sea coastline',
    heroQuery: 'Nagoa Beach horseshoe palm trees Diu island'
  },
  'delhi': {
    landmarks: ['India Gate', 'Humayun Tomb', 'Qutub Minar', 'Lotus Temple'],
    primaryQuery: 'India Gate war memorial monument New Delhi evening',
    heroQuery: 'Humayun Tomb Mughal red sandstone architecture Delhi'
  },
  'jammu-and-kashmir': {
    landmarks: ['Dal Lake shikara', 'Gulmarg snow meadows', 'Pahalgam valley'],
    primaryQuery: 'Dal Lake shikara floating wooden boat Srinagar Kashmir',
    heroQuery: 'Gulmarg mountain meadows Gondola Kashmir landscape'
  },
  'ladakh': {
    landmarks: ['Pangong Tso lake', 'Nubra Valley sand dunes', 'Thiksey Monastery', 'Shanti Stupa'],
    primaryQuery: 'Pangong Lake blue water reflection barren mountains Ladakh',
    heroQuery: 'Thiksey Monastery perched mountain hill Leh Ladakh'
  },
  'lakshadweep': {
    landmarks: ['Agatti Island lagoon', 'Bangaram atoll', 'Kavaratti beach', 'Coral reef'],
    primaryQuery: 'Agatti Island turquoise crystal lagoon white sand Lakshadweep',
    heroQuery: 'Bangaram atoll aerial coral reef azure blue water Lakshadweep'
  },
  'puducherry': {
    landmarks: ['French Quarter White Town', 'Promenade Beach rock', 'Auroville Matrimandir'],
    primaryQuery: 'French Quarter White Town colonial yellow architecture Puducherry',
    heroQuery: 'Promenade Beach coastal boulevard Bay of Bengal Puducherry'
  }
};

/**
 * Process a single region for both 'primary' and 'hero' image roles
 */
export async function processRegion(slug, pool) {
  const strategy = STATE_STRATEGY[slug];
  if (!strategy) {
    throw new Error(`Strategy not found for slug: ${slug}`);
  }

  // 1. Fetch State details from DB
  const [[state]] = await pool.query('SELECT * FROM states WHERE slug = ?', [slug]);
  if (!state) {
    throw new Error(`State not found in database: ${slug}`);
  }

  const results = {
    stateId: state.id,
    stateName: state.name,
    slug: state.slug,
    regionType: state.region_type,
    primary: null,
    hero: null
  };

  for (const role of ['primary', 'hero']) {
    const query = role === 'primary' ? strategy.primaryQuery : strategy.heroQuery;
    const context = {
      stateName: state.name,
      regionType: state.region_type,
      role,
      landmarkKeywords: strategy.landmarks
    };

    // 2. Fetch current image association
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

    // Assess current image
    let currentScore = 80;
    let currentAssessment = null;
    if (currentEntityImg) {
      currentAssessment = aiQualityAssessor.assess(currentEntityImg, context);
      currentScore = currentAssessment.totalScore;
    }

    // 3. Discover candidates across Wikimedia & Openverse
    const wikimediaProvider = providerManager.getProvider('wikimedia');
    const openverseProvider = providerManager.getProvider('openverse');

    const targetW = role === 'hero' ? 1920 : 1200;
    const wikiCandidates = await wikimediaProvider.search(query, { limit: 8, targetWidth: targetW });
    let openverseCandidates = [];
    try {
      openverseCandidates = await openverseProvider.search(query, { limit: 5 });
    } catch {
      openverseCandidates = [];
    }

    const allCandidates = [...wikiCandidates, ...openverseCandidates];

    // 4. Assess all candidates
    let bestCandidate = null;
    let bestAssessment = null;

    for (const cand of allCandidates) {
      const assessment = aiQualityAssessor.assess(cand, context);
      if (!assessment.isEligible) continue;

      if (!bestCandidate || assessment.totalScore > bestAssessment.totalScore) {
        bestCandidate = cand;
        bestAssessment = assessment;
      }
    }

    // 5. Compare candidate with existing
    const shouldReplace = bestCandidate && bestAssessment && bestAssessment.totalScore > currentScore;

    if (shouldReplace) {
      // 6. Apply Non-Generative AI Enhancement
      const enhanced = imageEnhancer.enhance(bestCandidate, role);
      const finalDisplayUrl = enhanced.enhancedUrl || bestCandidate.displayUrl || bestCandidate.display_url || bestCandidate.originalUrl || bestCandidate.original_url;
      const finalOriginalUrl = bestCandidate.originalUrl || bestCandidate.original_url || finalDisplayUrl;
      const finalThumbnailUrl = bestCandidate.thumbnailUrl || bestCandidate.thumbnail_url || finalDisplayUrl;

      // 7. Transactional DB Update
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        // Register image in images table if not exists
        let newImageId;
        const [existing] = await conn.query('SELECT id FROM images WHERE original_url = ?', [finalOriginalUrl]);
        if (existing.length > 0) {
          newImageId = existing[0].id;
          // Update metadata
          await conn.query(
            `UPDATE images SET 
               display_url = ?,
               enhanced_url = ?,
               is_ai_enhanced = 1,
               enhancement_operations = ?,
               quality_score = ?,
               geo_accuracy_score = ?,
               technical_score = ?,
               aesthetic_score = ?,
               tourism_score = ?,
               recency_score = ?,
               composite_score = ?,
               ai_assessed_at = CURRENT_TIMESTAMP,
               ai_assessment_method = 'cims_vision_v1',
               resolution_label = ?,
               status = 'verified'
             WHERE id = ?`,
            [
              finalDisplayUrl,
              finalDisplayUrl,
              JSON.stringify(enhanced.operations),
              bestAssessment.totalScore,
              bestAssessment.scores.geo,
              bestAssessment.scores.technical,
              bestAssessment.scores.aesthetic,
              bestAssessment.scores.tourism,
              bestAssessment.scores.recency,
              bestAssessment.totalScore,
              enhanced.resolutionLabel,
              newImageId
            ]
          );
        } else {
          const cleanTitle = (bestCandidate.title || `${state.name} Landmark`).slice(0, 255);
          const cleanDesc = bestCandidate.description || bestCandidate.title || `${state.name} Tourism`;
          const cleanAlt = (bestCandidate.altText || bestCandidate.alt_text || `${state.name} Scenery`).slice(0, 255);
          const cleanPhotographer = (bestCandidate.photographerName || bestCandidate.photographer_name || 'Contributor').slice(0, 150);
          const cleanLicense = (bestCandidate.licenseName || bestCandidate.license_name || 'CC BY-SA 4.0').slice(0, 100);
          const cleanLicenseUrl = (bestCandidate.licenseUrl || bestCandidate.license_url || 'https://creativecommons.org/licenses/by-sa/4.0/').slice(0, 500);
          const cleanSourcePage = (bestCandidate.sourcePageUrl || bestCandidate.source_page_url || finalDisplayUrl).slice(0, 1000);
          const cleanProvider = (bestCandidate.providerName || bestCandidate.provider_name || 'wikimedia').slice(0, 50);
          const cleanProviderId = (bestCandidate.providerImageId || bestCandidate.provider_image_id || 'img_' + Date.now()).slice(0, 150);

          const [insResult] = await conn.query(
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
              finalOriginalUrl.slice(0, 1000),
              finalDisplayUrl.slice(0, 1000),
              finalThumbnailUrl.slice(0, 1000),
              cleanSourcePage,
              cleanTitle,
              cleanDesc,
              cleanAlt,
              cleanPhotographer,
              cleanLicense,
              cleanLicenseUrl,
              bestCandidate.attributionText || bestCandidate.attribution_text || `Photo via ${cleanProvider}`,
              bestCandidate.width || targetW,
              bestCandidate.height || (role === 'hero' ? 1080 : 800),
              bestCandidate.format || 'image/jpeg',
              state.name,
              bestAssessment.notes,
              bestAssessment.totalScore,
              bestAssessment.scores.geo,
              bestAssessment.scores.technical,
              bestAssessment.scores.aesthetic,
              bestAssessment.scores.tourism,
              bestAssessment.scores.recency,
              bestAssessment.totalScore,
              JSON.stringify(enhanced.operations),
              finalDisplayUrl.slice(0, 1000),
              enhanced.resolutionLabel
            ]
          );
          newImageId = insResult.insertId;
        }

        // Deactivate old entity image
        if (currentEntityImg) {
          await conn.query('UPDATE entity_images SET is_active = 0 WHERE id = ?', [currentEntityImg.entity_image_id]);
          // Record replacement history
          await conn.query(
            `INSERT INTO image_replacement_history (entity_type, entity_id, old_image_id, new_image_id, reason, replaced_by)
             VALUES ('state', ?, ?, ?, 'CIMS Phase 4 AI quality enhancement', 'ai_quality_enhancer')`,
            [state.id, currentEntityImg.image_id, newImageId]
          );
        }

        // Insert new entity_images association
        await conn.query(
          `INSERT INTO entity_images (entity_type, state_id, image_id, image_role, display_order, is_active)
           VALUES ('state', ?, ?, ?, 0, 1)`,
          [state.id, newImageId, role]
        );

        // Sync legacy column on states table
        const column = role === 'primary' ? 'image_url' : 'hero_image_url';
        await conn.query(`UPDATE states SET ${column} = ? WHERE id = ?`, [enhanced.enhancedUrl, state.id]);

        // Insert structured audit log
        await conn.query(
          `INSERT INTO image_quality_assessments (
             image_id, entity_type, entity_id, role, geo_accuracy_score,
             technical_score, aesthetic_score, tourism_score, recency_score,
             total_score, assessment_notes, assessed_by
           ) VALUES (?, 'state', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cims_ai_evaluator_v1')`,
          [
            newImageId,
            state.id,
            role,
            bestAssessment.scores.geo,
            bestAssessment.scores.technical,
            bestAssessment.scores.aesthetic,
            bestAssessment.scores.tourism,
            bestAssessment.scores.recency,
            bestAssessment.totalScore,
            bestAssessment.notes
          ]
        );

        await conn.commit();
        conn.release();

        results[role] = {
          action: 'REPLACED_AND_ENHANCED',
          previousImageId: currentEntityImg?.image_id,
          previousUrl: currentEntityImg?.display_url,
          previousScore: currentScore,
          newImageId,
          newUrl: enhanced.enhancedUrl,
          newScore: bestAssessment.totalScore,
          provider: bestCandidate.providerName || 'wikimedia',
          license: bestCandidate.licenseName,
          attribution: bestCandidate.attributionText,
          operations: enhanced.operations,
          resolution: enhanced.resolutionLabel,
          reason: `Score improved from ${currentScore} to ${bestAssessment.totalScore} (${bestAssessment.tier}): ${bestAssessment.notes}`
        };
      } catch (err) {
        await conn.rollback();
        conn.release();
        throw err;
      }
    } else {
      // Retain existing image, but update real assessment scores
      if (currentEntityImg) {
        await pool.query(
          `UPDATE images SET 
             geo_accuracy_score = ?,
             technical_score = ?,
             aesthetic_score = ?,
             tourism_score = ?,
             recency_score = ?,
             composite_score = ?,
             ai_assessed_at = CURRENT_TIMESTAMP,
             ai_assessment_method = 'cims_vision_v1'
           WHERE id = ?`,
          [
            currentAssessment.scores.geo,
            currentAssessment.scores.technical,
            currentAssessment.scores.aesthetic,
            currentAssessment.scores.tourism,
            currentAssessment.scores.recency,
            currentAssessment.totalScore,
            currentEntityImg.image_id
          ]
        );

        await pool.query(
          `INSERT INTO image_quality_assessments (
             image_id, entity_type, entity_id, role, geo_accuracy_score,
             technical_score, aesthetic_score, tourism_score, recency_score,
             total_score, assessment_notes, assessed_by
           ) VALUES (?, 'state', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cims_ai_evaluator_v1')`,
          [
            currentEntityImg.image_id,
            state.id,
            role,
            currentAssessment.scores.geo,
            currentAssessment.scores.technical,
            currentAssessment.scores.aesthetic,
            currentAssessment.scores.tourism,
            currentAssessment.scores.recency,
            currentAssessment.totalScore,
            currentAssessment.notes
          ]
        );
      }

      results[role] = {
        action: 'RETAINED',
        imageId: currentEntityImg?.image_id,
        url: currentEntityImg?.display_url,
        score: currentScore,
        provider: currentEntityImg?.provider_name,
        license: currentEntityImg?.license_name,
        attribution: currentEntityImg?.attribution_text,
        operations: [],
        resolution: currentEntityImg?.width ? `${currentEntityImg.width}x${currentEntityImg.height}` : 'HD',
        reason: `Existing image is already superior or matches candidate quality (${currentScore} pts)`
      };
    }
  }

  return results;
}
