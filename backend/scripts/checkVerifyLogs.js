import mysql from 'mysql2/promise';
import { env } from '../src/config/env.js';

async function checkLogs() {
  const conn = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  });

  const [logs] = await conn.query(`
    SELECT l.*, i.display_url, i.title, d.name as district_name
    FROM image_verification_logs l
    JOIN images i ON l.image_id = i.id
    LEFT JOIN entity_images ei ON ei.image_id = i.id
    LEFT JOIN districts d ON ei.district_id = d.id
    ORDER BY l.id DESC
    LIMIT 30
  `);

  console.log(`Total recent logs: ${logs.length}`);
  for (const l of logs) {
    console.log(`[Log #${l.id}] Image #${l.image_id} (${l.district_name || 'State'}): Status=${l.http_status}, Accessible=${l.is_accessible}, ResponseTime=${l.response_time_ms}ms`);
    console.log(`  URL: ${l.display_url}`);
    console.log(`  Error: ${l.error_message}`);
  }

  await conn.end();
}

checkLogs().catch(console.error);
