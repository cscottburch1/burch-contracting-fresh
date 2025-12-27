import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { validateRecaptcha } from '@/lib/recaptcha';
import { sendLeadEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    // Rate limiting: 3 applications per hour per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit({
      identifier: `subcontractor-apply-${clientIp}`,
      maxRequests: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many applications. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      // Honeypot check
      website,
      
      // reCAPTCHA
      recaptchaToken,
      
      // Required fields
      company_name,
      contact_name,
      email,
      phone,
      business_type,
      years_in_business,
      license_number,
      insurance_provider,
      insurance_expiry,
      specialties,
      
      // Optional fields
      address,
      city,
      state,
      zip,
    } = body;

    // Honeypot check - if filled, it's a bot
    if (website) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    // Basic validation
    if (!company_name || !contact_name || !email || !phone || !business_type || 
        !years_in_business || !license_number || !insurance_provider || !insurance_expiry) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    if (!specialties || !Array.isArray(specialties) || specialties.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one specialty' },
        { status: 400 }
      );
    }

    // reCAPTCHA verification
    if (recaptchaToken) {
      const isValid = await validateRecaptcha(recaptchaToken, 'subcontractor_apply');
      if (!isValid) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Insert into database
    const result: any = await query(
      `INSERT INTO subcontractors 
       (company_name, contact_name, email, phone, address, city, state, zip,
        business_type, years_in_business, license_number, insurance_provider, 
        insurance_expiry, specialties, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        company_name,
        contact_name,
        email,
        phone,
        address || null,
        city || null,
        state || null,
        zip || null,
        business_type,
        years_in_business,
        license_number,
        insurance_provider,
        insurance_expiry,
        JSON.stringify(specialties),
      ]
    );

    // Log activity
    await query(
      `INSERT INTO subcontractor_activity 
       (subcontractor_id, activity_type, description)
       VALUES (?, 'application', ?)`,
      [result.insertId, `New application submitted by ${company_name}`]
    );

    // Send notification email to admin
    try {
      await sendLeadEmail({
        to: process.env.ADMIN_EMAIL || 'estimates@burchcontracting.com',
        subject: 'New Subcontractor Application',
        text: `New subcontractor application from ${company_name}.\n\nContact: ${contact_name}\nEmail: ${email}\nPhone: ${phone}\nSpecialties: ${specialties.join(', ')}`,
        replyTo: email as string,
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully. We will review and contact you within 48 hours.',
      id: result.insertId,
    });
  } catch (error: any) {
    console.error('Error processing subcontractor application:', error);
    
    // Check for duplicate email
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'An application with this email already exists.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
