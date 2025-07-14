
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { Coupon } from '@/types';

interface CouponCardProps {
  coupon: Coupon;
  onView: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onToggle: (coupon: Coupon) => void;
  onDelete: (couponId: string) => void;
  getCouponStatusBadge: (coupon: Coupon) => JSX.Element;
}

const CouponCard = ({ coupon, onView, onEdit, onToggle, onDelete, getCouponStatusBadge }: CouponCardProps) => {
  return (
    <div className="w-full bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-mono font-bold text-green-800 truncate">{coupon.code}</div>
          <div className="text-sm text-green-600">
            {coupon.type === 'percentage' ? `${coupon.value}%` : `R$ ${coupon.value.toFixed(2)}`} de desconto
          </div>
        </div>
        <div className="flex space-x-1 flex-shrink-0 ml-2">
          {getCouponStatusBadge(coupon)}
        </div>
      </div>
      <div className="text-xs text-green-700 space-y-1 mb-3">
        <div>Usado: {coupon.usedCount}/{coupon.maxUses || '∞'} vezes</div>
        {coupon.expiresAt && (
          <div className="truncate">Válido até: {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}</div>
        )}
      </div>
      <div className="flex space-x-1">
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => onView(coupon)}>
          <Eye className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => onEdit(coupon)}>
          <Edit className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => onToggle(coupon)}>
          {coupon.isActive ? (
            <ToggleRight className="h-3 w-3 text-green-600" />
          ) : (
            <ToggleLeft className="h-3 w-3 text-gray-400" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600 flex-shrink-0" onClick={() => onDelete(coupon.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CouponCard;
