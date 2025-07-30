import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_CONFIGS, PUBLIC_ROUTES } from '@/config/routes';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedLayout } from './ProtectedLayout';
import NotFound from '@/pages/NotFound';

// Lazy load dos componentes
const componentMap = {
  // Super Admin
  SuperAdminDashboard: lazy(() => import('@/pages/SuperAdmin/Dashboard')),
  Companies: lazy(() => import('@/pages/SuperAdmin/Companies')),
  PlanManagement: lazy(() => import('@/components/PlanManagement')),
  FinancialOverview: lazy(() => import('@/components/FinancialOverview')),
  Notifications: lazy(() => import('@/components/Notifications')),
  SuperAdminServiceCenter: lazy(() => import('@/pages/SuperAdmin/ServiceCenter')),
  LandingPageSettings: lazy(() => import('@/pages/SuperAdmin/LandingPageSettings')),
  PlatformCustomization: lazy(() => import('@/pages/SuperAdmin/PlatformCustomization')),
  SuperAdminSettings: lazy(() => import('@/pages/SuperAdmin/Settings')),
  
  // Company Admin
  CompanyDashboard: lazy(() => import('@/pages/Company/Dashboard')),
  Appointments: lazy(() => import('@/pages/Company/Appointments')),
  CompanyEmployees: lazy(() => import('@/pages/Company/Employees')),
  CompanyServices: lazy(() => import('@/pages/Company/Services')),
  CompanyClients: lazy(() => import('@/pages/Company/Clients')),
  CompanyFinancial: lazy(() => import('@/pages/Company/Financial')),
  CompanyPublicLink: lazy(() => import('@/pages/Company/PublicLink')),
  CompanySubscription: lazy(() => import('@/pages/Company/Subscription')),
  CompanyServiceCenter: lazy(() => import('@/pages/Company/ServiceCenter')),
  CompanySettings: lazy(() => import('@/pages/Company/Settings')),
  
  // Professional
  ProfessionalDashboard: lazy(() => import('@/pages/Professional/Dashboard')),
  ProfessionalSchedule: lazy(() => import('@/pages/Professional/Schedule')),
  ProfessionalCommissions: lazy(() => import('@/pages/Professional/Commissions')),
  ProfessionalHistory: lazy(() => import('@/pages/Professional/History')),
  ProfessionalSettings: lazy(() => import('@/pages/Professional/Settings')),
  
  // Public
  LandingPage: lazy(() => import('@/pages/LandingPage')),
  Login: lazy(() => import('@/pages/Login')),
  BookingPage: lazy(() => import('@/pages/Public/BookingPage')),
  CancelledSubscription: lazy(() => import('@/pages/CancelledSubscription'))
};

export const DynamicRoutes = () => {
  const { user } = useAuth();

  const renderProtectedRoutes = () => {
    return Object.entries(ROUTE_CONFIGS).map(([role, config]) => {
      return config.routes.map((route) => {
        const Component = componentMap[route.component as keyof typeof componentMap];
        const fullPath = `${config.basePath}${route.path}`;
        
        return (
          <Route
            key={fullPath}
            path={fullPath}
            element={
              <ProtectedLayout allowedRoles={[role]}>
                <Component />
              </ProtectedLayout>
            }
          />
        );
      });
    }).flat();
  };

  const renderPublicRoutes = () => {
    return PUBLIC_ROUTES.map((route) => {
      const Component = componentMap[route.component as keyof typeof componentMap];
      
      // Rota de login com redirecionamento se já logado
      if (route.component === 'Login') {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              user ? (
                <Navigate 
                  to={
                    user.role === 'super_admin' ? '/admin' : 
                    user.role === 'company_admin' ? '/empresa' : 
                    '/profissional'
                  } 
                  replace 
                />
              ) : (
                <Component />
              )
            }
          />
        );
      }
      
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<Component />}
        />
      );
    });
  };

  return (
    <Routes>
      {/* Rotas públicas */}
      {renderPublicRoutes()}
      
      {/* Rotas protegidas */}
      {renderProtectedRoutes()}
      
      {/* Redirecionamento da raiz */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={user ? 
              (user.role === 'super_admin' ? '/admin' : 
               user.role === 'company_admin' ? '/empresa' : 
               '/profissional') 
              : '/home'
            } 
            replace 
          />
        } 
      />
      
      {/* Página de acesso negado */}
      <Route 
        path="/unauthorized" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Acesso Negado</h1>
              <p className="text-muted-foreground mb-4">Você não tem permissão para acessar esta página.</p>
              <button 
                onClick={() => window.history.back()}
                className="text-primary hover:text-primary/80"
              >
                Voltar
              </button>
            </div>
          </div>
        } 
      />
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};