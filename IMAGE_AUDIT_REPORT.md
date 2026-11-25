# Explore India — Comprehensive Image System Audit & Resolution Report

**Date:** November 25, 2026  
**Environment:** React.js, Vite, React Router, GSAP  
**Repository Branch:** `react-migration`  

---

## 1. Executive Summary

A comprehensive geographical audit was executed across all pages of the **Explore India** web application to eliminate:
1. Broken image placeholders caused by external hotlink blocks and Wikimedia Commons thumbnail sizing restrictions.
2. Geographically inaccurate / mismatched images (e.g., VW camper van on a beach for Varanasi, Borobudur stupas for Munnar/Assam, canoe in river for Hampi/Ajanta/Konark/Mysore).
3. Missing state portal hero backgrounds (specifically reported on Arunachal Pradesh).
4. Excessive district placeholders across Arunachal Pradesh and other states.
5. Inappropriate duplicate inheritance (e.g., all 75 UP districts displaying the Taj Mahal).

### Key Architecture Fix: Local Asset Delivery
Every external image dependency has been permanently transitioned to local, optimized image assets stored directly inside `public/images/`. In Vite, all assets in `public/` are served at the root `/images/...` with:
- **Zero CORS restrictions**
- **Zero HTTP 400 thumbnail sizing issues**
- **Zero Referer / Hotlink blocks**
- **100% offline availability**

---

## 2. Issues Investigated & Resolved

### A. Explore Page (`src/pages/Explore.jsx` & `src/data/exploreData.js`)
*User Screenshot Reference:* `media_1795590087051_b93fb685.jpg`

| Destination | Reported Defect | Root Cause | Solution & Local Asset |
|---|---|---|---|
| **Rishikesh** | Dark placeholder | Broken Wikimedia Commons 1000px URL | `/images/destinations/rishikesh.jpg` (Lakshman Jhula) |
| **Darjeeling** | Dark placeholder | Broken Unsplash ID | `/images/destinations/darjeeling.jpg` (Tea estates & Kanchenjunga) |
| **Amritsar** | Dark placeholder | Broken Wikimedia Commons 1000px URL | `/images/destinations/amritsar.jpg` (Golden Temple) |
| **Shillong** | Dark placeholder | Broken Wikimedia Commons 1000px URL | `/images/destinations/shillong.jpg` (Umiam Lake) |
| **Varanasi** | Incorrect image (VW bus on beach) | Unsplash `photo-1561361513-2d000a50f0dc` | `/images/destinations/varanasi.jpg` (Dashashwamedh Ghat Ganga Aarti) |
| **Munnar** | Incorrect image (Indonesian Stupas) | Unsplash `photo-1596402184320-417e7178b2cd` | `/images/destinations/munnar.jpg` (Misty Western Ghats tea plantations) |
| **Hampi** | Incorrect image (Canoe in river) | Unsplash `photo-1590050752117-238cb0fb12b1` | `/images/destinations/hampi.jpg` (Vijaya Vittala Stone Chariot) |

---

### B. Top Places Page (`src/pages/TopPlaces.jsx` & `src/data/topPlacesData.js`)
*User Screenshot Reference:* `media_1795590100491_6afe472f.jpg`

| Attraction | Reported Defect | Root Cause | Solution & Local Asset |
|---|---|---|---|
| **Golden Temple** | Dark placeholder | Broken Wikimedia Commons 1000px URL | `/images/attractions/golden-temple.jpg` (Harmandir Sahib & Amrit Sarovar) |
| **Qutub Minar** | Displaying India Gate | Reused India Gate ID `photo-1587474260584-136574528ed5` | `/images/attractions/qutub-minar.jpg` (73m sandstone minaret) |
| **Hawa Mahal** | Showing generic desert fort | Unsplash `photo-1599661046289-e31897846e41` | `/images/attractions/hawa-mahal.jpg` (Pink honeycomb facade) |
| **Dal Lake** | Showing horse in meadow | Unsplash `photo-1598091383021-15ddea10925d` | `/images/attractions/dal-lake.jpg` (Srinagar shikara on tranquil waters) |
| **Ajanta & Ellora** | Showing canoe in river | Unsplash `photo-1590050752117-238cb0fb12b1` | `/images/attractions/ajanta-ellora.jpg` (Kailasa monolithic rock temple) |
| **Konark Sun Temple** | Showing canoe in river | Unsplash `photo-1590050752117-238cb0fb12b1` | `/images/attractions/konark-sun-temple.jpg` (Stone chariot wheel sundials) |
| **Mysore Palace** | Showing canoe in river | Unsplash `photo-1590050752117-238cb0fb12b1` | `/images/attractions/mysore-palace.jpg` (Wadiyar royal residence) |
| **Varanasi Ghats** | Showing VW bus on beach | Unsplash `photo-1561361513-2d000a50f0dc` | `/images/attractions/varanasi-ghats.jpg` (Sacred Ganges riverfront ghats) |
| **Dudhsagar Falls** | Dark placeholder | Broken Wikimedia Commons 1000px URL | `/images/attractions/dudhsagar-falls.jpg` (4-tier cascading waterfall) |

