import { useState } from 'react';
import { Plan, Coupon } from '@/types';
import { useData } from '@/contexts/DataContext';
import { usePlanManagement } from './hooks/usePlanManagement';
import { useCouponManagement } from './hooks/useCouponManagement';
import PlansSection from './sections/PlansSection';
import CouponsSection from './sections/CouponsSection';
import PlanFormDialog from './PlanFormDialog';
import CouponFormDialog from './CouponFormDialog';
import ViewItemDialog from './ViewItemDialog';

const PlanManagement = () => {
  const { plans, coupons } = useData();
  const [viewingItem, setViewingItem] = useState<Plan | Coupon | null>(null);
  
  const planManagement = usePlanManagement();
  const couponManagement = useCouponManagement();

  return (
    <div className="w-full max-w-none space-y-6">
      <PlansSection 
        plans={plans}
        onAddPlan={planManagement.handleAdd}
        onEditPlan={planManagement.handleEdit}
        onTogglePlan={planManagement.handleToggle}
        onDeletePlan={planManagement.handleDelete}
        onViewPlan={setViewingItem}
      />

      <CouponsSection 
        coupons={coupons}
        onAddCoupon={couponManagement.handleAdd}
        onEditCoupon={couponManagement.handleEdit}
        onToggleCoupon={couponManagement.handleToggle}
        onDeleteCoupon={couponManagement.handleDelete}
        onViewCoupon={setViewingItem}
      />

      {/* Plan Form Dialog */}
      <PlanFormDialog
        open={planManagement.isDialogOpen}
        onOpenChange={planManagement.setIsDialogOpen}
        editingPlan={planManagement.editingItem}
        formData={planManagement.formData}
        setFormData={planManagement.setFormData}
        onSubmit={planManagement.handleSubmit}
        onAddFeature={planManagement.addFeature}
        onUpdateFeature={planManagement.updateFeature}
        onRemoveFeature={planManagement.removeFeature}
      />

      {/* Coupon Form Dialog */}
      <CouponFormDialog
        open={couponManagement.isDialogOpen}
        onOpenChange={couponManagement.setIsDialogOpen}
        editingCoupon={couponManagement.editingItem}
        formData={couponManagement.formData}
        setFormData={couponManagement.setFormData}
        onSubmit={couponManagement.handleSubmit}
        onGenerateCode={couponManagement.generateCode}
      />

      {/* View Item Dialog */}
      <ViewItemDialog
        open={!!viewingItem}
        onOpenChange={() => setViewingItem(null)}
        viewingItem={viewingItem}
        getCouponStatusBadge={() => null}
      />
    </div>
  );
};

export default PlanManagement;