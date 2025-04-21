import { NextRequest, NextResponse } from 'next/server';
import { authUtils } from '@/lib/auth/auth-utils';

// Logout handler
export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      message: 'Logout successful'
    });
    
    // Clear auth cookie
    authUtils.clearAuthCookie(response);
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
