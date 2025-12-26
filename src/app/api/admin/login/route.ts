import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'YourStrongPassword123!@#';  // CHANGE THIS!

export async function POST(request: Request) {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
        const response = NextResponse.json({ success: true });
        response.cookies.set({
            name: 'admin_session',
            value: 'authenticated',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 8, // 8 hours
        });
        return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}