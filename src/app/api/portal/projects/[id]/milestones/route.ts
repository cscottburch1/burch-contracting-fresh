import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query } from '@/lib/mysql';

interface Milestone {
  id: number;
  project_id: number;
  milestone_name: string;
  description: string;
  order_num: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  scheduled_date: string | null;
  completed_date: string | null;
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

    // Fetch milestones
    const milestones = await query<Milestone>(
      `SELECT * FROM project_milestones 
       WHERE project_id = ? 
       ORDER BY order_num ASC`,
      [projectId]
    );

    return NextResponse.json({ milestones });
  } catch (error) {
    console.error('Get milestones error:', error);
    return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 });
  }
}
