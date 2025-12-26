import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { query, queryOne } from './mysql';

const SESSION_SECRET = process.env.CUSTOMER_SESSION_SECRET || 'change-this-secret-key-in-production';

export interface Customer {
  id: number;
  email: string;
  name: string;
  phone: string;
  address?: string;
  created_at: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createCustomer(data: {
  email: string;
  password: string;
  name: string;
  phone: string;
  address?: string;
}): Promise<Customer> {
  const passwordHash = await hashPassword(data.password);
  
  const result = await query(
    `INSERT INTO customers (email, password_hash, name, phone, address, created_at) 
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [data.email, passwordHash, data.name, data.phone, data.address || null]
  );

  const customer = await queryOne<Customer>(
    'SELECT id, email, name, phone, address, created_at FROM customers WHERE id = ?',
    [(result as any).insertId]
  );

  if (!customer) {
    throw new Error('Failed to create customer');
  }

  return customer;
}

export async function findCustomerByEmail(email: string): Promise<(Customer & { password_hash: string }) | null> {
  return queryOne<Customer & { password_hash: string }>(
    'SELECT * FROM customers WHERE email = ?',
    [email]
  );
}

export async function findCustomerById(id: number): Promise<Customer | null> {
  return queryOne<Customer>(
    'SELECT id, email, name, phone, address, created_at FROM customers WHERE id = ?',
    [id]
  );
}

export async function createCustomerSession(customerId: number): Promise<string> {
  const sessionData = `${customerId}:${Date.now()}`;
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(sessionData)
    .digest('hex');
  
  return `${sessionData}:${signature}`;
}

export async function verifyCustomerSession(sessionToken: string): Promise<number | null> {
  const parts = sessionToken.split(':');
  if (parts.length !== 3) return null;

  const [customerIdStr, timestamp, signature] = parts;
  const customerId = parseInt(customerIdStr, 10);
  
  if (isNaN(customerId)) return null;

  const sessionData = `${customerIdStr}:${timestamp}`;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(sessionData)
    .digest('hex');

  if (signature !== expectedSignature) return null;

  // Check if session is expired (30 days)
  const sessionAge = Date.now() - parseInt(timestamp, 10);
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  if (sessionAge > maxAge) return null;

  return customerId;
}

export async function getCustomerFromSession(): Promise<Customer | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('customer_session')?.value;

  if (!sessionToken) return null;

  const customerId = await verifyCustomerSession(sessionToken);
  if (!customerId) return null;

  return findCustomerById(customerId);
}

export async function setCustomerSessionCookie(customerId: number): Promise<void> {
  const sessionToken = await createCustomerSession(customerId);
  const cookieStore = await cookies();
  
  cookieStore.set('customer_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });
}

export async function clearCustomerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('customer_session');
}
