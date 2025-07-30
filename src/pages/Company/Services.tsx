
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import { Service } from '@/types';
import { toast } from 'sonner';
import ServiceStats from '@/components/Services/ServiceStats';
import ServiceForm from '@/components/Services/ServiceForm';
import ServicesList from '@/components/Services/ServicesList';

const CompanyServices = () => {
  const { services, addService, updateService, deleteService } = useCompanyDataContext();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const companyServices = services.filter(s => s.companyId === user?.companyId);

  const handleSubmit = (formData: any) => {
    if (editingService) {
      updateService(editingService.id, formData);
      toast.success('Serviço atualizado com sucesso!');
    } else {
      addService({
        ...formData,
        companyId: user?.companyId || ''
      });
      toast.success('Serviço cadastrado com sucesso!');
    }
    
    setIsDialogOpen(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteService(id);
      toast.success('Serviço excluído com sucesso!');
    }
  };

  const toggleServiceStatus = (id: string, currentStatus: boolean) => {
    updateService(id, { isActive: !currentStatus });
    toast.success(`Serviço ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Serviços" subtitle="Gerencie os serviços oferecidos pela sua empresa" />
      
      <main className="p-6">
        <ServiceStats services={companyServices} />

        {/* Barra de Ações */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        <ServicesList
          services={companyServices}
          searchTerm={searchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleServiceStatus}
        />

        <ServiceForm
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingService(null);
          }}
          onSubmit={handleSubmit}
          editingService={editingService}
        />
      </main>
    </div>
  );
};

export default CompanyServices;
