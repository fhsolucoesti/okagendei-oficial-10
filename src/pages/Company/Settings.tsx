
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings, Building2, Bell, Shield, Upload, User } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import { toast } from 'sonner';

const CompanySettings = () => {
  const { companies, updateCompany } = useData();
  const { user, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const company = companies.find(c => c.id === user?.companyId);

  const [companyData, setCompanyData] = useState({
    name: company?.name || '',
    email: company?.email || '',
    phone: company?.phone || '',
    address: company?.address || ''
  });

  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const [notifications, setNotifications] = useState({
    emailAppointments: true,
    emailPayments: true,
    emailPromotions: false,
    smsReminders: true,
    whatsappNotifications: true
  });

  const handleCompanyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) {
      updateCompany(company.id, companyData);
      toast.success('Dados da empresa atualizados com sucesso!');
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser(user.id, userProfile);
      toast.success('Perfil atualizado com sucesso!');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 1MB.');
        return;
      }

      setIsUploading(true);
      
      // Simular upload
      setTimeout(() => {
        const fileUrl = `/lovable-uploads/${file.name}`;
        setUserProfile({ ...userProfile, avatar: fileUrl });
        setIsUploading(false);
        toast.success('Foto de perfil atualizada!');
      }, 1000);
    }
  };

  const handleNotificationUpdate = () => {
    toast.success('Preferências de notificação atualizadas!');
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Configurações" subtitle="Gerencie as configurações da sua empresa" />
      
      <main className="p-6">
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">
              <Building2 className="h-4 w-4 mr-2" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>
                  Mantenha os dados da sua empresa sempre atualizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanyUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input
                        id="companyName"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyPhone">Telefone</Label>
                      <Input
                        id="companyPhone"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyAddress">Endereço</Label>
                      <Input
                        id="companyAddress"
                        value={companyData.address}
                        onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Perfil do Usuário</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback className="text-lg">
                        {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="avatar">Foto de Perfil</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('avatar')?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading ? 'Enviando...' : 'Alterar Foto'}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos aceitos: JPG, PNG. Tamanho máximo: 1MB
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userName">Nome</Label>
                        <Input
                          id="userName"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="userEmail">Email</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      Salvar Perfil
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Notificações por Email</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Novos Agendamentos</Label>
                          <p className="text-sm text-gray-500">Receba email quando houver novos agendamentos</p>
                        </div>
                        <Switch
                          checked={notifications.emailAppointments}
                          onCheckedChange={(checked) => setNotifications({...notifications, emailAppointments: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Confirmações de Pagamento</Label>
                          <p className="text-sm text-gray-500">Notificações sobre pagamentos e faturas</p>
                        </div>
                        <Switch
                          checked={notifications.emailPayments}
                          onCheckedChange={(checked) => setNotifications({...notifications, emailPayments: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Promoções e Dicas</Label>
                          <p className="text-sm text-gray-500">Receba dicas e ofertas especiais</p>
                        </div>
                        <Switch
                          checked={notifications.emailPromotions}
                          onCheckedChange={(checked) => setNotifications({...notifications, emailPromotions: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Outras Notificações</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Lembretes por SMS</Label>
                          <p className="text-sm text-gray-500">Enviar lembretes de agendamento por SMS</p>
                        </div>
                        <Switch
                          checked={notifications.smsReminders}
                          onCheckedChange={(checked) => setNotifications({...notifications, smsReminders: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>WhatsApp</Label>
                          <p className="text-sm text-gray-500">Receber notificações via WhatsApp</p>
                        </div>
                        <Switch
                          checked={notifications.whatsappNotifications}
                          onCheckedChange={(checked) => setNotifications({...notifications, whatsappNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleNotificationUpdate} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Salvar Preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>
                    Mantenha sua conta segura com uma senha forte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button type="submit" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                      Alterar Senha
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessões Ativas</CardTitle>
                  <CardDescription>
                    Gerencie onde você está logado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Navegador Atual</p>
                        <p className="text-sm text-gray-500">Chrome • São Paulo, Brasil</p>
                        <p className="text-xs text-gray-400">Ativo agora</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Atual</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CompanySettings;
