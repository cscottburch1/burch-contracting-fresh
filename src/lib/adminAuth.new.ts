import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from './mysql';
import { AdminUser, AdminSession, AdminRole } from '@/types/admin';

const COOKIE_NAME = 'admin_session';

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64url');
}

function unb64url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

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
    if (!session?.userId || !session?.email || !session?.timestamp) return null;
    
    // Check if session is expired (12 hours)
    const maxAge = 12 * 60 * 60 * 1000; // 12 hours in ms
    if (Date.now() - session.timestamp > maxAge) return null;
    
    return session;
  } catch {
    return null;
  }
}

// Find admin user by email
export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  try {
    const results = await query<AdminUser[]>(
      'SELECT * FROM admin_users WHERE email = ? AND is_active = TRUE LIMIT 1',
      [email]
    );
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error finding admin user:', error);
    return null;
  }
}

// Find admin user by ID
export async function findAdminById(id: number): Promise<AdminUser | null> {
  try {
    const results = await query<AdminUser[]>(
      'SELECT * FROM admin_users WHERE id = ? AND is_active = TRUE LIMIT 1',
      [id]
    );
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error finding admin user:', error);
    return null;
  }
}

// Verify admin credentials
export async function verifyAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  const user = await findAdminByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;

  // Update last login
  await query(
    'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
    [user.id]
  );

  return user;
}

// Create admin session cookie
export async function setAdminSessionCookie(user: AdminUser) {
  const session: AdminSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    timestamp: Date.now(),
  };

  const cookieValue = createAdminCookie(session);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  });
}

// Clear admin session cookie
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// Get admin session from request cookie
export function getAdminSessionFromRequestCookie(cookieValue?: string | null): AdminSession | null {
  return verifyAdminCookie(cookieValue);
}

// Helper function to verify admin authentication from a request
export async function verifyAdminAuth(request: Request): Promise<AdminSession | null> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const sessionCookie = cookies[COOKIE_NAME];
  return verifyAdminCookie(sessionCookie);
}

// Get current admin user from session
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  const session = verifyAdminCookie(sessionCookie);
  
  if (!session) return null;
  
  return await findAdminById(session.userId);
}

// Create a new admin user
export async function createAdminUser(data: {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
}): Promise<AdminUser | null> {
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const result = await query<any>(
      `INSERT INTO admin_users (email, password_hash, name, role, is_active) 
       VALUES (?, ?, ?, ?, TRUE)`,
      [data.email, passwordHash, data.name, data.role]
    );

    return await findAdminById(result.insertId);
  } catch (error) {
    console.error('Error creating admin user:', error);
    return null;
  }
}

// Update admin user
export async function updateAdminUser(id: number, data: {
  name?: string;
  email?: string;
  role?: AdminRole;
  is_active?: boolean;
}): Promise<boolean> {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.role !== undefined) {
      updates.push('role = ?');
      values.push(data.role);
    }
    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(data.is_active);
    }

    if (updates.length === 0) return true;

    values.push(id);
    await query(
      `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return true;
  } catch (error) {
    console.error('Error updating admin user:', error);
    return false;
  }
}

// Change admin password
export async function changeAdminPassword(id: number, newPassword: string): Promise<boolean> {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query(
      'UPDATE admin_users SET password_hash = ? WHERE id = ?',
      [passwordHash, id]
    );
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
}

// List all admin users
export async function listAdminUsers(): Promise<AdminUser[]> {
  try {
    return await query<AdminUser[]>(
      'SELECT id, email, name, role, is_active, created_at, updated_at, last_login FROM admin_users ORDER BY created_at DESC'
    );
  } catch (error) {
    console.error('Error listing admin users:', error);
    return [];
  }
}

// LEGACY SUPPORT: For backward compatibility with old single-password system
// This will be removed once multi-user system is fully migrated
export async function verifyLegacyAdminPassword(password: string): Promise<boolean> {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  return password === ADMIN_PASSWORD;
}
