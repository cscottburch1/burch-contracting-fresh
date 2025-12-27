import { NextResponse } from 'next/server';
import { getCurrentAdminUser, listAdminUsers, createAdminUser, updateAdminUser } from '@/lib/adminAuth';
import { AdminRole } from '@/types/admin';

// GET /api/admin/users - List all users
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser || currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const users = await listAdminUsers();
    
    // Remove password hashes from response
    const safeUsers = users.map(({ password_hash, ...user }) => user);
    
    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser || currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!['manager', 'sales', 'support'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const newUser = await createAdminUser({
      email,
      password,
      name,
      role: role as AdminRole,
    });

    if (!newUser) {
      return NextResponse.json({ error: 'Failed to create user (email may already exist)' }, { status: 400 });
    }

    const { password_hash, ...safeUser } = newUser;
    
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
