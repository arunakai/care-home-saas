import { NextRequest, NextResponse } from 'next/server';
import { authUtils, UserRole } from '@/lib/auth/auth-utils';

// Mock database for users - in production, use actual database
let users = [
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

// Registration handler
export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, role, facilityId } = await req.json();
    
    // Validate input
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if role is valid
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await authUtils.hashPassword(password);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      role,
      facility_id: facilityId || null
    };
    
    // Add user to mock database
    users.push(newUser);
    
    // Create user object for token
    const userForToken = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      role: newUser.role,
      facilityId: newUser.facility_id
    };
    
    // Generate token
    const token = authUtils.generateToken(userForToken);
    
    // Create response
    const response = NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        facilityId: newUser.facility_id
      },
      message: 'Registration successful'
    });
    
    // Set auth cookie
    authUtils.setAuthCookie(response, token);
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
