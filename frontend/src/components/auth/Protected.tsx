import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAuthenticatedSelector, isAdminSelector } from '../../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  const isAdmin = useRecoilValue(isAdminSelector);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};