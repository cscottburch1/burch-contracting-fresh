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
      subtotal,
      taxRate,
      tax,
      total,
      notes,
      proposalType,
      status = 'draft'
    } = data;

    // Insert proposal into database
    const [result] = await mysql.query(
      `INSERT INTO proposals 
      (proposal_number, customer_id, customer_name, customer_email, customer_phone, 
       customer_address, proposal_date, expiration_date, proposal_type, 
       subtotal, tax_rate, tax, total, notes, status, items_json, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
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
    const adminToken = cookieStore.get('admin_token');
    
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
