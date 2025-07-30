
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';

const CompanyDashboard = () => {
  const { appointments, professionals, services, clients } = useCompanyDataContext();
  const { user } = useAuth();

  // Filtrar dados da empresa do usuário
  const companyAppointments = appointments.filter(a => a.companyId === user?.companyId);
  const companyProfessionals = professionals.filter(p => p.companyId === user?.companyId);
  const companyServices = services.filter(s => s.companyId === user?.companyId);
  const companyClients = clients.filter(c => c.companyId === user?.companyId);

  // Agendamentos de hoje
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = companyAppointments.filter(a => a.date === today);

  // Faturamento do mês
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyRevenue = companyAppointments
    .filter(a => {
      const appointmentDate = new Date(a.date);
      return appointmentDate.getMonth() === thisMonth && 
             appointmentDate.getFullYear() === thisYear &&
             a.status === 'completed';
    })
    .reduce((sum, a) => sum + a.price, 0);

  // Próximos agendamentos
  const upcomingAppointments = companyAppointments
    .filter(a => a.status === 'scheduled')
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
    .slice(0, 5);

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Dashboard da Empresa" subtitle="Visão geral dos seus agendamentos e performance" />
      
      <main className="p-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Agendamentos Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <p className="text-xs text-blue-200">
                {todayAppointments.filter(a => a.status === 'completed').length} concluídos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Faturamento Mensal
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {monthlyRevenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-green-200">
                +15% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Profissionais
              </CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyProfessionals.length}</div>
              <p className="text-xs text-purple-200">
                {companyProfessionals.filter(p => p.isActive).length} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Total de Clientes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyClients.length}</div>
              <p className="text-xs text-orange-200">
                Clientes cadastrados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximos Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Agendamentos confirmados para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => {
                    const professional = companyProfessionals.find(p => p.id === appointment.professionalId);
                    const service = companyServices.find(s => s.id === appointment.serviceId);
                    
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.clientName}</p>
                            <p className="text-sm text-gray-500">{service?.name} - {professional?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-gray-500">{appointment.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum agendamento próximo</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Serviços */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Solicitados</CardTitle>
              <CardDescription>Ranking dos serviços mais populares</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyServices.slice(0, 5).map((service, index) => {
                  const serviceAppointments = companyAppointments.filter(a => a.serviceId === service.id);
                  
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-lg text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-500">R$ {service.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {serviceAppointments.length} agendamentos
                        </p>
                        <p className="text-xs text-gray-500">{service.duration} min</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
