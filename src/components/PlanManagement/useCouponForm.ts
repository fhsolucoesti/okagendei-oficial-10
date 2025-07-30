import { Coupon } from '@/types';
import { useForm } from '@/hooks/useForm';
import { toast } from 'sonner';

interface CouponFormData {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount: number;
  maxUses: number;
  expiresAt: string;
  isActive: boolean;
}

const initialValues: CouponFormData = {
  code: '',
  description: '',
  type: 'percentage',
  value: 0,
  minAmount: 0,
  maxUses: 0,
  expiresAt: '',
  isActive: true
};

const validateCoupon = (values: CouponFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.code.trim()) {
    errors.code = 'Código do cupom é obrigatório';
  }

  if (!values.description.trim()) {
    errors.description = 'Descrição do cupom é obrigatória';
  }

  if (values.value <= 0) {
    errors.value = 'Valor deve ser maior que zero';
  }

  if (values.type === 'percentage' && values.value > 100) {
    errors.value = 'Porcentagem não pode ser maior que 100%';
  }

  return errors;
};

export const useCouponForm = (
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void, 
  updateCoupon: (id: string, data: Partial<Coupon>) => void
) => {
  const form = useForm({
    initialValues,
    validate: validateCoupon
  });

  const loadCouponData = (coupon: Coupon) => {
    form.setValues({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minAmount: coupon.minAmount || 0,
      maxUses: coupon.maxUses || 0,
      expiresAt: coupon.expiresAt || '',
      isActive: coupon.isActive
    });
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue('code', code);
  };

  const validateAndSubmit = (editingCoupon: Coupon | null) => {
    if (!form.validateForm()) {
      return false;
    }

    const { values } = form;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, values);
      toast.success('Cupom atualizado com sucesso!');
    } else {
      addCoupon({
        ...values,
        companyId: 'super_admin',
        usedCount: 0,
        createdAt: new Date().toISOString()
      });
      toast.success('Cupom criado com sucesso!');
    }
    
    return true;
  };

  return {
    formData: form.values,
    setFormData: form.setValues,
    resetForm: form.resetForm,
    loadCouponData,
    generateCouponCode,
    validateAndSubmit,
    errors: form.errors
  };
};