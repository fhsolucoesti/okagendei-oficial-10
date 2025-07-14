
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

interface AllConfigurations {
  heroSection?: HeroSection;
  aboutSection?: AboutSection;
  companyInfo?: CompanyInfo;
  socialLinks?: SocialLinks;
  testimonials?: Testimonial[];
  legalLinks?: LegalLinks;
  promotionalSettings?: PromotionalSettings;
  ctaSection?: CtaSection;
  footerSection?: FooterSection;
  planSettings?: PlanSettings;
  signupSettings?: SignupSettings;
}

export const saveAllConfigurations = (configs: AllConfigurations) => {
  try {
    localStorage.setItem('landingPageConfigurations', JSON.stringify(configs));
    console.log('✅ Todas as configurações salvas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error);
  }
};

export const loadAllConfigurations = (): AllConfigurations => {
  try {
    const saved = localStorage.getItem('landingPageConfigurations');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('📥 Configurações carregadas:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Erro ao carregar configurações:', error);
  }
  
  return {};
};

// Individual save functions for compatibility
export const saveLandingConfig = (key: string, data: any) => {
  try {
    const existing = loadAllConfigurations();
    const updated = { ...existing, [key]: data };
    saveAllConfigurations(updated);
    console.log(`✅ ${key} configuração salva com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao salvar ${key}:`, error);
  }
};

export const saveHeroConfig = (heroSection: HeroSection) => {
  saveLandingConfig('heroSection', heroSection);
};

export const saveCompanyConfig = (companyInfo: CompanyInfo) => {
  saveLandingConfig('companyInfo', companyInfo);
};

export const saveCtaConfig = (ctaSection: CtaSection) => {
  saveLandingConfig('ctaSection', ctaSection);
};
