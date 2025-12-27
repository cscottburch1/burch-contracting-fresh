import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { getCurrentAdminUser } from '@/lib/adminAuth';

// GET - Get single email template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const [templates]: any = await pool.query(
      'SELECT * FROM email_templates WHERE id = ?',
      [id]
    );

    if (!templates || templates.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(templates[0]);
  } catch (error: any) {
    console.error('Error fetching email template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}

// PATCH - Update email template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (body.name !== undefined) {
      updates.push('name = ?');
      values.push(body.name);
    }
    if (body.subject !== undefined) {
      updates.push('subject = ?');
      values.push(body.subject);
    }
    if (body.body !== undefined) {
      updates.push('body = ?');
      values.push(body.body);
    }
    if (body.template_type !== undefined) {
      updates.push('template_type = ?');
      values.push(body.template_type);
    }
    if (body.variables !== undefined) {
      updates.push('variables = ?');
      values.push(JSON.stringify(body.variables));
    }
    if (body.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(body.is_active);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    
    await pool.query(
      `UPDATE email_templates SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true, message: 'Template updated' });
  } catch (error: any) {
    console.error('Error updating email template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

// DELETE - Delete email template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await pool.query('DELETE FROM email_templates WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Template deleted' });
  } catch (error: any) {
    console.error('Error deleting email template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
