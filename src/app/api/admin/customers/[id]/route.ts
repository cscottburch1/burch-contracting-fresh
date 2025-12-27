import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    
    const customer = await queryOne('SELECT * FROM customers WHERE id = ?', [id]);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const projects = await query('SELECT * FROM projects WHERE customer_id = ? ORDER BY created_at DESC', [id]);

    return NextResponse.json({ customer, projects });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const data = await request.json();
    const { name, email, phone, address } = data;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    await query(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, email, phone || null, address || null, id]
    );

    const customer = await queryOne('SELECT * FROM customers WHERE id = ?', [id]);
    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Check if customer has active projects
    const projects = await query('SELECT COUNT(*) as count FROM projects WHERE customer_id = ? AND status IN ("active", "scheduled")', [id]);
    if ((projects as any[])[0]?.count > 0) {
      return NextResponse.json({ error: 'Cannot delete customer with active projects' }, { status: 400 });
    }

    await query('DELETE FROM customers WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
