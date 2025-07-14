
import React from 'react';
import { Calendar, Users, BarChart3, Smartphone, Shield, Zap, Clock, Star, Heart, Check } from 'lucide-react';
import { AboutSection } from '@/types/landingConfig';

interface FeaturesSectionProps {
  aboutConfig: AboutSection;
}

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    calendar: Calendar,
    users: Users,
    chart: BarChart3,
    smartphone: Smartphone,
    shield: Shield,
    zap: Zap,
    clock: Clock,
    star: Star,
    heart: Heart,
    check: Check
  };
  
  return icons[iconName] || Zap;
};

const FeaturesSection = ({ aboutConfig }: FeaturesSectionProps) => {
  // Usar recursos dinâmicos filtrando apenas os ativos
  const features = aboutConfig.features.filter(feature => feature.isActive !== false);

  return (
    <section id="features" className="py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {aboutConfig.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutConfig.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => {
            const IconComponent = getIconComponent(feature.icon);
            return (
              <div key={feature.id} className="text-center group">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
