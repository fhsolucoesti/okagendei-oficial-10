
import { useEffect } from 'react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CompanyDataSync = () => {
  const { company, services, professionals, appointments, loadCompanyData } = useCompanyDataContext();
  const { user } = useAuth();

  // Sincronizar dados da empresa quando necessário
  useEffect(() => {
    if (user?.role === 'company_admin' && user.companyId) {
      if (!company) {
        console.log('Empresa não encontrada, carregando dados...');
        loadCompanyData(user.companyId);
        toast.info('Carregando dados da empresa...');
        return;
      }

      // Verificar se os dados estão consistentes
      const companyServices = services.filter(s => s.companyId === user.companyId);
      const companyProfessionals = professionals.filter(p => p.companyId === user.companyId);
      const companyAppointments = appointments.filter(a => a.companyId === user.companyId);

      console.log('Dados da empresa sincronizados:', {
        company: company.name,
        services: companyServices.length,
        professionals: companyProfessionals.length,
        appointments: companyAppointments.length
      });
    }
  }, [user, company, services, professionals, appointments, loadCompanyData]);

  return null; // Este componente não renderiza nada
};

export default CompanyDataSync;
