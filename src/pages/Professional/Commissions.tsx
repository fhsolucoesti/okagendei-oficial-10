
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, User } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';

const ProfessionalCommissions = () => {
  const { appointments, services, professionals } = useData();
  const { user } = useAuth();

  const currentProfessional = professionals.find(p => p.userId === user?.id);
  const professionalAppointments = appointments.filter(
    a => a.professionalId === currentProfessional?.id && a.status === 'completed'
  );

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const monthlyCommissions = professionalAppointments
    .filter(a => {
      const appointmentDate = new Date(a.date);
      return appointmentDate.getMonth() === thisMonth && appointmentDate.getFullYear() === thisYear;
    })
    .map(appointment => ({
      ...appointment,
      commission: appointment.price * (currentProfessional?.commission || 50) / 100,
      service: services.find(s => s.id === appointment.serviceId)
    }));

  const totalCommission = monthlyCommissions.reduce((sum, item) => sum + item.commission, 0);
  const totalServices = monthlyCommissions.length;

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Minhas Comissões" subtitle="Acompanhe seus ganhos e comissões" />
      
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Comissão Mensal
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-200">
                {currentProfessional?.commission}% de comissão
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Serviços Realizados
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalServices}</div>
              <p className="text-xs text-blue-200">Este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Média por Serviço
              </CardTitle>
              <User className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalServices > 0 ? (totalCommission / totalServices).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
              </div>
              <p className="text-xs text-purple-200">Por atendimento</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhamento Mensal</CardTitle>
            <CardDescription>Todas as comissões do mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyCommissions.length > 0 ? (
              <div className="space-y-4">
                {monthlyCommissions.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.clientName}</p>
                        <p className="text-sm text-gray-600">{item.service?.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString('pt-BR')} às {item.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        R$ {item.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentProfessional?.commission}% de R$ {item.price.toFixed(2)}
                      </p>
                      <Badge className="bg-green-100 text-green-800 mt-1">Pago</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma comissão registrada este mês</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfessionalCommissions;
