import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/mailer';

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

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendLeadEmail({
          to: adminEmail,
          subject: `New Lead: ${name} - ${serviceType || 'General Inquiry'}`,
          text: `
New Lead Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contact Information:
• Name: ${name}
• Phone: ${phone}
• Email: ${email}
${address ? `• Address: ${address}` : ''}

Project Details:
${serviceType ? `• Service Type: ${serviceType}` : ''}
${budgetRange ? `• Budget Range: ${budgetRange}` : ''}
${timeframe ? `• Timeframe: ${timeframe}` : ''}
${referralSource ? `• Referral Source: ${referralSource}` : ''}

Message:
${description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
          `,
          replyTo: email,
        });
        console.log('Lead email notification sent to admin');
      } catch (emailError) {
        console.error('Failed to send lead email:', emailError);
        // Don't fail the request if email fails
      }
    }

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
