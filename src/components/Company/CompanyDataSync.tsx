
import { useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CompanyDataSync = () => {
  const { companies, services, professionals, appointments, initializeCompanyData } = useData();
  const { user } = useAuth();

  // Sincronizar dados da empresa quando necessário
  useEffect(() => {
    if (user?.role === 'company_admin' && user.companyId) {
      const company = companies.find(c => c.id === user.companyId);
      
      if (!company) {
        console.log('Empresa não encontrada, inicializando dados...');
        initializeCompanyData(user.companyId);
        toast.info('Dados da empresa sendo inicializados...');
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
  }, [user, companies, services, professionals, appointments, initializeCompanyData]);

  return null; // Este componente não renderiza nada
};

export default CompanyDataSync;
