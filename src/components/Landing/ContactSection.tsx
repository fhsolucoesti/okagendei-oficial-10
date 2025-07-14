
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CtaSection } from '@/types/landingConfig';

interface ContactSectionProps {
  scrollToSection: (sectionId: string) => void;
  ctaConfig: CtaSection;
}

const ContactSection = ({ scrollToSection, ctaConfig }: ContactSectionProps) => {
  if (!ctaConfig.enabled) {
    return null; // Não renderizar se estiver desabilitado
  }

  const handleButtonClick = () => {
    switch (ctaConfig.buttonAction) {
      case 'plans':
        scrollToSection('plans');
        break;
      case 'signup':
        // Aqui você pode implementar a lógica para abrir o modal de cadastro
        scrollToSection('plans');
        break;
      case 'contact':
        scrollToSection('contact');
        break;
      default:
        scrollToSection('plans');
    }
  };

  const getBackgroundClasses = () => {
    switch (ctaConfig.backgroundColor) {
      case 'blue':
        return 'bg-gradient-to-br from-blue-600 to-indigo-700';
      case 'indigo':
        return 'bg-gradient-to-br from-indigo-600 to-purple-700';
      case 'purple':
        return 'bg-gradient-to-br from-purple-600 to-pink-700';
      case 'green':
        return 'bg-gradient-to-br from-green-600 to-emerald-700';
      default:
        return 'bg-gradient-to-br from-blue-600 to-indigo-700';
    }
  };

  return (
    <section id="contact" className={`py-12 lg:py-20 ${getBackgroundClasses()}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {ctaConfig.title}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {ctaConfig.subtitle}
        </p>
        <Button 
          size="lg"
          onClick={handleButtonClick}
          className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4"
        >
          {ctaConfig.buttonText}
          {ctaConfig.showIcon && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </section>
  );
};

export default ContactSection;
