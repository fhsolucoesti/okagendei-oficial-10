
export interface HeroSection {
  title: string;
  subtitle: string;
  image: string;
  ctaButtonText: string;
  ctaText?: string;
  ctaButtonColor?: string;
  secondaryButtonText: string;
  navigationSettings: NavigationSettings;
  logoImage?: string;
  backgroundImage?: string;
  showTrialBadge?: boolean;
  trialText?: string;
  trialDescription?: string;
  elements?: HeroElement[];
  highlightItems?: HighlightItem[];
  customStyles?: CustomStyles;
  colorTheme?: ColorTheme;
  plans?: Plan[];
}

export interface NavigationSettings {
  items: NavigationItem[];
  showLoginButton: boolean;
  showSignupButton: boolean;
  loginButtonText: string;
  signupButtonText: string;
  loginButtonBackgroundColor?: string;
  loginButtonTextColor?: string;
  signupButtonBackgroundColor?: string;
  signupButtonTextColor?: string;
}

export interface NavigationItem {
  id: string;
  name: string;
  action: string;
  isActive: boolean;
  order: number;
}

export interface HeroElement {
  id: string;
  type: 'title' | 'subtitle' | 'cta' | 'secondary-cta' | 'feature-badge';
  content: string;
  isActive: boolean;
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
  };
}

export interface HighlightItem {
  id: string;
  title: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface CustomStyles {
  heroBackground?: string;
  titleGradient?: string;
  ctaGradient?: string;
  cardBackground?: string;
  badgeColors?: {
    background?: string;
    text?: string;
  };
}

export interface ColorTheme {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface AboutSection {
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive?: boolean;
}

export interface CompanyInfo {
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  socialNetworks?: SocialNetwork[];
}

export interface SocialNetwork {
  id: string;
  name: string;
  url: string;
  icon: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  image: string;
  testimonial: string;
  business?: string;
  text?: string;
  rating?: number;
  isActive?: boolean;
}

export interface LegalLinks {
  termsOfService: string;
  privacyPolicy: string;
  cookiePolicy: string;
  legalLinks?: LegalLink[];
}

export interface LegalLink {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export interface PromotionalSettings {
  discountPercentage: number;
  couponCode: string;
  active: boolean;
  showAnnualDiscount?: boolean;
  annualDiscountPercentage?: number;
  discountBadgeText?: string;
  showFreeTrial?: boolean;
  freeTrialDays?: number;
  trialText?: string;
  promotions?: Promotion[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  couponCode: string;
  active: boolean;
  validUntil?: string;
}

export interface CtaSection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  enabled?: boolean;
  buttonAction?: string;
  backgroundColor?: string;
  showIcon?: boolean;
}

export interface FooterSection {
  aboutUsText: string;
  contactInfoText: string;
  copyrightText: string;
  enabled?: boolean;
  description?: string;
  showFeaturesSection?: boolean;
  featuresTitle?: string;
  featuresLinks?: {
    showAppointments?: boolean;
    appointments?: string;
    showClients?: boolean;
    clients?: string;
    showReports?: boolean;
    reports?: string;
    showMobile?: boolean;
    mobile?: string;
  };
  showCompanySection?: boolean;
  companyTitle?: string;
  companyLinks?: {
    showTestimonials?: boolean;
    testimonials?: string;
    showContact?: boolean;
    contact?: string;
    showPrivacy?: boolean;
    privacy?: string;
    showTerms?: boolean;
    terms?: string;
  };
  showSupportSection?: boolean;
  supportTitle?: string;
  supportLinks?: {
    showHelp?: boolean;
    help?: string;
    showLogin?: boolean;
    login?: string;
    showTraining?: boolean;
    training?: string;
    showGetStarted?: boolean;
    getStarted?: string;
  };
  showSocialSection?: boolean;
  socialTitle?: string;
}

export interface PlanSettings {
  highlightedPlan: string;
  popularBadgeText: string;
  planSectionTitle?: string;
  planSectionSubtitle?: string;
  highlightPopularPlan?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  isActive: boolean;
  freeTrial?: number; // dias grátis
}

export interface SignupSettings {
  title: string;
  subtitle: string;
  trialDays: number;
  trialBadgeText: string;
  trialDescription: string;
  benefitsTitle: string;
  benefits: string[];
  billingInfoTitle: string;
  billingInfoDescription: string;
  submitButtonText: string;
  formFields: {
    companyName: {
      label: string;
      placeholder: string;
      required: boolean;
      visible: boolean;
    };
    ownerName: {
      label: string;
      placeholder: string;
      required: boolean;
      visible: boolean;
    };
    email: {
      label: string;
      placeholder: string;
      required: boolean;
      visible: boolean;
    };
    phone: {
      label: string;
      placeholder: string;
      required: boolean;
      visible: boolean;
    };
    password: {
      label: string;
      placeholder: string;
      required: boolean;
      visible: boolean;
      helpText: string;
    };
  };
  termsOfUse: {
    enabled: boolean;
    title: string;
    content: string;
    checkboxText: string;
    linkText: string;
  };
}
