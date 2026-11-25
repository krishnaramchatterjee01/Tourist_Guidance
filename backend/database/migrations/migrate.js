import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('--- Starting Database Migrations ---');
  console.log(`Connecting to MySQL host: ${env.DB_HOST}:${env.DB_PORT} as user: ${env.DB_USER}`);

  // 1. Initial connection without database to ensure DB exists
  let rootConn;
  try {
    rootConn = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      multipleStatements: true
    });
  } catch (err) {
    console.error('[Migration Error] Could not connect to MySQL server:', err.message);
    console.error('Please verify MySQL service is running and credentials in backend/.env are correct.');
    process.exit(1);
  }

  try {
    console.log(`Ensuring database '${env.DB_NAME}' exists...`);
    await rootConn.query(`
      CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\`
      DEFAULT CHARACTER SET utf8mb4
      DEFAULT COLLATE utf8mb4_unicode_ci
    `);
    await rootConn.end();

    // 2. Connect to the specific database
    const dbConn = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      multipleStatements: true
    });

    // 3. Ensure migrations table exists
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        version VARCHAR(100) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Get applied migrations
    const [appliedRows] = await dbConn.query('SELECT version FROM schema_migrations');
    const appliedVersions = new Set(appliedRows.map(r => r.version));

    // 5. Read all .sql files in migrations dir
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration file(s).`);

    for (const file of files) {
      if (appliedVersions.has(file)) {
        console.log(`  ✓ Skipping already applied migration: ${file}`);
        continue;
      }

      console.log(`  -> Applying migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf8');

      // Execute migration statements
      await dbConn.query(sqlContent);

      // Record applied migration
      await dbConn.query('INSERT INTO schema_migrations (version) VALUES (?)', [file]);
      console.log(`  ✓ Successfully applied: ${file}`);
    }

    await dbConn.end();
    console.log('--- All Database Migrations Completed Successfully ---');
  } catch (err) {
    console.error('[Migration Error] Failed during migration execution:', err);
    process.exit(1);
  }
}

runMigrations();
