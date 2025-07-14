
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Phone, Check } from 'lucide-react';
import { Company } from '@/types';
import { toast } from 'sonner';

interface WhatsAppConfigProps {
  company: Company;
  onUpdateWhatsApp: (id: string, data: Partial<Company>) => void;
}

const WhatsAppConfig = ({ company, onUpdateWhatsApp }: WhatsAppConfigProps) => {
  const [whatsappNumber, setWhatsappNumber] = useState(company.whatsappNumber || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!whatsappNumber.trim()) {
      toast.error('Por favor, insira um número de WhatsApp');
      return;
    }

    // Remove qualquer formatação e mantém apenas números
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 10) {
      toast.error('Número de WhatsApp inválido');
      return;
    }

    setIsLoading(true);
    
    try {
      onUpdateWhatsApp(company.id, { whatsappNumber: cleanNumber });
      toast.success('Número do WhatsApp salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar número do WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>WhatsApp da Empresa</span>
        </CardTitle>
        <CardDescription>
          Configure o número do WhatsApp para onde os clientes serão direcionados após fazer agendamentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="whatsapp">Número do WhatsApp</Label>
          <div className="flex space-x-2 mt-1">
            <div className="flex-1">
              <Input
                id="whatsapp"
                type="tel"
                placeholder="11999999999"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite apenas números (DDD + número). Ex: 11999999999
              </p>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Número'}
            </Button>
          </div>
        </div>

        {company.whatsappNumber && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                WhatsApp configurado: +55 {company.whatsappNumber}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppConfig;
