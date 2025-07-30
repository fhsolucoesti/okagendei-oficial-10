import { Plan } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PlanCard from '../PlanCard';

interface PlansSectionProps {
  plans: Plan[];
  onAddPlan: () => void;
  onEditPlan: (plan: Plan) => void;
  onTogglePlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
  onViewPlan: (plan: Plan) => void;
}

const PlansSection = ({
  plans,
  onAddPlan,
  onEditPlan,
  onTogglePlan,
  onDeletePlan,
  onViewPlan
}: PlansSectionProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Planos Disponíveis</h3>
          <p className="text-sm text-slate-600">Gerencie os planos oferecidos para as empresas</p>
        </div>
        <Button onClick={onAddPlan} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto">
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
            onView={onViewPlan}
            onEdit={onEditPlan}
            onToggle={onTogglePlan}
            onDelete={onDeletePlan}
          />
        ))}
      </div>
    </>
  );
};

export default PlansSection;