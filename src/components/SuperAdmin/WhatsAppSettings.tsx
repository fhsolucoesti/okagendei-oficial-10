
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Save, Phone } from 'lucide-react';
import { PlatformSettings } from '@/types';
import { toast } from 'sonner';

const WhatsAppSettings = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    id: '1',
    whatsappNumber: '',
    supportMessage: 'Olá! Gostaria de reativar minha assinatura do OKAgendei.',
    platformName: 'OKAgendei',
    primaryColor: '#2563eb'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('platformSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validar número do WhatsApp (formato básico)
      if (settings.whatsappNumber && !/^\d{10,15}$/.test(settings.whatsappNumber.replace(/\D/g, ''))) {
        toast.error('Número do WhatsApp deve conter apenas dígitos (10-15 caracteres)');
        setIsLoading(false);
        return;
      }

      // Salvar no localStorage (em um app real, seria uma API)
      localStorage.setItem('platformSettings', JSON.stringify(settings));
      
      toast.success('Configurações do WhatsApp salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const formatWhatsAppNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Formatar para o padrão brasileiro: +55 (11) 99999-9999
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)} (${numbers.slice(2)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
    }
  };

  const handleWhatsAppNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsAppNumber(e.target.value);
    setSettings(prev => ({
      ...prev,
      whatsappNumber: e.target.value.replace(/\D/g, '') // Salvar apenas números
    }));
  };

  const testWhatsApp = () => {
    if (!settings.whatsappNumber) {
      toast.error('Cadastre um número do WhatsApp primeiro');
      return;
    }

    const message = encodeURIComponent(settings.supportMessage);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Abrindo WhatsApp para teste...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          Configurações do WhatsApp
        </CardTitle>
        <CardDescription>
          Configure o número do WhatsApp para suporte e reativação de assinaturas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">Número do WhatsApp</Label>
          <div className="flex gap-2">
            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              <Phone className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">+</span>
            </div>
            <Input
              id="whatsapp"
              placeholder="5511999999999"
              value={formatWhatsAppNumber(settings.whatsappNumber)}
              onChange={handleWhatsAppNumberChange}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-gray-500">
            Digite apenas números. Exemplo: 5511999999999 (código do país + DDD + número)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensagem Padrão de Suporte</Label>
          <Textarea
            id="message"
            placeholder="Digite a mensagem que será enviada automaticamente..."
            value={settings.supportMessage}
            onChange={(e) => setSettings(prev => ({ ...prev, supportMessage: e.target.value }))}
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Esta mensagem será enviada automaticamente quando o usuário clicar no botão do WhatsApp
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Quando um usuário cancelar a assinatura, ele será desconectado</li>
            <li>• Na tela de login, aparecerá uma mensagem informando sobre o cancelamento</li>
            <li>• O botão do WhatsApp abrirá uma conversa com a mensagem configurada</li>
            <li>• Você poderá reativar manualmente a assinatura da empresa</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={testWhatsApp}
            disabled={!settings.whatsappNumber}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Testar WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
