import { Coupon } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import CouponCard from '../CouponCard';

interface CouponsSectionProps {
  coupons: Coupon[];
  onAddCoupon: () => void;
  onEditCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (couponId: string) => void;
  onViewCoupon: (coupon: Coupon) => void;
}

const CouponsSection = ({
  coupons,
  onAddCoupon,
  onEditCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  onViewCoupon
}: CouponsSectionProps) => {
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
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <span>Cupons de Desconto</span>
          <Button size="sm" variant="outline" onClick={onAddCoupon} className="w-full sm:w-auto">
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
              onView={onViewCoupon}
              onEdit={onEditCoupon}
              onToggle={onToggleCoupon}
              onDelete={onDeleteCoupon}
              getCouponStatusBadge={getCouponStatusBadge}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CouponsSection;