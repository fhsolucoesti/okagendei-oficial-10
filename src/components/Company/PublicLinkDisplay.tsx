
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, Copy, ExternalLink, Eye, Share2 } from 'lucide-react';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { toast } from 'sonner';

interface PublicLinkDisplayProps {
  fullUrl: string;
  companyName: string;
}

const PublicLinkDisplay = ({ fullUrl, companyName }: PublicLinkDisplayProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copiado para a área de transferência!');
  };

  const shareOnWhatsApp = () => {
    const message = `Olá! 👋\n\nConheça nossos serviços e faça seu agendamento online na ${companyName}!\n\n🔗 ${fullUrl}\n\nÉ rápido, fácil e você pode escolher o melhor horário para você! ⏰`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    try {
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      copyToClipboard(fullUrl);
      toast.success('Link copiado! Cole no WhatsApp para compartilhar.');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link2 className="h-5 w-5" />
          <span>Seu Link de Agendamentos</span>
        </CardTitle>
        <CardDescription>
          Este é o link que seus clientes usarão para fazer agendamentos online
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
            <div className="flex-1 font-mono text-sm break-all">
              {fullUrl}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(fullUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(fullUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={shareOnWhatsApp}
              className="bg-green-600 hover:bg-green-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar no WhatsApp
            </Button>
            
            <QRCodeGenerator url={fullUrl} companyName={companyName} />
            
            <Button variant="outline" onClick={() => window.open(fullUrl, '_blank')}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar Página
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicLinkDisplay;
