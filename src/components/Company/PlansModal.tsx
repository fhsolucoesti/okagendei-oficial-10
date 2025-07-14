
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, TrendingUp, QrCode } from 'lucide-react';
import { Plan } from '@/types';
import { toast } from 'sonner';
import MercadoPagoPix from './MercadoPagoPix';

interface PlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: Plan[];
  currentPlanName?: string;
  onPlanSelect: (planId: string, planName: string) => void;
  isUpgrade?: boolean;
}

const PlansModal = ({ 
  open, 
  onOpenChange, 
  plans, 
  currentPlanName, 
  onPlanSelect,
  isUpgrade = false 
}: PlansModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [selectedPlanForPix, setSelectedPlanForPix] = useState<Plan | null>(null);

  const handlePlanSelection = async (planId: string, planName: string) => {
    if (planName === currentPlanName && !isUpgrade) {
      toast.error('Este já é seu plano atual');
      return;
    }

    setIsProcessing(true);
    
    // Simular processamento
    setTimeout(() => {
      onPlanSelect(planId, planName);
      setIsProcessing(false);
      onOpenChange(false);
      setSelectedPlan('');
    }, 1500);
  };

  const handlePixPayment = (plan: Plan) => {
    setSelectedPlanForPix(plan);
    setShowPixModal(true);
  };

  const handlePixSuccess = (paymentId: string) => {
    if (selectedPlanForPix) {
      toast.success('Pagamento aprovado! Plano ativado com sucesso.');
      onPlanSelect(selectedPlanForPix.id, selectedPlanForPix.name);
      setShowPixModal(false);
      setSelectedPlanForPix(null);
      onOpenChange(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isUpgrade ? (
              <>
                <TrendingUp className="h-5 w-5 text-green-600" />
                Fazer Upgrade de Plano
              </>
            ) : (
              'Alterar Plano de Assinatura'
            )}
          </DialogTitle>
          <DialogDescription>
            {isUpgrade 
              ? 'Escolha o plano ideal para expandir seu negócio'
              : 'Selecione o novo plano para sua empresa'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.filter(plan => plan.isActive).map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                plan.isPopular ? 'border-blue-500 shadow-md' : 'border-gray-200'
              } ${
                plan.name === currentPlanName ? 'bg-green-50 border-green-500' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Mais Popular
                  </div>
                </div>
              )}

              {plan.name === currentPlanName && (
                <div className="absolute -top-3 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Plano Atual
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(plan.monthlyPrice)}
                  </div>
                  <div className="text-sm text-gray-600">por mês</div>
                  <div className="text-xs text-gray-500">
                    ou {formatPrice(plan.yearlyPrice)}/ano (2 meses grátis)
                  </div>
                </div>
                <CardDescription className="mt-2">
                  Até {plan.maxEmployees === 'unlimited' ? 'ilimitados' : plan.maxEmployees} funcionários
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mt-6">
                  {plan.name === currentPlanName && !isUpgrade ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled
                    >
                      Plano Atual
                    </Button>
                  ) : plan.monthlyPrice === 0 ? (
                    /* Plano gratuito - seleção direta */
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={isProcessing}
                      onClick={() => handlePlanSelection(plan.id, plan.name)}
                    >
                      {isProcessing && selectedPlan === plan.id ? (
                        'Processando...'
                      ) : (
                        'Selecionar Plano Gratuito'
                      )}
                    </Button>
                  ) : (
                    /* Plano pago - opções de pagamento */
                    <>
                      <Button
                        className="w-full"
                        variant="default"
                        onClick={() => handlePixPayment(plan)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Pagar via PIX
                      </Button>
                      
                      {/* Botão secundário para seleção direta (trial/teste) */}
                      <Button
                        className="w-full"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => handlePlanSelection(plan.id, plan.name)}
                      >
                        {isProcessing && selectedPlan === plan.id ? (
                          'Processando...'
                        ) : (
                          'Testar por 7 dias'
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
      
      {/* Modal PIX */}
      {selectedPlanForPix && (
        <MercadoPagoPix
          open={showPixModal}
          onOpenChange={setShowPixModal}
          plan={selectedPlanForPix}
          onSuccess={handlePixSuccess}
        />
      )}
    </Dialog>
  );
};

export default PlansModal;
