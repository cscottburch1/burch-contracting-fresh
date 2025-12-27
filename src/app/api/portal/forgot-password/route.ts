import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendPasswordResetEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    // Rate limiting: 3 requests per 15 minutes per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit({
      identifier: `forgot-password-${clientIp}`,
      maxRequests: 3,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find customer by email
    const customers: any = await query(
      'SELECT id, email, name FROM customers WHERE email = ?',
      [email]
    );

    // Always return success to prevent email enumeration
    // But only send email if customer exists
    if (customers.length > 0) {
      const customer = customers[0];

      // Generate secure random token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Token expires in 1 hour
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Delete any existing tokens for this customer
      await query(
        'DELETE FROM password_reset_tokens WHERE customer_id = ?',
        [customer.id]
      );

      // Insert new token
      await query(
        'INSERT INTO password_reset_tokens (customer_id, token, expires_at) VALUES (?, ?, ?)',
        [customer.id, token, expiresAt]
      );

      // Send reset email
      const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal/reset-password?token=${token}`;
      
      try {
        await sendPasswordResetEmail({
          to: customer.email,
          name: customer.name,
          resetUrl,
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        return NextResponse.json(
          { error: 'Failed to send reset email. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Always return success (even if email doesn't exist) to prevent enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
