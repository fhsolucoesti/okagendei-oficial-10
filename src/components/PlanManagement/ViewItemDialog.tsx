
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plan, Coupon } from '@/types';

interface ViewItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewingItem: Plan | Coupon | null;
  getCouponStatusBadge?: (coupon: Coupon) => JSX.Element;
}

const ViewItemDialog = ({ open, onOpenChange, viewingItem, getCouponStatusBadge }: ViewItemDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {viewingItem && 'name' in viewingItem ? 'Detalhes do Plano' : 'Detalhes do Cupom'}
          </DialogTitle>
        </DialogHeader>
        {viewingItem && (
          <div className="space-y-4">
            {'name' in viewingItem ? (
              // Plan details
              <div className="space-y-2">
                <p><strong>Nome:</strong> {viewingItem.name}</p>
                <p><strong>Funcionários:</strong> {viewingItem.maxEmployees === 'unlimited' ? 'Ilimitados' : viewingItem.maxEmployees}</p>
                <p><strong>Preço Mensal:</strong> R$ {viewingItem.monthlyPrice.toFixed(2)}</p>
                <p><strong>Preço Anual:</strong> R$ {viewingItem.yearlyPrice.toFixed(2)}</p>
                <p><strong>Status:</strong> {viewingItem.isActive ? 'Ativo' : 'Inativo'}</p>
                <div>
                  <strong>Recursos:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {viewingItem.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              // Coupon details
              <div className="space-y-2">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-mono font-bold">{viewingItem.code}</h3>
                  <p className="text-lg text-purple-600">
                    {viewingItem.type === 'percentage' ? 
                      `${viewingItem.value}% de desconto` : 
                      `R$ ${viewingItem.value.toFixed(2)} de desconto`
                    }
                  </p>
                </div>
                <p><strong>Descrição:</strong> {viewingItem.description}</p>
                <p><strong>Status:</strong> {getCouponStatusBadge ? getCouponStatusBadge(viewingItem) : <Badge>Status</Badge>}</p>
                <p><strong>Usado:</strong> {viewingItem.usedCount}/{viewingItem.maxUses || 'Ilimitado'} vezes</p>
                {viewingItem.minAmount && viewingItem.minAmount > 0 && (
                  <p><strong>Valor mínimo:</strong> R$ {viewingItem.minAmount.toFixed(2)}</p>
                )}
                {viewingItem.expiresAt && (
                  <p><strong>Expira em:</strong> {new Date(viewingItem.expiresAt).toLocaleDateString('pt-BR')}</p>
                )}
                <p><strong>Criado em:</strong> {new Date(viewingItem.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewItemDialog;
