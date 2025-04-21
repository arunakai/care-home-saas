import { NextRequest, NextResponse } from 'next/server';
import { authUtils } from '@/lib/auth/auth-utils';

// Get current user handler
export async function GET(req: NextRequest) {
  try {
    // Get current user from request
    const user = authUtils.getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
}
