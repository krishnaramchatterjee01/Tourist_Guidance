import fs from 'fs';
import path from 'path';
import { getPool, closePool } from '../src/config/db.js';

async function createBackup() {
  const pool = getPool();
  try {
    console.log('=== CREATING PRE-REPAIR DATABASE ROLLBACK BACKUP ===\n');

    const [states] = await pool.query('SELECT * FROM states ORDER BY id ASC');
    const [entityImages] = await pool.query("SELECT * FROM entity_images WHERE entity_type = 'state' ORDER BY id ASC");
    const [images] = await pool.query(`
      SELECT i.* 
      FROM images i
      JOIN entity_images ei ON ei.image_id = i.id
      WHERE ei.entity_type = 'state'
      GROUP BY i.id
      ORDER BY i.id ASC
    `);
    const [history] = await pool.query('SELECT * FROM image_replacement_history ORDER BY id ASC');
    const [assessments] = await pool.query('SELECT * FROM image_quality_assessments ORDER BY id ASC');

    const backupDir = 'C:\\Desktop\\coding\\Tourist_guide 2.0\\backend\\database\\backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(backupDir, 'phase4_pre_repair_rollback_backup.json');
    const backupData = {
      timestamp: new Date().toISOString(),
      counts: {
        states: states.length,
        entityImages: entityImages.length,
        images: images.length,
        history: history.length,
        assessments: assessments.length
      },
      states,
      entityImages,
      images,
      history,
      assessments
    };

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');
    console.log(`✓ Backup successfully created: ${backupFile} (${fs.statSync(backupFile).size} bytes)`);

  } catch (err) {
    console.error('Backup error:', err);
    process.exit(1);
  } finally {
    await closePool();
  }
}

createBackup();
