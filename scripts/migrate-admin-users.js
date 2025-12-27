#!/usr/bin/env node
/**
 * Database migration script to set up admin_users table
 * Run this once to migrate from single-password to multi-user system
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  console.log('🔄 Starting admin_users migration...\n');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    // Create admin_users table
    console.log('📦 Creating admin_users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('owner', 'manager', 'sales', 'support') NOT NULL DEFAULT 'support',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table created successfully\n');

    // Check if owner account exists
    const [rows] = await connection.execute(
      'SELECT id FROM admin_users WHERE email = ?',
      [process.env.ADMIN_EMAIL]
    );

    if (rows.length === 0) {
      // Create owner account from existing env variables
      console.log('👤 Creating owner account...');
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      
      await connection.execute(
        `INSERT INTO admin_users (email, password_hash, name, role, is_active) 
         VALUES (?, ?, ?, 'owner', TRUE)`,
        [
          process.env.ADMIN_EMAIL,
          passwordHash,
          'Owner (Main Admin)',
        ]
      );
      
      console.log(`✅ Owner account created: ${process.env.ADMIN_EMAIL}`);
      console.log(`   Password: (same as ADMIN_PASSWORD in .env.local)\n`);
    } else {
      console.log(`✅ Owner account already exists: ${process.env.ADMIN_EMAIL}\n`);
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test login at /admin with your existing credentials');
    console.log('   2. Go to Settings to add more team members');
    console.log('   3. Deploy to production with the same migration\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
