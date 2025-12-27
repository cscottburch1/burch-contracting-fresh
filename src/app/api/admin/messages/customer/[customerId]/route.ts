import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const custId = parseInt(resolvedParams.customerId);

    const connection = await pool.getConnection();
    try {
      const [messages] = await connection.execute(
        `SELECT * FROM customer_messages 
         WHERE customer_id = ? 
         ORDER BY created_at DESC`,
        [custId]
      );

      return NextResponse.json({ messages });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching customer messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
