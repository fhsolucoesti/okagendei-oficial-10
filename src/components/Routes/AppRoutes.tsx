
import { Suspense } from 'react';
import { DynamicRoutes } from './DynamicRoutes';

const AppRoutes = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      }
    >
      <DynamicRoutes />
    </Suspense>
  );
};

export default AppRoutes;
