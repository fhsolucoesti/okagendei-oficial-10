
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PublicLinkStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Visualizações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.234</div>
          <p className="text-xs text-gray-500">Este mês</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">89</div>
          <p className="text-xs text-gray-500">Via link público</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600">Taxa de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">7.2%</div>
          <p className="text-xs text-gray-500">Visitantes que agendaram</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicLinkStats;
