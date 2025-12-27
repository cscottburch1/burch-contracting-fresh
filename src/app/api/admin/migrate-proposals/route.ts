import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from '@/lib/mysql';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');
    
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create proposals table
    await mysql.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proposal_number VARCHAR(50) UNIQUE NOT NULL,
        customer_id INT DEFAULT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        customer_address TEXT,
        proposal_date DATE NOT NULL,
        expiration_date DATE,
        proposal_type VARCHAR(100) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        tax_rate DECIMAL(5, 2) DEFAULT 0,
        tax DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        items_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        INDEX idx_proposal_number (proposal_number),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Try to add foreign key if customers table exists
    try {
      await mysql.query(`
        ALTER TABLE proposals 
        ADD CONSTRAINT fk_proposal_customer 
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
      `);
    } catch (err) {
      // Foreign key might already exist or customers table might not exist yet
      console.log('Foreign key constraint note:', err);
    }

    // Create customer_notes table
    await mysql.query(`
      CREATE TABLE IF NOT EXISTS customer_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        note TEXT NOT NULL,
        created_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Try to add foreign key for customer_notes
    try {
      await mysql.query(`
        ALTER TABLE customer_notes 
        ADD CONSTRAINT fk_note_customer 
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      `);
    } catch (err) {
      console.log('Customer notes foreign key note:', err);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Proposals tables created successfully'
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
