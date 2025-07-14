
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle } from 'lucide-react';
import { Company, Plan } from '@/types';

interface ActiveSubscriptionStatusProps {
  company: Company;
  currentPlan: Plan | undefined;
}

const ActiveSubscriptionStatus = ({ company, currentPlan }: ActiveSubscriptionStatusProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Status da Assinatura</span>
            </CardTitle>
            <CardDescription>
              Informações sobre seu plano atual
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
            <CheckCircle className="h-4 w-4 mr-1" />
            Plano Ativo
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Plano Atual</p>
            <p className="text-2xl font-bold text-gray-900">{company.plan}</p>
            <p className="text-sm text-gray-500">
              R$ {currentPlan?.monthlyPrice.toFixed(2)}/mês
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Funcionários</p>
            <p className="text-2xl font-bold text-gray-900">{company.employees}</p>
            <p className="text-sm text-gray-500">
              de {currentPlan?.maxEmployees} permitidos
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Próximo vencimento</p>
            <p className="text-2xl font-bold text-gray-900">15 dias</p>
            <p className="text-sm text-gray-500">15/08/2024</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveSubscriptionStatus;
