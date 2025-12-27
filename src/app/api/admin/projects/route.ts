import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    try {
      // Fetch all projects with customer info
      const [projects] = await connection.execute(
        `SELECT 
          p.id,
          p.customer_id,
          p.project_name,
          p.project_type,
          p.description,
          p.start_date,
          p.estimated_completion_date,
          p.actual_completion_date,
          p.status,
          p.completion_percentage,
          p.total_cost,
          p.address_line1,
          p.city,
          p.state,
          p.zip_code,
          p.created_at,
          p.updated_at,
          c.name as customer_name,
          c.email as customer_email
        FROM projects p
        LEFT JOIN customers c ON p.customer_id = c.id
        ORDER BY 
          CASE p.status
            WHEN 'in_progress' THEN 1
            WHEN 'scheduled' THEN 2
            WHEN 'on_hold' THEN 3
            WHEN 'completed' THEN 4
            WHEN 'cancelled' THEN 5
          END,
          p.start_date DESC`
      );

      return NextResponse.json({ projects });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      customer_id,
      project_name,
      project_type,
      description,
      start_date,
      estimated_completion_date,
      address_line1,
      address_line2,
      city,
      state,
      zip_code,
    } = data;

    if (!customer_id || !project_name || !address_line1 || !city || !state || !zip_code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO projects (
          customer_id, project_name, project_type, description,
          start_date, estimated_completion_date,
          address_line1, address_line2, city, state, zip_code,
          status, completion_percentage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', 0)`,
        [
          customer_id,
          project_name,
          project_type || 'Other',
          description || null,
          start_date || null,
          estimated_completion_date || null,
          address_line1,
          address_line2 || null,
          city,
          state,
          zip_code,
        ]
      );

      const projectId = (result as any).insertId;

      return NextResponse.json({ success: true, projectId });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
