import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, Phone, Edit, Trash2 } from 'lucide-react';
import { Appointment, Professional, Service } from '@/types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  professionals: Professional[];
  services: Service[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Appointment['status']) => void;
}

const AppointmentCalendar = ({ 
  appointments, 
  professionals, 
  services, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: AppointmentCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterClient, setFilterClient] = useState('');
  const [filterService, setFilterService] = useState('all');

  // Filtrar agendamentos
  const filteredAppointments = appointments.filter(appointment => {
    const clientMatch = !filterClient || appointment.clientName.toLowerCase().includes(filterClient.toLowerCase());
    const serviceMatch = filterService === 'all' || appointment.serviceId === filterService;
    return clientMatch && serviceMatch;
  });

  // Agrupar agendamentos por data
  const appointmentsByDate = filteredAppointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Agendamentos do dia selecionado
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayAppointments = appointmentsByDate[selectedDateStr] || [];

  const getStatusBadge = (status: Appointment['status']) => {
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

  // Função para verificar se uma data tem agendamentos
  const hasAppointments = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointmentsByDate[dateStr] && appointmentsByDate[dateStr].length > 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Filtros e Calendário */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Filtros</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Cliente</label>
              <Input
                placeholder="Buscar por cliente..."
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Serviço</label>
              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os serviços" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os serviços</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border-0 pointer-events-auto"
              modifiers={{
                hasAppointments: (date) => hasAppointments(date)
              }}
              modifiersStyles={{
                hasAppointments: {
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Agendamentos do Dia */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Agendamentos - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {dayAppointments.length} agendamento(s) encontrado(s)
            </p>
          </CardHeader>
          <CardContent>
            {dayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum agendamento para este dia</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dayAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => {
                    const professional = professionals.find(p => p.id === appointment.professionalId);
                    const service = services.find(s => s.id === appointment.serviceId);
                    
                    return (
                      <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                <Clock className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold">{appointment.clientName}</h3>
                                  {getStatusBadge(appointment.status)}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{appointment.time}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <Phone className="h-3 w-3" />
                                      <span>{appointment.clientPhone}</span>
                                    </span>
                                  </div>
                                  <div className="mt-1">
                                    <p><strong>Serviço:</strong> {service?.name} - R$ {appointment.price.toFixed(2)}</p>
                                    <p><strong>Profissional:</strong> {professional?.name}</p>
                                    <p><strong>Duração:</strong> {appointment.duration} min</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex space-x-1">
                                {appointment.status === 'scheduled' && (
                                  <>
                                    <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => onStatusChange(appointment.id, 'completed')}>
                                      Concluir
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => onStatusChange(appointment.id, 'cancelled')}>
                                      Cancelar
                                    </Button>
                                  </>
                                )}
                                <Button size="sm" variant="ghost" onClick={() => onEdit(appointment)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => onDelete(appointment.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
