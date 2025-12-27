import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { getCurrentAdminUser } from '@/lib/adminAuth';

// GET - List all recent projects for admin
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [projects] = await pool.query(
      `SELECT rp.*, au.name as creator_name 
       FROM recent_projects rp
       LEFT JOIN admin_users au ON rp.created_by = au.id
       ORDER BY rp.display_order ASC, rp.completion_date DESC`
    );

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      category, 
      description, 
      short_description,
      image_url,
      before_image,
      after_image,
      completion_date,
      project_duration,
      location,
      budget_range,
      featured,
      display_order,
      is_active
    } = body;

    if (!title || !category) {
      return NextResponse.json({ 
        error: 'Title and category are required' 
      }, { status: 400 });
    }

    const [result]: any = await pool.query(
      `INSERT INTO recent_projects 
       (title, category, description, short_description, image_url, before_image, after_image, 
        completion_date, project_duration, location, budget_range, featured, display_order, 
        is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        description || null,
        short_description || null,
        image_url || null,
        before_image || null,
        after_image || null,
        completion_date || null,
        project_duration || null,
        location || null,
        budget_range || null,
        featured !== undefined ? featured : false,
        display_order !== undefined ? display_order : 0,
        is_active !== undefined ? is_active : true,
        user.id
      ]
    );

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'Project created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ 
      error: 'Failed to create project',
      details: error.message 
    }, { status: 500 });
  }
}
