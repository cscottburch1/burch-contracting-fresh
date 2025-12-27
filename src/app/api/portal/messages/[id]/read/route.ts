import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query } from '@/lib/mysql';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomerFromSession();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const messageId = parseInt(id);

    // Verify message belongs to this customer
    const [message] = await query(
      'SELECT id FROM customer_messages WHERE id = ? AND customer_id = ?',
      [messageId, customer.id]
    );

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Mark as read
    await query(
      'UPDATE customer_messages SET is_read = TRUE, read_at = NOW() WHERE id = ?',
      [messageId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark as read error:', error);
    return NextResponse.json({ error: 'Failed to mark message as read' }, { status: 500 });
  }
}
