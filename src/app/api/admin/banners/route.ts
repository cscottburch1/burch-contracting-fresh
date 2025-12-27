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
      const [banners] = await connection.execute(
        'SELECT * FROM banners ORDER BY display_order ASC, created_at DESC'
      );

      return NextResponse.json({ banners });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, message, button_text, button_link, bg_color, text_color, 
      icon, is_active, display_order, start_date, end_date 
    } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO banners 
        (title, message, button_text, button_link, bg_color, text_color, icon, is_active, display_order, start_date, end_date, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, message, button_text, button_link, bg_color || 'from-blue-600 to-blue-800', 
         text_color || 'white', icon, is_active || false, display_order || 0, 
         start_date, end_date, currentUser.id]
      );

      const insertResult = result as any;
      return NextResponse.json({ 
        success: true, 
        bannerId: insertResult.insertId 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
