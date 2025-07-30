import { useState } from 'react';
import { Plan } from '@/types';
import { useData } from '@/contexts/DataContext';
import { usePlanForm } from '../usePlanForm';
import { toast } from 'sonner';

export const usePlanManagement = () => {
  const { addPlan, updatePlan, deletePlan } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Plan | null>(null);
  
  const planForm = usePlanForm(addPlan, updatePlan);

  const handleAdd = () => {
    setEditingItem(null);
    planForm.resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingItem(plan);
    planForm.loadPlanData(plan);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (planForm.validateAndSubmit(editingItem)) {
      setIsDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleDelete = (planId: string) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      deletePlan(planId);
      toast.success('Plano excluído com sucesso!');
    }
  };

  const handleToggle = (plan: Plan) => {
    updatePlan(plan.id, { isActive: !plan.isActive });
    toast.success(`Plano ${!plan.isActive ? 'ativado' : 'desativado'} com sucesso!`);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    formData: planForm.formData,
    setFormData: planForm.setFormData,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleToggle,
    addFeature: planForm.addFeature,
    updateFeature: planForm.updateFeature,
    removeFeature: planForm.removeFeature
  };
};