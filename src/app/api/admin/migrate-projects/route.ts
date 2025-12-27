import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'database', 'projects.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split into statements and execute
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const connection = await pool.getConnection();
    
    try {
      for (const statement of statements) {
        await connection.query(statement);
      }
      
      connection.release();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Projects table created successfully'
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}
