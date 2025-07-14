
import { useEffect } from 'react';
import { saveLandingConfig } from '@/utils/landingConfigStorage';
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

interface UseLandingConfigAutoSaveProps {
  heroSection: HeroSection;
  aboutSection: AboutSection;
  companyInfo: CompanyInfo;
  socialLinks: SocialLinks;
  testimonials: Testimonial[];
  legalLinks: LegalLinks;
  promotionalSettings: PromotionalSettings;
  ctaSection: CtaSection;
  footerSection: FooterSection;
  planSettings: PlanSettings;
  signupSettings: SignupSettings;
}

export const useLandingConfigAutoSave = ({
  heroSection,
  aboutSection,
  companyInfo,
  socialLinks,
  testimonials,
  legalLinks,
  promotionalSettings,
  ctaSection,
  footerSection,
  planSettings,
  signupSettings
}: UseLandingConfigAutoSaveProps) => {
  // Auto-save configurations when they change
  useEffect(() => {
    saveLandingConfig('heroSection', heroSection);
  }, [heroSection]);

  useEffect(() => {
    saveLandingConfig('aboutSection', aboutSection);
  }, [aboutSection]);

  useEffect(() => {
    saveLandingConfig('companyInfo', companyInfo);
  }, [companyInfo]);

  useEffect(() => {
    saveLandingConfig('socialLinks', socialLinks);
  }, [socialLinks]);

  useEffect(() => {
    saveLandingConfig('testimonials', testimonials);
  }, [testimonials]);

  useEffect(() => {
    saveLandingConfig('legalLinks', legalLinks);
  }, [legalLinks]);

  useEffect(() => {
    saveLandingConfig('promotionalSettings', promotionalSettings);
  }, [promotionalSettings]);

  useEffect(() => {
    saveLandingConfig('ctaSection', ctaSection);
  }, [ctaSection]);

  useEffect(() => {
    saveLandingConfig('footerSection', footerSection);
  }, [footerSection]);

  useEffect(() => {
    saveLandingConfig('planSettings', planSettings);
  }, [planSettings]);

  useEffect(() => {
    saveLandingConfig('signupSettings', signupSettings);
  }, [signupSettings]);

  // Function to save all configurations at once
  const saveAllConfigurations = () => {
    saveLandingConfig('heroSection', heroSection);
    saveLandingConfig('aboutSection', aboutSection);
    saveLandingConfig('companyInfo', companyInfo);
    saveLandingConfig('socialLinks', socialLinks);
    saveLandingConfig('testimonials', testimonials);
    saveLandingConfig('legalLinks', legalLinks);
    saveLandingConfig('promotionalSettings', promotionalSettings);
    saveLandingConfig('ctaSection', ctaSection);
    saveLandingConfig('footerSection', footerSection);
    saveLandingConfig('planSettings', planSettings);
    saveLandingConfig('signupSettings', signupSettings);
    console.log('Todas as configurações foram salvas');
  };

  return { saveAllConfigurations };
};
