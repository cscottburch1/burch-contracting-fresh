import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';

// GET - List all active recent projects (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = `
      SELECT id, title, category, short_description, description, 
             image_url, before_image, after_image, completion_date, 
             project_duration, location, budget_range, featured
      FROM recent_projects 
      WHERE is_active = TRUE
    `;

    const params: any[] = [];

    if (category && ['handyman', 'remodeling', 'additions'].includes(category)) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY display_order ASC, completion_date DESC';

    const [projects] = await pool.query(query, params);

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Error fetching recent projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
