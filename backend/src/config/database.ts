import { Pool } from 'pg';
import { env } from './env';

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.isProduction ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('[database] Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('[database] Unexpected error on idle client', err);
  process.exit(-1);
});

export const verifyDatabaseConnection = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
};

export default pool;
