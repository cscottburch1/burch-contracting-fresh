import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from '@/lib/mysql';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    // Use the same cookie name set by admin login
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      proposalNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      proposalDate,
      expirationDate,
      items,
      laborSubtotal = 0,
      serviceCharge = 0,
      subtotal,
      taxRate,
      tax,
      total,
      notes,
      proposalType,
      status = 'draft'
    } = data;

    // Ensure proposals table exists (prevents crashes if database was not migrated)
    await mysql.query(
      `CREATE TABLE IF NOT EXISTS proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proposal_number VARCHAR(50) NOT NULL,
        customer_id INT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        customer_address VARCHAR(255),
        proposal_date DATE,
        expiration_date DATE,
        proposal_type VARCHAR(100),
        labor_subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        service_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
        tax DECIMAL(10,2) NOT NULL DEFAULT 0,
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        items_json LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        UNIQUE KEY uq_proposal_number (proposal_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `
    );

    // Insert proposal into database
    const [result] = await mysql.query(
      `INSERT INTO proposals 
      (proposal_number, customer_id, customer_name, customer_email, customer_phone, 
       customer_address, proposal_date, expiration_date, proposal_type, 
       labor_subtotal, service_charge, subtotal, tax_rate, tax, total, notes, status, items_json, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        proposalNumber,
        customerId || null,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        proposalDate,
        expirationDate,
        proposalType,
        laborSubtotal,
        serviceCharge,
        subtotal,
        taxRate,
        tax,
        total,
        notes,
        status,
        JSON.stringify(items)
      ]
    );

    // If customer is selected, add note to customer CRM
    if (customerId) {
      await mysql.query(
        `INSERT INTO customer_notes (customer_id, note, created_by, created_at) 
         VALUES (?, ?, 'admin', NOW())`,
        [
          customerId,
          `Proposal ${proposalNumber} created - ${proposalType} - Total: $${total.toFixed(2)}`
        ]
      );
    }

    return NextResponse.json({ 
      success: true, 
      proposalId: (result as any).insertId,
      message: 'Proposal saved successfully'
    });

  } catch (error) {
    console.error('Error saving proposal:', error);
    return NextResponse.json(
      { error: 'Failed to save proposal' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_session');
    
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await mysql.query(
      `CREATE TABLE IF NOT EXISTS proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proposal_number VARCHAR(50) NOT NULL,
        customer_id INT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        customer_address VARCHAR(255),
        proposal_date DATE,
        expiration_date DATE,
        proposal_type VARCHAR(100),
        labor_subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        service_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
        tax DECIMAL(10,2) NOT NULL DEFAULT 0,
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        items_json LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        UNIQUE KEY uq_proposal_number (proposal_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `
    );

    const [proposals] = await mysql.query(
      `SELECT * FROM proposals ORDER BY created_at DESC LIMIT 100`
    );

    return NextResponse.json({ proposals });

  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
