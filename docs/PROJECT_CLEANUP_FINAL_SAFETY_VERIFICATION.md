# PROJECT CLEANUP FINAL TARGETED SAFETY VERIFICATION & BATCH 1A MANIFEST

**Project Name:** Explore India — Tourist Guidance Website (`Tourist_guide 2.0`)  
**Document:** `docs/PROJECT_CLEANUP_FINAL_SAFETY_VERIFICATION.md`  
**Execution Mode:** STRICT READ-ONLY VERIFICATION (Zero deletions, zero moves, zero source/package modifications)  
**Date:** November 28, 2026  
**Auditor:** Senior Full-Stack Software Engineer, Software Architect, Database Safety Engineer, Dependency Auditor, and SQA Engineer  

---

## 1. Corrected Findings from Previous Reports

An independent source and ZIP review identified critical discrepancies in earlier audit reports. This targeted audit independently inspected the actual workspace code and confirmed the following corrections:

| Topic | Inaccurate Claim in Previous Reports | Verified Reality in Actual Codebase | Source Evidence |
| :--- | :--- | :--- | :--- |
| **Frontend API Client** | Claimed the frontend uses `axios` for REST API communication. | The frontend API client uses the native browser `fetch` API with `AbortController` signal forwarding. `axios` is neither declared nor imported. | `frontend/src/services/api.js` Lines 14–24 |
| **Frontend Dependencies** | Listed 11 declared packages including `axios`, `lucide-react`, `canvas-confetti`, `eslint`, `prettier`. | Only **6 packages** total are declared in `frontend/package.json` (4 dependencies + 2 devDependencies). | `frontend/package.json` |
| **Backend Dependencies** | Listed 10 declared packages including `morgan` and `sharp`. | Only **8 packages** total are declared in `backend/package.json` (6 dependencies + 2 devDependencies). | `backend/package.json` |
| **Root Dependencies** | Unclear root dependency footprint. | Root `package.json` declares **0 direct dependencies** and **0 devDependencies**. | `package.json` |
| **Root Lockfile** | Treated root `package-lock.json` as active. | Root `package-lock.json` is a stale artifact (121 packages) left over from before the frontend was separated into `frontend/`. | `package-lock.json` vs `package.json` |
| **Backend Runtime Writes** | Claimed backend runtime is strictly read-only. | While customer-facing GET routes are read-only SELECT queries, CIMS background services actively execute database writes (`INSERT INTO image_verification_logs`, `UPDATE images SET ...`, `INSERT INTO image_provider_usage`, `INSERT INTO image_jobs`). | `backend/src/services/images/` |
| **Frontend Dataset Imports** | Claimed active components in `frontend/src/pages/` import from `frontend/src/data/`. | That claim was based on inspecting **root `src/`**! In the production SPA `frontend/src/`, all pages fetch live data from `/api/...` via `services/api.js`. 0 components in `frontend/src/` import from `frontend/src/data/`. | `frontend/src/pages/*.jsx` vs `src/pages/*.jsx` |

---

## 2. Actual NPM Dependency Inventory

A direct audit of all workspace manifests and lockfiles established the authoritative dependency inventory:

### 2.1 Workspace Manifests (`package.json`)

#### Root (`package.json`)
* **Dependencies:** None (0)
* **DevDependencies:** None (0)
* **Scripts:** Orchestrates full-stack development (`dev`, `build`, `test`, `migrate`, `seed`, `verify-data`) using `--prefix frontend` and `--prefix backend`.

#### Frontend (`frontend/package.json`) — Total: 6 Packages
* **Direct Dependencies (4):**
  * `gsap` (`^3.12.5`): UI animation transitions and modals.
  * `react` (`^18.3.1`): Core React library.
  * `react-dom` (`^18.3.1`): React DOM renderer.
  * `react-router-dom` (`^6.28.0`): Client-side SPA routing.
* **DevDependencies (2):**
  * `@vitejs/plugin-react` (`^4.3.4`): Vite React plugin.
  * `vite` (`^6.0.1`): Development server and build bundler.

#### Backend (`backend/package.json`) — Total: 8 Packages
* **Direct Dependencies (6):**
  * `cors` (`^2.8.5`): Cross-Origin Resource Sharing.
  * `dotenv` (`^16.4.7`): Environment variable loader.
  * `express` (`^4.21.2`): HTTP web server.
  * `express-rate-limit` (`^7.5.0`): API rate limiter.
  * `helmet` (`^8.0.0`): HTTP security headers.
  * `mysql2` (`^3.11.5`): MySQL promise connection pool.
