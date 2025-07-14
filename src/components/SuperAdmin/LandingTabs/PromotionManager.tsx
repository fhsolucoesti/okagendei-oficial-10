
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, Percent } from 'lucide-react';
import { Promotion } from '@/types/landingConfig';

interface PromotionManagerProps {
  promotions: Promotion[];
  onUpdate: (promotions: Promotion[]) => void;
}

const PromotionManager = ({ promotions, onUpdate }: PromotionManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercentage: 0,
    couponCode: '',
    validUntil: '',
    active: true
  });

  const handleAdd = () => {
    setEditingPromotion(null);
    setFormData({ 
      title: '', 
      description: '', 
      discountPercentage: 0, 
      couponCode: '',
      validUntil: '', 
      active: true 
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      discountPercentage: promotion.discountPercentage,
      couponCode: promotion.couponCode,
      validUntil: promotion.validUntil || '',
      active: promotion.active
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) return;

    const newPromotion: Promotion = {
      id: editingPromotion?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      discountPercentage: formData.discountPercentage,
      couponCode: formData.couponCode,
      active: formData.active,
      validUntil: formData.validUntil || undefined
    };

    let updatedPromotions: Promotion[];
    if (editingPromotion) {
      updatedPromotions = promotions.map(promotion => 
        promotion.id === editingPromotion.id ? newPromotion : promotion
      );
    } else {
      updatedPromotions = [...promotions, newPromotion];
    }

    onUpdate(updatedPromotions);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedPromotions = promotions.filter(promotion => promotion.id !== id);
    onUpdate(updatedPromotions);
  };

  const handleToggleActive = (id: string, active: boolean) => {
    const updatedPromotions = promotions.map(promotion =>
      promotion.id === id ? { ...promotion, active } : promotion
    );
    onUpdate(updatedPromotions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Promoções Ativas</h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Promoção
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? 'Editar Promoção' : 'Adicionar Promoção'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Promoção</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Desconto de Black Friday"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva a promoção..."
                />
              </div>
              
              <div>
                <Label htmlFor="discountPercentage">Percentual de Desconto (%)</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({...formData, discountPercentage: Number(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="couponCode">Código do Cupom</Label>
                <Input
                  id="couponCode"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({...formData, couponCode: e.target.value})}
                  placeholder="Ex: BLACKFRIDAY50"
                />
              </div>
              
              <div>
                <Label htmlFor="validUntil">Válido até</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label>Ativo</Label>
              </div>
              
              <Button onClick={handleSave} className="w-full">
                {editingPromotion ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  <Percent className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{promotion.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {promotion.discountPercentage}% de desconto
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Válido até: {promotion.validUntil || 'Não definido'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={promotion.active}
                  onCheckedChange={(checked) => handleToggleActive(promotion.id, checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(promotion)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(promotion.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {promotions.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Nenhuma promoção adicionada ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default PromotionManager;
