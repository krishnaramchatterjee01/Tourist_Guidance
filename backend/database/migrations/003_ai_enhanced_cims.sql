-- ============================================================
-- Explore India — Centralized Image Management System (CIMS) Schema
-- Migration 003: AI-Powered Image Enhancement and Quality Assessment Architecture
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

USE explore_india;

-- ------------------------------------------------------------
-- 1. Extend Master Images Table with AI Assessment & Enhancement Metadata
-- ------------------------------------------------------------
ALTER TABLE images
  ADD COLUMN ai_assessed_at TIMESTAMP NULL AFTER is_locked,
  ADD COLUMN ai_assessment_method VARCHAR(50) DEFAULT NULL AFTER ai_assessed_at,
  ADD COLUMN geo_accuracy_score INT DEFAULT NULL AFTER ai_assessment_method,
  ADD COLUMN technical_score INT DEFAULT NULL AFTER geo_accuracy_score,
  ADD COLUMN aesthetic_score INT DEFAULT NULL AFTER technical_score,
  ADD COLUMN tourism_score INT DEFAULT NULL AFTER aesthetic_score,
  ADD COLUMN recency_score INT DEFAULT NULL AFTER tourism_score,
  ADD COLUMN composite_score INT DEFAULT NULL AFTER recency_score,
  ADD COLUMN is_ai_enhanced BOOLEAN DEFAULT FALSE AFTER composite_score,
  ADD COLUMN enhancement_operations JSON NULL AFTER is_ai_enhanced,
  ADD COLUMN enhanced_url VARCHAR(1000) DEFAULT NULL AFTER enhancement_operations,
  ADD COLUMN original_checksum VARCHAR(64) DEFAULT NULL AFTER enhanced_url,
  ADD COLUMN resolution_label VARCHAR(20) DEFAULT NULL AFTER original_checksum,
  ADD INDEX idx_images_composite_score (composite_score),
  ADD INDEX idx_images_enhanced (is_ai_enhanced);

-- ------------------------------------------------------------
-- 2. Structured Quality Assessment Audit Table
-- Records granular multi-dimensional scoring for historical traceability
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS image_quality_assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_id INT NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  geo_accuracy_score INT NOT NULL,
  technical_score INT NOT NULL,
  aesthetic_score INT NOT NULL,
  tourism_score INT NOT NULL,
  recency_score INT NOT NULL,
  total_score INT NOT NULL,
  assessment_notes TEXT,
  assessed_by VARCHAR(100) DEFAULT 'cims_ai_evaluator_v1',
  assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_iqa_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
  INDEX idx_iqa_entity (entity_type, entity_id, role),
  INDEX idx_iqa_total_score (total_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
