const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'gtd_tasks',
  user: process.env.DB_USER || 'gtd_user',
  password: process.env.DB_PASSWORD || 'gtd_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// SQL statements for database initialization
const initSQL = `
-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('inbox', 'next', 'waiting', 'scheduled', 'someday')),
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for future authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user_id to tasks table for future multi-user support
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'user_id') THEN
        ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(category, order_index);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data if tasks table is empty
INSERT INTO tasks (title, description, category, priority, due_date, order_index) 
SELECT * FROM (VALUES
    ('E-Mail Posteingang durchgehen', 'Alle E-Mails sortieren und beantworten', 'inbox', 'medium', CURRENT_DATE + INTERVAL '1 day', 0),
    ('Projektplanung für Q1', 'Strategie und Ziele für das erste Quartal definieren', 'next', 'high', CURRENT_DATE + INTERVAL '7 days', 0),
    ('Auf Antwort von Kunde warten', 'Angebot für Projekt X gesendet', 'waiting', 'low', NULL, 0),
    ('Jahresurlaub planen', 'Urlaubsplanung für das kommende Jahr', 'scheduled', 'medium', CURRENT_DATE + INTERVAL '90 days', 0),
    ('Neue Programmiersprache lernen', 'Python oder Rust für zukünftige Projekte', 'someday', 'low', NULL, 0)
) AS v(title, description, category, priority, due_date, order_index)
WHERE NOT EXISTS (SELECT 1 FROM tasks LIMIT 1);
`;

// Function to initialize database
async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Initializing database...');
    
    // Execute initialization SQL
    await client.query(initSQL);
    
    console.log('Database initialized successfully');
    
    // Test the connection and basic functionality
    const result = await client.query('SELECT COUNT(*) as task_count FROM tasks');
    console.log(`Database contains ${result.rows[0].task_count} tasks`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to check if database is ready
async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Function to wait for database to be ready
async function waitForDatabase(maxRetries = 30, retryInterval = 2000) {
  console.log('Waiting for database to be ready...');
  
  for (let i = 0; i < maxRetries; i++) {
    if (await checkDatabaseConnection()) {
      console.log('Database is ready!');
      return true;
    }
    
    console.log(`Database not ready, retrying in ${retryInterval/1000}s... (${i + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, retryInterval));
  }
  
  throw new Error('Database connection timeout');
}

module.exports = {
  pool,
  initializeDatabase,
  checkDatabaseConnection,
  waitForDatabase
}; 
