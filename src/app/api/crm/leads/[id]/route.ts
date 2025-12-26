import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/mysql';
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
    const lead = await queryOne('SELECT * FROM leads WHERE id = ?', [id]);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PUT(
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
    const {
      status,
      priority,
      assigned_to,
      estimated_value,
      scheduled_date,
      tags,
      address,
      service_type,
      budget_range,
      timeframe,
      referral_source,
      description
    } = body;

    const oldLead = await queryOne<any>('SELECT * FROM leads WHERE id = ?', [id]);
    if (!oldLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to);
    }
    if (estimated_value !== undefined) {
      updates.push('estimated_value = ?');
      params.push(estimated_value);
    }
    if (scheduled_date !== undefined) {
      updates.push('scheduled_date = ?');
      params.push(scheduled_date);
    }
    if (tags !== undefined) {
      updates.push('tags = ?');
      params.push(JSON.stringify(tags));
    }
    if (address !== undefined) {
      updates.push('address = ?');
      params.push(address);
    }
    if (service_type !== undefined) {
      updates.push('service_type = ?');
      params.push(service_type);
    }
    if (budget_range !== undefined) {
      updates.push('budget_range = ?');
      params.push(budget_range);
    }
    if (timeframe !== undefined) {
      updates.push('timeframe = ?');
      params.push(timeframe);
    }
    if (referral_source !== undefined) {
      updates.push('referral_source = ?');
      params.push(referral_source);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    updates.push('last_contact_date = NOW()');

    if (updates.length > 0) {
      params.push(id);
      await query(
        `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    // Log activity if status changed
    if (status && status !== oldLead.status) {
      await query(
        'INSERT INTO lead_activities (lead_id, activity_type, description, created_by) VALUES (?, ?, ?, ?)',
        [id, 'status_change', `Status changed from ${oldLead.status} to ${status}`, adminUser.email]
      );
    }

    const updatedLead = await queryOne('SELECT * FROM leads WHERE id = ?', [id]);

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    await query('DELETE FROM leads WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
