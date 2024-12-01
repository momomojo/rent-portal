import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '@shared/hooks/useAuthState';
import { useRoleAccess } from '@shared/hooks/useRoleAccess';
import { UserRole } from '@core/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthState();
  const { hasAccess } = useRoleAccess();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasAccess(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
