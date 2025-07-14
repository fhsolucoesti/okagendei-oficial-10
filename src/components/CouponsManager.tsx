
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Coupon } from '@/types';
import { toast } from 'sonner';

const CouponsManager = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [viewingCoupon, setViewingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minAmount: 0,
    maxUses: 0,
    expiresAt: '',
    isActive: true
  });

  const companyCoupons = coupons.filter(c => c.companyId === user?.companyId);

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, formData);
      toast.success('Cupom atualizado com sucesso!');
    } else {
      addCoupon({
        ...formData,
        companyId: user?.companyId || '',
        usedCount: 0,
        createdAt: new Date().toISOString()
      });
      toast.success('Cupom criado com sucesso!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingCoupon(null);
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

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
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
    setIsDialogOpen(true);
  };

  const handleToggleActive = (coupon: Coupon) => {
    updateCoupon(coupon.id, { isActive: !coupon.isActive });
    toast.success(`Cupom ${!coupon.isActive ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
      deleteCoupon(id);
      toast.success('Cupom excluído com sucesso!');
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) return <Badge variant="secondary">Inativo</Badge>;
    if (isExpired(coupon.expiresAt)) return <Badge variant="destructive">Expirado</Badge>;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return <Badge variant="outline">Esgotado</Badge>;
    return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cupons de Desconto</h2>
          <p className="text-gray-600">Gerencie seus cupons promocionais</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
              </DialogTitle>
              <DialogDescription>
                Crie ou edite um cupom de desconto
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Button type="button" variant="outline" onClick={generateCouponCode}>
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
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {editingCoupon ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyCoupons.map((coupon) => (
          <Card key={coupon.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-mono">{coupon.code}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(coupon)}
                    <Badge variant="outline">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `R$ ${coupon.value.toFixed(2)}`}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingCoupon(coupon)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(coupon)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleToggleActive(coupon)}
                  >
                    {coupon.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(coupon.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{coupon.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Usado: {coupon.usedCount}/{coupon.maxUses || '∞'}</span>
                  <span>
                    {coupon.expiresAt ? 
                      `Expira: ${new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}` : 
                      'Sem expiração'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Visualização */}
      <Dialog open={!!viewingCoupon} onOpenChange={() => setViewingCoupon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Cupom</DialogTitle>
          </DialogHeader>
          {viewingCoupon && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-mono font-bold">{viewingCoupon.code}</h3>
                <p className="text-lg text-purple-600">
                  {viewingCoupon.type === 'percentage' ? 
                    `${viewingCoupon.value}% de desconto` : 
                    `R$ ${viewingCoupon.value.toFixed(2)} de desconto`
                  }
                </p>
              </div>
              
              <div className="space-y-2">
                <p><strong>Descrição:</strong> {viewingCoupon.description}</p>
                <p><strong>Status:</strong> {getStatusBadge(viewingCoupon)}</p>
                <p><strong>Usado:</strong> {viewingCoupon.usedCount}/{viewingCoupon.maxUses || 'Ilimitado'} vezes</p>
                {viewingCoupon.minAmount > 0 && (
                  <p><strong>Valor mínimo:</strong> R$ {viewingCoupon.minAmount.toFixed(2)}</p>
                )}
                {viewingCoupon.expiresAt && (
                  <p><strong>Expira em:</strong> {new Date(viewingCoupon.expiresAt).toLocaleDateString('pt-BR')}</p>
                )}
                <p><strong>Criado em:</strong> {new Date(viewingCoupon.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponsManager;
