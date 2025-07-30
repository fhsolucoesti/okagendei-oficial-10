import { useState } from 'react';
import { Coupon } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useCouponForm } from '../useCouponForm';
import { toast } from 'sonner';

export const useCouponManagement = () => {
  const { addCoupon, updateCoupon, deleteCoupon } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);
  
  const couponForm = useCouponForm(addCoupon, updateCoupon);

  const handleAdd = () => {
    setEditingItem(null);
    couponForm.resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingItem(coupon);
    couponForm.loadCouponData(coupon);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (couponForm.validateAndSubmit(editingItem)) {
      setIsDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleToggle = (coupon: Coupon) => {
    updateCoupon(coupon.id, { isActive: !coupon.isActive });
    toast.success(`Cupom ${!coupon.isActive ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
      deleteCoupon(id);
      toast.success('Cupom excluído com sucesso!');
    }
  };

  const generateCode = () => {
    couponForm.generateCouponCode();
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    formData: couponForm.formData,
    setFormData: couponForm.setFormData,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleToggle,
    generateCode
  };
};