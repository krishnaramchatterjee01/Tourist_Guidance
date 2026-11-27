-- ============================================================
-- Explore India — Relational Database Schema
-- MySQL 8.0+ | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS explore_india
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE explore_india;

-- ------------------------------------------------------------
-- 1. Schema Migrations Tracking
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schema_migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(100) NOT NULL UNIQUE,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. States & Union Territories (36 Regions)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS states (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  region_type ENUM('state', 'ut') NOT NULL DEFAULT 'state',
  capital VARCHAR(100),
  description TEXT,
  short_description TEXT,
  tagline VARCHAR(255),
  image_url VARCHAR(500),
  hero_image_url VARCHAR(500),
  total_districts INT DEFAULT 0,
  button_url VARCHAR(255),
  button_text VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_states_region_type (region_type),
  INDEX idx_states_slug (slug),
  INDEX idx_states_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Districts (739 Districts across India)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS districts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  state_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  headquarters VARCHAR(100),
  division VARCHAR(100),
  tagline VARCHAR(255),
  short_description TEXT,
  full_description TEXT,
  image_url VARCHAR(500),
  hero_image_url VARCHAR(500),
  best_time_to_visit VARCHAR(100),
  known_for VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_state_district_slug (state_id, slug),
  CONSTRAINT fk_districts_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE,
  INDEX idx_districts_slug (slug),
  INDEX idx_districts_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Tourist Places & Attractions (Specific District Points of Interest)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tourist_places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_id VARCHAR(100),
  state_id INT,
  district_id INT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  location VARCHAR(200),
  description TEXT,
  image_url VARCHAR(500),
  map_query VARCHAR(255),
  map_url VARCHAR(500),
  highlights TEXT,
  best_time_to_visit VARCHAR(100),
  badge VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_places_source (source_id),
  CONSTRAINT fk_places_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE SET NULL,
  CONSTRAINT fk_places_district FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL,
  INDEX idx_places_category (category),
  INDEX idx_places_slug (slug),
  INDEX idx_places_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Destination Collections (Explore, Top Places, Sliders)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS destination_collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  subtitle TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Collection Items (Curated Destination Cards with Original Metadata)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS collection_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  collection_id INT NOT NULL,
  place_id INT,
  destination_name VARCHAR(150) NOT NULL,
  state_name VARCHAR(100),
  category VARCHAR(100),
  badge VARCHAR(100),
  image_url VARCHAR(500),
  alt_text VARCHAR(255),
  description TEXT,
  location VARCHAR(200),
  best_time VARCHAR(100),
  highlights TEXT,
  map_query VARCHAR(255),
  button_url VARCHAR(255),
  button_text VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_col_items_collection FOREIGN KEY (collection_id) REFERENCES destination_collections(id) ON DELETE CASCADE,
  CONSTRAINT fk_col_items_place FOREIGN KEY (place_id) REFERENCES tourist_places(id) ON DELETE SET NULL,
  INDEX idx_collection_order (collection_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. Master Images Registry (Centralized Image Management System)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_name VARCHAR(50) NOT NULL,
  provider_image_id VARCHAR(150),
  original_url VARCHAR(1000) NOT NULL,
  display_url VARCHAR(1000) NOT NULL,
  thumbnail_url VARCHAR(1000),
  source_page_url VARCHAR(1000),
  title VARCHAR(255),
  description TEXT,
  alt_text VARCHAR(255),
  photographer_name VARCHAR(150),
  photographer_url VARCHAR(500),
  license_name VARCHAR(100) NOT NULL DEFAULT 'CC BY-SA',
  license_version VARCHAR(50),
  license_url VARCHAR(500),
  attribution_text TEXT,
  width INT,
  height INT,
  format VARCHAR(50) DEFAULT 'image/jpeg',
  country VARCHAR(100) DEFAULT 'India',
  state VARCHAR(100),
  district VARCHAR(100),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  geographic_confidence ENUM('verified_monument', 'district_headquarters', 'regional_landscape', 'unverified') DEFAULT 'district_headquarters',
  geographic_evidence TEXT,
  quality_score INT DEFAULT 85,
  content_hash VARCHAR(128),
  status ENUM('pending', 'verified', 'temporarily_unavailable', 'broken', 'replacement_pending', 'replaced', 'rejected', 'manual_review', 'license_revoked') DEFAULT 'verified',
  review_status ENUM('auto_approved', 'manual_approved', 'pending_review', 'rejected') DEFAULT 'auto_approved',
  is_locked BOOLEAN DEFAULT FALSE,
  last_verified_at TIMESTAMP NULL,
  next_verification_at TIMESTAMP NULL,
  last_success_at TIMESTAMP NULL,
  consecutive_failures INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_images_provider (provider_name, provider_image_id),
  INDEX idx_images_status (status),
  INDEX idx_images_geo (state, district),
  INDEX idx_images_next_verify (next_verification_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. Entity Image Mapping Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entity_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('state', 'district', 'tourist_place') NOT NULL,
  state_id INT NULL,
  district_id INT NULL,
  place_id INT NULL,
  image_id INT NOT NULL,
  image_role ENUM('primary', 'hero', 'backup', 'gallery') NOT NULL DEFAULT 'primary',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_entity_images_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE,
  CONSTRAINT fk_entity_images_district FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
  CONSTRAINT fk_entity_images_place FOREIGN KEY (place_id) REFERENCES tourist_places(id) ON DELETE CASCADE,
  CONSTRAINT fk_entity_images_img FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
  INDEX idx_entity_lookup (entity_type, state_id, district_id, place_id, is_active, image_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. Image Verification Logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS image_verification_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_id INT NOT NULL,
  verification_type ENUM('startup', 'scheduled', 'realtime_report', 'manual') NOT NULL,
  http_status INT,
  is_accessible BOOLEAN NOT NULL,
  response_time_ms INT,
  error_message TEXT,
  verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_verify_logs_img FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
  INDEX idx_verify_logs_image (image_id, verified_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. Image Replacement History
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS image_replacement_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('state', 'district', 'tourist_place') NOT NULL,
  entity_id INT NOT NULL,
  old_image_id INT NOT NULL,
  new_image_id INT NULL,
  reason VARCHAR(255) NOT NULL,
  replaced_by VARCHAR(50) DEFAULT 'auto_healer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_replace_hist_old FOREIGN KEY (old_image_id) REFERENCES images(id) ON DELETE CASCADE,
  CONSTRAINT fk_replace_hist_new FOREIGN KEY (new_image_id) REFERENCES images(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. Image Provider Quota & Usage Tracker
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS image_provider_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_name VARCHAR(50) NOT NULL,
  usage_date DATE NOT NULL,
  discovery_requests INT DEFAULT 0,
  metadata_requests INT DEFAULT 0,
  verification_requests INT DEFAULT 0,
  recovery_requests INT DEFAULT 0,
  last_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_provider_date (provider_name, usage_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. Asynchronous Image Jobs Queue
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS image_jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_type ENUM('verify', 'recover', 'collect', 'deduplicate') NOT NULL,
  target_entity_type VARCHAR(50),
  target_entity_id INT,
  image_id INT NULL,
  status ENUM('queued', 'processing', 'completed', 'failed') DEFAULT 'queued',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  CONSTRAINT fk_image_jobs_img FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
  INDEX idx_jobs_status (status, job_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