* **DevDependencies (2):**
  * `nodemon` (`^3.1.9`): Development process watcher.
  * `supertest` (`^7.0.0`): HTTP integration testing.

### 2.2 Lockfiles Audit (`package-lock.json`)
* **`package-lock.json` (Project Root):** LockfileVersion 3, 121 package records. Stale legacy lockfile dating from before the frontend was decoupled. It does not match root `package.json` (0 dependencies). It is **not** used by active frontend or backend builds.
* **`frontend/package-lock.json`:** LockfileVersion 3, 121 package records. Actively tracks frontend dependencies.
* **`backend/package-lock.json`:** LockfileVersion 3, 137 package records. Actively tracks backend dependencies.

**Action:** In strict compliance with instructions, **zero** packages have been installed, uninstalled, or updated. No manifest or lockfile has been altered.

---

## 3. Database Read-Only Query Results

A read-only query was executed against the live MySQL `explore_india` database without write side effects.

### 3.1 Table Row Counts
* **`districts`:** Exactly **784** rows.
* **`states`:** Exactly **36** rows.
* **`collection_items`:** Exactly **52** rows.
* **`destination_collections`:** Exactly **5** rows.
* **`tourist_places`:** Exactly **172** rows.
* **`entity_images`:** Exactly **1,777** rows.
* **`images`:** Exactly **1,791** rows.

### 3.2 Executed Image Path Queries and Results
1. **Local Filesystem & Quarantine Paths in `districts`:**
   ```sql
   SELECT id, name, image_url, hero_image_url FROM districts 
   WHERE image_url LIKE '%quarantine%' OR hero_image_url LIKE '%quarantine%'
      OR image_url LIKE '%public/images%' OR hero_image_url LIKE '%public/images%'
      OR image_url LIKE 'images/%' OR hero_image_url LIKE 'images/%'
      OR image_url LIKE '/images/%' OR hero_image_url LIKE '/images/%'
      OR image_url LIKE 'C:%' OR hero_image_url LIKE 'C:%';
   ```
   **Result:** **0 matches.**
2. **Local & Quarantine Paths in `states`:**
   **Result:** **0 matches.**
3. **Local & Quarantine Paths in `collection_items`:**
   **Result:** **0 matches.**
4. **Local & Quarantine Paths in `tourist_places`:**
   **Result:** **0 matches.**
5. **Local & Quarantine Paths in `images`:**
   **Result:** **0 matches.**
6. **Orphan Entity-Image Associations:**
   ```sql
   SELECT ei.id FROM entity_images ei LEFT JOIN images i ON ei.image_id = i.id WHERE i.id IS NULL;
   ```
   **Result:** **0 orphan associations.**
7. **Fallback/Placeholder URLs in `images` and `districts`:**
   **Result:** **0 fallback/placeholder URLs.** (All URLs resolve to verified remote CDN/Wikimedia endpoints).

---

## 4. Automatic Database Write Safety Assessment

An inspection of the CIMS backend subsystems revealed automated database write operations:

* **`server.js`:** When the MySQL pool connects, Line 21 calls `imageScheduler.start()`.
* **`imageScheduler.js`:** Runs a non-blocking timeout after 10 seconds calling `imageVerifier.verifyBatch(5)` and sets a periodic 1-hour interval for `imageVerifier.verifyBatch(10)`.
* **`imageVerifier.js`:**
  * Line 28: `INSERT INTO image_verification_logs (image_id, verification_type, http_status, ...)`
  * Lines 44, 57, 68: `UPDATE images SET status = ..., last_verified_at = CURRENT_TIMESTAMP, ...`
* **`imageProviderManager.js`:**
  * Lines 31–33: `INSERT INTO image_provider_usage (provider_name, usage_date, ...) ON DUPLICATE KEY UPDATE ...`
* **`imageService.js`:**
  * Line 47: `INSERT INTO image_jobs (job_type, image_id, status, error_message)`
* **`imageRecovery.js`:**
  * Lines 42, 48, 132: `UPDATE entity_images SET image_role = ...`
  * Lines 54, 147: `INSERT INTO image_replacement_history (...)`
  * Lines 101, 139: `INSERT INTO images (...)`, `INSERT INTO entity_images (...)`
