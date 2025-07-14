
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Plan } from '@/types';
import { useLandingConfig } from '@/contexts/LandingConfigContext';

interface PlansSectionProps {
  plans: Plan[];
  isAnnualBilling: boolean;
  setIsAnnualBilling: (value: boolean) => void;
  handlePlanSelect: (plan: Plan) => void;
}

const PlansSection = ({ plans, isAnnualBilling, setIsAnnualBilling, handlePlanSelect }: PlansSectionProps) => {
  const { planSettings, promotionalSettings } = useLandingConfig();

  // Usar configurações dinâmicas se disponíveis
  const sectionTitle = planSettings.planSectionTitle || 'Escolha o plano ideal para seu negócio';
  const sectionSubtitle = planSettings.planSectionSubtitle || 'Planos flexíveis que crescem com seu negócio. Comece grátis e atualize quando precisar.';
  
  // Usar sempre os planos do DataContext, filtrando apenas os ativos
  const activePlans = plans.filter(plan => plan.isActive !== false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getDiscountedPrice = (price: number) => {
    if (promotionalSettings.showAnnualDiscount && isAnnualBilling) {
      const discount = promotionalSettings.annualDiscountPercentage || 20;
      return price * (1 - discount / 100);
    }
    return price;
  };

  return (
    <section id="plans" className="py-12 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {sectionSubtitle}
          </p>
          
          {/* Toggle de faturamento */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`${!isAnnualBilling ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Mensal
            </span>
            <button
              onClick={() => setIsAnnualBilling(!isAnnualBilling)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnualBilling ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              aria-label="Toggle billing period"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnualBilling ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`${isAnnualBilling ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Anual
            </span>
            {promotionalSettings.showAnnualDiscount && (
              <Badge className="bg-green-100 text-green-800 ml-2">
                {promotionalSettings.discountBadgeText || `Economize ${promotionalSettings.annualDiscountPercentage}%`}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {activePlans.map((plan) => {
            const monthlyPrice = isAnnualBilling ? plan.yearlyPrice / 12 : plan.monthlyPrice;
            const finalPrice = getDiscountedPrice(monthlyPrice);
            const isPopular = planSettings.highlightPopularPlan && plan.isPopular;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg p-6 lg:p-8 ${
                  isPopular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(finalPrice)}
                    </span>
                    <span className="text-gray-500 text-lg">/mês</span>
                    {isAnnualBilling && promotionalSettings.showAnnualDiscount && finalPrice < monthlyPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(monthlyPrice)}/mês
                      </div>
                    )}
                  </div>
                  {promotionalSettings.showFreeTrial && (
                    <p className="text-sm text-green-600 font-medium">
                      {promotionalSettings.trialText || `${promotionalSettings.freeTrialDays} dias grátis`}
                    </p>
                  )}
                </div>
                
                <div className="space-y-4 mb-8">
                  <p className="text-sm text-gray-500 font-medium">
                    Até {typeof plan.maxEmployees === 'string' ? plan.maxEmployees : plan.maxEmployees} 
                    {typeof plan.maxEmployees === 'number' ? ' funcionários' : ' funcionários'}
                  </p>
                  
                  {/* Usar features array do plano */}
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full ${
                    isPopular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Começar Agora
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
