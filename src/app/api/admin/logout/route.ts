import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/adminAuth';

export async function POST(request: Request) {
    await clearAdminSessionCookie();
    return NextResponse.json({ success: true });
}