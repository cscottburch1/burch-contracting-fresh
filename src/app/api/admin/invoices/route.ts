import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from '@/lib/mysql';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create invoices table if it doesn't exist
    await mysql.query(
      `CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(50) NOT NULL UNIQUE,
        customer_id INT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        customer_address VARCHAR(255),
        invoice_date DATE,
        due_date DATE,
        invoice_type VARCHAR(100),
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
        tax DECIMAL(10,2) NOT NULL DEFAULT 0,
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        items_json LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `
    );

    const [invoices] = await mysql.query(
      `SELECT * FROM invoices ORDER BY created_at DESC LIMIT 200`
    );

    return NextResponse.json({ invoices });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      invoiceNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      tax,
      total,
      notes,
      invoiceType,
      status = 'draft'
    } = data;

    // Ensure invoices table exists
    await mysql.query(
      `CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(50) NOT NULL UNIQUE,
        customer_id INT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        customer_address VARCHAR(255),
        invoice_date DATE,
        due_date DATE,
        invoice_type VARCHAR(100),
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
        tax DECIMAL(10,2) NOT NULL DEFAULT 0,
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        items_json LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `
    );

    // Insert invoice into database
    const [result] = await mysql.query(
      `INSERT INTO invoices 
      (invoice_number, customer_id, customer_name, customer_email, customer_phone, 
       customer_address, invoice_date, due_date, invoice_type, 
       subtotal, tax_rate, tax, total, notes, status, items_json, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        invoiceNumber,
        customerId || null,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        invoiceDate,
        dueDate,
        invoiceType,
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
          `Invoice ${invoiceNumber} created - ${invoiceType} - Total: $${total.toFixed(2)}`
        ]
      );
    }

    return NextResponse.json({ 
      success: true, 
      invoiceId: (result as any).insertId,
      message: 'Invoice created successfully'
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
