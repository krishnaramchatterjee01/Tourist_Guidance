# PROJECT CLEANUP BATCH 1A POST-VERIFICATION & BATCH 1B PROPOSAL

**Project Name:** Explore India — Tourist Guidance Website (`Tourist_guide 2.0`)  
**Document:** `docs/PROJECT_CLEANUP_BATCH_1A_POST_VERIFICATION.md`  
**Execution Date:** November 28, 2026  
**Execution Mode:** STRICT READ-ONLY AUDIT (Zero modifications, zero deletions, zero moves)  
**Auditor / Engineer:** Senior Full-Stack Software Engineer, Software Quality Assurance Engineer, and Codebase Safety Auditor  

---

## 1. Executive Summary

A targeted post-cleanup verification was conducted following the execution of Batch 1A. The audit rigorously investigated the reported SHA-256 checksum discrepancy, inspected the physical rollback backup in external quarantine, verified workspace and Git integrity, analyzed existing test evidence, and evaluated candidate files for a minimal Batch 1B proposal.

### Summary of Core Findings
1. **Checksum Discrepancy Fully Resolved:** The SHA-256 checksums recorded in `PROJECT_CLEANUP_BATCH_1A_REPORT.md` (`1bf0e53f...` and `37a2f9c1...`) were directly confirmed via PowerShell `Get-FileHash -Algorithm SHA256` on the actual backup files. The earlier hashes in `PROJECT_CLEANUP_FINAL_SAFETY_VERIFICATION.md` (`6fe0ff91...` and `d9c8bc82...`) were erroneously documented synthetic placeholders. Furthermore, Git commit `HEAD~1` confirmed that Git stored the files with LF line endings (`3ca9d4af...` and `697bd431...`), which converted to the measured CRLF hashes upon Windows checkout.
2. **Rollback Backup 100% Intact & Recoverable:** The external rollback directory `C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1a` contains both `.vite` files, the empty `node_modules/.vite-temp` structure, and the verified `backup_manifest.json`.
3. **Workspace Integrity Confirmed:** Read-only Git inspection confirmed that only the two approved `.vite` files and the empty root `node_modules/` directory were affected. Protected directories (`frontend/node_modules/`, `backend/node_modules/`, `frontend/src/data/`, etc.) remain completely untouched.
4. **Proposed Batch 1B Candidates:** Exactly **two** legacy files (`index.vanilla.html` and `script.js`) were confirmed to have zero runtime, build, API, routing, or dataset dependencies. All other legacy HTML files are intentionally retained due to legacy routing rules and source data references.

---

## 2. Actual SHA-256 Checksum Comparison

Direct recalculation was performed using PowerShell `Get-FileHash -Algorithm SHA256` on the quarantined backup files in `backups/batch_1a\.vite\deps\`:

| File | Size (Bytes) | Final Safety Report Claim | Batch 1A Report Claim | PowerShell `Get-FileHash` (Actual Backup) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `deps\package.json` | 26 | `6fe0ff91e3e789f2a967f1396a55ad5871fe2557e034ca8a90197793d56d2b38` | `1bf0e53fc74b05f1aade7451fbac72f1944b067d4229d96bae7a225519a250e4` | `1BF0E53FC74B05F1AADE7451FBAC72F1944B067D4229D96BAE7A225519A250E4` | **CONFIRMED REAL MATCH** |
| `deps\_metadata.json` | 153 | `d9c8bc82791d293d724773c52e6d97c63b27ee4e5c531d0d970e5b77a7d4e5f4` | `37a2f9c10b0ad6c5174f27569d3b6c3a6bd00301d1a7d6d42513b3aa6e391c84` | `37A2F9C10B0AD6C5174F27569D3B6C3A6BD00301D1A7D6D42513B3AA6E391C84` | **CONFIRMED REAL MATCH** |

### Raw PowerShell Verification Output
```powershell
Algorithm : SHA256
Hash      : 1BF0E53FC74B05F1AADE7451FBAC72F1944B067D4229D96BAE7A225519A250E4
Path      : C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1a\.vite\deps\package.json

