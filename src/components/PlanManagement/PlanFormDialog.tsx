
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, X } from 'lucide-react';
import { Plan } from '@/types';

interface PlanFormData {
  name: string;
  maxEmployees: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPlan: Plan | null;
  formData: PlanFormData;
  setFormData: (data: PlanFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAddFeature: () => void;
  onUpdateFeature: (index: number, value: string) => void;
  onRemoveFeature: (index: number) => void;
}

const PlanFormDialog = ({
  open,
  onOpenChange,
  editingPlan,
  formData,
  setFormData,
  onSubmit,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature
}: PlanFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPlan ? 'Editar Plano' : 'Novo Plano'}
          </DialogTitle>
          <DialogDescription>
            Configure os detalhes do plano de assinatura
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="planName">Nome do Plano *</Label>
              <Input 
                id="planName" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Plano Premium" 
                required
              />
            </div>
            <div>
              <Label htmlFor="maxEmployees">Máximo de Funcionários *</Label>
              <Input 
                id="maxEmployees" 
                value={formData.maxEmployees}
                onChange={(e) => setFormData({...formData, maxEmployees: e.target.value})}
                placeholder="Ex: 5 ou ilimitado" 
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyPrice">Preço Mensal (R$) *</Label>
              <Input 
                id="monthlyPrice" 
                type="number" 
                step="0.01" 
                min="0.01"
                value={formData.monthlyPrice || ''}
                onChange={(e) => setFormData({...formData, monthlyPrice: Number(e.target.value)})}
                placeholder="59.90" 
                required
              />
            </div>
            <div>
              <Label htmlFor="yearlyPrice">Preço Anual (R$) *</Label>
              <Input 
                id="yearlyPrice" 
                type="number" 
                step="0.01" 
                min="0.01"
                value={formData.yearlyPrice || ''}
                onChange={(e) => setFormData({...formData, yearlyPrice: Number(e.target.value)})}
                placeholder="575.04" 
                required
              />
            </div>
          </div>

          <div>
            <Label>Benefícios do Plano *</Label>
            <div className="space-y-2 mt-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => onUpdateFeature(index, e.target.value)}
                    placeholder="Ex: Agendamentos ilimitados"
                    className="flex-1"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onRemoveFeature(index)}
                      className="h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={onAddFeature}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Benefício
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPopular"
              checked={formData.isPopular}
              onCheckedChange={(checked) => setFormData({...formData, isPopular: checked})}
            />
            <Label htmlFor="isPopular">Marcar como "Mais Popular"</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
            />
            <Label htmlFor="isActive">Plano ativo</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              {editingPlan ? 'Atualizar Plano' : 'Criar Plano'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanFormDialog;
