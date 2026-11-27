# Explore India — Image API Compliance & Provider Evaluation Report

**Document Version:** 1.0.0  
**Audit Date:** November 25, 2026  
**Environment:** Node.js, Express.js REST API, React.js Frontend, MySQL  
**Scope:** Centralized Image Management System (CIMS) — Phase 1: West Bengal Pilot  

---

## 1. Executive Summary & Policy Compliance

In strict compliance with the **Absolute Zero-Cost Policy**, all external image providers evaluated for the **Centralized Image Management System (CIMS)** must satisfy the following non-negotiable criteria:
1. **$0.00 Total Cost:** No paid plans, no billing accounts, no credit card requirements, no auto-overage charges.
2. **Open & Permissive Licensing:** Media must be licensed under Public Domain, CC0, CC BY, or CC BY-SA (or equivalent free reuse terms).
3. **Hotlinking & Embedding Compliance:** The provider must allow hotlinking/embedding via HTTPS or provide standard thumbnail generation URLs.
4. **URL & Metadata Persistence:** MySQL will store canonical image URLs, thumbnail URLs, source links, licenses, and photographer credits. No photographic binary data (BLOBs) will be stored.
5. **Rate-Limiting Protection:** The backend service must track requests and pause prior to reaching any free quota limit.

---

## 2. Comprehensive Provider Audit & Comparison Matrix

| Provider | Official Documentation URL | Free Tier Pricing & Quota | Auth / Key Requirements | Commercial & CC License Support | Hotlinking / Embedding Policy | Approval Status | Rationale |
|---|---|---|---|---|---|:---:|---|
| **Wikimedia Commons API** | [commons.wikimedia.org/w/api.php](https://commons.wikimedia.org/w/api.php) | **100% Free** (Non-profit foundation). Recommended rate: up to 200 req/min with descriptive User-Agent. Zero billing accounts. | **No API key required.** Requires custom `User-Agent: ExploreIndia/2.0 (tourism-platform@example.com)`. | **Public Domain, CC0, CC BY, CC BY-SA**. Free cultural works only. Non-free commercial exclusions do not exist. | **Fully permitted**. Direct high-speed CDN delivery via `upload.wikimedia.org` and dynamic thumbnail generator via API `iiurlwidth`. | **APPROVED (Primary Provider)** | Highest geographical coverage of Indian districts, monuments, and rural heritage. 100% free with no keys or billing risks. |
| **Wikipedia / MediaWiki API** | [en.wikipedia.org/w/api.php](https://en.wikipedia.org/w/api.php) | **100% Free**. Same Wikimedia Foundation infrastructure and rate policies as Commons. | **No API key required.** Requires custom `User-Agent`. | Same as Wikimedia Commons. Images are hosted on Wikimedia Commons repository. | Fully permitted via `upload.wikimedia.org`. | **APPROVED (Secondary Discovery)** | Excellent for discovering canonical lead page images for specific districts and landmarks. |
| **Openverse API** | [api.openverse.org/v1/](https://api.openverse.org/v1/) | **100% Free**. Managed by WordPress.org. Unauth: 5 req/min. Free registered token: 100 req/min, 5,000 req/day. No credit card required. | Free registration required for API key (Client ID & Secret). | **CC0, CC BY, CC BY-SA, Public Domain**. Granular license filtering available. | Openverse proxies thumbnails (`/v1/images/{id}/thumb/`) or points to upstream canonical URL (must check upstream origin). | **APPROVED (Secondary Provider)** | Broad CC index across museums, Flickr, and cultural institutions. Strict zero-cost policy compliant. |
| **Flickr API** | [flickr.com/services/api/](https://www.flickr.com/services/api/) | **Free non-commercial tier**. 3,600 queries per hour (1 req/sec). | Free API key required (requires free Yahoo/Flickr account). | Mixed. **Must filter by `license=1,2,4,5,7,9,10`** (CC licenses & Public Domain only). | Permitted via `live.staticflickr.com` with mandatory photographer attribution and link to Flickr photo page. | **APPROVED (Backup Provider)** | Good coverage of travel photography. Strictly requires backlink attribution. |
| **Unsplash API** | [unsplash.com/developers](https://unsplash.com/developers) | **Free tier**. Demo: 50 requests/hour. Production: 5,000 req/hr upon application approval. | API Access Key required. | Unsplash Free License (allows commercial and non-commercial reuse without permission). | Permitted with required hotlinking (`images.unsplash.com`) and **mandatory download tracking endpoint calls**. | **CONDITIONAL / TERTIARY** | 50 req/hr demo limit is very restrictive for automated collection. Used selectively as tertiary fallback. |
| **Pexels API** | [pexels.com/api/](https://www.pexels.com/api/) | **Free tier**. 200 requests/hour, 20,000 requests/month. No billing required. | Free API key required. | Pexels Free License (free to use, attribution appreciated). | Permitted via `images.pexels.com`. | **CONDITIONAL / TERTIARY** | Very limited coverage of specific rural districts in India (e.g., Bankura, Birbhum, Jhargram). |

---

## 3. Approved Implementation Architecture for Pilot

1. **Primary Provider:** **Wikimedia Commons API**
   - Utilizes `action=query&generator=search&prop=imageinfo&iiprop=url|size|extmetadata|mime`
   - Strictly filters for image MIME types (`image/jpeg`, `image/png`, `image/webp`)
   - Uses `iiurlwidth=800` (cards) and `iiurlwidth=1280` (heroes) for optimized responsive CDN delivery from `upload.wikimedia.org`.
   - Extracts exact metadata: `Artist`, `LicenseShortName`, `LicenseUrl`, `Credit`, `ImageDescription`.
2. **Secondary/Fallback Discovery:** **Wikipedia API** (Pageimages API) & **Openverse API**.
3. **Attribution Guarantee:** All images will carry photographer credit, license badge, and original source link in the database and frontend components.
4. **Zero-Cost Safeguard:** Zero paid endpoints, zero cloud storage fees, zero subscription services.
