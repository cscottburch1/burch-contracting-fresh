import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query } from '@/lib/mysql';

interface Project {
  id: number;
  customer_id: number;
  project_name: string;
  project_type: string;
  description: string;
  start_date: string;
  estimated_completion_date: string;
  actual_completion_date: string | null;
  status: 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  completion_percentage: number;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const customer = await getCustomerFromSession();
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const projects = await query<Project>(
      `SELECT 
        id, project_name, project_type, description, 
        start_date, estimated_completion_date, actual_completion_date,
        status, completion_percentage, 
        address_line1, address_line2, city, state, zip_code,
        created_at, updated_at
      FROM projects 
      WHERE customer_id = ?
      ORDER BY 
        CASE status
          WHEN 'in_progress' THEN 1
          WHEN 'scheduled' THEN 2
          WHEN 'on_hold' THEN 3
          WHEN 'completed' THEN 4
          WHEN 'cancelled' THEN 5
        END,
        start_date DESC`,
      [customer.id]
    );

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

