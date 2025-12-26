import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64url');
}

function unb64url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

export type AdminSession = {
  email: string;
  iat: number; // issued-at unix ms
};

function sign(payloadB64: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
}

export function createAdminCookie(session: AdminSession) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('Missing ADMIN_SESSION_SECRET');

  const payloadB64 = b64url(JSON.stringify(session));
  const sig = sign(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export function verifyAdminCookie(value: string | undefined | null): AdminSession | null {
  if (!value) return null;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const parts = value.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  const expected = sign(payloadB64, secret);

  // constant-time compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  try {
    const session = JSON.parse(unb64url(payloadB64)) as AdminSession;
    if (!session?.email || !session?.iat) return null;
    return session;
  } catch {
    return null;
  }
}

export function setAdminSessionCookie() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error('Missing ADMIN_EMAIL');

  const cookieValue = createAdminCookie({ email: adminEmail, iat: Date.now() });

  cookies().set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  });
}

export function clearAdminSessionCookie() {
  cookies().set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function getAdminSessionFromRequestCookie(cookieValue?: string | null) {
  return verifyAdminCookie(cookieValue);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
