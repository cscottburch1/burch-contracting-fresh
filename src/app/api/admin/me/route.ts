import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';

export async function GET() {
  try {
    const user = await getCurrentAdminUser();
    
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Error checking admin session:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
