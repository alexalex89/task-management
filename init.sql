-- GTD Task Management Database Schema
-- This script initializes the database with the necessary tables

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
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

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
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO tasks (title, description, category, priority, due_date, order_index) VALUES
('E-Mail Posteingang durchgehen', 'Alle E-Mails sortieren und beantworten', 'inbox', 'medium', CURRENT_DATE + INTERVAL '1 day', 0),
('Projektplanung für Q1', 'Strategie und Ziele für das erste Quartal definieren', 'next', 'high', CURRENT_DATE + INTERVAL '7 days', 0),
('Auf Antwort von Kunde warten', 'Angebot für Projekt X gesendet', 'waiting', 'low', NULL, 0),
('Jahresurlaub planen', 'Urlaubsplanung für das kommende Jahr', 'scheduled', 'medium', CURRENT_DATE + INTERVAL '90 days', 0),
('Neue Programmiersprache lernen', 'Python oder Rust für zukünftige Projekte', 'someday', 'low', NULL, 0)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gtd_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gtd_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO gtd_user; 
