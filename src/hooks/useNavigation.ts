import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultRouteForRole, getRoutesForRole, ROUTE_CONFIGS } from '@/config/routes';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigateToDefault = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const defaultRoute = getDefaultRouteForRole(user.role);
    navigate(defaultRoute);
  };

  const navigateToRoute = (path: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const userConfig = ROUTE_CONFIGS[user.role];
    if (userConfig) {
      const fullPath = path.startsWith(userConfig.basePath) ? path : `${userConfig.basePath}${path}`;
      navigate(fullPath);
    } else {
      navigate(path);
    }
  };

  const getCurrentRoute = () => {
    if (!user) return null;
    
    const userConfig = ROUTE_CONFIGS[user.role];
    if (!userConfig) return null;
    
    const relativePath = location.pathname.replace(userConfig.basePath, '');
    return userConfig.routes.find(route => route.path === relativePath);
  };

  const isCurrentRoute = (path: string): boolean => {
    if (!user) return false;
    
    const userConfig = ROUTE_CONFIGS[user.role];
    if (!userConfig) return false;
    
    const fullPath = path.startsWith(userConfig.basePath) ? path : `${userConfig.basePath}${path}`;
    return location.pathname === fullPath;
  };

  const getUserRoutes = () => {
    if (!user) return [];
    return getRoutesForRole(user.role);
  };

  return {
    navigateToDefault,
    navigateToRoute,
    getCurrentRoute,
    isCurrentRoute,
    getUserRoutes,
    currentPath: location.pathname
  };
};