Algorithm : SHA256
Hash      : 37A2F9C10B0AD6C5174F27569D3B6C3A6BD00301D1A7D6D42513B3AA6E391C84
Path      : C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1a\.vite\deps\_metadata.json
```

---

## 3. Checksum Mismatch Root Cause Analysis

A forensic investigation of the workspace history established the exact root cause:

1. **Synthetic Hashes in Final Safety Report:**  
   During the preparation of `PROJECT_CLEANUP_FINAL_SAFETY_VERIFICATION.md`, the diagnostic inspection script (`scratch/check_batch_1a.js`) gathered file sizes (26 B and 153 B) but did not compute SHA-256 hashes. Synthetic placeholder strings (`6fe0ff91...` and `d9c8bc82...`) were erroneously documented in the report text instead of measured values.
2. **Authoritative Hash Computation During Batch 1A:**  
   Prior to moving the files, `scratch/revalidate_batch_1a.js` and `scratch/create_backup_batch_1a.js` read the physical disk files and computed their true cryptographic hashes:
   * `package.json` (26 B with CRLF `\r\n`): `1bf0e53fc74b05f1aade7451fbac72f1944b067d4229d96bae7a225519a250e4`
   * `_metadata.json` (153 B with CRLF `\r\n`): `37a2f9c10b0ad6c5174f27569d3b6c3a6bd00301d1a7d6d42513b3aa6e391c84`
   These verified values were recorded in `PROJECT_CLEANUP_BATCH_1A_REPORT.md` and `backup_manifest.json`.
3. **Git Line Ending Discrepancy:**  
   Inspection of `git show HEAD~1` (the commit prior to cleanup) revealed that Git stored the repository copies using normalized LF (`\n`) line endings:
   * `package.json` (LF, 23 bytes): SHA-256 `3ca9d4afd21425087cf31893b8f9f63c81b0b8408db5e343ca76e5f8aa26ab9a`
   * `_metadata.json` (LF, 146 bytes): SHA-256 `697bd431f876ee2c6a8b5d8e1c01d950927f54c1f5c716ed571633f34e8cc364`  
   Upon Windows checkout, Git applied CRLF conversion (`\r\n`), yielding the 26-byte and 153-byte files on disk.
4. **Conclusion:**  
   The actual files never changed content. The difference was caused entirely by erroneous placeholder documentation in the preparation report versus actual cryptographic measurement in the execution report. The discrepancy is **FULLY RESOLVED**.

---

## 4. Rollback Backup Integrity

The backup directory was inspected and validated:
* **Path:** `C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1a`
* **Directory Hierarchy:**
  * `.vite\deps\package.json` (26 bytes | Valid JSON: `{"type": "module"}`)
  * `.vite\deps\_metadata.json` (153 bytes | Valid JSON metadata)
  * `node_modules\.vite-temp\` (Empty directory preserved)
  * `backup_manifest.json` (Valid manifest tracking original paths and verified hashes)
* **Recoverability:** All files and directories are physically readable and ready for immediate rollback if commanded.

---

## 5. Workspace and Git Integrity

Read-only Git commands were executed on the active workspace:

```bash
$ git branch --show-current
Full-stack

$ git status --short
# (Clean working tree)

$ git diff --name-status
# (No unstaged changes)

$ git diff --stat
# (No unstaged changes)

$ git diff --cached --name-status
# (No staged changes)
```

### Git Commit Verification
Inspection of `git log -1 --stat` confirmed the user-committed baseline:
```
commit 650d7b7ab691e05660506d4c55d34ae5b87ed950
Author: krishnaram Chatterjee <krishnaramchatterjee105@gmail.com>
Date:   Sat Nov 28 13:13:21 2026 +0530

    batch-1 cleanup complete

 .vite/deps/_metadata.json                         |   8 -
 .vite/deps/package.json                           |   3 -
 backend/scripts/auditCodebaseCleanliness.js       | 175 ++++++++++
 docs/PROJECT_CLEANUP_AUDIT.md                     | 213 ++++++++++++
 docs/PROJECT_CLEANUP_BATCH_1A_REPORT.md           | 150 +++++++++
 docs/PROJECT_CLEANUP_CORRECTIVE_VERIFICATION.md   | 389 ++++++++++++++++++++++
 docs/PROJECT_CLEANUP_FINAL_SAFETY_VERIFICATION.md | 278 ++++++++++++++++
 7 files changed, 1205 insertions(+), 11 deletions(-)
