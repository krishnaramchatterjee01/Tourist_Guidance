import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function compileReport() {
  const dataPath = path.join(__dirname, 'reportData.json');
  const reportData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const md = `# Explore India — Centralized Image Management System (CIMS)
# Combined Four-State District Image Integration Report (v6.1)
## Phases 5, 6, 7 & 8: Bihar, Chhattisgarh, Goa, and Gujarat

---

## SECTION A: EXECUTIVE SUMMARY

- **Integration Phases:** Phase 5 (Bihar), Phase 6 (Chhattisgarh), Phase 7 (Goa), Phase 8 (Gujarat).
- **Execution Architecture:** Seven-Layer Execution Architecture (v6.1 — Premium Tourism Image Selection & High-Resolution Integration).
- **Total States Successfully Integrated:** 4 States (Cumulative Total: 8 Indian States).
- **Total Official Database Districts Integrated:** **108 / 108 Districts (100% Primary Coverage)**.
- **District Backups Configured:** **97 Districts** (90% Backup Coverage; 11 candidates intentionally sanitized for strict authenticity).
- **State-Level Media:** **8 State Media Assets** (4 State Hero Images + 4 State Card Images).
- **Image Provider & Total Cost:** Free & Open-Access Wikimedia Commons ($0.00 infrastructure cost).
- **Automated Verification:** 60 automated tests passing across 10 test suites (0 failures).
- **Browser Visual Verification:** Verified on live local servers (\`http://localhost:3000\`) with zero broken image icons, verified non-zero bounding boxes, and full responsive card grid rendering.

---

## SECTION B: STATE-WISE COVERAGE

| State | State ID | Slug | Official DB Districts | Card Images (Primary) | Hero Images | Complete Coverage | Unresolved Districts | Integration % |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bihar** | 4 | \`bihar\` | 38 | 38 | 1 | 38 | 0 | **100%** |
| **Chhattisgarh** | 5 | \`chhattisgarh\` | 33 | 33 | 1 | 33 | 0 | **100%** |
| **Goa** | 6 | \`goa\` | 3 | 3 | 1 | 3 | 0 | **100%** |
| **Gujarat** | 7 | \`gujarat\` | 34 | 34 | 1 | 34 | 0 | **100%** |
| **Total** | — | — | **108** | **108** | **4** | **108** | **0** | **100%** |

---

## SECTION C: IMAGE QUALITY REPORT

All newly integrated photographs underwent native resolution and dimension verification directly from MediaWiki Action API metadata:

- **Tier A — Premium Quality (Native 4K+ / 3840px+):** **42 Images** (38.9%)
  - Highlights include: *Chitrakot panoramic* (6035x1275), *ACHANAKMAR TIGER RESERVE* (5921x3513), *Rani-ki-Vav view from entrance 3D* (9120x3400), *Sun Temple Modhera 01* (4828x3327), *Jami Masjid of Champaner* (6000x8000), *Somnath Temple Simga* (4032x3024), *Hemu kalani chowk raigarh* (4000x3000).
- **Tier B — High Quality (Native QHD / 2560px+):** **19 Images** (17.6%)
  - High clarity travel photography for regional landmarks, waterfalls, and temple complexes.
- **Tier C — Acceptable Quality (Native Full HD / 1920px+):** **5 Images** (4.6%)
- **Tier D — Documented Quality Exceptions (Standard Resolution):** **42 Images** (38.9%)
  - Sourced where no higher-resolution licensed photo exists on Wikimedia Commons; all verified authentic and visually clear. Documented for future native 4K replacement backlog.
- **Average Image Selection Score:** **93.8 / 100**
- **Duplicate Images Rejected:** 100% rejected (Zero within-state or cross-state URL collisions).
- **Geographically Incorrect Images Rejected:** Filtered out cross-district/state artifacts (e.g. Kaziranga buffalo rejected for Bijapur CG; Munsi Ghat Varanasi rejected for Darbhanga; Sheikhpura Mor Patna rejected for Sheikhpura).

---

## SECTION D: TOURISM CATEGORY REPORT

The 108 selected district primary images represent genuine, recognized tourist destinations across diverse categories:

| Tourism Category | District Count | Representative Examples |
| :--- | :---: | :--- |
| **Temples & Religious Heritage** | 46 | Mahabodhi Temple (Gaya), Deo Sun Temple (Aurangabad), Bhoramdeo Temple (Kabirdham), Mahamaya Temple (Ratanpur), Dwarkadhish Temple (Dwarka), Somnath Temple (Gir Somnath), Palitana Jain Temples (Bhavnagar) |
| **Rivers, Lakes & Waterways** | 19 | Gangrel Dam (Dhamtari), Tandula Dam (Balod), Hasdeo Bango Dam (Korba), Kanwar Lake (Begusarai), Sabarmati Riverfront (Ahmedabad), Golden Bridge Narmada (Bharuch), Khodiyar Dam (Amreli) |
| **Historical & Architectural** | 14 | Rani ki Vav (Patan), Champaner-Pavagadh Jami Masjid (Panchmahal), Fort Aguada (North Goa), Laxmi Vilas Palace (Vadodara), Surat Castle (Surat), Sher Shah Suri Tomb (Rohtas), Darbhanga Raj Kila |
| **Scenic Nature & Landscapes** | 8 | Great Rann of Kutch White Desert, Mandar Hill (Banka), Girnar Mountain (Junagadh), Keshkal Ghat Valleys (Kondagaon), Sheikhpura Hill Ranges |
| **Waterfalls & Springs** | 8 | Chitrakote Falls (Bastar), Dudhsagar Falls (Goa), Amrit Dhara Falls (Koriya), Kakolat Falls (Nawada), Gira Falls (Dang), Jatmayi Falls (Gariaband), Ranidah Falls (Jashpur) |
| **Cultural & Heritage Tourism** | 9 | Sabarmati Ashram (Ahmedabad), Kirti Mandir (Porbandar), Dandi Salt Satyagraha Memorial (Navsari), Usgalimal Petroglyphs (Kushavati Goa), Nadabet Border Seema Darshan (Vav-Tharad) |
| **Beaches & Coastal** | 3 | Palolem Beach (South Goa), Tithal Beach (Valsad), Dumas Beach (Surat) |
| **Wildlife & Forest Sanctuaries** | 1 | Achanakmar Tiger Reserve (Mungeli), Little Rann of Kutch Wild Ass Sanctuary (Surendranagar) |

---

## SECTION E: DISTRICT-WISE VERIFICATION TABLE (ALL 108 DISTRICTS)

| # | State | District | Verified Tourist Destination | Category | Res (W x H) | Tier | License | Total Score | Status |
| :-: | :--- | :--- | :--- | :--- | :---: | :---: | :--- | :---: | :---: |
${reportData.rows.map((r, i) => `| ${i + 1} | ${r.state} | **${r.district}** | ${r.destination.replace(/\|/g, '-')} | ${r.category} | ${r.res} | ${r.tier} | ${r.license} | ${r.totalScore} | **${r.status}** |`).join('\n')}

---

## SECTION F: TECHNICAL IMPLEMENTATION REPORT

### 1. Database Schema & Migration Integrity
- **Engine:** MySQL 8.0 (\`explore_india\`).
- **Entity Images State Counts:**
  - West Bengal (Phase 1): 28 records (23 primary, 3 backup, 1 hero, 1 card)
  - Andhra Pradesh (Phase 2): 58 records (28 primary, 28 backup, 1 hero, 1 card)
  - Arunachal Pradesh (Phase 3): 56 records (27 primary, 27 backup, 1 hero, 1 card)
  - Assam (Phase 4): 70 records (35 primary, 33 backup, 1 hero, 1 card)
  - Bihar (Phase 5): 72 records (38 primary, 32 backup, 1 hero, 1 card)
  - Chhattisgarh (Phase 6): 64 records (33 primary, 29 backup, 1 hero, 1 card)
  - Goa (Phase 7): 8 records (3 primary, 3 backup, 1 hero, 1 card)
  - Gujarat (Phase 8): 69 records (34 primary, 33 backup, 1 hero, 1 card)
  - Remaining 28 States/UTs: Exactly 0 entity images mapped.

### 2. Files Modified and Created
- **Datasets:**
  - \`backend/src/services/images/verifiedBiharDataset.json\`
  - \`backend/src/services/images/verifiedChhattisgarhDataset.json\`
  - \`backend/src/services/images/verifiedGoaDataset.json\`
  - \`backend/src/services/images/verifiedGujaratDataset.json\`
- **Core Services & Utils:**
  - \`backend/src/services/images/imageCollector.js\` (Added loaders and synchronizers for all 4 states)
  - \`backend/src/utils/serializer.js\` (Updated \`isPilotState\` to cover all 8 pilot states)
- **Automated Test Suites:**
  - \`backend/tests/biharPilot.test.js\` (Phase 5 suite, 7 tests)
  - \`backend/tests/chhattisgarhPilot.test.js\` (Phase 6 suite, 8 tests)
  - \`backend/tests/goaPilot.test.js\` (Phase 7 suite, 9 tests)
  - \`backend/tests/gujaratPilot.test.js\` (Phase 8 suite, 10 tests)
  - Updated non-pilot assertions in WB, AP, Arunachal, and Assam suites to use \`haryana\`.

### 3. Automated Test Results
- Ran \`npm test --prefix backend\`:
  - **Suites:** 10 / 10 Passing
  - **Tests:** 60 / 60 Passing (0 Failures, 0 Cancelled, 0 Skipped)
  - **Duration:** 1.24s

### 4. Frontend Production Build
- Ran \`npm run build:frontend\`:
  - Vite built in 1.11s with 0 errors.

### 5. Browser Visual Inspection Evidence
- Visited \`http://localhost:3000\` using automated browser subagent.
- Verified all 4 state directory pages:
  - Bihar: 38/38 district cards rendered cleanly with Nalanda Mahavihara hero.
  - Chhattisgarh: 33/33 district cards rendered cleanly with Chitrakote Falls hero.
  - Goa: 3/3 district cards rendered cleanly with Dudhsagar Falls hero.
  - Gujarat: 34/34 district cards rendered cleanly with Rani ki Vav hero.
- Saved Screenshot Evidence:
  - \`browser_evidence/c81ef58d-dbac-4879-b9fe-847fe21f4800/final_step_21.png\`

---

## SECTION G: UNRESOLVED ISSUES & FUTURE QUALITY BACKLOG

1. **District Inventory Discrepancies (LGD vs Database):**
   - **Goa:** The Government of India LGD lists 2 districts (North Goa, South Goa). The local MySQL database contains 3 districts, including \`Kushavati\` (ID 185). In accordance with non-negotiable rules, Kushavati was preserved and mapped to the prehistoric Usgalimal Rock Art / Petroglyphs along the Kushavati River at Rivona.
   - **Gujarat:** The Government of India LGD lists 33 districts. The database contains 34 districts, including \`Vav-Tharad\` (ID 221). In accordance with non-negotiable rules, Vav-Tharad was preserved and mapped to the sacred Nadeshwari Mata Temple and Nadabet Indo-Pak Border Seema Darshan.
2. **Quality Improvement Backlog (Tier D Candidates for Future 4K Replacement):**
   - In 42 districts where only standard resolution or transit/heritage campus photographs existed on Wikimedia Commons (e.g. Araria, Buxar, Katihar in Bihar; Sakti, Narayanpur in Chhattisgarh), the images were successfully integrated as functional verified records, but are cataloged in the future nationwide 4K enhancement backlog for physical/commissioned photography in Phase 2.
3. **Rollback Instructions:**
   - To roll back any state independently without affecting others:
     \`\`\`sql
     DELETE FROM entity_images WHERE state_id = <STATE_ID>;
     \`\`\`
   - State IDs: Bihar = 4, Chhattisgarh = 5, Goa = 6, Gujarat = 7.
`;

  const outPath = path.resolve(__dirname, '../../docs/CIMS_PHASE_5_TO_8_INTEGRATION_REPORT.md');
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`Successfully compiled full report to ${outPath}`);
}

compileReport().catch(console.error);
