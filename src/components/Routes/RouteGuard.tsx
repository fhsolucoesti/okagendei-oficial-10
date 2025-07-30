import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultRouteForRole } from '@/config/routes';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const RouteGuard = ({ children, allowedRoles, redirectTo }: RouteGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const userDefaultRoute = getDefaultRouteForRole(user.role);
    return <Navigate to={redirectTo || userDefaultRoute} replace />;
  }

  return <>{children}</>;
};