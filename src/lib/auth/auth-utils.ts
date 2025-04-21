import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'care-home-saas-secret-key';

// User roles
export enum UserRole {
  STAFF = 'staff',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// User interface
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  facilityId?: number;
}

// Authentication utilities
export const authUtils = {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  },

  // Compare password with hash
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  },

  // Generate JWT token
  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      facilityId: user.facilityId
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  },

  // Verify JWT token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Set auth cookie
  setAuthCookie(response: NextResponse, token: string): void {
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
  },

  // Get auth cookie
  getAuthCookie(): string | undefined {
    const cookieStore = cookies();
    return cookieStore.get('auth_token')?.value;
  },

  // Clear auth cookie
  clearAuthCookie(response: NextResponse): void {
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });
  },

  // Get current user from request
  getCurrentUser(req: NextRequest): User | null {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;
    
    const decoded = this.verifyToken(token);
    if (!decoded) return null;
    
    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      facilityId: decoded.facilityId
    };
  },

  // Check if user has required role
  hasRole(user: User | null, requiredRoles: UserRole[]): boolean {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }
};

// Role-based access control middleware
export async function withAuth(
  req: NextRequest,
  allowedRoles: UserRole[] = [UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN]
) {
  const user = authUtils.getCurrentUser(req);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  if (!authUtils.hasRole(user, allowedRoles)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return user;
}
