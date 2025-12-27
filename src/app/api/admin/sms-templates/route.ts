import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { getCurrentAdminUser } from '@/lib/adminAuth';

// GET - List all SMS templates
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [templates] = await pool.query(
      `SELECT st.*, au.name as creator_name 
       FROM sms_templates st
       LEFT JOIN admin_users au ON st.created_by = au.id
       ORDER BY st.name ASC`
    );

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Error fetching SMS templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST - Create new SMS template
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, message, template_type, variables, is_active } = body;

    if (!name || !message) {
      return NextResponse.json({ 
        error: 'Name and message are required' 
      }, { status: 400 });
    }

    // SMS character limit validation
    if (message.length > 160) {
      return NextResponse.json({ 
        error: 'SMS message must be 160 characters or less' 
      }, { status: 400 });
    }

    const [result]: any = await pool.query(
      `INSERT INTO sms_templates (name, message, template_type, variables, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        message,
        template_type || 'general',
        JSON.stringify(variables || []),
        is_active !== undefined ? is_active : true,
        user.id
      ]
    );

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'SMS template created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating SMS template:', error);
    return NextResponse.json({ 
      error: 'Failed to create template',
      details: error.message 
    }, { status: 500 });
  }
}
