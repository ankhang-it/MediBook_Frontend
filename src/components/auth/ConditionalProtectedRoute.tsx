import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthPage } from './AuthPage';

interface ConditionalProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ConditionalProtectedRoute({ 
  children, 
  fallback = <AuthPage /> 
}: ConditionalProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show fallback (usually AuthPage)
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // User is authenticated, show protected content
  return <>{children}</>;
}
