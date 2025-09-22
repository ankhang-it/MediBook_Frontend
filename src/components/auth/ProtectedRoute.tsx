import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthPage } from './AuthPage';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'patient' | 'doctor' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show auth page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // If role is required and user doesn't have it, show access denied
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Truy cập bị từ chối
          </h1>
          <p className="text-muted-foreground">
            Bạn không có quyền truy cập vào trang này.
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role (if any)
  return <>{children}</>;
}
