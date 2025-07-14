
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SharingTips = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dicas de Compartilhamento</CardTitle>
        <CardDescription>
          Maximize o alcance do seu link de agendamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">WhatsApp Business</h4>
            <p className="text-sm text-gray-600">
              Adicione o link na sua mensagem de boas-vindas automática
            </p>
            <Badge variant="outline">Recomendado</Badge>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Redes Sociais</h4>
            <p className="text-sm text-gray-600">
              Compartilhe nas suas redes sociais e stories do Instagram
            </p>
            <Badge variant="outline">Alto impacto</Badge>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">QR Code</h4>
            <p className="text-sm text-gray-600">
              Imprima um QR Code para colocar na sua loja física
            </p>
            <Badge variant="outline">Físico</Badge>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Google Meu Negócio</h4>
            <p className="text-sm text-gray-600">
              Adicione o link na descrição do seu perfil no Google
            </p>
            <Badge variant="outline">SEO</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharingTips;
