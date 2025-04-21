// Replace the current content of src/lib/auth/auth-utils.ts with this:

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// User roles enum
export enum UserRole {
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// JWT token interface
export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Compare password with hash
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Client-side cookie management functions
export const setCookieClient = (name: string, value: string, days: number) => {
  if (typeof window === 'undefined') return;
  
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

export const getCookieClient = (name: string) => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookieClient = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