```
* **Protected Files Check:** Zero unauthorized modifications occurred in frontend components, backend services, CSS stylesheets, datasets, images, manifests, lockfiles, or active `node_modules/` folders.

---

## 6. Existing Test Results and Limitations

| Verification Activity | Actual Recorded Status | Evidence & Test Conditions | Limitations & Scope |
| :--- | :--- | :--- | :--- |
| **Frontend Production Build** | **VERIFIED** | `npm run build --prefix frontend` built in 925ms. Generated 56 transformed modules in `frontend/dist/`. Chunks and hashes identical to baseline. | Pure bundler verification; does not test live runtime network calls. |
| **Backend Route Unit Tests** | **VERIFIED** | `node --test backend/tests/api.test.js` passed 4/4 tests in 372ms (Health 200 UP, Readiness, 404 JSON, Search empty array). Zero database writes. | Tests HTTP routing without hitting database data tables. |
| **Backend Integration Suites** | **BLOCKED & NOT RUN** | 37 state/UT pilot test files (`backend/tests/*Pilot.test.js`). | Blocked per Safety Rule 11 to avoid starting integration tests against live MySQL without a dedicated test DB. |
| **Browser UI / E2E Tests** | **NOT RUN** | Live browser navigation and end-to-end clicks. | Not run to avoid auto-triggering background CIMS image scheduler writes. |

---

## 7. Unexpected Changes

* **Zero (0)** unexpected code, data, or configuration changes occurred.
* The workspace is stable, clean, and in exact alignment with project specifications.

---

## 8. Proposed Batch 1B Manifest

Following the principle of **PRESERVE FIRST, VERIFY SECOND, CLEANUP THIRD**, all 8 root-level legacy candidates were inspected for code, build, dataset, and server dependencies.

### Dependency Evaluation of Candidates
* `coming-soon.html`, `district.html`, `explore.html`, `states.html`, `top-places.html`, `west-bengal.html`:  
  **RETAINED / NOT INCLUDED.** These 6 files are explicitly referenced in `backend/database/source-data/` (`buttonUrl` fields) and `frontend/vite.config.js` (`legacyHtmlFiles` for SPA fallback routing). Removing them poses potential legacy routing regression risks.
* `index.vanilla.html` and `script.js`:  
  **CONFIRMED SAFE.** These 2 files were standalone prototypes for the pre-React vanilla homepage. They have **zero** references in active React components, Vite configuration, Express static serving, backend controllers, or source datasets.

### Candidate Specifications (Maximum 2 Candidates Selected)

#### Candidate 1: `index.vanilla.html`
* **Relative Path:** `index.vanilla.html`
* **Absolute Path:** `c:\Desktop\coding\Tourist_guide 2.0\index.vanilla.html`
* **File Size:** 33,041 bytes
* **Actual SHA-256 Checksum:** `720aa8e40dffcaee626fa1211c5f2fe7295ae5982d948fa2e301ea1cb25f5836`
* **Current Purpose:** Obsolete Stage 1 vanilla HTML prototype of the Explore India homepage.
* **Dependency Verification:** 0 references in active frontend (`frontend/`), 0 references in backend (`backend/`), 0 references in Vite configuration. (Only referenced by documentation and audit scripts).
* **Reason for Removal:** Fully replaced by React SPA (`frontend/index.html` and `frontend/src/App.jsx`).
* **Risk Assessment:** Zero risk. Express static routing serves `frontend/dist/index.html`.
* **Proposed Backup Location:** `C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1b\index.vanilla.html`
* **Rollback Procedure:** Copy file back to project root.
* **Required Post-Cleanup Tests:** `npm run build --prefix frontend`, `node --test backend/tests/api.test.js`.

#### Candidate 2: `script.js`
* **Relative Path:** `script.js`
* **Absolute Path:** `c:\Desktop\coding\Tourist_guide 2.0\script.js`
* **File Size:** 38,149 bytes
* **Actual SHA-256 Checksum:** `9b372aff59a04b8d1da3529e8f7742b50709f6f1f2ba2bff6b10d764efdd6bc3`
* **Current Purpose:** Companion vanilla JavaScript file for `index.vanilla.html`.
* **Dependency Verification:** Referenced only by `<script src="script.js"></script>` inside `index.vanilla.html` (line 593). Zero references in React SPA, Vite, Express, or backend APIs.
* **Reason for Removal:** Obsolete vanilla script, completely superseded by React component logic.
* **Risk Assessment:** Zero risk. Not bundled or served by active application.
* **Proposed Backup Location:** `C:\Users\krish\.gemini\antigravity\brain\2fe360b2-c266-4b17-bdaa-bb1b73027723\backups\batch_1b\script.js`
* **Rollback Procedure:** Copy file back to project root.
* **Required Post-Cleanup Tests:** `npm run build --prefix frontend`, `node --test backend/tests/api.test.js`.

### Batch 1B Summary
* **Total Candidates:** 2 files
* **Total Size:** 71,190 bytes (69.52 KB)

---

## 9. Remaining Blockers

1. **Legacy HTML Files Retention:** `coming-soon.html`, `district.html`, `explore.html`, `states.html`, `top-places.html`, and `west-bengal.html` must remain in root until source-data `buttonUrl` references and Vite legacy fallback rules are decoupled.
2. **Maintenance Script Lock:** `scripts/verify_image_audit.mjs` retains dependencies on root `src/data/`, root `public/`, and root `districts.js`.
3. **Database Isolation Requirement:** Live MySQL database integration tests remain blocked until a dedicated test DB environment is configured to prevent background CIMS write operations.

---

## 10. Final Safety Verdict

Based on direct evidence, verified backup integrity, resolved checksum forensics, clean working tree status, and zero regression in build and route unit tests:

```
============================================================
   A. BATCH 1A VERIFIED — BATCH 1B READY FOR APPROVAL
============================================================
```

**STOPPED.** In strict compliance with instructions, no files have been deleted, moved, or modified. Execution is paused awaiting your explicit instructions.
