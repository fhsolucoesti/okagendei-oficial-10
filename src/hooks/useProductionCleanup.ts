import { useEffect } from 'react';
import { initializeProductionEnvironment, validateProductionReadiness } from '@/utils/productionCleanup';

export const useProductionCleanup = () => {
  const cleanupForProduction = () => {
    initializeProductionEnvironment();
  };

  const validateReadiness = () => {
    return validateProductionReadiness();
  };

  return {
    cleanupForProduction,
    validateReadiness
  };
};

// Hook para executar limpeza automática em ambiente de produção
export const useAutoCleanup = () => {
  useEffect(() => {
    // Verificar se está em ambiente de produção
    if (process.env.NODE_ENV === 'production') {
      const hasRunCleanup = localStorage.getItem('productionCleanupComplete');
      
      if (!hasRunCleanup) {
        console.log('🧹 Executando limpeza automática para produção...');
        initializeProductionEnvironment();
        localStorage.setItem('productionCleanupComplete', 'true');
      }
    }
  }, []);
};