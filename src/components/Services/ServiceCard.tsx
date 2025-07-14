
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scissors, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const ServiceCard = ({ service, onEdit, onDelete, onToggleStatus }: ServiceCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {service.imageUrl ? (
              <Avatar className="h-12 w-12">
                <AvatarImage src={service.imageUrl} alt={service.name} />
                <AvatarFallback>
                  <Scissors className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg">
                <Scissors className="h-6 w-6" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {service.isActive ? (
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Inativo</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(service)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => onDelete(service.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{service.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-green-600">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold">R$ {service.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{service.duration} min</span>
            </div>
          </div>
          
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onToggleStatus(service.id, service.isActive)}
            >
              {service.isActive ? 'Desativar' : 'Ativar'} Serviço
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
