
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);

  console.log('🛡️ ProtectedRoute check:', { 
    loading, 
    hasUser: !!user, 
    userRole: user?.role, 
    allowedRoles,
    currentPath: window.location.pathname 
  });

  // Safety timeout for loading state
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ ProtectedRoute loading timeout - showing timeout message');
        setShowTimeout(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timeoutId);
    } else {
      setShowTimeout(false);
    }
  }, [loading]);

  if (loading) {
    console.log('⏳ Still loading, showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">
            {showTimeout ? 'Verificando autenticação...' : 'Carregando...'}
          </p>
          {showTimeout && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                Se esta tela persistir, tente recarregar a página
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Recarregar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log('🚫 Usuário sem permissão para acessar esta rota:', user.role, 'permitidos:', allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ Usuário autorizado:', user.role, 'acessando rota permitida');
  return <>{children}</>;
};

export default ProtectedRoute;
