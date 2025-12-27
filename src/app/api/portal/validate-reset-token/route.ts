import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Check if token exists and is valid
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

    return NextResponse.json({
      valid: true,
      message: 'Token is valid',
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
