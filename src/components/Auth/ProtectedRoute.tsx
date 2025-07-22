
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);
  const [showRecoveryOptions, setShowRecoveryOptions] = useState(false);

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
      }, 8000); // 8 seconds

      const recoveryTimeoutId = setTimeout(() => {
        console.warn('⚠️ Showing recovery options after extended loading');
        setShowRecoveryOptions(true);
      }, 15000); // 15 seconds

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(recoveryTimeoutId);
      };
    } else {
      setShowTimeout(false);
      setShowRecoveryOptions(false);
    }
  }, [loading]);

  const handleForceReload = () => {
    console.log('🔄 Force reload initiated by user');
    window.location.reload();
  };

  const handleClearSession = () => {
    console.log('🧹 Clearing session and redirecting to login');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    console.log('⏳ Still loading, showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md w-full px-4">
          <Card>
            <CardHeader>
              <CardTitle>Carregando Sistema</CardTitle>
              <CardDescription>
                {showTimeout 
                  ? 'Verificando autenticação...' 
                  : 'Aguarde enquanto carregamos seus dados'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              
              {showTimeout && (
                <div className="text-sm text-gray-600 space-y-2">
                  <p>O carregamento está demorando mais que o esperado.</p>
                  <p>Isso pode acontecer após uma limpeza de dados.</p>
                </div>
              )}

              {showRecoveryOptions && (
                <div className="space-y-3 border-t pt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Opções de recuperação:
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleForceReload}
                      variant="outline"
                      className="w-full"
                    >
                      Recarregar Página
                    </Button>
                    <Button 
                      onClick={handleClearSession}
                      variant="destructive"
                      className="w-full"
                    >
                      Limpar Sessão e Fazer Login
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Se o problema persistir, entre em contato com o suporte.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