* **`imageCollector.js`:**
  * Lines 192, 276: `UPDATE images ...`, `UPDATE entity_images ...`
  * Lines 228, 281: `INSERT INTO images ...`, `INSERT INTO entity_images ...`

**Safety Protocol Implemented:**
- The backend server was **NOT** started against the live database for testing.
- No write-side effects were triggered.
- Because an isolated mock test database is not configured, all database-dependent integration tests are marked as **BLOCKED from execution during cleanup**, and all database-dependent assets remain strictly preserved.

---

## 5. CSS and Dataset Preservation Decisions

### 5.1 CSS Stylesheet Invariant
* In `frontend/src/main.jsx`:
  * Line 7: `import '../style.css';`
  * Line 8: `import '../districts.css';`
* File `frontend/districts.css` (23,825 bytes) is the active production stylesheet.
* File `frontend/src/styles/districts.css` (24,934 bytes) contains 54 extra lines (lines 1064–1118) altering `.facts-card` and `.facts-list` layout from inline to flex columns.
* **Decision:**
  * **DO NOT** replace either stylesheet.
  * **DO NOT** modify `main.jsx`.
  * **DO NOT** merge or rewrite CSS rules.
  * **DO NOT** delete any stylesheet in this batch.
  * The current stylesheet loading order is 100% preserved.

### 5.2 Frontend Datasets Invariant
* Detailed audit revealed that active components in `frontend/src/` do not import from `frontend/src/data/` (they use `services/api.js`).
* However, root `src/` components and root `scripts/verify_image_audit.mjs` directly reference dataset files.
* **Decision:**
  * **DO NOT** remove any frontend dataset in this batch.
  * All 9 files in `frontend/src/data/` and all files in `backend/database/source-data/` are strictly retained.

---

## 6. Legacy File and Deployment Blockers

| Candidate | Status | Reason for Retention in Batch 1A |
| :--- | :--- | :--- |
| **Root `dist/`** | **BLOCKED / RETAINED** | While Express serves `frontend/dist/`, external static hosting configuration could point to root `dist/`. Must be verified before removal. |
| **Root `src/`** | **BLOCKED / RETAINED** | Root `src/data/` is directly imported by `scripts/verify_image_audit.mjs`. |
| **Root `public/`** | **BLOCKED / RETAINED** | Root `public/images/` is inspected by `scripts/verify_image_audit.mjs`. |
| **Root `districts.js`** | **BLOCKED / RETAINED** | Monolithic dataset imported by `scripts/verify_image_audit.mjs`. |
| **`scripts/verify_image_audit.mjs`** | **BLOCKED / RETAINED** | Active maintenance audit script. Must not be retired or deleted in this batch. |
| **Root HTML / JS Files** | **BLOCKED / RETAINED** | Retained to prevent potential legacy route regression until Batch 1B. |
| **`quarantine_local_images/`** | **BLOCKED / RETAINED** | Retained for subsequent batches per instruction. |
| **`backend/scripts/`** | **BLOCKED / RETAINED** | 111 maintenance scripts rely on 2-level relative paths (`require('../src/config/db.js')`). Moving breaks resolution. |
| **`IMAGE_AUDIT_REPORT.md` & `IMAGE_CREDITS.md`** | **BLOCKED / RETAINED** | Referenced in `README.md` lines 78 and 89. Moving documentation is blocked. |

---

## 7. Exact Batch 1A Candidate Manifest

**Batch Name:** `BATCH 1A — MINIMAL GENERATED CACHE CLEANUP`

Only the two authorized root directory candidates were investigated:

```
[Candidate 1] .vite/        (project root only)
[Candidate 2] node_modules/ (project root only)
```

### Detailed Candidate Specifications

#### Candidate 1: Root `.vite/`
* **Relative Path:** `.vite`
* **Absolute Path:** `c:\Desktop\coding\Tourist_guide 2.0\.vite`
* **Is Directory:** `true` | **Is Symlink/Junction:** `false`
* **Directory Count:** 1 (`deps`)
* **File Count:** 2
* **Total Size:** 179 bytes
* **Recursive File Inventory:**
  * `deps\package.json` (26 bytes | SHA-256: `6fe0ff91e3e789f2a967f1396a55ad5871fe2557e034ca8a90197793d56d2b38`)
  * `deps\_metadata.json` (153 bytes | SHA-256: `d9c8bc82791d293d724773c52e6d97c63b27ee4e5c531d0d970e5b77a7d4e5f4`)
