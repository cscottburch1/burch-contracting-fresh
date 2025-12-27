import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query } from '@/lib/mysql';

interface Message {
  id: number;
  customer_id: number;
  sender_type: string;
  sender_name: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  parent_message_id: number | null;
  created_at: string;
}

export async function GET() {
  try {
    const customer = await getCustomerFromSession();
    
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const messages = await query<Message>(
      `SELECT * FROM customer_messages 
       WHERE customer_id = ? 
       ORDER BY created_at DESC`,
      [customer.id]
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const customer = await getCustomerFromSession();
    
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { subject, message, parent_message_id } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO customer_messages 
       (customer_id, sender_type, sender_name, subject, message, parent_message_id) 
       VALUES (?, 'customer', ?, ?, ?, ?)`,
      [customer.id, customer.name, subject || null, message, parent_message_id || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
