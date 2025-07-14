
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Service } from '@/types';

interface ServiceStatsProps {
  services: Service[];
}

const ServiceStats = ({ services }: ServiceStatsProps) => {
  const activeServices = services.filter(s => s.isActive);
  const averagePrice = services.length > 0 
    ? (services.reduce((sum, s) => sum + s.price, 0) / services.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{services.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600">Serviços Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {activeServices.length}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">Preço Médio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            R$ {averagePrice.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceStats;
