
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { initializeCompanyData } = useData();

  // Inicializar dados da empresa quando usuário company_admin fizer login
  useEffect(() => {
    if (user && user.role === 'company_admin' && user.companyId) {
      console.log('Usuário company_admin detectado, inicializando dados da empresa:', user.companyId);
      initializeCompanyData(user.companyId);
    }
  }, [user, initializeCompanyData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log('Usuário sem permissão para acessar esta rota:', user.role, 'permitidos:', allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('Usuário autorizado:', user.role, 'acessando rota permitida');
  return <>{children}</>;
};

export default ProtectedRoute;
