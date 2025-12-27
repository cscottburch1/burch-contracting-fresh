import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/adminAuth';
import { getConnection } from '@/lib/mysql';
import * as fs from 'fs';
import * as path from 'path';

export async function POST() {
  try {
    // Check if user is authenticated and is owner
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden - Owner access required' }, { status: 403 });
    }

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'database', 'password_reset_tokens.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements and filter out empty ones
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const connection = await getConnection();
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
        message: 'Password reset tables migrated successfully',
        results,
      });
    } finally {
      connection.end();
    }
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error.message },
      { status: 500 }
    );
  }
}
