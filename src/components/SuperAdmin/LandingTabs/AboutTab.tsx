
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AboutSection } from '@/types/landingConfig';
import { saveLandingConfig } from '@/utils/landingConfigStorage';
import FeatureManager from './FeatureManager';

interface AboutTabProps {
  aboutSection: AboutSection;
  setAboutSection: (section: AboutSection) => void;
}

const AboutTab = ({ aboutSection, setAboutSection }: AboutTabProps) => {
  const handleInputChange = (field: keyof AboutSection, value: string) => {
    setAboutSection({
      ...aboutSection,
      [field]: value
    });
  };

  const handleFeaturesUpdate = (features: any[]) => {
    setAboutSection({
      ...aboutSection,
      features: features
    });
  };

  const handleSave = () => {
    saveLandingConfig('about', aboutSection);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seção Recursos/Sobre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título Principal</Label>
            <Input
              id="title"
              value={aboutSection.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Textarea
              id="subtitle"
              value={aboutSection.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Recursos</CardTitle>
          <CardDescription>
            Adicione, edite ou remova recursos que serão exibidos na seção sobre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureManager
            features={aboutSection.features || []}
            onUpdate={handleFeaturesUpdate}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
        Salvar Configurações
      </Button>
    </div>
  );
};

export default AboutTab;
