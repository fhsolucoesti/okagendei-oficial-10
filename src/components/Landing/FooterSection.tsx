
import React from 'react';
import { useLandingConfig } from '@/contexts/LandingConfigContext';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Globe, Mail, Phone } from 'lucide-react';

interface FooterSectionProps {
  companyName: string;
  scrollToSection: (sectionId: string) => void;
  setIsLoginOpen: (open: boolean) => void;
}

const FooterSection = ({ companyName, scrollToSection, setIsLoginOpen }: FooterSectionProps) => {
  const { footerSection, socialLinks, legalLinks, companyInfo } = useLandingConfig();

  if (!footerSection.enabled) {
    return null; // Não renderizar se estiver desabilitado
  }

  // Filtrar redes sociais ativas 
  const activeSocialNetworks = socialLinks.socialNetworks?.filter(network => network.isActive) || [];
  
  // Filtrar links legais ativos
  const activeLegalLinks = legalLinks.legalLinks?.filter(link => link.isActive) || [];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      case 'twitter':
        return Twitter;
      case 'linkedin':
        return Linkedin;
      case 'youtube':
        return Youtube;
      case 'whatsapp':
        return MessageCircle;
      case 'website':
        return Globe;
      case 'email':
        return Mail;
      case 'phone':
        return Phone;
      default:
        return Globe;
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Seção da empresa */}
          <div>
            <h3 className="text-xl font-bold mb-4">{companyInfo.companyName || companyName}</h3>
            <p className="text-gray-400 mb-4">
              {footerSection.description}
            </p>
          </div>
          
          {/* Seção de Recursos */}
          {footerSection.showFeaturesSection && (
            <div>
              <h4 className="font-semibold mb-4">{footerSection.featuresTitle}</h4>
              <ul className="space-y-2 text-gray-400">
                {footerSection.featuresLinks.showAppointments && (
                  <li>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.featuresLinks.appointments}
                    </button>
                  </li>
                )}
                {footerSection.featuresLinks.showClients && (
                  <li>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.featuresLinks.clients}
                    </button>
                  </li>
                )}
                {footerSection.featuresLinks.showReports && (
                  <li>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.featuresLinks.reports}
                    </button>
                  </li>
                )}
                {footerSection.featuresLinks.showMobile && (
                  <li>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.featuresLinks.mobile}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Seção da Empresa */}
          {footerSection.showCompanySection && (
            <div>
              <h4 className="font-semibold mb-4">{footerSection.companyTitle}</h4>
              <ul className="space-y-2 text-gray-400">
                {footerSection.companyLinks.showTestimonials && (
                  <li>
                    <button 
                      onClick={() => scrollToSection('testimonials')} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.companyLinks.testimonials}
                    </button>
                  </li>
                )}
                {footerSection.companyLinks.showContact && (
                  <li>
                    <button 
                      onClick={() => scrollToSection('contact')} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.companyLinks.contact}
                    </button>
                  </li>
                )}
                {footerSection.companyLinks.showPrivacy && activeLegalLinks.find(link => link.name.toLowerCase().includes('privacidade')) && (
                  <li>
                    <a 
                      href={activeLegalLinks.find(link => link.name.toLowerCase().includes('privacidade'))?.url} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.companyLinks.privacy}
                    </a>
                  </li>
                )}
                {footerSection.companyLinks.showTerms && activeLegalLinks.find(link => link.name.toLowerCase().includes('termo')) && (
                  <li>
                    <a 
                      href={activeLegalLinks.find(link => link.name.toLowerCase().includes('termo'))?.url} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.companyLinks.terms}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Seção de Suporte */}
          {footerSection.showSupportSection && (
            <div>
              <h4 className="font-semibold mb-4">{footerSection.supportTitle}</h4>
              <ul className="space-y-2 text-gray-400">
                {footerSection.supportLinks.showHelp && activeLegalLinks.find(link => link.name.toLowerCase().includes('ajuda')) && (
                  <li>
                    <a 
                      href={activeLegalLinks.find(link => link.name.toLowerCase().includes('ajuda'))?.url} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.supportLinks.help}
                    </a>
                  </li>
                )}
                {footerSection.supportLinks.showLogin && (
                  <li>
                    <button 
                      onClick={() => setIsLoginOpen(true)} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.supportLinks.login}
                    </button>
                  </li>
                )}
                {footerSection.supportLinks.showTraining && (
                  <li>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.supportLinks.training}
                    </button>
                  </li>
                )}
                {footerSection.supportLinks.showGetStarted && (
                  <li>
                    <button 
                      onClick={() => scrollToSection('plans')} 
                      className="hover:text-white transition-colors"
                    >
                      {footerSection.supportLinks.getStarted}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Seção de Redes Sociais - quinta coluna */}
          {footerSection.showSocialSection && activeSocialNetworks.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4">{footerSection.socialTitle}</h4>
              <div className="flex flex-col space-y-3">
                {activeSocialNetworks.map((network) => {
                  const IconComponent = getIconComponent(network.icon);
                  return (
                    <a
                      key={network.id}
                      href={network.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors flex-shrink-0">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="text-sm">{network.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {companyInfo.companyName || companyName}. {footerSection.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
