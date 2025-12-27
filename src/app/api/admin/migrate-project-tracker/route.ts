import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';
import * as fs from 'fs';
import * as path from 'path';

export async function POST() {
  try {
    // Check if user is authenticated and is owner
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden - Owner access required' }, { status: 403 });
    }

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'database', 'project_tracker.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements and filter out empty ones
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const connection = await pool.getConnection();
    const results: string[] = [];

    try {
      // Execute each statement
      for (const statement of statements) {
        await connection.execute(statement);
        
        // Extract table name from CREATE TABLE statement
        const tableMatch = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?`?(\w+)`?/i);
        if (tableMatch) {
          results.push(`Created table: ${tableMatch[1]}`);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Project tracker tables migrated successfully',
        results,
        tables: [
          'projects',
          'project_milestones',
          'project_updates',
          'project_photos',
          'project_assignments',
          'project_documents'
        ]
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
