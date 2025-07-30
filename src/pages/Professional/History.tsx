
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, User, Clock } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';

const ProfessionalHistory = () => {
  const { appointments, services, professionals } = useCompanyDataContext();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const currentProfessional = professionals.find(p => p.userId === user?.id);
  const professionalAppointments = appointments.filter(a => a.professionalId === currentProfessional?.id);

  const filteredAppointments = professionalAppointments
    .filter(appointment => {
      const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Agendado</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      case 'no_show':
        return <Badge className="bg-orange-100 text-orange-800">Não Compareceu</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const stats = {
    total: professionalAppointments.length,
    completed: professionalAppointments.filter(a => a.status === 'completed').length,
    cancelled: professionalAppointments.filter(a => a.status === 'cancelled').length,
    noShow: professionalAppointments.filter(a => a.status === 'no_show').length
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Histórico de Atendimentos" subtitle="Visualize todo seu histórico de agendamentos" />
      
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Cancelados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Não Compareceu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.noShow}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico Completo</CardTitle>
            <CardDescription>Todos os seus atendimentos registrados</CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="no_show">Não Compareceu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => {
                  const service = services.find(s => s.id === appointment.serviceId);
                  
                  return (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{appointment.clientName}</h3>
                            <p className="text-sm text-gray-600">{service?.name}</p>
                            <p className="text-sm text-gray-500">{appointment.clientPhone}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(appointment.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{appointment.time}</span>
                          </div>
                          <div className="text-sm font-medium text-green-600 mb-2">
                            R$ {appointment.price.toFixed(2)}
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">
                            <strong>Observações:</strong> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Nenhum atendimento encontrado com os filtros aplicados'
                    : 'Nenhum atendimento registrado ainda'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfessionalHistory;
