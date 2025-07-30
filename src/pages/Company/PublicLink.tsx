
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import PublicLinkDisplay from '@/components/Company/PublicLinkDisplay';
import CustomUrlForm from '@/components/Company/CustomUrlForm';
import CompanyLogoUpload from '@/components/Company/CompanyLogoUpload';
import PublicLinkStats from '@/components/Company/PublicLinkStats';
import SharingTips from '@/components/Company/SharingTips';
import WhatsAppConfig from '@/components/Company/WhatsAppConfig';
import { useEffect } from 'react';

const CompanyPublicLink = () => {
  const { company, updateCompany } = useCompanyDataContext();
  const { user } = useAuth();

  // Funcionalidade de inicialização removida - dados são carregados automaticamente pelo CompanyDataContext

  // Se não encontrou a empresa, mostrar loading
  if (!company) {
    return (
      <div className="flex-1 bg-gray-50">
        <Header title="Link Público" subtitle="Configure e compartilhe seu link de agendamentos" />
        <main className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando dados da empresa...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentUrl = company.customUrl || '';
  const fullUrl = `${window.location.origin}/agendar/${currentUrl}`;

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Link Público" subtitle="Configure e compartilhe seu link de agendamentos" />
      
      <main className="p-6">
        <PublicLinkDisplay 
          fullUrl={fullUrl} 
          companyName={company.name || ''} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CustomUrlForm 
            company={company}
            onUpdateUrl={(id, updates) => updateCompany(id, updates)}
          />

          <CompanyLogoUpload 
            company={company}
            onUpdateLogo={(id, updates) => updateCompany(id, updates)}
          />
        </div>

        <div className="mb-6">
          <WhatsAppConfig 
            company={company}
            onUpdateWhatsApp={(id, updates) => updateCompany(id, updates)}
          />
        </div>

        <PublicLinkStats />

        <SharingTips />
      </main>
    </div>
  );
};

export default CompanyPublicLink;
