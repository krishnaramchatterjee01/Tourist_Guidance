import { getPool, closePool } from '../src/config/db.js';

async function verify() {
  const pool = getPool();
  try {
    const [cols] = await pool.query('SHOW COLUMNS FROM images');
    const addedCols = [
      'ai_assessed_at',
      'ai_assessment_method',
      'geo_accuracy_score',
      'technical_score',
      'aesthetic_score',
      'tourism_score',
      'recency_score',
      'composite_score',
      'is_ai_enhanced',
      'enhancement_operations',
      'enhanced_url',
      'original_checksum',
      'resolution_label'
    ];
    const existing = cols.map(c => c.Field);
    const missing = addedCols.filter(c => !existing.includes(c));
    console.log('Missing columns in images:', missing);

    const [tables] = await pool.query("SHOW TABLES LIKE 'image_quality_assessments'");
    console.log('image_quality_assessments table exists:', tables.length === 1);

    const [mig] = await pool.query('SELECT * FROM schema_migrations ORDER BY id ASC');
    console.log('Migrations in DB:', mig);
  } finally {
    await closePool();
  }
}

verify();
