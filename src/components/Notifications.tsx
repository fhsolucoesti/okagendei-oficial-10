import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  AlertTriangle, 
  DollarSign, 
  UserPlus, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  Building2,
  TrendingUp,
  Eye,
  MessageSquare,
  Mail
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import InvoiceCollection from './InvoiceCollection';

const Notifications = () => {
  const { notifications, companies, markNotificationAsRead, invoices } = useData();
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [viewCompanyDialog, setViewCompanyDialog] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_overdue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'company_registered':
        return <UserPlus className="h-5 w-5 text-green-600" />;
      case 'trial_expiring':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'payment_success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'payment_failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'payment_overdue':
      case 'payment_failed':
        return 'bg-red-50 border-red-200';
      case 'company_registered':
      case 'payment_success':
        return 'bg-green-50 border-green-200';
      case 'trial_expiring':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Média</Badge>;
      case 'low':
        return <Badge variant="secondary">Baixa</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
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
      return date.toLocaleDateString('pt-BR');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;

  const markAsRead = (id: string) => {
    markNotificationAsRead(id);
    toast.success('Notificação marcada como lida');
  };

  const markAllAsRead = () => {
    notifications.filter(n => !n.isRead).forEach(n => markNotificationAsRead(n.id));
    toast.success('Todas as notificações marcadas como lidas');
  };

  const handleViewCompany = (companyId?: string) => {
    if (companyId) {
      const company = companies.find(c => c.id === companyId);
      if (company) {
        setSelectedCompany(company);
        setViewCompanyDialog(true);
      }
    }
  };

  const handleSendBilling = (companyId?: string) => {
    if (companyId) {
      const company = companies.find(c => c.id === companyId);
      if (company) {
        toast.success(`Sistema de cobrança aberto para ${company.name}`);
      }
    }
  };

  // Empresas com faturas em atraso para o componente de cobrança
  const overdueCompanies = companies.filter(c => {
    const invoice = invoices.find(i => i.companyId === c.id && i.status === 'overdue');
    if (invoice) {
      const daysOverdue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      return { ...c, overdueDays: daysOverdue };
    }
    return false;
  }).map(c => {
    const invoice = invoices.find(i => i.companyId === c.id && i.status === 'overdue');
    const daysOverdue = Math.floor((new Date().getTime() - new Date(invoice!.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    return { ...c, overdueDays: daysOverdue };
  });

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Notification Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-bold">{notifications.length}</div>
                <div className="text-xs sm:text-sm text-blue-100">Total</div>
              </div>
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-bold">{unreadCount}</div>
                <div className="text-xs sm:text-sm text-orange-100">Não Lidas</div>
              </div>
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-bold">{highPriorityCount}</div>
                <div className="text-xs sm:text-sm text-red-100">Alta Prior.</div>
              </div>
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-bold">
                  {notifications.filter(n => n.isRead).length}
                </div>
                <div className="text-xs sm:text-sm text-green-100">Resolvidas</div>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistema de Cobrança para Faturas em Atraso */}
      {overdueCompanies.length > 0 && (
        <InvoiceCollection overdueCompanies={overdueCompanies} />
      )}

      {/* Notifications List - Responsive Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 lg:grid-cols-3">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              Todas ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs sm:text-sm">
              Não Lidas ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="high" className="text-xs sm:text-sm">
              Alta Prioridade ({highPriorityCount})
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={markAllAsRead} variant="outline" size="sm" className="w-full sm:w-auto">
            Marcar Todas como Lidas
          </Button>
        </div>

        {/* Tab Contents with Responsive Design */}
        <TabsContent value="all" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Todas as Notificações</CardTitle>
              <CardDescription className="text-sm">Histórico completo de notificações do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getNotificationBg(notification.type)} ${
                      !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-3 sm:space-x-4">
                      <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <h4 className="font-medium text-slate-900 text-sm sm:text-base truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                              {getPriorityBadge(notification.priority)}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                        {notification.type === 'company_registered' && notification.companyId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCompany(notification.companyId)}
                            className="text-xs whitespace-nowrap"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Ver Empresa</span>
                          </Button>
                        )}
                        
                        {notification.type === 'payment_overdue' && notification.companyId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 text-xs whitespace-nowrap"
                            onClick={() => handleSendBilling(notification.companyId)}
                          >
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Cobrar</span>
                          </Button>
                        )}
                        
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs whitespace-nowrap"
                          >
                            <span className="hidden sm:inline">Marcar como Lida</span>
                            <Eye className="h-3 w-3 sm:hidden" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Notificações Não Lidas</CardTitle>
              <CardDescription className="text-sm">Itens que requerem sua atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {notifications.filter(n => !n.isRead).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getNotificationBg(notification.type)} ${
                      !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-3 sm:space-x-4">
                      <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <h4 className="font-medium text-slate-900 text-sm sm:text-base truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              {getPriorityBadge(notification.priority)}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                        {notification.type === 'company_registered' && notification.companyId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCompany(notification.companyId)}
                            className="text-xs whitespace-nowrap"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Ver Empresa</span>
                          </Button>
                        )}
                        
                        {notification.type === 'payment_overdue' && notification.companyId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 text-xs whitespace-nowrap"
                            onClick={() => handleSendBilling(notification.companyId)}
                          >
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Cobrar</span>
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">Marcar como Lida</span>
                          <Eye className="h-3 w-3 sm:hidden" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Alta Prioridade</CardTitle>
              <CardDescription className="text-sm">Notificações críticas que precisam de ação imediata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {notifications.filter(n => n.priority === 'high' && !n.isRead).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getNotificationBg(notification.type)} ${
                      !notification.isRead ? 'border-l-4 border-l-red-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-3 sm:space-x-4">
                      <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <h4 className="font-medium text-slate-900 text-sm sm:text-base truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                              {getPriorityBadge(notification.priority)}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                        {notification.type === 'company_registered' && notification.companyId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCompany(notification.companyId)}
                            className="text-xs whitespace-nowrap"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Ver Empresa</span>
                          </Button>
                        )}
                        
                        {notification.type === 'payment_overdue' && notification.companyId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 text-xs whitespace-nowrap"
                            onClick={() => handleSendBilling(notification.companyId)}
                          >
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Cobrar</span>
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">Marcar como Lida</span>
                          <Eye className="h-3 w-3 sm:hidden" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para Visualizar Empresa - Responsive */}
      <Dialog open={viewCompanyDialog} onOpenChange={setViewCompanyDialog}>
        <DialogContent className="max-w-sm sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">Detalhes da Empresa</DialogTitle>
            <DialogDescription className="text-sm">
              Informações da empresa cadastrada
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                  <AvatarImage src={selectedCompany.logo} alt={selectedCompany.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <Building2 className="h-6 w-6 sm:h-8 sm:w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold truncate">{selectedCompany.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                    <Badge className="bg-blue-100 text-blue-800 text-xs w-fit">{selectedCompany.plan}</Badge>
                    <Badge variant={selectedCompany.status === 'active' ? 'default' : 'secondary'} className="text-xs w-fit">
                      {selectedCompany.status === 'active' ? 'Ativo' : selectedCompany.status === 'trial' ? 'Teste' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="break-all"><strong>Email:</strong> {selectedCompany.email}</p>
                <p><strong>Telefone:</strong> {selectedCompany.phone}</p>
                <p className="break-words"><strong>Endereço:</strong> {selectedCompany.address}</p>
                <p><strong>Funcionários:</strong> {selectedCompany.employees}</p>
                <p><strong>Faturamento:</strong> R$ {selectedCompany.monthlyRevenue.toLocaleString('pt-BR')}</p>
                <p><strong>Cadastro:</strong> {new Date(selectedCompany.createdAt).toLocaleDateString('pt-BR')}</p>
                {selectedCompany.trialEndsAt && (
                  <p><strong>Teste expira:</strong> {new Date(selectedCompany.trialEndsAt).toLocaleDateString('pt-BR')}</p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1 text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="flex-1 text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;
