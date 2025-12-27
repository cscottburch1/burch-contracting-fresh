import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query } from '@/lib/mysql';

interface Photo {
  id: number;
  project_id: number;
  photo_url: string;
  caption: string;
  photo_type: 'progress' | 'before' | 'after' | 'issue' | 'completed';
  taken_at: string;
  uploaded_at: string;
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

    // Fetch photos
    const photos = await query<Photo>(
      `SELECT * FROM project_photos 
       WHERE project_id = ? 
       ORDER BY taken_at DESC`,
      [projectId]
    );

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Get photos error:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}
