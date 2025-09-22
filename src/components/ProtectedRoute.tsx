import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'patient' | 'doctor' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-primary">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    let redirectPath = '/';
    switch (user.role) {
      case 'doctor':
        redirectPath = '/doctor-dashboard';
        break;
      case 'admin':
        redirectPath = '/admin-dashboard';
        break;
      case 'patient':
      default:
        redirectPath = '/';
        break;
    }
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
