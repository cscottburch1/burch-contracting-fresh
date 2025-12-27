import { NextResponse } from 'next/server';
import { getCurrentAdminUser, findAdminById, updateAdminUser, changeAdminPassword } from '@/lib/adminAuth';
import { AdminRole } from '@/types/admin';

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser || currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();

    const targetUser = await findAdminById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cannot modify owner role
    if (targetUser.role === 'owner' && body.role) {
      return NextResponse.json({ error: 'Cannot change owner role' }, { status: 403 });
    }

    // Cannot disable owner
    if (targetUser.role === 'owner' && body.is_active === false) {
      return NextResponse.json({ error: 'Cannot disable owner' }, { status: 403 });
    }

    const updates: any = {};
    if (body.name) updates.name = body.name;
    if (body.email) updates.email = body.email;
    if (body.role && ['manager', 'sales', 'support'].includes(body.role)) {
      updates.role = body.role as AdminRole;
    }
    if (typeof body.is_active === 'boolean') updates.is_active = body.is_active;

    const success = await updateAdminUser(userId, updates);

    if (!success) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
