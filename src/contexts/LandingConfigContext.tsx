import React, { createContext, useContext, ReactNode } from 'react';
import { useData } from './DataContext';
import {
  HeroSection,
  AboutSection,
  CompanyInfo,
  SocialLinks,
  Testimonial,
  LegalLinks,
  PromotionalSettings,
  CtaSection,
  FooterSection,
  PlanSettings,
  SignupSettings
} from '@/types/landingConfig';
import { useLandingConfigState } from '@/hooks/useLandingConfigState';
import { useLandingConfigAutoSave } from '@/hooks/useLandingConfigAutoSave';

interface LandingConfigContextType {
  // Hero Section
  heroSection: HeroSection;
  setHeroSection: (section: HeroSection) => void;
  
  // About Section
  aboutSection: AboutSection;
  setAboutSection: (section: AboutSection) => void;
  
  // Company Info
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
  
  // Social Links
  socialLinks: SocialLinks;
  setSocialLinks: (links: SocialLinks) => void;
  
  // Testimonials
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  
  // Legal Links
  legalLinks: LegalLinks;
  setLegalLinks: (links: LegalLinks) => void;
  
  // Promotional Settings
  promotionalSettings: PromotionalSettings;
  setPromotionalSettings: (settings: PromotionalSettings) => void;
  
  // CTA Section
  ctaSection: CtaSection;
  setCtaSection: (section: CtaSection) => void;
  
  // Footer Section
  footerSection: FooterSection;
  setFooterSection: (section: FooterSection) => void;
  
  // Plan Settings
  planSettings: PlanSettings;
  setPlanSettings: (settings: PlanSettings) => void;
  
  // Signup Settings
  signupSettings: SignupSettings;
  setSignupSettings: (settings: SignupSettings) => void;
  
  // Save all configurations
  saveAllConfigurations: () => void;
  
  // Reload configurations
  reloadConfigurations: () => void;
}

const LandingConfigContext = createContext<LandingConfigContextType | undefined>(undefined);

export const useLandingConfig = () => {
  const context = useContext(LandingConfigContext);
  if (!context) {
    throw new Error('useLandingConfig must be used within a LandingConfigProvider');
  }
  return context;
};

interface LandingConfigProviderProps {
  children: ReactNode;
}

export const LandingConfigProvider = ({ children }: LandingConfigProviderProps) => {
  const { plans } = useData();
  
  // Use custom hooks for state management
  const configState = useLandingConfigState();
  const { saveAllConfigurations } = useLandingConfigAutoSave(configState);

  return (
    <LandingConfigContext.Provider
      value={{
        ...configState,
        saveAllConfigurations
      }}
    >
      {children}
    </LandingConfigContext.Provider>
  );
};
