import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser || currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Read the SQL file
    const sqlFile = fs.readFileSync(
      path.join(process.cwd(), 'database/subcontractors.sql'),
      'utf8'
    );

    // Split into individual statements
    const statements = sqlFile
      .split(';\n')
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim());

    const results = [];

    for (const statement of statements) {
      if (statement.includes('CREATE TABLE')) {
        const tableName = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i)?.[1];
        console.log(`Creating table: ${tableName}...`);
        results.push(`Creating table: ${tableName}`);
      }
      await query(statement);
    }

    results.push('All subcontractor tables created successfully!');

    return NextResponse.json({ 
      success: true, 
      message: 'Migration completed',
      results 
    });
  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}
