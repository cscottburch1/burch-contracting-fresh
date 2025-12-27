import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const [banners] = await connection.execute(
        `SELECT * FROM banners 
         WHERE is_active = TRUE 
         AND (start_date IS NULL OR start_date <= ?)
         AND (end_date IS NULL OR end_date >= ?)
         ORDER BY display_order ASC`,
        [now, now]
      );

      return NextResponse.json({ banners });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return NextResponse.json({ banners: [] });
  }
}
