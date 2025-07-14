
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, DollarSign } from 'lucide-react';
import { Plan } from '@/types/landingConfig';

interface PlanManagerProps {
  plans: Plan[];
  onUpdate: (plans: Plan[]) => void;
}

const PlanManager = ({ plans, onUpdate }: PlanManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    currency: 'BRL',
    interval: 'month',
    features: '',
    popular: false,
    isActive: true,
    freeTrial: 0
  });

  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({ 
      name: '', 
      price: 0, 
      currency: 'BRL',
      interval: 'month',
      features: '',
      popular: false,
      isActive: true,
      freeTrial: 0
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      features: plan.features.join('\n'),
      popular: plan.popular || false,
      isActive: plan.isActive,
      freeTrial: plan.freeTrial || 0
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || formData.price <= 0) return;

    const newPlan: Plan = {
      id: editingPlan?.id || Date.now().toString(),
      name: formData.name,
      price: formData.price,
      currency: formData.currency,
      interval: formData.interval,
      features: formData.features.split('\n').filter(f => f.trim()),
      popular: formData.popular,
      isActive: formData.isActive,
      freeTrial: formData.freeTrial > 0 ? formData.freeTrial : undefined
    };

    let updatedPlans: Plan[];
    if (editingPlan) {
      updatedPlans = plans.map(plan => 
        plan.id === editingPlan.id ? newPlan : plan
      );
    } else {
      updatedPlans = [...plans, newPlan];
    }

    onUpdate(updatedPlans);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== id);
    onUpdate(updatedPlans);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const updatedPlans = plans.map(plan =>
      plan.id === id ? { ...plan, isActive } : plan
    );
    onUpdate(updatedPlans);
  };

  const handleTogglePopular = (id: string, popular: boolean) => {
    const updatedPlans = plans.map(plan =>
      plan.id === id ? { ...plan, popular } : plan
    );
    onUpdate(updatedPlans);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Planos Disponíveis</h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Editar Plano' : 'Adicionar Plano'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Plano Básico"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="interval">Intervalo</Label>
                  <select 
                    id="interval"
                    value={formData.interval}
                    onChange={(e) => setFormData({...formData, interval: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="month">Mensal</option>
                    <option value="year">Anual</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="freeTrial">Dias Grátis</Label>
                  <Input
                    id="freeTrial"
                    type="number"
                    min="0"
                    value={formData.freeTrial}
                    onChange={(e) => setFormData({...formData, freeTrial: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="features">Recursos (um por linha)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="Agendamento online&#10;Gestão de clientes&#10;Relatórios básicos"
                  rows={4}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.popular}
                    onCheckedChange={(checked) => setFormData({...formData, popular: checked})}
                  />
                  <Label>Plano Popular</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label>Ativo</Label>
                </div>
              </div>
              
              <Button onClick={handleSave} className="w-full">
                {editingPlan ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{plan.name}</p>
                    {plan.popular && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    R$ {plan.price}/{plan.interval === 'month' ? 'mês' : 'ano'}
                    {plan.freeTrial && plan.freeTrial > 0 && (
                      <span className="text-green-600 ml-2">• {plan.freeTrial} dias grátis</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {plan.features.length} recursos inclusos
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={plan.popular}
                    onCheckedChange={(checked) => handleTogglePopular(plan.id, checked)}
                  />
                  <span className="text-xs">Popular</span>
                </div>
                <Switch
                  checked={plan.isActive}
                  onCheckedChange={(checked) => handleToggleActive(plan.id, checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(plan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {plans.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Nenhum plano adicionado ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlanManager;
