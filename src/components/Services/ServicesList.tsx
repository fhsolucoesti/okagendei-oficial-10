
import { Scissors } from 'lucide-react';
import { Service } from '@/types';
import ServiceCard from './ServiceCard';

interface ServicesListProps {
  services: Service[];
  searchTerm: string;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const ServicesList = ({ services, searchTerm, onEdit, onDelete, onToggleStatus }: ServicesListProps) => {
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-12">
        <Scissors className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado ainda'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default ServicesList;