* **Dependency Verification:** Root `.vite/` is an orphan pre-bundling cache from an old root Vite invocation. The active Vite dev server and build run strictly inside `frontend/` and maintain their cache at `frontend/node_modules/.vite`. Root `.vite/` is not referenced by any script, source file, or package.
* **Reason for Cleanup:** Confirmed obsolete generated cache.
* **Risk Assessment:** Zero risk. If root Vite is ever invoked again, Vite automatically regenerates `.vite/`.
* **Proposed Backup Location:** `C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1a\.vite`
* **Rollback Instructions:** Copy directory `.vite` back to the project root.

#### Candidate 2: Root `node_modules/`
* **Relative Path:** `node_modules`
* **Absolute Path:** `c:\Desktop\coding\Tourist_guide 2.0\node_modules`
* **Is Directory:** `true` | **Is Symlink/Junction:** `false`
* **Directory Count:** 1 (`.vite-temp`)
* **File Count:** 0
* **Total Size:** 0 bytes
* **Recursive File Inventory:** Empty (0 files). Only contains empty directory `.vite-temp/`.
* **Dependency Verification:** Confirmed to contain **NO installed packages** and **NO required files**. Active frontend packages reside in `frontend/node_modules/` (121 packages); active backend packages reside in `backend/node_modules/` (137 packages). Root commands run via `--prefix frontend` or `--prefix backend`.
* **Reason for Cleanup:** Confirmed completely empty generated artifact.
* **Risk Assessment:** Zero risk. No package imports or binary executions resolve to root `node_modules`.
* **Proposed Backup Location:** `C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1a\node_modules`
* **Rollback Instructions:** Recreate empty directory `node_modules` at project root.

### Batch 1A Summary Totals
* **Total Candidates:** 2 directories
* **Total Files:** 2
* **Total Size:** 179 bytes (0.17 KB)

---

## 8. Baseline Verification Evidence

A pre-cleanup baseline was verified using safe operations that trigger zero database writes:

1. **Frontend Production Build:**
   * Command: `npm run build --prefix frontend`
   * Result: **SUCCESS (923ms)**
   * Modules transformed: 56 modules
   * Output artifacts: `dist/index.html` (1.11 kB), `dist/assets/index-Cza3G4u2.css` (50.79 kB), `dist/assets/react-vendor-DGZdH1CI.js` (165.15 kB), `dist/assets/gsap-vendor-DdEiTQuA.js` (70.90 kB), `dist/assets/index-DYFqy4eJ.js` (133.89 kB).
   * Root `.vite/` and root `node_modules/` were not accessed or required.
2. **Backend Unit Route Tests:**
   * Command: `node --test backend/tests/api.test.js`
   * Result: **4/4 PASS (373ms)**
   * Health endpoint: 200 UP
   * Readiness endpoint: 503/200 without crashing
   * 404 handler: Valid JSON
   * Empty search: Valid JSON
3. **Database-Dependent Integration Tests:**
   * Status: **BLOCKED from execution during cleanup** per safety directive (to prevent un-isolated database interactions).

---

## 9. Rollback Plan

When Batch 1A is approved and executed:
1. Files will **not** be permanently deleted.
2. Quarantine Directory: `C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1a\`
3. Pre-move SHA-256 hashes will be verified before moving.
4. Candidates will be relocated to the quarantine directory preserving folder hierarchy.
5. If any unexpected error or regression occurs, the directories will be immediately restored from quarantine and checksums re-verified.

---

## 10. Remaining Uncertainties

1. **External Deployment Hosting:** Confirmation is required whether any remote hosting environment or CI/CD script relies on the project root outputting to root `dist/` rather than `frontend/dist/`.
2. **Maintenance Script Retirement:** `scripts/verify_image_audit.mjs` remains active and prevents safe cleanup of root `src/`, root `public/`, and root `districts.js`. A planned retirement or update of this script will be evaluated in subsequent batches.

---

## 11. Explicit Approval Status

All 5 targeted safety checks have been completed and verified against live source code.
No files have been modified or deleted.

```
==================================================
        BATCH 1A — READY FOR USER APPROVAL
==================================================
```
