
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLandingConfig } from '@/contexts/LandingConfigContext';
import { Plan } from '@/types/landingConfig';
import { toast } from 'sonner';

// Components
import HeaderSection from '@/components/Landing/HeaderSection';
import HeroSection from '@/components/Landing/HeroSection';
import FeaturesSection from '@/components/Landing/FeaturesSection';
import PlansSection from '@/components/Landing/PlansSection';
import TestimonialsSection from '@/components/Landing/TestimonialsSection';
import ContactSection from '@/components/Landing/ContactSection';
import FooterSection from '@/components/Landing/FooterSection';
import LoginDialog from '@/components/Landing/LoginDialog';
import SignupDialog from '@/components/Landing/SignupDialog';

const LandingPage = () => {
  // Use plans directly from DataContext and configurations from LandingConfigContext
  const { createCompanyUser } = useAuth();
  const {
    heroSection,
    aboutSection,
    companyInfo,
    ctaSection
  } = useLandingConfig();
  
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    planId: '',
    billingType: 'monthly' as 'monthly' | 'annual'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      toast.success('Login realizado com sucesso!');
      setIsLoginOpen(false);
      if (loginForm.email.includes('admin')) {
        navigate('/admin');
      } else if (loginForm.email.includes('profissional')) {
        navigate('/profissional');
      } else {
        navigate('/empresa');
      }
    } else {
      toast.error('Preencha todos os campos');
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setSignupForm({ ...signupForm, planId: plan.id, billingType: isAnnualBilling ? 'annual' : 'monthly' });
    setIsSignupOpen(true);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.companyName || !signupForm.ownerName || !signupForm.email || !signupForm.phone || !signupForm.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (signupForm.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      toast.loading('Criando sua conta...');
      
      // Criar usuário e empresa automaticamente
      const success = await createCompanyUser({
        companyName: signupForm.companyName,
        ownerName: signupForm.ownerName,
        email: signupForm.email,
        phone: signupForm.phone,
        password: signupForm.password,
        planId: signupForm.planId,
        billingType: signupForm.billingType
      });

      if (success) {
        toast.dismiss();
        toast.success('Conta criada com sucesso! Bem-vindo ao OKAgendei!');
        setIsSignupOpen(false);
        // Redirecionar para o painel da empresa
        navigate('/empresa');
      } else {
        toast.dismiss();
        toast.error('Este e-mail já está em uso. Tente outro e-mail.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao criar conta. Tente novamente.');
      console.error('Erro no cadastro:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const getPlanPrice = (plan: Plan) => {
    return plan.price;
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderSection
        companyName={companyInfo.companyName}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsLoginOpen={setIsLoginOpen}
        scrollToSection={scrollToSection}
      />

      <HeroSection
        heroConfig={heroSection}
        scrollToSection={scrollToSection}
        setIsLoginOpen={setIsLoginOpen}
      />

      <FeaturesSection aboutConfig={aboutSection} />

      <PlansSection
        plans={heroSection.plans || []}
        isAnnualBilling={isAnnualBilling}
        setIsAnnualBilling={setIsAnnualBilling}
        handlePlanSelect={handlePlanSelect}
      />

      <TestimonialsSection />

      <ContactSection 
        scrollToSection={scrollToSection} 
        ctaConfig={ctaSection}
      />

      <FooterSection
        companyName={companyInfo.companyName}
        scrollToSection={scrollToSection}
        setIsLoginOpen={setIsLoginOpen}
      />

      <LoginDialog
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        onSubmit={handleLogin}
      />

      <SignupDialog
        isOpen={isSignupOpen}
        onOpenChange={setIsSignupOpen}
        selectedPlan={selectedPlan}
        isAnnualBilling={isAnnualBilling}
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        onSubmit={handleSignup}
        getPlanPrice={getPlanPrice}
      />
    </div>
  );
};

export default LandingPage;
