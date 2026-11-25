import mysql from 'mysql2/promise';
import { env } from './env.js';

let pool = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 15,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return pool;
}

/**
 * Checks whether MySQL connection pool can execute a ping query.
 */
export async function testConnection() {
  try {
    const currentPool = getPool();
    const [rows] = await currentPool.query('SELECT 1 AS ready');
    return { connected: true, rows };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export default {
  getPool,
  testConnection,
  closePool
};
