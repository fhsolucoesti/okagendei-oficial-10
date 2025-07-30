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
  // Função initializeCompanyData foi removida - dados da empresa são carregados via CompanyDataContext

  // Funcionalidade de inicialização removida - dados são carregados automaticamente pelo CompanyDataContext

  return (
    <RouteGuard allowedRoles={allowedRoles}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </RouteGuard>
  );
};