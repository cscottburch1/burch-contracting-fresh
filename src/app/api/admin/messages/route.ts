import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    try {
      // Get all messages with customer info and unread counts
      const [messages] = await connection.execute(
        `SELECT 
          cm.*,
          c.name as customer_name,
          c.email as customer_email,
          (SELECT COUNT(*) FROM customer_messages 
           WHERE customer_id = cm.customer_id 
           AND sender_type = 'customer' 
           AND is_read = FALSE) as unread_count
        FROM customer_messages cm
        LEFT JOIN customers c ON cm.customer_id = c.id
        ORDER BY cm.created_at DESC`
      );

      return NextResponse.json({ messages });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customer_id, message, subject, parent_message_id } = await request.json();

    if (!customer_id || !message || !message.trim()) {
      return NextResponse.json({ error: 'Customer ID and message are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.execute(
        `INSERT INTO customer_messages 
         (customer_id, sender_type, sender_name, subject, message, parent_message_id) 
         VALUES (?, 'admin', ?, ?, ?, ?)`,
        [customer_id, currentUser.name, subject || null, message, parent_message_id || null]
      );

      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
