import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export default function AuthGuard({ 
  children, 
  allowedRoles = [], 
  fallback = <div className="p-8 text-center">You don't have permission to access this page.</div> 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  // If not authenticated
  if (!user) {
    return <div className="p-8 text-center">Please log in to access this page.</div>;
  }
  
  // If no specific roles are required or user has the required role
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  
  // User doesn't have the required role
  return <>{fallback}</>;
}
