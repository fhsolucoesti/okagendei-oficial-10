
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, AlertTriangle, Calendar } from 'lucide-react';
import { PlatformSettings } from '@/types';

const CancelledSubscription = () => {
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings | null>(null);

  useEffect(() => {
    // Carregar configurações da plataforma
    const savedSettings = localStorage.getItem('platformSettings');
    if (savedSettings) {
      setPlatformSettings(JSON.parse(savedSettings));
    } else {
      // Configurações padrão
      setPlatformSettings({
        id: '1',
        whatsappNumber: '5511999999999',
        supportMessage: 'Olá! Gostaria de reativar minha assinatura do OKAgendei.',
        platformName: 'OKAgendei',
        primaryColor: '#2563eb'
      });
    }
  }, []);

  const handleWhatsAppContact = () => {
    if (platformSettings?.whatsappNumber) {
      const message = encodeURIComponent(platformSettings.supportMessage);
      const whatsappUrl = `https://wa.me/${platformSettings.whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
            {platformSettings?.platformName || 'OKAgendei'}
          </h1>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Assinatura Cancelada</CardTitle>
            <CardDescription>
              Sua assinatura foi cancelada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-center">
                Sua assinatura foi cancelada. Entre em contato pelo WhatsApp para reativar seu acesso.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Entrar em Contato via WhatsApp
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/login'}
              >
                Voltar ao Login
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Precisa de ajuda? Entre em contato conosco!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CancelledSubscription;
