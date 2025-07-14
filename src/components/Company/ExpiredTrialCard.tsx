
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const ExpiredTrialCard = () => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="text-center">
        <CardTitle className="text-red-800">Teste Expirado</CardTitle>
        <CardDescription className="text-red-600">
          Seu período de teste expirou. Contrate um plano para continuar usando o sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Contratar Plano
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExpiredTrialCard;
