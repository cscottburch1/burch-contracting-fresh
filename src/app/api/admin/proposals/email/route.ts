import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');
    
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      proposalNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      proposalDate,
      expirationDate,
      items,
      subtotal,
      taxRate,
      tax,
      total,
      notes,
      proposalType
    } = data;

    // Generate HTML email with proposal details
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.service}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">$${item.total.toFixed(2)}</td>
      </tr>
      ${item.notes ? `<tr><td colspan="4" style="padding: 5px 10px; font-size: 12px; color: #6b7280; font-style: italic;">Note: ${item.notes}</td></tr>` : ''}
    `).join('');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 800px; margin: 0 auto; background-color: white; padding: 40px;">
    <!-- Header -->
    <div style="border-bottom: 4px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between;">
        <div>
          <h1 style="margin: 0; color: #2563eb; font-size: 32px;">BURCH CONTRACTING</h1>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Professional ${proposalType}</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 24px; font-weight: bold; color: #111827;">PROPOSAL</div>
          <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">#${proposalNumber}</div>
        </div>
      </div>
    </div>

    <!-- Customer & Company Info -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
      <div>
        <h3 style="margin: 0 0 10px 0; color: #111827; font-size: 16px;">From:</h3>
        <p style="margin: 0; color: #374151; line-height: 1.6;">
          <strong>Burch Contracting</strong><br>
          (864) 724-4600<br>
          estimates@burchcontracting.com<br>
          Simpsonville, SC 29681
        </p>
      </div>
      <div>
        <h3 style="margin: 0 0 10px 0; color: #111827; font-size: 16px;">To:</h3>
        <p style="margin: 0; color: #374151; line-height: 1.6;">
          <strong>${customerName}</strong><br>
          ${customerEmail}<br>
          ${customerPhone}<br>
          ${customerAddress}
        </p>
      </div>
    </div>

    <!-- Dates -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
      <div>
        <strong style="color: #374151;">Date:</strong> ${proposalDate}
      </div>
      <div>
        <strong style="color: #374151;">Valid Until:</strong> ${expirationDate}
      </div>
    </div>

    <!-- Services Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="padding: 12px; text-align: left; color: #111827; font-weight: 600;">Service Description</th>
          <th style="padding: 12px; text-align: center; color: #111827; font-weight: 600;">Qty</th>
          <th style="padding: 12px; text-align: right; color: #111827; font-weight: 600;">Price</th>
          <th style="padding: 12px; text-align: right; color: #111827; font-weight: 600;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="margin-left: auto; width: 300px; margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="color: #374151;">Subtotal:</span>
        <span style="font-weight: 600; color: #111827;">$${subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="color: #374151;">Tax (${taxRate}%):</span>
        <span style="font-weight: 600; color: #111827;">$${tax.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #111827;">
        <span style="font-size: 18px; font-weight: bold; color: #111827;">Total:</span>
        <span style="font-size: 18px; font-weight: bold; color: #2563eb;">$${total.toFixed(2)}</span>
      </div>
    </div>

    <!-- Terms -->
    <div style="border-top: 1px solid #d1d5db; padding-top: 20px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #111827; font-size: 16px;">Terms & Conditions:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
        <li>50% deposit required to schedule work</li>
        <li>Balance due upon completion</li>
        <li>All work guaranteed for 90 days</li>
        <li>Proposal valid for 30 days from date above</li>
      </ul>
    </div>

    ${notes ? `
    <div style="margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #111827; font-size: 16px;">Additional Notes:</h3>
      <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-line;">${notes}</p>
    </div>
    ` : ''}

    <!-- Call to Action -->
    <div style="text-align: center; margin: 40px 0; padding: 30px; background-color: #eff6ff; border-radius: 8px;">
      <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">Ready to Get Started?</h3>
      <p style="margin: 0 0 20px 0; color: #374151;">Reply to this email or call us to accept this proposal and schedule your project.</p>
      <a href="tel:+18647244600" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
        📞 Call (864) 724-4600
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">Burch Contracting | (864) 724-4600 | estimates@burchcontracting.com</p>
      <p style="margin: 5px 0 0 0;">Simpsonville, SC 29681 | www.burchcontracting.com</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email using nodemailer directly
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'estimates@burchcontracting.com',
      to: customerEmail,
      subject: `Proposal #${proposalNumber} from Burch Contracting`,
      html: emailHtml
    });

    return NextResponse.json({ 
      success: true,
      message: 'Proposal emailed successfully'
    });

  } catch (error) {
    console.error('Error emailing proposal:', error);
    return NextResponse.json(
      { error: 'Failed to send proposal email' },
      { status: 500 }
    );
  }
}
