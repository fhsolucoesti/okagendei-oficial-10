import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Gift, BarChart3, Star, Shield, Users, Zap, Heart } from 'lucide-react';
import { HeroSection as HeroSectionType } from '@/types/landingConfig';

interface HeroSectionProps {
  heroConfig: HeroSectionType;
  scrollToSection: (sectionId: string) => void;
  setIsLoginOpen: (open: boolean) => void;
}

const HeroSection = ({ heroConfig, scrollToSection, setIsLoginOpen }: HeroSectionProps) => {
  // Mapeamento de cores para classes CSS
  const getButtonColorClass = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      red: 'bg-red-600 hover:bg-red-700',
      orange: 'bg-orange-600 hover:bg-orange-700',
      indigo: 'bg-indigo-600 hover:bg-indigo-700',
      pink: 'bg-pink-600 hover:bg-pink-700',
      gray: 'bg-gray-600 hover:bg-gray-700'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-blue-600 hover:bg-blue-700';
  };

  // Função para renderizar elementos dinâmicos
  const renderHeroElement = (element: any) => {
    if (!element.isActive) return null;

    const baseStyles = `${element.styles?.fontSize || ''} ${element.styles?.fontWeight || ''}`;
    const customColor = element.styles?.color;
    const customBg = element.styles?.backgroundColor;

    const style: React.CSSProperties = {
      ...(customColor && { color: customColor }),
      ...(customBg && { backgroundColor: customBg })
    };

    switch (element.type) {
      case 'title':
        return (
          <h1 key={element.id} className={`${baseStyles} mb-4 lg:mb-6`} style={style}>
            {element.content}
          </h1>
        );
      case 'subtitle':
        return (
          <p key={element.id} className={`${baseStyles} mb-6 lg:mb-8`} style={style}>
            {element.content}
          </p>
        );
      case 'cta':
        return (
          <Button 
            key={element.id}
            size="lg" 
            onClick={() => scrollToSection('plans')}
            className={`${baseStyles} px-6 lg:px-8 py-3 lg:py-4 ${getButtonColorClass(heroConfig.ctaButtonColor)}`}
            style={style}
          >
            {element.content}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        );
      case 'secondary-cta':
        return (
          <Button 
            key={element.id}
            variant="outline" 
            size="lg"
            onClick={() => setIsLoginOpen(true)}
            className={`${baseStyles} px-6 lg:px-8 py-3 lg:py-4`}
            style={style}
          >
            {element.content}
          </Button>
        );
      case 'feature-badge':
        return (
          <Badge key={element.id} className={baseStyles} style={style}>
            {element.content}
          </Badge>
        );
      default:
        return null;
    }
  };

  // Função para obter o componente do ícone
  const getIconComponent = (iconName: string) => {
    const iconMap = {
      check: Check,
      star: Star,
      gift: Gift,
      shield: Shield,
      users: Users,
      zap: Zap,
      heart: Heart
    };
    return iconMap[iconName as keyof typeof iconMap] || Check;
  };

  // Aplicar estilos customizados
  const heroBackgroundStyle = heroConfig.customStyles?.heroBackground || 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
  const badgeStyle = {
    backgroundColor: heroConfig.customStyles?.badgeColors?.background || '#dcfce7',
    color: heroConfig.customStyles?.badgeColors?.text || '#166534'
  };

  // Separar elementos por tipo
  const titleElements = heroConfig.elements?.filter(el => el.type === 'title' && el.isActive) || [];
  const subtitleElements = heroConfig.elements?.filter(el => el.type === 'subtitle' && el.isActive) || [];
  const ctaElements = heroConfig.elements?.filter(el => el.type === 'cta' && el.isActive) || [];
  const secondaryCtaElements = heroConfig.elements?.filter(el => el.type === 'secondary-cta' && el.isActive) || [];
  const badgeElements = heroConfig.elements?.filter(el => el.type === 'feature-badge' && el.isActive) || [];

  // Filtrar e ordenar itens de destaque ativos
  const activeHighlightItems = (heroConfig.highlightItems || [])
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <section 
      className={`pt-20 lg:pt-24 pb-12 lg:pb-20 ${heroBackgroundStyle}`}
      style={heroConfig.backgroundImage ? { 
        backgroundImage: `url(${heroConfig.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* Logo da empresa */}
            {heroConfig.logoImage && (
              <div className="mb-6 flex justify-center lg:justify-start">
                <img 
                  src={heroConfig.logoImage} 
                  alt="Logo" 
                  className="h-12 lg:h-16 object-contain"
                />
              </div>
            )}

            {/* Títulos dinâmicos */}
            {titleElements.length > 0 ? (
              titleElements.map(renderHeroElement)
            ) : (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
                {heroConfig.title}
              </h1>
            )}

            {/* Subtítulos dinâmicos */}
            {subtitleElements.length > 0 ? (
              subtitleElements.map(renderHeroElement)
            ) : (
              <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8">
                {heroConfig.subtitle}
              </p>
            )}

            {/* Badges de recursos dinâmicos */}
            {badgeElements.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                {badgeElements.map(renderHeroElement)}
              </div>
            )}
            
            {/* Banner de Teste Grátis */}
            {heroConfig.showTrialBadge && (
              <div 
                className="border-2 rounded-2xl p-4 mb-6 lg:mb-8"
                style={badgeStyle}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Gift className="h-6 w-6" />
                  <span className="text-lg font-semibold">
                    {heroConfig.trialText}
                  </span>
                </div>
                <p className="text-sm mt-2 opacity-80">
                  Experimente todos os recursos sem pagar nada. Cancele quando quiser.
                </p>
              </div>
            )}
            
            {/* Botões de ação dinâmicos */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {ctaElements.length > 0 ? (
                ctaElements.map(renderHeroElement)
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => scrollToSection('plans')}
                  className={`text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 ${getButtonColorClass(heroConfig.ctaButtonColor)}`}
                >
                  {heroConfig.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              
              {secondaryCtaElements.length > 0 ? (
                secondaryCtaElements.map(renderHeroElement)
              ) : (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setIsLoginOpen(true)}
                  className="text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4"
                >
                  Já tenho conta
                </Button>
              )}
            </div>
            
            {/* Itens de destaque dinâmicos */}
            {activeHighlightItems.length > 0 && (
              <div className="mt-8 lg:mt-12 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                {activeHighlightItems.map((item) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <div key={item.id} className="flex items-center">
                      <IconComponent className="h-4 w-4 text-green-500 mr-2" />
                      {item.title}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-8 mx-auto max-w-md lg:max-w-none">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Agenda de Hoje</h3>
                  <Badge className="bg-green-100 text-green-800">12 agendamentos</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '09:00', client: 'Maria Silva', service: 'Corte + Escova' },
                    { time: '10:30', client: 'João Santos', service: 'Barba + Cabelo' },
                    { time: '14:00', client: 'Ana Costa', service: 'Manicure' }
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {appointment.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{appointment.client}</p>
                        <p className="text-sm text-gray-500 truncate">{appointment.service}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 hidden lg:block">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm font-medium">Cliente confirmado</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 hidden lg:block">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-1 rounded-full">
                  <BarChart3 className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-sm font-medium">+47% este mês</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
