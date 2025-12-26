import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      address,
      serviceType,
      budgetRange,
      timeframe,
      referralSource,
      description
    } = body;

    // Basic validation
    if (!name || !phone || !email || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Add database storage logic here
    // Example: await query('INSERT INTO leads (name, phone, email...) VALUES (?, ?, ?...)', [name, phone, email...]);

    // TODO: Add email notification logic here
    // Example: await sendLeadEmail({ to: process.env.ADMIN_EMAIL, subject: 'New Lead', text: `...` });

    console.log('New contact form submission:', {
      name,
      phone,
      email,
      serviceType,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
