
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Plan, Coupon } from '@/types';
import { toast } from 'sonner';
import PlanCard from './PlanCard';
import PlanFormDialog from './PlanFormDialog';
import CouponCard from './CouponCard';
import CouponFormDialog from './CouponFormDialog';
import ViewItemDialog from './ViewItemDialog';
import { usePlanForm } from './usePlanForm';
import { useCouponForm } from './useCouponForm';

const PlanManagement = () => {
  const { plans, coupons, addCoupon, updateCoupon, deleteCoupon, addPlan, updatePlan, deletePlan } = useData();
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [viewingItem, setViewingItem] = useState<Plan | Coupon | null>(null);
  
  const planForm = usePlanForm(addPlan, updatePlan);
  const couponForm = useCouponForm(addCoupon, updateCoupon);

  // Plan handlers
  const handleAddPlan = () => {
    setEditingPlan(null);
    planForm.resetForm();
    setIsPlanDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    console.log('Editing plan:', plan);
    setEditingPlan(plan);
    planForm.loadPlanData(plan);
    setIsPlanDialogOpen(true);
  };

  const handleSubmitPlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (planForm.validateAndSubmit(editingPlan)) {
      setIsPlanDialogOpen(false);
      setEditingPlan(null);
    }
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      deletePlan(planId);
      toast.success('Plano excluído com sucesso!');
    }
  };

  const handleTogglePlan = (plan: Plan) => {
    updatePlan(plan.id, { isActive: !plan.isActive });
    toast.success(`Plano ${!plan.isActive ? 'ativado' : 'desativado'} com sucesso!`);
  };

  // Coupon handlers
  const handleAddCoupon = () => {
    setEditingCoupon(null);
    couponForm.resetForm();
    setIsCouponDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    couponForm.loadCouponData(coupon);
    setIsCouponDialogOpen(true);
  };

  const handleSubmitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (couponForm.validateAndSubmit(editingCoupon)) {
      setIsCouponDialogOpen(false);
      setEditingCoupon(null);
    }
  };

  const handleToggleCoupon = (coupon: Coupon) => {
    updateCoupon(coupon.id, { isActive: !coupon.isActive });
    toast.success(`Cupom ${!coupon.isActive ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
      deleteCoupon(id);
      toast.success('Cupom excluído com sucesso!');
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getCouponStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) return <Badge variant="secondary">Inativo</Badge>;
    if (isExpired(coupon.expiresAt)) return <Badge variant="destructive">Expirado</Badge>;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return <Badge variant="outline">Esgotado</Badge>;
    return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
  };

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Planos Disponíveis</h3>
          <p className="text-sm text-slate-600">Gerencie os planos oferecidos para as empresas</p>
        </div>
        <Button onClick={handleAddPlan} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onView={setViewingItem}
            onEdit={handleEditPlan}
            onToggle={handleTogglePlan}
            onDelete={handleDeletePlan}
          />
        ))}
      </div>

      {/* Coupons Section */}
      <Card className="w-full bg-white/80 backdrop-blur-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <span>Cupons de Desconto</span>
            <Button size="sm" variant="outline" onClick={handleAddCoupon} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-1" />
              Novo Cupom
            </Button>
          </CardTitle>
          <CardDescription>
            Gerencie cupons de desconto para novos clientes e upgrades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onView={setViewingItem}
                onEdit={handleEditCoupon}
                onToggle={handleToggleCoupon}
                onDelete={handleDeleteCoupon}
                getCouponStatusBadge={getCouponStatusBadge}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Form Dialog */}
      <PlanFormDialog
        open={isPlanDialogOpen}
        onOpenChange={setIsPlanDialogOpen}
        editingPlan={editingPlan}
        formData={planForm.formData}
        setFormData={planForm.setFormData}
        onSubmit={handleSubmitPlan}
        onAddFeature={planForm.addFeature}
        onUpdateFeature={planForm.updateFeature}
        onRemoveFeature={planForm.removeFeature}
      />

      {/* Coupon Form Dialog */}
      <CouponFormDialog
        open={isCouponDialogOpen}
        onOpenChange={setIsCouponDialogOpen}
        editingCoupon={editingCoupon}
        formData={couponForm.formData}
        setFormData={couponForm.setFormData}
        onSubmit={handleSubmitCoupon}
        onGenerateCode={couponForm.generateCouponCode}
      />

      {/* View Item Dialog */}
      <ViewItemDialog
        open={!!viewingItem}
        onOpenChange={() => setViewingItem(null)}
        viewingItem={viewingItem}
        getCouponStatusBadge={getCouponStatusBadge}
      />
    </div>
  );
};

export default PlanManagement;
