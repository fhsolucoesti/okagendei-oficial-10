
import { useEffect } from 'react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ConfigurationValidator = () => {
  const { company, services, professionals } = useCompanyDataContext();
  const { plans } = useData();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'company_admin' && user.companyId && company) {
      // Validar se o plano da empresa existe
      const companyPlan = plans.find(p => p.name.toLowerCase() === company.plan?.toLowerCase());
      if (!companyPlan) {
        console.warn('Plano da empresa não encontrado:', company.plan);
        toast.warning('Plano da empresa precisa ser configurado');
      }

      // Validar serviços da empresa
      const companyServices = services.filter(s => s.companyId === user.companyId && s.isActive);
      if (companyServices.length === 0) {
        console.warn('Empresa sem serviços ativos');
      }

      // Validar profissionais da empresa
      const companyProfessionals = professionals.filter(p => p.companyId === user.companyId && p.isActive);
      if (companyProfessionals.length === 0) {
        console.warn('Empresa sem profissionais ativos');
      }

      // Validar URL personalizada
      if (!company.customUrl) {
        console.warn('Empresa sem URL personalizada configurada');
      }

      console.log('Validação de configurações concluída para empresa:', company.name);
    }
  }, [user, company, services, professionals, plans]);

  return null;
};

export default ConfigurationValidator;
