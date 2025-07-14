
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar } from 'lucide-react';

const PaymentHistory = () => {
  const payments = [
    {
      month: 'Julho 2024',
      plan: 'Plano Profissional',
      amount: 109.90,
      status: 'Pago',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      month: 'Junho 2024',
      plan: 'Plano Profissional',
      amount: 109.90,
      status: 'Pago',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      month: 'Maio 2024',
      plan: 'Período de Teste',
      amount: 0.00,
      status: 'Gratuito',
      icon: Calendar,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
        <CardDescription>Suas últimas faturas e pagamentos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment, index) => {
            const IconComponent = payment.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`${payment.bgColor} ${payment.textColor} p-2 rounded-lg`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{payment.month}</p>
                    <p className="text-sm text-gray-500">{payment.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {payment.amount.toFixed(2)}</p>
                  <Badge className={payment.badgeColor}>{payment.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
