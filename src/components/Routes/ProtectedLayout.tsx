import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { RouteGuard } from './RouteGuard';

interface ProtectedLayoutProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const ProtectedLayout = ({ children, allowedRoles }: ProtectedLayoutProps) => {
  const { user } = useAuth();
  const { initializeCompanyData } = useData();

  // Inicializar dados da empresa quando usuário company_admin fizer login
  useEffect(() => {
    if (user && user.role === 'company_admin' && user.companyId) {
      console.log('Usuário company_admin detectado, inicializando dados da empresa:', user.companyId);
      initializeCompanyData(user.companyId);
    }
  }, [user, initializeCompanyData]);

  return (
    <RouteGuard allowedRoles={allowedRoles}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </RouteGuard>
  );
};