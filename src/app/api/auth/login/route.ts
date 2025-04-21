import { NextRequest, NextResponse } from 'next/server';
import { authUtils, UserRole } from '@/lib/auth/auth-utils';

// Mock database for users - in production, use actual database
const users = [
  {
    id: 1,
    email: 'admin@carehome.com',
    password_hash: '$2a$10$XQtJ5vMT8MlQrX7MZ8bRouA7X.aPCd5xUzBUULRn7PMwITvGeyAIi', // password: admin123
    first_name: 'Admin',
    last_name: 'User',
    role: UserRole.ADMIN,
    facility_id: 1
  },
  {
    id: 2,
    email: 'staff@carehome.com',
    password_hash: '$2a$10$XQtJ5vMT8MlQrX7MZ8bRouA7X.aPCd5xUzBUULRn7PMwITvGeyAIi', // password: staff123
    first_name: 'Staff',
    last_name: 'User',
    role: UserRole.STAFF,
    facility_id: 1
  },
  {
    id: 3,
    email: 'superadmin@carehome.com',
    password_hash: '$2a$10$XQtJ5vMT8MlQrX7MZ8bRouA7X.aPCd5xUzBUULRn7PMwITvGeyAIi', // password: super123
    first_name: 'Super',
    last_name: 'Admin',
    role: UserRole.SUPER_ADMIN,
    facility_id: null
  }
];

// Login handler
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await authUtils.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create user object for token
    const userForToken = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      facilityId: user.facility_id
    };
    
    // Generate token
    const token = authUtils.generateToken(userForToken);
    
    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        facilityId: user.facility_id
      },
      message: 'Login successful'
    });
    
    // Set auth cookie
    authUtils.setAuthCookie(response, token);
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
