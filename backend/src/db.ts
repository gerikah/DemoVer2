import 'dotenv/config'; // Loads .env file immediately
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // timeout for initial connection attempts (ms)
  connectionTimeoutMillis: 5000
});

async function ensureConnected(retries = 10, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Connected to the database!');
      return;
    } catch (err: any) {
      console.error(`Database connection attempt ${i + 1} failed: ${err && err.message ? err.message : err}`);
      if (i === retries - 1) {
        console.error('Exceeded database connection retries.');
        throw err;
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

ensureConnected().catch((err) => {
  console.error('Failed to connect to database after retries:', err);
  process.exit(1);
});

// Export a query function
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};