import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

async function waitForDb(connectionString: string, retries = 20, delayMs = 1000) {
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 5000 });
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      await pool.end();
      return;
    } catch (err) {
      console.log(`Waiting for DB (attempt ${i + 1}/${retries})...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error('Database did not become available in time');
}

async function setupDatabase() {
  await waitForDb(process.env.DATABASE_URL || '');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000
  });

  try {
    console.log('Creating tables...');

    // Create mission_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mission_logs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        location VARCHAR(255) NOT NULL,
        gps_track JSONB,
        detected_sites JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ mission_logs table created');

    // Create mission_plans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mission_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        altitude NUMERIC,
        speed NUMERIC,
        waypoints JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ mission_plans table created');

    console.log('\n✓ Database setup complete!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

setupDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
