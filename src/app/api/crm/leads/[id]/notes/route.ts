import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const notes = await query(
      'SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC',
      [id]
    );

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { content, note_type, is_important } = body;

    if (!content) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO lead_notes (lead_id, content, note_type, is_important, created_by) VALUES (?, ?, ?, ?, ?)',
      [id, content, note_type || 'general', is_important || false, adminUser.email]
    );

    // Log activity
    await query(
      'INSERT INTO lead_activities (lead_id, activity_type, description, created_by) VALUES (?, ?, ?, ?)',
      [id, 'note_added', `Note added: ${content.substring(0, 50)}...`, adminUser.email]
    );

    const insertId = (result as any).insertId;
    const note = await query('SELECT * FROM lead_notes WHERE id = ?', [insertId]);

    return NextResponse.json({ note: note[0] });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
