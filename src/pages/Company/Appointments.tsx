import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Search, Clock, User, Phone, Edit, Trash2, List } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import { Appointment } from '@/types';
import { toast } from 'sonner';

const Appointments = () => {
  const { appointments, professionals, services, addAppointment, updateAppointment, deleteAppointment } = useCompanyDataContext();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [formData, setFormData] = useState({
    professionalId: '',
    serviceId: '',
    clientName: '',
    clientPhone: '',
    clientBirthDate: '',
    date: '',
    time: '',
    notes: ''
  });

  const companyAppointments = appointments.filter(a => a.companyId === user?.companyId);
  const companyProfessionals = professionals.filter(p => p.companyId === user?.companyId);
  const companyServices = services.filter(s => s.companyId === user?.companyId);

  const filteredAppointments = companyAppointments.filter(appointment =>
    appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.clientPhone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedService = companyServices.find(s => s.id === formData.serviceId);
    if (!selectedService) return;

    const appointmentData = {
      companyId: user?.companyId || '',
      professionalId: formData.professionalId,
      serviceId: formData.serviceId,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientBirthDate: formData.clientBirthDate,
      date: formData.date,
      time: formData.time,
      duration: selectedService.duration,
      price: selectedService.price,
      status: 'scheduled' as const,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    if (editingAppointment) {
      updateAppointment(editingAppointment.id, appointmentData);
      toast.success('Agendamento atualizado com sucesso!');
    } else {
      addAppointment(appointmentData);
      toast.success('Agendamento criado com sucesso!');
    }
    
    setIsDialogOpen(false);
    setEditingAppointment(null);
    setFormData({
      professionalId: '',
      serviceId: '',
      clientName: '',
      clientPhone: '',
      clientBirthDate: '',
      date: '',
      time: '',
      notes: ''
    });
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      professionalId: appointment.professionalId,
      serviceId: appointment.serviceId,
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      clientBirthDate: appointment.clientBirthDate,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      deleteAppointment(id);
      toast.success('Agendamento excluído com sucesso!');
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    updateAppointment(appointmentId, { status: newStatus });
    toast.success('Status atualizado com sucesso!');
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = filteredAppointments.filter(a => a.date === today);
  const upcomingAppointments = filteredAppointments.filter(a => a.date > today);
  const pastAppointments = filteredAppointments.filter(a => a.date < today);

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Agendamentos" subtitle="Gerencie todos os agendamentos da sua empresa" />
      
      <main className="p-6">
        {/* Barra de Ações */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* Botões de visualização */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="rounded-none"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendário
              </Button>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do agendamento
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="professionalId">Profissional</Label>
                  <Select value={formData.professionalId} onValueChange={(value) => setFormData({...formData, professionalId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyProfessionals.map(professional => (
                        <SelectItem key={professional.id} value={professional.id}>
                          {professional.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="serviceId">Serviço</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => setFormData({...formData, serviceId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyServices.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - R$ {service.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="clientName">Nome do Cliente</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Telefone</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientBirthDate">Data de Nascimento</Label>
                  <Input
                    id="clientBirthDate"
                    type="date"
                    value={formData.clientBirthDate}
                    onChange={(e) => setFormData({...formData, clientBirthDate: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observações opcionais"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    {editingAppointment ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Conteúdo baseado no modo de visualização */}
        {viewMode === 'calendar' ? (
          <AppointmentCalendar
            appointments={filteredAppointments}
            professionals={companyProfessionals}
            services={companyServices}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ) : (
          /* Tabs de Agendamentos - Visualização em Lista */
          <Tabs defaultValue="today" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Hoje ({todayAppointments.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Próximos ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Histórico ({pastAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              <AppointmentList 
                appointments={todayAppointments}
                professionals={companyProfessionals}
                services={companyServices}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <AppointmentList 
                appointments={upcomingAppointments}
                professionals={companyProfessionals}
                services={companyServices}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <AppointmentList 
                appointments={pastAppointments}
                professionals={companyProfessionals}
                services={companyServices}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

interface AppointmentListProps {
  appointments: Appointment[];
  professionals: any[];
  services: any[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Appointment['status']) => void;
}

const AppointmentList = ({ appointments, professionals, services, onEdit, onDelete, onStatusChange }: AppointmentListProps) => {
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

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhum agendamento encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const professional = professionals.find(p => p.id === appointment.professionalId);
        const service = services.find(s => s.id === appointment.serviceId);
        
        return (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{appointment.clientName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{appointment.clientPhone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.duration} min</span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm"><strong>Serviço:</strong> {service?.name} - R$ {appointment.price.toFixed(2)}</p>
                      <p className="text-sm"><strong>Profissional:</strong> {professional?.name}</p>
                      {appointment.notes && (
                        <p className="text-sm"><strong>Observações:</strong> {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(appointment.status)}
                    <div className="flex space-x-1">
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button size="sm" variant="outline" className="text-green-600" onClick={() => onStatusChange(appointment.id, 'completed')}>
                            Concluir
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => onStatusChange(appointment.id, 'cancelled')}>
                            Cancelar
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => onEdit(appointment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => onDelete(appointment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Appointments;
