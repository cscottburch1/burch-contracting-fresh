import { NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSessionCookie } from '@/lib/adminAuth';
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

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // Verify credentials against database
        const user = await verifyAdminCredentials(email, password);

        if (!user) {
            console.warn(`Failed admin login attempt for ${email} from IP: ${clientIp}`);
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Create session
        await setAdminSessionCookie(user);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}