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
