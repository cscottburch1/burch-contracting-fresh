import { NextResponse } from 'next/server';
import { setAdminSessionCookie } from '@/lib/adminAuth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
    try {
        // Rate limiting - max 5 login attempts per 15 minutes per IP
        const clientIp = getClientIp(request);
        const rateLimit = checkRateLimit({
          identifier: `admin_login_${clientIp}`,
          maxRequests: 5,
          windowMs: 15 * 60 * 1000, // 15 minutes
        });

        if (!rateLimit.allowed) {
          console.warn(`Admin login rate limit exceeded for IP: ${clientIp}`);
          return NextResponse.json(
            { error: 'Too many login attempts. Please try again later.' },
            { status: 429 }
          );
        }

        const { password } = await request.json();
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        if (password === ADMIN_PASSWORD) {
            await setAdminSessionCookie();
            return NextResponse.json({ success: true });
        }

        // Log failed attempt
        console.warn(`Failed admin login attempt from IP: ${clientIp}`);
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}