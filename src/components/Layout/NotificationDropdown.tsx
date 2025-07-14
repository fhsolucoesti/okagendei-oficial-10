
import { useState } from 'react';
import { Bell, X, Eye, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const NotificationDropdown = () => {
  const { notifications, markNotificationAsRead } = useData();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const recentNotifications = notifications.slice(0, 5);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_overdue':
      case 'payment_failed':
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
      case 'company_registered':
      case 'payment_success':
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />;
      case 'trial_expiring':
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />;
      default:
        return <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMins} min atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
    }
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationAsRead(id);
    toast.success('Notificação marcada como lida');
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    toast.info(`Abrindo detalhes: ${notification.title}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative p-2 sm:px-3 sm:py-2">
          <Bell className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline text-xs sm:text-sm">
            {isMobile ? '' : 'Notificações'}
          </span>
          {unreadNotifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className={`p-0 ${isMobile ? 'w-screen max-w-sm mx-2' : 'w-80 sm:w-96'}`} 
        align="end"
        sideOffset={8}
      >
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm sm:text-base">Notificações</h3>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="p-1">
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          {unreadNotifications.length > 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {unreadNotifications.length} não lida{unreadNotifications.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="h-60 sm:h-80">
          {recentNotifications.length > 0 ? (
            <div className="p-2">
              {recentNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`mb-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-xs sm:text-sm truncate pr-2">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 sm:h-6 sm:w-6 p-0 flex-shrink-0"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                            >
                              <Eye className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.createdAt)}
                          </span>
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs py-0 px-1">
                              Alta
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center text-muted-foreground">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs sm:text-sm">Nenhuma notificação</p>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 5 && (
          <div className="p-2 sm:p-3 border-t">
            <Button variant="outline" className="w-full text-xs sm:text-sm" size="sm">
              Ver todas as notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
