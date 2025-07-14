
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, TestTube, AlertTriangle, ShoppingCart } from 'lucide-react';

interface TrialStatusCardProps {
  trialDaysLeft: number;
  trialStartDate: Date | null;
  trialEndDate: Date | null;
}

const TrialStatusCard = ({ trialDaysLeft, trialStartDate, trialEndDate }: TrialStatusCardProps) => {
  const trialDaysUsed = 7 - trialDaysLeft;
  const trialProgressPercentage = (trialDaysUsed / 7) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900 mb-2">
            🧪 Você está no Período de Teste Gratuito
          </CardTitle>
          <CardDescription className="text-blue-700 text-lg">
            Aproveite todos os recursos sem custo por 7 dias
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Trial Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-blue-700 mb-1">Início</p>
              <p className="text-xl font-bold text-blue-900">
                {trialStartDate?.toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-blue-700 mb-1">Fim</p>
              <p className="text-xl font-bold text-blue-900">
                {trialEndDate?.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Days Remaining */}
          <div className="text-center">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-4 shadow-sm border border-blue-200">
              <Calendar className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-blue-900 mr-2">⏳</span>
              <span className="text-xl font-bold text-blue-900 mr-2">
                Faltam {trialDaysLeft}
              </span>
              <span className="text-lg text-blue-700">
                {trialDaysLeft === 1 ? 'dia para o fim do teste' : 'dias para o fim do teste'}
              </span>
            </div>
          </div>

          {/* Trial Progress Bar */}
          <div className="bg-white bg-opacity-70 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Progresso do Teste</span>
              <span className="text-sm text-blue-600">
                {trialDaysUsed} de 7 dias utilizados
              </span>
            </div>
            <Progress value={trialProgressPercentage} className="h-3" />
          </div>

          {/* Warning Alert */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-orange-800 text-lg mb-2">
                  ⚠️ Contrate um plano antes do vencimento para evitar o bloqueio do acesso
                </h4>
                <p className="text-orange-700">
                  Seu período de teste expira em <strong>{trialDaysLeft} {trialDaysLeft === 1 ? 'dia' : 'dias'}</strong>. 
                  Para continuar aproveitando todos os recursos do sistema, escolha um plano que atenda às suas necessidades.
                </p>
              </div>
            </div>
          </div>

          {/* Single Action Button */}
          <div className="text-center pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingCart className="h-6 w-6 mr-3" />
              Contratar Agora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialStatusCard;
