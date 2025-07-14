
import { useState } from 'react';
import { Coupon } from '@/types';
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

export const useCouponForm = (addCoupon: (coupon: Omit<Coupon, 'id'>) => void, updateCoupon: (id: string, data: Partial<Coupon>) => void) => {
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    description: '',
    type: 'percentage',
    value: 0,
    minAmount: 0,
    maxUses: 0,
    expiresAt: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      type: 'percentage',
      value: 0,
      minAmount: 0,
      maxUses: 0,
      expiresAt: '',
      isActive: true
    });
  };

  const loadCouponData = (coupon: Coupon) => {
    setFormData({
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
    setFormData({ ...formData, code });
  };

  const validateAndSubmit = (editingCoupon: Coupon | null) => {
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, formData);
      toast.success('Cupom atualizado com sucesso!');
    } else {
      addCoupon({
        ...formData,
        companyId: 'super_admin',
        usedCount: 0,
        createdAt: new Date().toISOString()
      });
      toast.success('Cupom criado com sucesso!');
    }
    
    return true;
  };

  return {
    formData,
    setFormData,
    resetForm,
    loadCouponData,
    generateCouponCode,
    validateAndSubmit
  };
};
