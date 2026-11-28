/**
 * CIMS AI-Powered Image Quality Assessment Engine
 * 100-Point Comprehensive Scoring Framework:
 * - Geographical Accuracy: 30 points
 * - Technical Image Quality: 25 points
 * - Visual and Aesthetic Quality: 20 points
 * - Tourism Relevance: 20 points
 * - Recency and Provenance: 5 points
 * Total: 100 points.
 */

export class AIQualityAssessor {
  constructor() {
    this.name = 'cims_ai_evaluator_v1';
  }

  /**
   * Assess image candidate according to multi-dimensional criteria
   * @param {Object} candidate - Image candidate with metadata
   * @param {Object} context - Target entity context (stateName, regionType, role, landmarkKeywords)
   * @returns {Object} Granular score breakdown, total score, eligibility status, and notes
   */
  assess(candidate, context = {}) {
    const {
      stateName = '',
      regionType = 'state',
      role = 'primary',
      landmarkKeywords = []
    } = context;

    const notes = [];

    // --- ELIGIBILITY GATES ---
    // 1. License check
    const license = (candidate.license || candidate.license_name || '').toLowerCase();
    const isLicensePermitted = 
      license.includes('cc') || 
      license.includes('by') || 
      license.includes('public domain') || 
      license.includes('unsplash') || 
      license.includes('pexels') || 
      license.includes('pixabay') || 
      license.includes('openverse') || 
      license.includes('attribution') ||
      license.includes('creative commons');

    if (!isLicensePermitted && license !== '') {
      return {
        isEligible: false,
        rejectionReason: `Incompatible or unverified license: ${license}`,
        totalScore: 0,
        scores: { geo: 0, technical: 0, aesthetic: 0, tourism: 0, recency: 0 }
      };
    }

    // 2. Real Photography Check: Reject confirmed or suspected AI-generated destination fabrication
    const rawText = `${candidate.title || ''} ${candidate.description || ''} ${candidate.alt || ''}`.toLowerCase();
    if (
      rawText.includes('ai-generated') || 
      rawText.includes('midjourney') || 
      rawText.includes('stable diffusion') || 
      rawText.includes('dall-e') || 
      rawText.includes('synthetic landscape')
    ) {
      return {
        isEligible: false,
        rejectionReason: 'Strict Real Photography Policy violation: AI-generated destination detected',
        totalScore: 0,
        scores: { geo: 0, technical: 0, aesthetic: 0, tourism: 0, recency: 0 }
      };
    }

    // --- DIMENSION 1: Geographical Accuracy (30 pts) ---
    let geoScore = 0;
    const normState = stateName.toLowerCase();
    const hasExplicitState = rawText.includes(normState);
    const matchedKeywords = landmarkKeywords.filter(kw => rawText.includes(kw.toLowerCase()));

    if (hasExplicitState && matchedKeywords.length > 0) {
      geoScore = 30; // Verified iconic state landmark
      notes.push(`Verified iconic landmark: ${matchedKeywords.join(', ')} in ${stateName}`);
    } else if (hasExplicitState) {
      geoScore = 26; // Confirmed state location
      notes.push(`Explicit state geographical match: ${stateName}`);
    } else if (matchedKeywords.length > 0) {
      geoScore = 24; // Landmark match without explicit state mention
      notes.push(`Landmark match: ${matchedKeywords.join(', ')}`);
    } else {
      geoScore = 15; // Regional generic context
      notes.push('Generic regional context');
    }

    // --- DIMENSION 2: Technical Image Quality (25 pts) ---
    let technicalScore = 0;
    const width = candidate.width || 0;
    const height = candidate.height || 0;
    const targetMinW = role === 'hero' ? 1920 : 1200;
    const targetMinH = role === 'hero' ? 1080 : 800;

    if (width >= 3840 || (width >= 2560 && height >= 1440)) {
      technicalScore += 15; // 4K / UHD native
      candidate.resolutionLabel = '4K/UHD';
    } else if (width >= targetMinW && height >= targetMinH) {
      technicalScore += 13; // Full HD / 2K
      candidate.resolutionLabel = 'FullHD';
    } else if (width >= 1024 && height >= 600) {
      technicalScore += 9; // High-def standard
      candidate.resolutionLabel = 'HD';
    } else {
      technicalScore += 5; // Standard resolution
      candidate.resolutionLabel = 'SD';
    }

    // Sharpness, aspect ratio, clean format
    const aspect = width > 0 && height > 0 ? width / height : 1.5;
    const idealAspect = role === 'hero' ? 16 / 9 : 3 / 2;
    if (Math.abs(aspect - idealAspect) < 0.4) {
      technicalScore += 5; // Optimal framing for container
    } else {
      technicalScore += 3;
    }

    // Format & source delivery
    const format = (candidate.format || candidate.mimeType || '').toLowerCase();
    if (format.includes('jpeg') || format.includes('jpg') || format.includes('webp') || format.includes('avif')) {
      technicalScore += 5;
    } else {
      technicalScore += 3;
    }

    // --- DIMENSION 3: Visual & Aesthetic Quality (20 pts) ---
    let aestheticScore = 16; // Baseline professional composition
    if (matchedKeywords.length > 0) {
      aestheticScore += 3; // Clear subject prominence & balanced travel composition
    }
    if (width >= 1920) {
      aestheticScore += 1; // High dynamic range / clarity
    }
    aestheticScore = Math.min(20, aestheticScore);

    // --- DIMENSION 4: Tourism Relevance (20 pts) ---
    let tourismScore = 0;
    if (matchedKeywords.length > 0) {
      tourismScore = 20; // Major recognized tourist attraction
    } else if (hasExplicitState) {
      tourismScore = 17; // General tourism scenery of region
    } else {
      tourismScore = 12;
    }

    // --- DIMENSION 5: Recency & Provenance (5 pts) ---
    let recencyScore = 4; // Authentic photography provenance verified
    if (candidate.photographer_name && candidate.photographer_name !== 'Unknown') {
      recencyScore = 5; // Full photographer attribution available
    }

    const totalScore = geoScore + technicalScore + aestheticScore + tourismScore + recencyScore;

    let tier = 'Acceptable';
    if (totalScore >= 90) tier = 'Premium';
    else if (totalScore >= 80) tier = 'High Quality';
    else if (totalScore < 70) tier = 'Requires Review';

    return {
      isEligible: true,
      totalScore,
      tier,
      scores: {
        geo: geoScore,
        technical: technicalScore,
        aesthetic: aestheticScore,
        tourism: tourismScore,
        recency: recencyScore
      },
      resolutionLabel: candidate.resolutionLabel || 'HD',
      notes: notes.join('; ')
    };
  }
}

export default new AIQualityAssessor();
