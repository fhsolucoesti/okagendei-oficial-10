
import { useState, useEffect } from 'react';
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
import { loadAllConfigurations, saveAllConfigurations as saveConfigs } from '@/utils/landingConfigStorage';

export const useLandingConfigState = () => {
  const [heroSection, setHeroSection] = useState<HeroSection>({
    title: 'Sistema de Agendamento Online',
    subtitle: 'Gerencie seus agendamentos de forma simples e eficiente com nossa plataforma completa.',
    image: '',
    ctaButtonText: 'Começar Teste Grátis',
    ctaText: 'Começar Teste Grátis',
    ctaButtonColor: 'blue',
    secondaryButtonText: 'Ver Planos',
    navigationSettings: {
      items: [
        { id: '1', name: 'Recursos', action: 'features', isActive: true, order: 0 },
        { id: '2', name: 'Planos', action: 'plans', isActive: true, order: 1 },
        { id: '3', name: 'Depoimentos', action: 'testimonials', isActive: true, order: 2 },
        { id: '4', name: 'Contato', action: 'contact', isActive: true, order: 3 }
      ],
      showLoginButton: true,
      showSignupButton: true,
      loginButtonText: 'Entrar',
      signupButtonText: 'Começar Grátis',
      loginButtonBackgroundColor: '#10b981',
      loginButtonTextColor: '#ffffff',
      signupButtonBackgroundColor: '#f97316',
      signupButtonTextColor: '#ffffff'
    },
    logoImage: '',
    backgroundImage: '',
    showTrialBadge: false,
    trialText: '🆓 Teste Grátis por 7 Dias',
    trialDescription: 'Experimente todos os recursos sem pagar nada. Cancele quando quiser.',
    elements: [],
    highlightItems: [],
    customStyles: {
      heroBackground: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
      badgeColors: {
        background: '#dcfce7',
        text: '#166534'
      }
    }
  });

  const [aboutSection, setAboutSection] = useState<AboutSection>({
    title: 'Por que escolher OKAgendei?',
    subtitle: 'Nosso sistema oferece tudo que você precisa para gerenciar seu negócio de forma eficiente e sem complicações.',
    features: [
      {
        id: '1',
        title: 'Agendamento Simplificado',
        description: 'Agende e gerencie seus compromissos de forma rápida e fácil, diretamente do seu computador ou celular.',
        icon: 'calendar',
        isActive: true
      },
      {
        id: '2',
        title: 'Lembretes Automáticos',
        description: 'Reduza o número de faltas com lembretes automáticos enviados por SMS e e-mail para seus clientes.',
        icon: 'bell',
        isActive: true
      },
      {
        id: '3',
        title: 'Gestão Financeira',
        description: 'Controle suas finanças, registre pagamentos e acompanhe seu fluxo de caixa de forma organizada.',
        icon: 'dollar-sign',
        isActive: true
      }
    ]
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: 'Sistema de Agendamento',
    companyDescription: 'Plataforma completa para gerenciar agendamentos e clientes.',
    companyLogo: '',
    companyEmail: 'contato@empresa.com',
    companyPhone: '',
    companyAddress: ''
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    socialNetworks: []
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [legalLinks, setLegalLinks] = useState<LegalLinks>({
    termsOfService: '/terms',
    privacyPolicy: '/privacy',
    cookiePolicy: '/cookies',
    legalLinks: []
  });

  const [promotionalSettings, setPromotionalSettings] = useState<PromotionalSettings>({
    discountPercentage: 20,
    couponCode: 'DESCONTO20',
    active: false,
    showAnnualDiscount: true,
    annualDiscountPercentage: 20,
    discountBadgeText: 'Economize 20%',
    showFreeTrial: true,
    freeTrialDays: 7,
    trialText: '7 dias grátis'
  });

  const [ctaSection, setCtaSection] = useState<CtaSection>({
    title: 'Pronto para começar?',
    subtitle: 'Experimente OKAgendei e veja como podemos ajudar você a simplificar sua gestão e aumentar seus resultados.',
    buttonText: 'Começar Teste Grátis',
    buttonLink: '/signup',
    image: '',
    enabled: true,
    buttonAction: 'plans',
    backgroundColor: 'blue',
    showIcon: true
  });

  const [footerSection, setFooterSection] = useState<FooterSection>({
    aboutUsText: 'Sobre nós',
    contactInfoText: 'Informações de contato',
    copyrightText: 'Todos os direitos reservados.',
    enabled: true,
    description: 'Sistema de agendamento online que simplifica a gestão do seu negócio.',
    showFeaturesSection: true,
    featuresTitle: 'Recursos',
    featuresLinks: {
      showAppointments: true,
      appointments: 'Agendamentos',
      showClients: true,
      clients: 'Clientes',
      showReports: true,
      reports: 'Relatórios',
      showMobile: true,
      mobile: 'App Mobile'
    },
    showCompanySection: true,
    companyTitle: 'Empresa',
    companyLinks: {
      showTestimonials: true,
      testimonials: 'Depoimentos',
      showContact: true,
      contact: 'Contato',
      showPrivacy: true,
      privacy: 'Privacidade',
      showTerms: true,
      terms: 'Termos'
    },
    showSupportSection: true,
    supportTitle: 'Suporte',
    supportLinks: {
      showHelp: true,
      help: 'Ajuda',
      showLogin: true,
      login: 'Entrar',
      showTraining: true,
      training: 'Treinamento',
      showGetStarted: true,
      getStarted: 'Começar'
    },
    showSocialSection: true,
    socialTitle: 'Redes Sociais'
  });

  const [planSettings, setPlanSettings] = useState<PlanSettings>({
    highlightedPlan: 'premium',
    popularBadgeText: 'Mais Popular',
    planSectionTitle: 'Escolha o plano ideal para seu negócio',
    planSectionSubtitle: 'Planos flexíveis que crescem com seu negócio. Comece grátis e atualize quando precisar.',
    highlightPopularPlan: true
  });

  const [signupSettings, setSignupSettings] = useState<SignupSettings>({
    title: 'Começar Teste Grátis',
    subtitle: 'Experimente todos os recursos sem compromisso',
    trialDays: 7,
    trialBadgeText: '🆓 Teste Grátis por 7 Dias',
    trialDescription: 'Experimente todos os recursos sem pagar nada durante 7 dias.',
    benefitsTitle: 'Teste Sem Riscos',
    benefits: [
      '7 dias completamente grátis',
      'Acesso a todos os recursos',
      'Cancele a qualquer momento',
      'Sem compromisso ou multa'
    ],
    billingInfoTitle: 'Informação sobre Cobrança',
    billingInfoDescription: 'Não será cobrado nada durante o período de teste. Após 7 dias, caso continue, será cobrado via Mercado Pago.',
    submitButtonText: 'Começar Teste Grátis de 7 Dias',
    formFields: {
      companyName: {
        label: 'Nome da Empresa',
        placeholder: 'Salão Beleza',
        required: true,
        visible: true
      },
      ownerName: {
        label: 'Nome do Responsável',
        placeholder: 'Maria Silva',
        required: true,
        visible: true
      },
      email: {
        label: 'E-mail',
        placeholder: 'contato@salaobeleza.com',
        required: true,
        visible: true
      },
      phone: {
        label: 'Telefone',
        placeholder: '(11) 99999-9999',
        required: true,
        visible: true
      },
      password: {
        label: 'Criar Senha',
        placeholder: 'Digite sua senha',
        required: true,
        visible: true,
        helpText: 'Mínimo de 6 caracteres'
      }
    },
    termsOfUse: {
      enabled: false,
      title: 'Termos de Uso',
      content: 'Ao usar nosso serviço, você concorda com nossos termos e condições...',
      checkboxText: 'Aceito os termos de uso',
      linkText: 'Ver termos completos'
    }
  });

  const reloadConfigurations = () => {
    const configs = loadAllConfigurations();
    setHeroSection(configs.heroSection || heroSection);
    setAboutSection(configs.aboutSection || aboutSection);
    setCompanyInfo(configs.companyInfo || companyInfo);
    setSocialLinks(configs.socialLinks || socialLinks);
    setTestimonials(configs.testimonials || testimonials);
    setLegalLinks(configs.legalLinks || legalLinks);
    setPromotionalSettings(configs.promotionalSettings || promotionalSettings);
    setCtaSection(configs.ctaSection || ctaSection);
    setFooterSection(configs.footerSection || footerSection);
    setPlanSettings(configs.planSettings || planSettings);
    setSignupSettings(configs.signupSettings || signupSettings);
  };

  useEffect(() => {
    reloadConfigurations();
  }, []);

  const saveAllConfigurations = () => {
    saveConfigs({
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
    });
  };

  return {
    heroSection,
    setHeroSection,
    aboutSection,
    setAboutSection,
    companyInfo,
    setCompanyInfo,
    socialLinks,
    setSocialLinks,
    testimonials,
    setTestimonials,
    legalLinks,
    setLegalLinks,
    promotionalSettings,
    setPromotionalSettings,
    ctaSection,
    setCtaSection,
    footerSection,
    setFooterSection,
    planSettings,
    setPlanSettings,
    signupSettings,
    setSignupSettings,
    saveAllConfigurations,
    reloadConfigurations
  };
};
