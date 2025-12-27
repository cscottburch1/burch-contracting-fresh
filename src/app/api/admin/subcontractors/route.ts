import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// GET /api/admin/subcontractors - List all subcontractors
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const subcontractors: any = await query(
      `SELECT * FROM subcontractors ORDER BY created_at DESC`
    );

    // Parse JSON fields
    const parsed = subcontractors.map((sub: any) => ({
      ...sub,
      specialties: sub.specialties ? JSON.parse(sub.specialties) : [],
    }));

    return NextResponse.json({ subcontractors: parsed });
  } catch (error) {
    console.error('Error fetching subcontractors:', error);
    return NextResponse.json({ error: 'Failed to fetch subcontractors' }, { status: 500 });
  }
}
