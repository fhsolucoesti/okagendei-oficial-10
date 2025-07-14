
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useLandingConfig } from '@/contexts/LandingConfigContext';

interface PlatformConfig {
  menuLogo?: string;
  menuPlatformName?: string;
  menuTextColor?: string;
  loginButtonText?: string;
  loginButtonBackgroundColor?: string;
  loginButtonTextColor?: string;
}

interface HeaderSectionProps {
  companyName: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setIsLoginOpen: (open: boolean) => void;
  scrollToSection: (sectionId: string) => void;
}

const HeaderSection = ({ 
  companyName, 
  isMenuOpen, 
  setIsMenuOpen, 
  setIsLoginOpen, 
  scrollToSection 
}: HeaderSectionProps) => {
  const { companyInfo, heroSection } = useLandingConfig();
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    menuPlatformName: 'OKAgendei',
    menuTextColor: '#1f2937',
    loginButtonText: 'Entrar',
    loginButtonBackgroundColor: '#ffffff',
    loginButtonTextColor: '#374151'
  });

  // Carregar configurações da plataforma
  useEffect(() => {
    const loadPlatformConfig = () => {
      const savedConfig = localStorage.getItem('platformConfig');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setPlatformConfig({
          menuLogo: parsed.menuLogo || '',
          menuPlatformName: parsed.menuPlatformName || 'OKAgendei',
          menuTextColor: parsed.menuTextColor || '#1f2937',
          loginButtonText: parsed.loginButtonText || 'Entrar',
          loginButtonBackgroundColor: parsed.loginButtonBackgroundColor || '#ffffff',
          loginButtonTextColor: parsed.loginButtonTextColor || '#374151'
        });
      }
    };

    loadPlatformConfig();

    // Escutar mudanças nas configurações
    const handleConfigUpdate = (event: CustomEvent) => {
      const config = event.detail;
      setPlatformConfig({
        menuLogo: config.menuLogo || '',
        menuPlatformName: config.menuPlatformName || 'OKAgendei',
        menuTextColor: config.menuTextColor || '#1f2937',
        loginButtonText: config.loginButtonText || 'Entrar',
        loginButtonBackgroundColor: config.loginButtonBackgroundColor || '#ffffff',
        loginButtonTextColor: config.loginButtonTextColor || '#374151'
      });
    };

    window.addEventListener('platformConfigUpdated', handleConfigUpdate as EventListener);

    return () => {
      window.removeEventListener('platformConfigUpdated', handleConfigUpdate as EventListener);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection(sectionId);
    }
    setIsMenuOpen(false); // Close mobile menu when navigating
  };

  // Get navigation settings with fallback
  const navigationSettings = heroSection.navigationSettings || {
    items: [
      { id: '1', name: 'Recursos', action: 'features', isActive: true, order: 0 },
      { id: '2', name: 'Planos', action: 'plans', isActive: true, order: 1 },
      { id: '3', name: 'Depoimentos', action: 'testimonials', isActive: true, order: 2 },
      { id: '4', name: 'Contato', action: 'contact', isActive: true, order: 3 }
    ],
    showLoginButton: true,
    showSignupButton: true,
    loginButtonText: 'Entrar',
    signupButtonText: 'Começar Grátis'
  };

  // Filter and sort active navigation items
  const activeNavItems = navigationSettings.items
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order);

  // Usar cores personalizadas para os botões
  const loginButtonStyle = {
    backgroundColor: navigationSettings.loginButtonBackgroundColor || '#10b981',
    color: navigationSettings.loginButtonTextColor || '#ffffff',
    border: `1px solid ${navigationSettings.loginButtonBackgroundColor || '#10b981'}`
  };
  
  const signupButtonStyle = {
    backgroundColor: navigationSettings.signupButtonBackgroundColor || '#f97316',
    color: navigationSettings.signupButtonTextColor || '#ffffff',
    border: `1px solid ${navigationSettings.signupButtonBackgroundColor || '#f97316'}`
  };

  // Determinar qual logo e nome usar (prioridade: hero > plataforma > padrão)
  const displayLogo = heroSection.logoImage || platformConfig.menuLogo;
  const displayName = companyInfo.companyName || platformConfig.menuPlatformName || companyName;

  // Usar texto personalizado do botão Entrar
  const loginButtonText = platformConfig.loginButtonText || navigationSettings.loginButtonText;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center space-x-3">
            {displayLogo && (
              <img 
                src={displayLogo} 
                alt="Logo" 
                className="h-8 lg:h-10 w-auto object-contain max-w-[120px]"
              />
            )}
            <span 
              className="text-xl lg:text-2xl font-bold"
              style={{ color: platformConfig.menuTextColor }}
            >
              {displayName}
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {activeNavItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.action)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </button>
            ))}
            {navigationSettings.showLoginButton && (
              <Button 
                onClick={() => setIsLoginOpen(true)} 
                style={loginButtonStyle}
              >
                {loginButtonText}
              </Button>
            )}
            {navigationSettings.showSignupButton && (
              <Button 
                onClick={() => handleNavClick('plans')}
                style={signupButtonStyle}
              >
                {navigationSettings.signupButtonText}
              </Button>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {activeNavItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.action)}
                  className="text-left text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {navigationSettings.showLoginButton && (
                  <Button 
                    onClick={() => setIsLoginOpen(true)} 
                    className="w-full"
                    style={loginButtonStyle}
                  >
                    {loginButtonText}
                  </Button>
                )}
                {navigationSettings.showSignupButton && (
                  <Button 
                    onClick={() => handleNavClick('plans')} 
                    className="w-full"
                    style={signupButtonStyle}
                  >
                    {navigationSettings.signupButtonText}
                  </Button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default HeaderSection;
