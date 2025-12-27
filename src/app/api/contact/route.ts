import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/mailer';
import { query } from '@/lib/mysql';
import { validateRecaptcha } from '@/lib/recaptcha';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // Rate limiting - max 5 submissions per 15 minutes per IP
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit({
      identifier: clientIp,
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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
      description,
      recaptchaToken,
      website, // Honeypot field
    } = body;

    // Honeypot check
    if (website) {
      console.warn(`Spam detected (honeypot): ${email || 'no email'}`);
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Basic validation
    if (!name || !phone || !email || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA if token provided
    if (recaptchaToken) {
      try {
        await validateRecaptcha(recaptchaToken, 'contact_form', 0.5);
      } catch (recaptchaError) {
        console.error('reCAPTCHA validation failed:', recaptchaError);
        return NextResponse.json(
          { error: 'Spam protection check failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Save lead to database
    const result = await query<any>(
      `INSERT INTO leads (name, phone, email, address, service_type, budget_range, timeframe, referral_source, description, status, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'medium')`,
      [name, phone, email, address || null, serviceType || null, budgetRange || null, timeframe || null, referralSource || null, description]
    );

    const leadId = (result as any).insertId;

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
