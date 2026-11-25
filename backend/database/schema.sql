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
