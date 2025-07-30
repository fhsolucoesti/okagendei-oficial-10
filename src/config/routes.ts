// Configuração centralizada de rotas por tipo de usuário
export interface RouteConfig {
  path: string;
  component: string;
  label?: string;
  icon?: string;
}

export interface UserRoutes {
  basePath: string;
  defaultPath: string;
  routes: RouteConfig[];
}

export const ROUTE_CONFIGS: Record<string, UserRoutes> = {
  super_admin: {
    basePath: '/admin',
    defaultPath: '/admin',
    routes: [
      { path: '', component: 'SuperAdminDashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { path: '/empresas', component: 'Companies', label: 'Empresas', icon: 'Building2' },
      { path: '/planos', component: 'PlanManagement', label: 'Planos', icon: 'Package' },
      { path: '/financeiro', component: 'FinancialOverview', label: 'Financeiro', icon: 'DollarSign' },
      { path: '/notificacoes', component: 'Notifications', label: 'Notificações', icon: 'Bell' },
      { path: '/central-servico', component: 'SuperAdminServiceCenter', label: 'Central de Serviço', icon: 'HelpCircle' },
      { path: '/landing-page', component: 'LandingPageSettings', label: 'Landing Page', icon: 'Globe' },
      { path: '/personalizacao', component: 'PlatformCustomization', label: 'Personalização', icon: 'Palette' },
      { path: '/configuracoes', component: 'SuperAdminSettings', label: 'Configurações', icon: 'Settings' }
    ]
  },
  company_admin: {
    basePath: '/empresa',
    defaultPath: '/empresa',
    routes: [
      { path: '', component: 'CompanyDashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { path: '/agendamentos', component: 'Appointments', label: 'Agendamentos', icon: 'Calendar' },
      { path: '/funcionarios', component: 'CompanyEmployees', label: 'Funcionários', icon: 'Users' },
      { path: '/servicos', component: 'CompanyServices', label: 'Serviços', icon: 'Briefcase' },
      { path: '/clientes', component: 'CompanyClients', label: 'Clientes', icon: 'UserCheck' },
      { path: '/financeiro', component: 'CompanyFinancial', label: 'Financeiro', icon: 'DollarSign' },
      { path: '/link-publico', component: 'CompanyPublicLink', label: 'Link Público', icon: 'Link' },
      { path: '/assinatura', component: 'CompanySubscription', label: 'Assinatura', icon: 'CreditCard' },
      { path: '/central-servico', component: 'CompanyServiceCenter', label: 'Central de Serviço', icon: 'HelpCircle' },
      { path: '/configuracoes', component: 'CompanySettings', label: 'Configurações', icon: 'Settings' }
    ]
  },
  professional: {
    basePath: '/profissional',
    defaultPath: '/profissional',
    routes: [
      { path: '', component: 'ProfessionalDashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { path: '/agenda', component: 'ProfessionalSchedule', label: 'Agenda', icon: 'Calendar' },
      { path: '/comissoes', component: 'ProfessionalCommissions', label: 'Comissões', icon: 'DollarSign' },
      { path: '/historico', component: 'ProfessionalHistory', label: 'Histórico', icon: 'Clock' },
      { path: '/configuracoes', component: 'ProfessionalSettings', label: 'Configurações', icon: 'Settings' }
    ]
  }
};

// Rotas públicas
export const PUBLIC_ROUTES = [
  { path: '/home', component: 'LandingPage' },
  { path: '/login', component: 'Login' },
  { path: '/agendar/:companyUrl', component: 'BookingPage' },
  { path: '/assinatura-cancelada', component: 'CancelledSubscription' }
];

// Utilitários de rota
export const getDefaultRouteForRole = (role: string): string => {
  return ROUTE_CONFIGS[role]?.defaultPath || '/home';
};

export const getRoutesForRole = (role: string): RouteConfig[] => {
  return ROUTE_CONFIGS[role]?.routes || [];
};

export const isValidRouteForRole = (path: string, role: string): boolean => {
  const config = ROUTE_CONFIGS[role];
  if (!config) return false;
  
  const normalizedPath = path.replace(config.basePath, '');
  return config.routes.some(route => route.path === normalizedPath);
};