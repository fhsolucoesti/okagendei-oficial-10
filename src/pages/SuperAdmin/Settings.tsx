
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield, Mail, Database, Server, Bell } from 'lucide-react';
import Header from '@/components/Layout/Header';
import { toast } from 'sonner';

const SuperAdminSettings = () => {
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'OKAgendei',
    supportEmail: 'suporte@okagendei.com',
    allowRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    enableEmailNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '24',
    maxLoginAttempts: '5',
    requireStrongPasswords: true,
    enableTwoFactor: false
  });

  const [notifications, setNotifications] = useState({
    newCompanyRegistrations: true,
    paymentFailures: true,
    systemAlerts: true,
    weeklyReports: true
  });

  const handleSaveSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configurações do sistema atualizadas com sucesso!');
  };

  const handleSaveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configurações de email atualizadas com sucesso!');
  };

  const handleTestEmail = () => {
    toast.success('Email de teste enviado com sucesso!');
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Configurações do Sistema" subtitle="Configurações administrativas globais" />
      
      <main className="p-6 space-y-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Configurações Gerais</span>
            </CardTitle>
            <CardDescription>
              Configurações básicas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSystemSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Email de Suporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={systemSettings.supportEmail}
                    onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Permitir Novos Registros</p>
                    <p className="text-sm text-gray-600">Permitir que novas empresas se registrem</p>
                  </div>
                  <Switch
                    checked={systemSettings.allowRegistration}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, allowRegistration: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Verificação de Email Obrigatória</p>
                    <p className="text-sm text-gray-600">Exigir verificação de email no registro</p>
                  </div>
                  <Switch
                    checked={systemSettings.requireEmailVerification}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, requireEmailVerification: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modo de Manutenção</p>
                    <p className="text-sm text-gray-600">Ativar modo de manutenção para o sistema</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, maintenanceMode: checked})
                    }
                  />
                </div>
              </div>

              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Salvar Configurações
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Configurações de Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Configurações de Email</span>
            </CardTitle>
            <CardDescription>
              Configure o servidor SMTP para envio de emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveEmailSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUser">Usuário SMTP</Label>
                  <Input
                    id="smtpUser"
                    type="email"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">Senha SMTP</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Habilitar Notificações por Email</p>
                  <p className="text-sm text-gray-600">Enviar notificações automáticas por email</p>
                </div>
                <Switch
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => 
                    setEmailSettings({...emailSettings, enableEmailNotifications: checked})
                  }
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Salvar Configurações
                </Button>
                <Button type="button" variant="outline" onClick={handleTestEmail}>
                  Testar Email
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Segurança</span>
            </CardTitle>
            <CardDescription>
              Configurações de segurança do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (horas)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                    min="1"
                    max="168"
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                    min="3"
                    max="10"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Exigir Senhas Fortes</p>
                    <p className="text-sm text-gray-600">Obrigar senhas com 8+ caracteres, maiúsculas, números</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireStrongPasswords}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, requireStrongPasswords: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação em Duas Etapas</p>
                    <p className="text-sm text-gray-600">Habilitar 2FA para administradores do sistema</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, enableTwoFactor: checked})
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificações do Administrador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notificações do Administrador</span>
            </CardTitle>
            <CardDescription>
              Configure suas preferências de notificação como administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos Registros de Empresas</p>
                  <p className="text-sm text-gray-600">Notificar quando uma nova empresa se registrar</p>
                </div>
                <Switch
                  checked={notifications.newCompanyRegistrations}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, newCompanyRegistrations: checked})
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Falhas de Pagamento</p>
                  <p className="text-sm text-gray-600">Notificar sobre pagamentos que falharam</p>
                </div>
                <Switch
                  checked={notifications.paymentFailures}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, paymentFailures: checked})
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas do Sistema</p>
                  <p className="text-sm text-gray-600">Notificar sobre problemas técnicos e erros</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, systemAlerts: checked})
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Relatórios Semanais</p>
                  <p className="text-sm text-gray-600">Receber relatório semanal do sistema</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, weeklyReports: checked})
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Status do Sistema</span>
            </CardTitle>
            <CardDescription>
              Informações sobre o status atual do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Database className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="font-medium text-green-800">Banco de Dados</p>
                <p className="text-sm text-green-600">Online</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Server className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="font-medium text-green-800">Servidor</p>
                <p className="text-sm text-green-600">99.9% uptime</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Mail className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="font-medium text-green-800">Email</p>
                <p className="text-sm text-green-600">Funcionando</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SuperAdminSettings;
