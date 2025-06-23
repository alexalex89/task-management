#!/usr/bin/env node

/**
 * Startup script for the GTD Task Management Backend
 * This script ensures the database is properly initialized before starting the server
 */

const { waitForDatabase, initializeDatabase, checkDatabaseConnection } = require('./database');

async function main() {
  console.log('🚀 Starting GTD Task Management Backend...');
  
  try {
    // Wait for database to be ready
    console.log('⏳ Waiting for database connection...');
    await waitForDatabase();
    
    // Initialize database schema and sample data
    console.log('🔧 Initializing database...');
    await initializeDatabase();
    
    // Verify everything is working
    console.log('✅ Database initialization completed successfully');
    
    // Start the main server
    console.log('🎯 Starting Express server...');
    require('./server');
    
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the startup
main(); 
