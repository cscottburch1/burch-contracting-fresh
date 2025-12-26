import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';

export async function GET() {
  try {
    const customer = await getCustomerFromSession();

    if (!customer) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { error: 'Failed to get customer info' },
      { status: 500 }
    );
  }
}
