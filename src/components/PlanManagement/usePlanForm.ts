
import { useState } from 'react';
import { Plan } from '@/types';
import { toast } from 'sonner';

interface PlanFormData {
  name: string;
  maxEmployees: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export const usePlanForm = (addPlan: (plan: Omit<Plan, 'id'>) => void, updatePlan: (id: string, data: Partial<Plan>) => void) => {
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    maxEmployees: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [''],
    isPopular: false,
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      maxEmployees: '',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [''],
      isPopular: false,
      isActive: true
    });
  };

  const loadPlanData = (plan: Plan) => {
    setFormData({
      name: plan.name,
      maxEmployees: plan.maxEmployees.toString(),
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      features: plan.features,
      isPopular: plan.isPopular || false,
      isActive: plan.isActive !== undefined ? plan.isActive : true
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        features: newFeatures
      });
    }
  };

  const validateAndSubmit = (editingPlan: Plan | null) => {
    // Validação básica
    if (!formData.name.trim()) {
      toast.error('Nome do plano é obrigatório');
      return false;
    }
    
    if (!formData.maxEmployees.trim()) {
      toast.error('Número de funcionários é obrigatório');
      return false;
    }
    
    if (formData.monthlyPrice <= 0) {
      toast.error('Preço mensal deve ser maior que zero');
      return false;
    }
    
    if (formData.yearlyPrice <= 0) {
      toast.error('Preço anual deve ser maior que zero');
      return false;
    }
    
    const validFeatures = formData.features.filter(f => f.trim() !== '');
    if (validFeatures.length === 0) {
      toast.error('Pelo menos um benefício deve ser adicionado');
      return false;
    }

    // Converter maxEmployees para number ou string 'unlimited'
    let maxEmployees: number | 'unlimited';
    if (formData.maxEmployees.toLowerCase() === 'unlimited' || formData.maxEmployees.toLowerCase() === 'ilimitado') {
      maxEmployees = 'unlimited';
    } else {
      const numEmployees = parseInt(formData.maxEmployees);
      if (isNaN(numEmployees) || numEmployees <= 0) {
        toast.error('Número de funcionários deve ser um número válido ou "ilimitado"');
        return false;
      }
      maxEmployees = numEmployees;
    }

    const planData: Partial<Plan> = {
      name: formData.name,
      maxEmployees: maxEmployees,
      monthlyPrice: formData.monthlyPrice,
      yearlyPrice: formData.yearlyPrice,
      features: validFeatures,
      isPopular: formData.isPopular,
      isActive: formData.isActive
    };

    console.log('Submitting plan data:', planData);

    if (editingPlan) {
      // Atualizar plano existente
      updatePlan(editingPlan.id, planData);
      toast.success('Plano atualizado com sucesso!');
    } else {
      // Criar novo plano
      addPlan(planData as Omit<Plan, 'id'>);
      toast.success('Plano criado com sucesso!');
    }
    
    return true;
  };

  return {
    formData,
    setFormData,
    resetForm,
    loadPlanData,
    addFeature,
    updateFeature,
    removeFeature,
    validateAndSubmit
  };
};
