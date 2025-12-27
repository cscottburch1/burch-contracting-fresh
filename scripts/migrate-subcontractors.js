require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
  console.log('Starting subcontractor tables migration...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });

  try {
    // Read SQL file
    const sqlFile = fs.readFileSync(
      path.join(__dirname, '../database/subcontractors.sql'),
      'utf8'
    );

    // Split by statement (rough split - assumes statements are separated by `;` on new lines)
    const statements = sqlFile
      .split(';\n')
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';');

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      if (statement.includes('CREATE TABLE')) {
        const tableName = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i)?.[1];
        console.log(`Creating table: ${tableName}...`);
      }
      await connection.query(statement);
    }

    console.log('✓ All subcontractor tables created successfully!');
    console.log('\nTables created:');
    console.log('- subcontractors');
    console.log('- subcontractor_documents');
    console.log('- bid_opportunities');
    console.log('- subcontractor_bids');
    console.log('- subcontractor_reviews');
    console.log('- subcontractor_activity');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

migrate()
  .then(() => {
    console.log('\nMigration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });
