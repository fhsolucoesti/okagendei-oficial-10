
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Plan } from '@/types';

interface PlanDetailsProps {
  currentPlan: Plan | undefined;
}

const PlanDetails = ({ currentPlan }: PlanDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Plano</CardTitle>
        <CardDescription>Recursos inclusos no seu plano atual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentPlan?.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <Button variant="outline" className="w-full">
            Ver Todos os Planos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanDetails;
