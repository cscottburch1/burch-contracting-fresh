import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

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
    const { title, description, budget, start_date, end_date, status } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO projects (customer_id, title, description, budget, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, budget || null, start_date || null, end_date || null, status || 'pending']
    );

    const projectId = (result as any).insertId;
    const project = await query('SELECT * FROM projects WHERE id = ?', [projectId]);

    return NextResponse.json({ project: project[0] });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
