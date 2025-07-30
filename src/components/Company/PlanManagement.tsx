
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, Users, CreditCard, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import PlansModal from './PlansModal';
import ConfigurationValidator from './ConfigurationValidator';

interface PlanManagementProps {
  isTrialActive: boolean;
  trialEndDate: Date | null;
}

const PlanManagement = ({ isTrialActive, trialEndDate }: PlanManagementProps) => {
  const navigate = useNavigate();
  const { company, updateCompany } = useCompanyDataContext();
  const { user } = useAuth();
  const { plans } = useData();
  const { logout } = useAuth();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);

  const currentPlan = plans.find(p => p.name.toLowerCase().includes(company?.plan?.toLowerCase() || ''));

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const handlePlanChange = () => {
    setShowPlanChangeModal(true);
  };

  const handlePlanSelection = (planId: string, planName: string) => {
    if (company) {
      // Atualizar o plano da empresa
      updateCompany(company.id, { 
        plan: planName.toLowerCase(),
        status: 'active' as const
      });
      
      toast.success(`Plano alterado para ${planName} com sucesso!`);
      console.log(`Plano da empresa ${company.name} alterado para ${planName}`);
    }
  };

  const handlePaymentUpdate = () => {
    toast.success('Redirecionando para atualização de pagamento...');
    setTimeout(() => {
      window.open('https://checkout.stripe.com/demo', '_blank');
    }, 1000);
  };

  const handleCancelSubscription = () => {
    setShowCancelDialog(true);
  };

  const confirmCancellation = () => {
    if (company) {
      // Atualizar status da empresa para cancelado
      updateCompany(company.id, { status: 'cancelled' as const });
      
      toast.success('Assinatura cancelada com sucesso.');
      setShowCancelDialog(false);
      
      // Fazer logout e redirecionar para página de cancelamento
      setTimeout(() => {
        logout();
        navigate('/assinatura-cancelada', { replace: true });
      }, 1500);
    }
  };

  // Se estiver no período de teste, mostrar apenas o botão de upgrade
  if (isTrialActive) {
    return (
      <div className="w-full max-w-none space-y-6">
        <ConfigurationValidator />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Período de Teste</CardTitle>
            <CardDescription>
              Você está no período de teste gratuito
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mensagem de alerta para período de teste */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-amber-800 font-medium">Período de Teste Gratuito</p>
                  <p className="text-amber-700 text-sm mt-1">
                    O teste termina em {trialEndDate?.toLocaleDateString('pt-BR')}. 
                    Para continuar usando o sistema, contrate um plano antes dessa data.
                  </p>
                </div>
              </div>
            </div>

            {/* Apenas botão de upgrade para período de teste */}
            <div className="flex justify-center">
              <Button 
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 w-full sm:w-auto"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Fazer Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        <PlansModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          plans={plans}
          currentPlanName={currentPlan?.name}
          onPlanSelect={handlePlanSelection}
          isUpgrade={true}
        />
      </div>
    );
  }

  // Para usuários com plano pago - mostrar todos os botões
  return (
    <div className="w-full max-w-none space-y-6">
      <ConfigurationValidator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gerenciar Plano</CardTitle>
          <CardDescription>
            Faça upgrade, downgrade ou cancele sua assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex-1 sm:flex-none"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Fazer Upgrade
            </Button>
            <Button variant="outline" onClick={handlePlanChange} className="flex-1 sm:flex-none">
              <Users className="h-4 w-4 mr-2" />
              Alterar Plano
            </Button>
            <Button variant="outline" onClick={handlePaymentUpdate} className="flex-1 sm:flex-none">
              <CreditCard className="h-4 w-4 mr-2" />
              Atualizar Pagamento
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
              onClick={handleCancelSubscription}
            >
              Cancelar Assinatura
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Assinatura</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar sua assinatura? Você será desconectado e seu acesso será bloqueado até reativar via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Não, manter assinatura
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancellation}
            >
              Sim, cancelar assinatura
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Upgrade */}
      <PlansModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        plans={plans}
        currentPlanName={currentPlan?.name}
        onPlanSelect={handlePlanSelection}
        isUpgrade={true}
      />

      {/* Modal de Alteração de Plano */}
      <PlansModal
        open={showPlanChangeModal}
        onOpenChange={setShowPlanChangeModal}
        plans={plans}
        currentPlanName={currentPlan?.name}
        onPlanSelect={handlePlanSelection}
        isUpgrade={false}
      />
    </div>
  );
};

export default PlanManagement;
