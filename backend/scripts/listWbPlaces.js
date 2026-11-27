import mysql from 'mysql2/promise';
import { env } from '../src/config/env.js';

async function listWbPlaces() {
  const conn = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  });

  const [places] = await conn.query(`
    SELECT p.id, p.name, p.slug, p.category, p.image_url, p.district_id, d.name as district_name, d.slug as district_slug
    FROM tourist_places p
    JOIN districts d ON p.district_id = d.id
    WHERE d.state_id = 28
    ORDER BY d.name, p.display_order
  `);

  console.log(`West Bengal Tourist Places Count: ${places.length}`);
  for (const p of places) {
    console.log(`[ID: ${p.id}] ${p.name} (${p.district_name}) -> Current Image: ${p.image_url}`);
  }

  await conn.end();
}

listWbPlaces().catch(console.error);
