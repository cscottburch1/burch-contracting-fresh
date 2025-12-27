import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query } from '@/lib/mysql';

interface Update {
  id: number;
  project_id: number;
  update_type: string;
  title: string;
  message: string;
  visibility: 'customer' | 'internal' | 'both';
  created_by: string;
  created_at: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomerFromSession();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const projectId = parseInt(id);

    // Verify this project belongs to the customer
    const [project] = await query(
      'SELECT id FROM projects WHERE id = ? AND customer_id = ?',
      [projectId, customer.id]
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fetch updates visible to customer
    const updates = await query<Update>(
      `SELECT * FROM project_updates 
       WHERE project_id = ? AND visibility IN ('customer', 'both')
       ORDER BY created_at DESC`,
      [projectId]
    );

    return NextResponse.json({ updates });
  } catch (error) {
    console.error('Get updates error:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}
