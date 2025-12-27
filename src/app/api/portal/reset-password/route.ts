import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Find valid token
    const tokens: any = await query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = ? AND expires_at > NOW() AND used_at IS NULL`,
      [token]
    );

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const resetToken = tokens[0];

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update customer password
    await query(
      'UPDATE customers SET password_hash = ? WHERE id = ?',
      [passwordHash, resetToken.customer_id]
    );

    // Mark token as used
    await query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?',
      [resetToken.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
