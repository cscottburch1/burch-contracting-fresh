import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query } from '@/lib/mysql';

interface Project {
  id: number;
  customer_id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
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
      `SELECT * FROM projects WHERE customer_id = ? ORDER BY created_at DESC`,
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
