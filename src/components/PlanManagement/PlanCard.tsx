
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Check, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
  onView: (plan: Plan) => void;
  onEdit: (plan: Plan) => void;
  onToggle: (plan: Plan) => void;
  onDelete: (planId: string) => void;
}

const PlanCard = ({ plan, onView, onEdit, onToggle, onDelete }: PlanCardProps) => {
  return (
    <Card className={`relative bg-white/80 backdrop-blur-sm border-2 transition-all duration-200 hover:shadow-lg ${plan.isPopular ? 'border-blue-500 shadow-blue-100' : 'border-slate-200'} ${!plan.isActive ? 'opacity-60' : ''}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1">
            Mais Popular
          </Badge>
        </div>
      )}
      
      {!plan.isActive && (
        <div className="absolute -top-3 right-4">
          <Badge variant="secondary">Inativo</Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-slate-900">{plan.name}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center justify-center space-x-1 text-slate-600">
                <Users className="h-4 w-4" />
                <span>{plan.maxEmployees === 'unlimited' ? 'Ilimitados' : plan.maxEmployees} funcionário{typeof plan.maxEmployees === 'number' && plan.maxEmployees > 1 ? 's' : typeof plan.maxEmployees === 'string' ? 's' : ''}</span>
              </div>
            </CardDescription>
          </div>
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(plan)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(plan)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggle(plan)}>
              {plan.isActive ? (
                <ToggleRight className="h-3 w-3 text-green-600" />
              ) : (
                <ToggleLeft className="h-3 w-3 text-gray-400" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => onDelete(plan.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-center space-x-1">
            <DollarSign className="h-5 w-5 text-slate-600" />
            <span className="text-3xl font-bold text-slate-900">
              {plan.monthlyPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-slate-600">/mês</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            ou R$ {plan.yearlyPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano (20% desconto)
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-sm text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 rounded px-2 py-1 text-center">
              <div className="font-medium text-slate-900">12</div>
              <div className="text-xs text-slate-600">Empresas</div>
            </div>
            <div className="bg-slate-50 rounded px-2 py-1 text-center">
              <div className="font-medium text-slate-900">R$ 1.2k</div>
              <div className="text-xs text-slate-600">MRR</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
