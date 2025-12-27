import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// PATCH /api/admin/subcontractors/[id] - Update subcontractor
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const subId = parseInt(id);
    const body = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    // Allow updating these fields
    if (body.status !== undefined) {
      updates.push('status = ?');
      values.push(body.status);
      
      // Track status changes in activity log
      if (body.status === 'approved') {
        await query(
          `INSERT INTO subcontractor_activity (subcontractor_id, activity_type, description, performed_by)
           VALUES (?, 'approved', 'Application approved', ?)`,
          [subId, currentUser.id]
        );
        
        // Set approved timestamp
        updates.push('approved_at = NOW()');
        updates.push('approved_by = ?');
        values.push(currentUser.id);
      } else if (body.status === 'rejected') {
        await query(
          `INSERT INTO subcontractor_activity (subcontractor_id, activity_type, description, performed_by)
           VALUES (?, 'rejected', 'Application rejected', ?)`,
          [subId, currentUser.id]
        );
      }
    }

    if (body.admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      values.push(body.admin_notes);
      
      await query(
        `INSERT INTO subcontractor_activity (subcontractor_id, activity_type, description, performed_by)
         VALUES (?, 'note_added', 'Admin notes updated', ?)`,
        [subId, currentUser.id]
      );
    }

    if (body.rating !== undefined) {
      updates.push('rating = ?');
      values.push(body.rating);
    }

    if (body.total_projects !== undefined) {
      updates.push('total_projects = ?');
      values.push(body.total_projects);
    }

    if (body.w9_submitted !== undefined) {
      updates.push('w9_submitted = ?');
      values.push(body.w9_submitted);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true });
    }

    values.push(subId);
    await query(
      `UPDATE subcontractors SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating subcontractor:', error);
    return NextResponse.json({ error: 'Failed to update subcontractor' }, { status: 500 });
  }
}

// GET /api/admin/subcontractors/[id] - Get single subcontractor details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const subId = parseInt(id);

    const results: any = await query(
      `SELECT * FROM subcontractors WHERE id = ?`,
      [subId]
    );

    if (results.length === 0) {
      return NextResponse.json({ error: 'Subcontractor not found' }, { status: 404 });
    }

    const subcontractor = {
      ...results[0],
      specialties: results[0].specialties ? JSON.parse(results[0].specialties) : [],
    };

    // Get activity history
    const activity: any = await query(
      `SELECT * FROM subcontractor_activity WHERE subcontractor_id = ? ORDER BY created_at DESC LIMIT 50`,
      [subId]
    );

    // Get documents
    const documents: any = await query(
      `SELECT * FROM subcontractor_documents WHERE subcontractor_id = ? ORDER BY uploaded_at DESC`,
      [subId]
    );

    return NextResponse.json({ 
      subcontractor, 
      activity,
      documents
    });
  } catch (error) {
    console.error('Error fetching subcontractor:', error);
    return NextResponse.json({ error: 'Failed to fetch subcontractor' }, { status: 500 });
  }
}
