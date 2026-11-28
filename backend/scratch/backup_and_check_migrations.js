import fs from 'fs';
import path from 'path';
import { getPool, closePool } from '../src/config/db.js';

async function backupDb() {
  const pool = getPool();
  try {
    console.log('=== DATABASE BACKUP BEFORE CIMS PHASE 4 ===');
    
    // Check migrations
    const [migrations] = await pool.query('SELECT * FROM schema_migrations ORDER BY id ASC');
    console.log('Applied migrations:', migrations);

    // Backup state records
    const [states] = await pool.query('SELECT * FROM states ORDER BY id ASC');
    console.log(`Backed up ${states.length} states.`);

    // Backup all state entity_images
    const [stateEntityImages] = await pool.query("SELECT * FROM entity_images WHERE entity_type = 'state' ORDER BY id ASC");
    console.log(`Backed up ${stateEntityImages.length} state-level entity_images.`);

    // Backup all images associated with states
    const [stateImages] = await pool.query(`
      SELECT i.* 
      FROM images i
      JOIN entity_images ei ON ei.image_id = i.id
      WHERE ei.entity_type = 'state'
      GROUP BY i.id
      ORDER BY i.id ASC
    `);
    console.log(`Backed up ${stateImages.length} images referenced by states.`);

    // Full count snapshots
    const [[{ totalImages }]] = await pool.query('SELECT COUNT(*) as totalImages FROM images');
    const [[{ totalEntityImages }]] = await pool.query('SELECT COUNT(*) as totalEntityImages FROM entity_images');

    const backupData = {
      timestamp: new Date().toISOString(),
      counts: {
        states: states.length,
        stateEntityImages: stateEntityImages.length,
        stateImages: stateImages.length,
        totalImages,
        totalEntityImages
      },
      migrations,
      states,
      stateEntityImages,
      stateImages
    };

    const backupDir = 'C:\\Desktop\\coding\\Tourist_guide 2.0\\backend\\database\\backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupPath = path.join(backupDir, 'phase4_pre_migration_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');

    console.log(`✓ Backup successfully saved to ${backupPath} (${fs.statSync(backupPath).size} bytes)`);

  } catch (err) {
    console.error('Backup error:', err);
    process.exit(1);
  } finally {
    await closePool();
  }
}

backupDb();
