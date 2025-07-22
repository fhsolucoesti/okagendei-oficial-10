/**
 * Production cleanup utilities
 * Use these functions to clean all development data before going live
 */

export const clearAllDevelopmentData = () => {
  console.log('🧹 Iniciando limpeza geral dos dados de desenvolvimento...');
  
  // Lista de chaves importantes que devem ser preservadas
  const preserveKeys = [
    'supabase.auth.token',
    'sb-project-ref',
    'sb-api-url',
    'platformConfig',
    'productionCleanupComplete',
    'colorTheme'
  ];
  
  // Backup das configurações importantes
  const backupData: { [key: string]: string | null } = {};
  preserveKeys.forEach(key => {
    backupData[key] = localStorage.getItem(key);
  });
  
  // Limpar localStorage, mas preservar dados essenciais
  localStorage.clear();
  
  // Restaurar dados importantes
  Object.entries(backupData).forEach(([key, value]) => {
    if (value !== null) {
      localStorage.setItem(key, value);
    }
  });
  
  // Limpar sessionStorage (pode ser completamente limpo)
  sessionStorage.clear();
  
  // Limpar dados de desenvolvimento específicos do IndexedDB se houver
  if ('indexedDB' in window) {
    try {
      // Limpar bases de dados de desenvolvimento conhecidas
      const dbsToDelete = ['supabase-cache', 'dev-data', 'test-data'];
      dbsToDelete.forEach(dbName => {
        indexedDB.deleteDatabase(dbName);
      });
    } catch (error) {
      console.warn('⚠️ Erro ao limpar IndexedDB:', error);
    }
  }
  
  console.log('✅ Limpeza concluída. Dados essenciais preservados.');
  console.log('📋 Dados preservados:', Object.keys(backupData).filter(key => backupData[key] !== null));
  
  // Não forçar reload aqui para evitar loops
  alert('Limpeza concluída! Os dados de desenvolvimento foram removidos, mas as configurações essenciais foram preservadas.');
};

export const resetLandingPageToDefaults = () => {
  console.log('🏠 Resetando Landing Page para configurações de produção...');
  
  const productionConfig = {
    heroSection: {
      title: 'Sistema de Agendamento Online',
      subtitle: 'Gerencie seus agendamentos de forma simples e eficiente',
      ctaButtonText: 'Começar Teste Grátis',
      showTrialBadge: true,
      trialText: '🆓 7 Dias Grátis'
    },
    companyInfo: {
      companyName: 'Sua Empresa',
      companyEmail: 'contato@suaempresa.com',
      companyPhone: '',
      companyAddress: ''
    },
    socialLinks: {
      facebook: '',
      instagram: '', 
      twitter: '',
      linkedin: ''
    },
    testimonials: []
  };
  
  localStorage.setItem('landingPageConfigurations', JSON.stringify(productionConfig));
  console.log('✅ Landing Page configurada para produção');
};

export const validateProductionReadiness = () => {
  console.log('🔍 Validando prontidão para produção...');
  
  const issues = [];
  
  // Check for development data
  const devKeys = ['companies', 'services', 'professionals', 'appointments'];
  devKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          issues.push(`Dados de desenvolvimento encontrados em: ${key}`);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  });
  
  // Check for test users
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.email && user.email.includes('teste')) {
        issues.push('Usuário de teste ainda logado');
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ Sistema pronto para produção!');
    return { ready: true, issues: [] };
  } else {
    console.log('❌ Problemas encontrados:', issues);
    return { ready: false, issues };
  }
};

// Function to initialize production environment
export const initializeProductionEnvironment = () => {
  console.log('🚀 Inicializando ambiente de produção...');
  
  // Clear all development data
  clearAllDevelopmentData();
  
  // Reset landing page
  resetLandingPageToDefaults();
  
  // Set production flag
  localStorage.setItem('productionMode', 'true');
  
  console.log('🎉 Ambiente de produção inicializado com sucesso!');
  
  // Suggest page refresh
  if (window.confirm('Ambiente limpo para produção. Deseja recarregar a página para aplicar as alterações?')) {
    window.location.reload();
  }
};
