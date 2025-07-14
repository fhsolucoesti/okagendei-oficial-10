
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Clock, Bell, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Header from '@/components/Layout/Header';
import { toast } from 'sonner';

const ProfessionalSettings = () => {
  const { user } = useAuth();
  const { professionals, updateProfessional } = useData();
  
  const currentProfessional = professionals.find(p => p.userId === user?.id);
  
  const [formData, setFormData] = useState({
    name: currentProfessional?.name || '',
    email: currentProfessional?.email || '',
    phone: currentProfessional?.phone || '',
    specialties: currentProfessional?.specialties || []
  });

  const [workingHours, setWorkingHours] = useState(
    currentProfessional?.workingHours || [
      { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isAvailable: false },
      { dayOfWeek: 0, startTime: '09:00', endTime: '15:00', isAvailable: false }
    ]
  );

  const [notifications, setNotifications] = useState({
    newAppointments: true,
    appointmentReminders: true,
    commissionUpdates: true
  });

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProfessional) {
      updateProfessional(currentProfessional.id, {
        ...formData,
        workingHours
      });
      toast.success('Configurações atualizadas com sucesso!');
    }
  };

  const handleWorkingHoursChange = (dayIndex: number, field: string, value: any) => {
    const newWorkingHours = [...workingHours];
    newWorkingHours[dayIndex] = { ...newWorkingHours[dayIndex], [field]: value };
    setWorkingHours(newWorkingHours);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Configurações" subtitle="Gerencie suas informações e preferências" />
      
      <main className="p-6 space-y-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informações Pessoais</span>
            </CardTitle>
            <CardDescription>
              Atualize suas informações de contato e perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div>
                <Label>Especialidades</Label>
                <Input
                  value={formData.specialties.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData, 
                    specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  placeholder="Ex: Corte Masculino, Barba, Bigode"
                />
                <p className="text-xs text-gray-500 mt-1">Separe as especialidades por vírgula</p>
              </div>

              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Salvar Informações
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Horários de Trabalho */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Horários de Trabalho</span>
            </CardTitle>
            <CardDescription>
              Configure seus horários de disponibilidade para cada dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workingHours.map((schedule, index) => (
                <div key={schedule.dayOfWeek} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20">
                    <span className="font-medium text-gray-900">
                      {dayNames[schedule.dayOfWeek]}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={schedule.isAvailable}
                      onCheckedChange={(checked) => 
                        handleWorkingHoursChange(index, 'isAvailable', checked)
                      }
                    />
                    <span className="text-sm text-gray-600">
                      {schedule.isAvailable ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                  
                  {schedule.isAvailable && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => 
                          handleWorkingHoursChange(index, 'startTime', e.target.value)
                        }
                        className="w-24"
                      />
                      <span className="text-gray-500">às</span>
                      <Input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => 
                          handleWorkingHoursChange(index, 'endTime', e.target.value)
                        }
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notificações</span>
            </CardTitle>
            <CardDescription>
              Configure suas preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos Agendamentos</p>
                  <p className="text-sm text-gray-600">Receber notificação quando houver novos agendamentos</p>
                </div>
                <Switch
                  checked={notifications.newAppointments}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, newAppointments: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembretes de Agendamento</p>
                  <p className="text-sm text-gray-600">Receber lembrete 30 minutos antes do agendamento</p>
                </div>
                <Switch
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, appointmentReminders: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Atualizações de Comissão</p>
                  <p className="text-sm text-gray-600">Receber notificação sobre pagamentos de comissão</p>
                </div>
                <Switch
                  checked={notifications.commissionUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, commissionUpdates: checked})
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Segurança</span>
            </CardTitle>
            <CardDescription>
              Configurações de segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Alterar Senha
              </Button>
              <Button variant="outline" className="w-full">
                Configurar Autenticação em Duas Etapas
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfessionalSettings;
