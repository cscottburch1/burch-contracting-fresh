import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT emergency_services_enabled FROM emergency_settings LIMIT 1'
      );
      
      const settings = rows as any[];
      return NextResponse.json({ 
        enabled: settings.length > 0 ? settings[0].emergency_services_enabled : false 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching emergency settings:', error);
    return NextResponse.json({ enabled: false });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled } = await request.json();

    const connection = await pool.getConnection();
    try {
      await connection.execute(
        `UPDATE emergency_settings 
         SET emergency_services_enabled = ?, updated_by = ? 
         WHERE id = 1`,
        [enabled, currentUser.id]
      );

      return NextResponse.json({ success: true, enabled });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating emergency settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
