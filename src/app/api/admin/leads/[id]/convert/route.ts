import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';
import bcrypt from 'bcrypt';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Get lead details
    const lead = await queryOne<any>('SELECT * FROM leads WHERE id = ?', [id]);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check if customer already exists with this email
    const existingCustomer = await queryOne('SELECT id FROM customers WHERE email = ?', [lead.email]);
    if (existingCustomer) {
      return NextResponse.json({ error: 'Customer already exists with this email' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create customer
    const result = await query(
      `INSERT INTO customers (email, password_hash, name, phone, address)
       VALUES (?, ?, ?, ?, ?)`,
      [lead.email, passwordHash, lead.name, lead.phone, lead.address || null]
    );

    const customerId = (result as any).insertId;

    // Update lead status to "won" and add note about conversion
    await query('UPDATE leads SET status = ?, assigned_to = ? WHERE id = ?', ['won', 'converted', id]);
    await query(
      'INSERT INTO lead_notes (lead_id, content, note_type, created_by) VALUES (?, ?, ?, ?)',
      [id, `Lead converted to customer (ID: ${customerId})`, 'general', adminUser.email]
    );

    const customer = await queryOne('SELECT * FROM customers WHERE id = ?', [customerId]);

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error converting lead:', error);
    return NextResponse.json({ error: 'Failed to convert lead' }, { status: 500 });
  }
}
