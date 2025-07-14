
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 ml-12 lg:ml-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 ml-4">
          <NotificationDropdown />
          
          <div className="flex items-center space-x-2 min-w-0">
            <div className="bg-gray-100 rounded-full p-1.5 sm:p-2 flex-shrink-0">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </div>
            {!isMobile && (
              <div className="text-sm min-w-0 hidden sm:block">
                <p className="font-medium text-gray-900 truncate text-xs sm:text-sm">
                  {user?.name}
                </p>
                <p className="text-gray-600 truncate text-xs">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
