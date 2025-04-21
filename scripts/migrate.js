const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Read database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

async function migrate() {
  console.log('Starting database migration...');
  
  const client = new Client({
    connectionString,
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Read migration SQL
    const migrationSQL = fs.readFileSync(path.join(__dirname, '../migrations/0001_initial.sql'), 'utf8');
    
    // Execute migration
    console.log('Executing migration...');
    await client.query(migrationSQL);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
