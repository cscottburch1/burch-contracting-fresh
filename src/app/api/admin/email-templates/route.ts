import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { getCurrentAdminUser } from '@/lib/adminAuth';

// GET - List all email templates
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [templates] = await pool.query(
      `SELECT et.*, au.name as creator_name 
       FROM email_templates et
       LEFT JOIN admin_users au ON et.created_by = au.id
       ORDER BY et.name ASC`
    );

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST - Create new email template
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, subject, body: emailBody, template_type, variables, is_active } = body;

    if (!name || !subject || !emailBody) {
      return NextResponse.json({ 
        error: 'Name, subject, and body are required' 
      }, { status: 400 });
    }

    const [result]: any = await pool.query(
      `INSERT INTO email_templates (name, subject, body, template_type, variables, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        subject,
        emailBody,
        template_type || 'general',
        JSON.stringify(variables || []),
        is_active !== undefined ? is_active : true,
        user.id
      ]
    );

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'Email template created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating email template:', error);
    return NextResponse.json({ 
      error: 'Failed to create template',
      details: error.message 
    }, { status: 500 });
  }
}
