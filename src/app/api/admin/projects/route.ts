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
