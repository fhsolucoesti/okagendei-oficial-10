
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Coupon } from '@/types';

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

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCoupon: Coupon | null;
  formData: CouponFormData;
  setFormData: (data: CouponFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGenerateCode: () => void;
}

const CouponFormDialog = ({
  open,
  onOpenChange,
  editingCoupon,
  formData,
  setFormData,
  onSubmit,
  onGenerateCode
}: CouponFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
          </DialogTitle>
          <DialogDescription>
            Crie ou edite um cupom de desconto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Código do Cupom</Label>
            <div className="flex space-x-2">
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="Ex: DESCONTO10"
                required
              />
              <Button type="button" variant="outline" onClick={onGenerateCode}>
                Gerar
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descrição do cupom"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentagem</SelectItem>
                  <SelectItem value="fixed">Valor Fixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="value">
                {formData.type === 'percentage' ? 'Porcentagem (%)' : 'Valor (R$)'}
              </Label>
              <Input
                id="value"
                type="number"
                min="0"
                max={formData.type === 'percentage' ? 100 : undefined}
                step={formData.type === 'percentage' ? 1 : 0.01}
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minAmount">Valor Mínimo (R$)</Label>
              <Input
                id="minAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.minAmount}
                onChange={(e) => setFormData({...formData, minAmount: Number(e.target.value)})}
              />
            </div>
            
            <div>
              <Label htmlFor="maxUses">Máximo de Usos</Label>
              <Input
                id="maxUses"
                type="number"
                min="0"
                value={formData.maxUses}
                onChange={(e) => setFormData({...formData, maxUses: Number(e.target.value)})}
                placeholder="0 = ilimitado"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="expiresAt">Data de Expiração</Label>
            <Input
              id="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
            />
            <Label htmlFor="isActive">Cupom ativo</Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              {editingCoupon ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponFormDialog;
