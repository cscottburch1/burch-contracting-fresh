import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sqlPath = path.join(process.cwd(), 'database', 'emergency_settings.sql');
    const sql = await fs.readFile(sqlPath, 'utf-8');

    const connection = await pool.getConnection();
    try {
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        await connection.execute(statement);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Emergency settings table created successfully',
        tables: ['emergency_settings']
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error running emergency settings migration:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
