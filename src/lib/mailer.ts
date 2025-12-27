import nodemailer from 'nodemailer';

export function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured. Missing SMTP_HOST/SMTP_USER/SMTP_PASS.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendLeadEmail(opts: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const from = process.env.SMTP_FROM || 'no-reply@localhost';
  const transporter = getTransport();

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    replyTo: opts.replyTo,
  });
}

// Generic email sending function
export async function sendEmail(to: string, subject: string, body: string) {
  const from = process.env.SMTP_FROM || 'no-reply@localhost';
  const transporter = getTransport();

  await transporter.sendMail({
    from,
    to,
    subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),
  });
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const from = process.env.SMTP_FROM || 'no-reply@localhost';
  const transporter = getTransport();

  const subject = 'Reset Your Password - Burch Contracting';
  
  const text = `Hi ${opts.name},

We received a request to reset your password for your Burch Contracting customer portal account.

Click the link below to reset your password:
${opts.resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.

Thanks,
Burch Contracting Team

---
This is an automated email. Please do not reply to this message.`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9fafb; padding: 30px; }
    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hi ${opts.name},</p>
      <p>We received a request to reset your password for your Burch Contracting customer portal account.</p>
      <p>Click the button below to reset your password:</p>
      <p style="text-align: center;">
        <a href="${opts.resetUrl}" class="button">Reset Password</a>
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        Or copy and paste this link into your browser:<br>
        <a href="${opts.resetUrl}">${opts.resetUrl}</a>
      </p>
      <p><strong>This link will expire in 1 hour</strong> for security reasons.</p>
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
      <p>Thanks,<br>Burch Contracting Team</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from,
    to: opts.to,
    subject,
    text,
    html,
  });
}
