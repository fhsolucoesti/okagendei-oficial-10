
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

interface CompaniesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isDialogOpen: boolean;
  onDialogChange: (open: boolean) => void;
}

const CompaniesHeader = ({ searchTerm, onSearchChange, isDialogOpen, onDialogChange }: CompaniesHeaderProps) => {
  const { removeDuplicateCompanies } = useData();

  const handleRemoveDuplicates = () => {
    if (confirm('Tem certeza que deseja remover empresas duplicadas? Esta ação não pode ser desfeita.')) {
      removeDuplicateCompanies();
      toast.success('Duplicações removidas com sucesso!');
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar empresas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleRemoveDuplicates}
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remover Duplicadas
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default CompaniesHeader;
