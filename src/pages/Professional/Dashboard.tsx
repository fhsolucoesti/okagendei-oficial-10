
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';

const ProfessionalDashboard = () => {
  const { appointments, services, professionals } = useCompanyDataContext();
  const { user } = useAuth();

  // Encontrar o profissional atual
  const currentProfessional = professionals.find(p => p.userId === user?.id);
  
  // Filtrar agendamentos do profissional
  const professionalAppointments = appointments.filter(a => a.professionalId === currentProfessional?.id);

  // Agendamentos de hoje
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = professionalAppointments.filter(a => a.date === today);

  // Faturamento do mês
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyRevenue = professionalAppointments
    .filter(a => {
      const appointmentDate = new Date(a.date);
      return appointmentDate.getMonth() === thisMonth && 
             appointmentDate.getFullYear() === thisYear &&
             a.status === 'completed';
    })
    .reduce((sum, a) => sum + (a.price * (currentProfessional?.commission || 50) / 100), 0);

  // Próximos agendamentos
  const upcomingAppointments = professionalAppointments
    .filter(a => a.status === 'scheduled' && a.date >= today)
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
    .slice(0, 5);

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Meu Dashboard" subtitle={`Bem-vindo, ${currentProfessional?.name || user?.name}`} />
      
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
                Comissão Mensal
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {monthlyRevenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-green-200">
                {currentProfessional?.commission}% de comissão
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Total de Atendimentos
              </CardTitle>
              <User className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {professionalAppointments.filter(a => a.status === 'completed').length}
              </div>
              <p className="text-xs text-purple-200">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Avaliação
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-orange-200">
                Média dos clientes
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximos Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Minha Agenda de Hoje</CardTitle>
              <CardDescription>Agendamentos confirmados para hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => {
                    const service = services.find(s => s.id === appointment.serviceId);
                    
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.clientName}</p>
                            <p className="text-sm text-gray-500">{service?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                          <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                            {appointment.status === 'completed' ? 'Concluído' : 'Agendado'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum agendamento para hoje</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Próximos Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Seus próximos atendimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => {
                    const service = services.find(s => s.id === appointment.serviceId);
                    
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.clientName}</p>
                            <p className="text-sm text-gray-500">{service?.name}</p>
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
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum agendamento próximo</p>
                  </div>
                )}
              </div>
              {upcomingAppointments.length > 0 && (
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Ver Todos os Agendamentos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
