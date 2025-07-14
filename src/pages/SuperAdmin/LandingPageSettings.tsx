
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Layout/Header';
import { useLandingConfig } from '@/contexts/LandingConfigContext';

// Import tab components
import HeroTab from '@/components/SuperAdmin/LandingTabs/HeroTab';
import AboutTab from '@/components/SuperAdmin/LandingTabs/AboutTab';
import CtaTab from '@/components/SuperAdmin/LandingTabs/CtaTab';
import CompanyTab from '@/components/SuperAdmin/LandingTabs/CompanyTab';
import SocialTab from '@/components/SuperAdmin/LandingTabs/SocialTab';
import FooterTab from '@/components/SuperAdmin/LandingTabs/FooterTab';
import SignupTab from '@/components/SuperAdmin/LandingTabs/SignupTab';
import {
  TestimonialsTab,
  LegalTab,
  PromotionalTab
} from '@/components/SuperAdmin/LandingTabs/OtherTabs';

const LandingPageSettings = () => {
  const {
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
    signupSettings,
    setSignupSettings
  } = useLandingConfig();

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Configurar Landing Page" subtitle="Gerencie o conteúdo da página inicial" />
      
      <main className="p-6">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="hero">Principal</TabsTrigger>
            <TabsTrigger value="about">Recursos</TabsTrigger>
            <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
            <TabsTrigger value="cta">Call-to-Action</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
            <TabsTrigger value="footer">Rodapé</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="legal">Links</TabsTrigger>
            <TabsTrigger value="promotional">Promoções</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <HeroTab heroSection={heroSection} setHeroSection={setHeroSection} />
          </TabsContent>

          <TabsContent value="about">
            <AboutTab aboutSection={aboutSection} setAboutSection={setAboutSection} />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsTab testimonials={testimonials} setTestimonials={setTestimonials} />
          </TabsContent>

          <TabsContent value="cta">
            <CtaTab ctaSection={ctaSection} setCtaSection={setCtaSection} />
          </TabsContent>

          <TabsContent value="signup">
            <SignupTab signupSettings={signupSettings} setSignupSettings={setSignupSettings} />
          </TabsContent>

          <TabsContent value="footer">
            <FooterTab footerSection={footerSection} setFooterSection={setFooterSection} />
          </TabsContent>

          <TabsContent value="company">
            <CompanyTab companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
          </TabsContent>

          <TabsContent value="social">
            <SocialTab socialLinks={socialLinks} setSocialLinks={setSocialLinks} />
          </TabsContent>

          <TabsContent value="legal">
            <LegalTab legalLinks={legalLinks} setLegalLinks={setLegalLinks} />
          </TabsContent>

          <TabsContent value="promotional">
            <PromotionalTab 
              promotionalSettings={promotionalSettings} 
              setPromotionalSettings={setPromotionalSettings} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LandingPageSettings;
