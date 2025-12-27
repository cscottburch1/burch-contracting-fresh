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

// POST /api/admin/subcontractors - Create new subcontractor
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      company_name,
      contact_name,
      email,
      phone,
      address,
      city,
      state,
      zip_code,
      specialties,
      years_experience,
      insurance_info,
      license_number,
      status,
      admin_notes
    } = body;

    if (!company_name || !contact_name || !email || !phone) {
      return NextResponse.json({ 
        error: 'Company name, contact name, email, and phone are required' 
      }, { status: 400 });
    }

    const result: any = await query(
      `INSERT INTO subcontractors 
       (company_name, contact_name, email, phone, address, city, state, zip_code, 
        specialties, years_experience, insurance_info, license_number, status, admin_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_name,
        contact_name,
        email,
        phone,
        address || '',
        city || '',
        state || '',
        zip_code || '',
        JSON.stringify(specialties || []),
        years_experience || 0,
        insurance_info || '',
        license_number || '',
        status || 'pending',
        admin_notes || ''
      ]
    );

    return NextResponse.json({ 
      success: true, 
      subcontractorId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating subcontractor:', error);
    return NextResponse.json({ error: 'Failed to create subcontractor' }, { status: 500 });
  }
}
