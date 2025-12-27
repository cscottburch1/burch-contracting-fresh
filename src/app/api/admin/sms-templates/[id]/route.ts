import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { getCurrentAdminUser } from '@/lib/adminAuth';

// GET - Get single SMS template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const [templates]: any = await pool.query(
      'SELECT * FROM sms_templates WHERE id = ?',
      [id]
    );

    if (!templates || templates.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(templates[0]);
  } catch (error: any) {
    console.error('Error fetching SMS template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}

// PATCH - Update SMS template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAdminUser();
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
    if (body.message !== undefined) {
      if (body.message.length > 160) {
        return NextResponse.json({ 
          error: 'SMS message must be 160 characters or less' 
        }, { status: 400 });
      }
      updates.push('message = ?');
      values.push(body.message);
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
      `UPDATE sms_templates SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true, message: 'Template updated' });
  } catch (error: any) {
    console.error('Error updating SMS template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

// DELETE - Delete SMS template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await pool.query('DELETE FROM sms_templates WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Template deleted' });
  } catch (error: any) {
    console.error('Error deleting SMS template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
