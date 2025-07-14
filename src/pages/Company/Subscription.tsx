
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import TrialStatusCard from '@/components/Company/TrialStatusCard';
import ActiveSubscriptionStatus from '@/components/Company/ActiveSubscriptionStatus';
import PlanDetails from '@/components/Company/PlanDetails';
import PaymentHistory from '@/components/Company/PaymentHistory';
import PlanManagement from '@/components/Company/PlanManagement';
import ExpiredTrialCard from '@/components/Company/ExpiredTrialCard';

const CompanySubscription = () => {
  const { companies, plans } = useData();
  const { user } = useAuth();

  const company = companies.find(c => c.id === user?.companyId);
  const currentPlan = plans.find(p => p.name.includes(company?.plan || ''));

  const trialDaysLeft = company?.trialEndsAt 
    ? Math.ceil((new Date(company.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Lógica de status corrigida
  const isTrialActive = company?.status === 'trial' && trialDaysLeft > 0;
  const isActive = company?.status === 'active';
  const isTrialExpired = company?.status === 'trial' && trialDaysLeft <= 0;

  // Format trial dates
  const trialStartDate = company?.trialEndsAt 
    ? new Date(new Date(company.trialEndsAt).getTime() - 7 * 24 * 60 * 60 * 1000)
    : null;
  const trialEndDate = company?.trialEndsAt ? new Date(company.trialEndsAt) : null;

  console.log('Status da empresa:', {
    companyStatus: company?.status,
    isTrialActive,
    isActive,
    isTrialExpired,
    trialDaysLeft
  });

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Assinatura" subtitle="Gerencie sua assinatura e plano atual" />
      
      <main className="p-6">
        {isTrialActive ? (
          <>
            <TrialStatusCard 
              trialDaysLeft={trialDaysLeft}
              trialStartDate={trialStartDate}
              trialEndDate={trialEndDate}
            />
            
            {/* Gerenciamento específico para período de teste - SOMENTE botão de upgrade */}
            <div className="mt-6">
              <PlanManagement isTrialActive={true} trialEndDate={trialEndDate} />
            </div>
          </>
        ) : isActive ? (
          <>
            <ActiveSubscriptionStatus company={company} currentPlan={currentPlan} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PlanDetails currentPlan={currentPlan} />
              <PaymentHistory />
            </div>

            {/* Gerenciamento completo para plano pago - TODOS os botões */}
            <PlanManagement isTrialActive={false} trialEndDate={null} />
          </>
        ) : (
          <ExpiredTrialCard />
        )}
      </main>
    </div>
  );
};

export default CompanySubscription;