---

### C. States Directory Page (`src/pages/States.jsx`, `src/data/regionsData.js`, & `src/data/stateImages.js`)
*User Screenshot Reference:* `media_1795590115396_b0400689.jpg`

- **Root Cause:** All 15 missing state cards (Andhra Pradesh, Arunachal Pradesh, Chhattisgarh, Gujarat, Haryana, Jharkhand, Madhya Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Tripura, Uttarakhand) were attempting to load `upload.wikimedia.org/.../1200px-...` thumbnails. These failed with HTTP 400 (only standard thumbnail widths permitted) or HTTP 403 (referrer blocked).
- **Mismatches Fixed:**
  - Bihar: Replaced VW bus on beach with authentic Mahabodhi Temple (`/images/states/bihar.jpg`).
  - Assam: Replaced Indonesian stupas with Kaziranga Rhinoceros in Brahmaputra Valley (`/images/states/assam.jpg`).
- **Solution:** All 28 States and 8 Union Territories now load directly from `/images/states/${slug}.jpg` and `/images/union-territories/${slug}.jpg`.

---

### D. District Pages & Hero Backgrounds (`StateDirectory.jsx` & `districtImages.js`)
*User Screenshot Reference:* `media_1795590125899_6fddede3.jpg`

1. **Missing Arunachal Pradesh Hero Background:**
   - `.wb-hero` in `StateDirectory.jsx` had only a CSS gradient background.
   - Fixed by applying `.wb-hero.has-state-bg` with `linear-gradient(...)` and `url('/images/states/${stateSlug}.jpg')`.
   - Now displays the majestic Tawang Monastery banner for Arunachal Pradesh, Tirumala for Andhra Pradesh, and Victoria Memorial for West Bengal.
2. **All 27 Arunachal Pradesh District Placeholders:**
   - In previous attempts, `getDistrictImage` returned `null` for all non-WB districts.
   - Fixed by storing and resolving all 27 Arunachal Pradesh districts to `/images/districts/arunachal-pradesh/${distSlug}.jpg`.
3. **Andhra Pradesh Districts (28):**
   - All 28 districts resolved to `/images/districts/andhra-pradesh/${distSlug}.jpg`.
4. **West Bengal Districts (23):**
   - All 23 districts resolved to `/images/districts/west-bengal/${distSlug}.jpg`.
5. **Uttar Pradesh (75 Districts):**
   - Prominent cultural districts receive verified landmarks (`agra.jpg`, `ayodhya.jpg`, `jhansi.jpg`, `lucknow.jpg`, `mathura.jpg`, `prayagraj.jpg`, `varanasi.jpg`).
   - The remaining administrative districts safely return `null` and display the clean, dark mountain SVG placeholder (`destination-placeholder.svg`), strictly blocking duplicate inheritance of the Taj Mahal.

---

## 3. Verification & Automated Test Results

A full automated verification script (`scripts/verify_image_audit.mjs`) was executed:
```
Checking Explore Data (16 items)...
Checking Top Places Data (16 items)...
Checking Home Sliders...
Checking STATE_IMAGES (36 items)...
Checking regionsData (36 items)...
Checking Arunachal Pradesh districts (27)...
Checking Andhra Pradesh districts (28)...
Checking West Bengal districts (23)...
Checking Uttar Pradesh districts (75)...
UP districts: 7 verified landmarks, 68 safe placeholders (no Taj Mahal duplication).
Verified: Aligarh correctly does NOT inherit Taj Mahal (returns null)
Checking State Directory Hero Images for all 28 states...
-------------------------------------------
TOTAL VERIFIED LOCAL IMAGE CALLS CHECKED: 237
ERRORS FOUND: 0
ALL AUDITS PASSED WITH ZERO ERRORS!
```

Additionally, `npm run build` compiled all production bundles cleanly with zero warnings or errors.
