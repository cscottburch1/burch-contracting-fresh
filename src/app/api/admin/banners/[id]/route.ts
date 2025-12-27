import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const connection = await pool.getConnection();
    try {
      const updateFields: string[] = [];
      const values: any[] = [];

      if (body.title !== undefined) {
        updateFields.push('title = ?');
        values.push(body.title);
      }
      if (body.message !== undefined) {
        updateFields.push('message = ?');
        values.push(body.message);
      }
      if (body.button_text !== undefined) {
        updateFields.push('button_text = ?');
        values.push(body.button_text);
      }
      if (body.button_link !== undefined) {
        updateFields.push('button_link = ?');
        values.push(body.button_link);
      }
      if (body.bg_color !== undefined) {
        updateFields.push('bg_color = ?');
        values.push(body.bg_color);
      }
      if (body.text_color !== undefined) {
        updateFields.push('text_color = ?');
        values.push(body.text_color);
      }
      if (body.icon !== undefined) {
        updateFields.push('icon = ?');
        values.push(body.icon);
      }
      if (body.is_active !== undefined) {
        updateFields.push('is_active = ?');
        values.push(body.is_active);
      }
      if (body.display_order !== undefined) {
        updateFields.push('display_order = ?');
        values.push(body.display_order);
      }
      if (body.start_date !== undefined) {
        updateFields.push('start_date = ?');
        values.push(body.start_date);
      }
      if (body.end_date !== undefined) {
        updateFields.push('end_date = ?');
        values.push(body.end_date);
      }

      if (updateFields.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }

      values.push(id);

      await connection.execute(
        `UPDATE banners SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );

      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM banners WHERE id = ?', [id]);
      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
