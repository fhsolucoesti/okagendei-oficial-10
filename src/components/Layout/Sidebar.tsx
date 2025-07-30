
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigation } from '@/hooks/useNavigation';
import * as Icons from 'lucide-react';

interface PlatformConfig {
  menuLogo?: string;
  menuPlatformName?: string;
  menuTextColor?: string;
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    menuPlatformName: 'OKAgendei',
    menuTextColor: '#1f2937'
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Carregar configurações da plataforma
  useEffect(() => {
    const loadPlatformConfig = () => {
      const savedConfig = localStorage.getItem('platformConfig');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setPlatformConfig({
          menuLogo: parsed.menuLogo || '',
          menuPlatformName: parsed.menuPlatformName || 'OKAgendei',
          menuTextColor: parsed.menuTextColor || '#1f2937'
        });
      }
    };

    loadPlatformConfig();

    // Escutar mudanças nas configurações
    const handleConfigUpdate = (event: CustomEvent) => {
      const config = event.detail;
      setPlatformConfig({
        menuLogo: config.menuLogo || '',
        menuPlatformName: config.menuPlatformName || 'OKAgendei',
        menuTextColor: config.menuTextColor || '#1f2937'
      });
    };

    window.addEventListener('platformConfigUpdated', handleConfigUpdate as EventListener);

    return () => {
      window.removeEventListener('platformConfigUpdated', handleConfigUpdate as EventListener);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const { getUserRoutes, isCurrentRoute } = useNavigation();
  
  const getSidebarItems = () => {
    const userRoutes = getUserRoutes();
    return userRoutes.map(route => {
      const IconComponent = Icons[route.icon as keyof typeof Icons] as any;
      return {
        icon: IconComponent,
        label: route.label!,
        path: route.path,
        fullPath: user?.role ? 
          (route.path === '' ? 
            (user.role === 'super_admin' ? '/admin' : 
             user.role === 'company_admin' ? '/empresa' : 
             '/profissional') :
            (user.role === 'super_admin' ? `/admin${route.path}` :
             user.role === 'company_admin' ? `/empresa${route.path}` :
             `/profissional${route.path}`)) : 
          route.path
      };
    });
  };

  const sidebarItems = getSidebarItems();

  const renderLogo = () => {
    if (platformConfig.menuLogo) {
      return (
        <img 
          src={platformConfig.menuLogo} 
          alt="Logo" 
          className="h-8 w-auto object-contain max-w-[120px]"
        />
      );
    }
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl">
        <Calendar className="h-5 w-5" />
      </div>
    );
  };

  // Mobile sidebar overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile Trigger Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
              {/* Mobile Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {renderLogo()}
                  <div>
                    <h1 
                      className="text-lg font-bold"
                      style={{ color: platformConfig.menuTextColor }}
                    >
                      {platformConfig.menuPlatformName}
                    </h1>
                    <p className="text-xs text-gray-600">
                      {user?.role === 'super_admin' ? 'Admin Geral' : 
                       user?.role === 'company_admin' ? 'Admin Empresa' : 'Profissional'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => (
                  <NavLink
                    key={item.fullPath}
                    to={item.fullPath}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Mobile User Info & Logout */}
              <div className="p-4 border-t border-gray-200">
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start px-3"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} hidden lg:flex`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              {renderLogo()}
              <div>
                <h1 
                  className="text-lg font-bold"
                  style={{ color: platformConfig.menuTextColor }}
                >
                  {platformConfig.menuPlatformName}
                </h1>
                <p className="text-xs text-gray-600">
                  {user?.role === 'super_admin' ? 'Admin Geral' : 
                   user?.role === 'company_admin' ? 'Admin Empresa' : 'Profissional'}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.fullPath}
            to={item.fullPath}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
