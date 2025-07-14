
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Edit, CheckCircle, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import { toast } from 'sonner';

const ProfessionalSchedule = () => {
  const { appointments, services, professionals, updateAppointment } = useData();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const currentProfessional = professionals.find(p => p.userId === user?.id);
  const professionalAppointments = appointments.filter(a => a.professionalId === currentProfessional?.id);
  
  const selectedDateAppointments = professionalAppointments
    .filter(a => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleStatusChange = (appointmentId: string, newStatus: 'completed' | 'cancelled' | 'no_show') => {
    updateAppointment(appointmentId, { status: newStatus });
    toast.success('Status do agendamento atualizado!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Agendado</Badge>;
      case 'confirmed':
        return <Badge className="bg-purple-100 text-purple-800">Confirmado</Badge>;
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

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Minha Agenda" subtitle="Gerencie seus agendamentos e horários" />
      
      <main className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Data
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Agendamentos - {new Date(selectedDate).toLocaleDateString('pt-BR')}</span>
              </CardTitle>
              <CardDescription>
                {selectedDateAppointments.length} agendamento(s) para esta data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateAppointments.map((appointment) => {
                    const service = services.find(s => s.id === appointment.serviceId);
                    
                    return (
                      <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{appointment.clientName}</h3>
                              <p className="text-sm text-gray-600">{service?.name}</p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone className="h-3 w-3 mr-1" />
                                {appointment.clientPhone}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">{appointment.time}</div>
                            <div className="text-sm text-gray-500">{appointment.duration} min</div>
                            <div className="text-sm font-medium text-green-600">
                              R$ {appointment.price.toFixed(2)}
                            </div>
                            <div className="mt-2">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-3 p-2 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">
                              <strong>Observações:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                        
                        {appointment.status === 'scheduled' && (
                          <div className="mt-4 flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Concluir
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(appointment.id, 'no_show')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Não Compareceu
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhum agendamento para esta data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalSchedule;
