import { Plan } from '@/types';
import { useForm } from '@/hooks/useForm';
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

const initialValues: PlanFormData = {
  name: '',
  maxEmployees: '',
  monthlyPrice: 0,
  yearlyPrice: 0,
  features: [''],
  isPopular: false,
  isActive: true
};

const validatePlan = (values: PlanFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) {
    errors.name = 'Nome do plano é obrigatório';
  }

  if (!values.maxEmployees.trim()) {
    errors.maxEmployees = 'Número de funcionários é obrigatório';
  }

  if (values.monthlyPrice <= 0) {
    errors.monthlyPrice = 'Preço mensal deve ser maior que zero';
  }

  if (values.yearlyPrice <= 0) {
    errors.yearlyPrice = 'Preço anual deve ser maior que zero';
  }

  const validFeatures = values.features.filter(f => f.trim() !== '');
  if (validFeatures.length === 0) {
    errors.features = 'Pelo menos um benefício deve ser adicionado';
  }

  return errors;
};

export const usePlanForm = (
  addPlan: (plan: Omit<Plan, 'id'>) => void, 
  updatePlan: (id: string, data: Partial<Plan>) => void
) => {
  const form = useForm({
    initialValues,
    validate: validatePlan
  });

  const loadPlanData = (plan: Plan) => {
    form.setValues({
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
    form.setFieldValue('features', [...form.values.features, '']);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...form.values.features];
    newFeatures[index] = value;
    form.setFieldValue('features', newFeatures);
  };

  const removeFeature = (index: number) => {
    if (form.values.features.length > 1) {
      const newFeatures = form.values.features.filter((_, i) => i !== index);
      form.setFieldValue('features', newFeatures);
    }
  };

  const validateAndSubmit = (editingPlan: Plan | null) => {
    if (!form.validateForm()) {
      return false;
    }

    const { values } = form;
    
    // Convert maxEmployees to number or string 'unlimited'
    let maxEmployees: number | 'unlimited';
    if (values.maxEmployees.toLowerCase() === 'unlimited' || values.maxEmployees.toLowerCase() === 'ilimitado') {
      maxEmployees = 'unlimited';
    } else {
      const numEmployees = parseInt(values.maxEmployees);
      if (isNaN(numEmployees) || numEmployees <= 0) {
        toast.error('Número de funcionários deve ser um número válido ou "ilimitado"');
        return false;
      }
      maxEmployees = numEmployees;
    }

    const validFeatures = values.features.filter(f => f.trim() !== '');
    
    const planData: Partial<Plan> = {
      name: values.name,
      maxEmployees: maxEmployees,
      monthlyPrice: values.monthlyPrice,
      yearlyPrice: values.yearlyPrice,
      features: validFeatures,
      isPopular: values.isPopular,
      isActive: values.isActive
    };

    if (editingPlan) {
      updatePlan(editingPlan.id, planData);
      toast.success('Plano atualizado com sucesso!');
    } else {
      addPlan(planData as Omit<Plan, 'id'>);
      toast.success('Plano criado com sucesso!');
    }
    
    return true;
  };

  return {
    formData: form.values,
    setFormData: form.setValues,
    resetForm: form.resetForm,
    loadPlanData,
    addFeature,
    updateFeature,
    removeFeature,
    validateAndSubmit,
    errors: form.errors
  };
};