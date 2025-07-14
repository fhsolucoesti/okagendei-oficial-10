
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveLandingConfig } from '@/utils/landingConfigStorage';
import LegalLinkManager from './LegalLinkManager';
import TestimonialManager from './TestimonialManager';
import PromotionManager from './PromotionManager';
import {
  Testimonial,
  LegalLinks,
  PromotionalSettings
} from '@/types/landingConfig';

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
}

export const TestimonialsTab = ({ testimonials, setTestimonials }: TestimonialsTabProps) => {
  const handleSave = () => {
    saveLandingConfig('testimonials', testimonials);
  };

  const handleTestimonialsUpdate = (updatedTestimonials: Testimonial[]) => {
    setTestimonials(updatedTestimonials);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Depoimentos</CardTitle>
          <CardDescription>
            Adicione, edite ou remova depoimentos de clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialManager
            testimonials={testimonials || []}
            onUpdate={handleTestimonialsUpdate}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
        Salvar Depoimentos
      </Button>
    </div>
  );
};

interface LegalTabProps {
  legalLinks: LegalLinks;
  setLegalLinks: (links: LegalLinks) => void;
}

export const LegalTab = ({ legalLinks, setLegalLinks }: LegalTabProps) => {
  const handleSave = () => {
    saveLandingConfig('legal', legalLinks);
  };

  const handleLegalLinksUpdate = (links: any[]) => {
    setLegalLinks({
      ...legalLinks,
      legalLinks: links
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Links Legais</CardTitle>
          <CardDescription>
            Adicione, edite ou remova links legais que podem aparecer no rodapé ou outras seções
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LegalLinkManager
            legalLinks={legalLinks.legalLinks || []}
            onUpdate={handleLegalLinksUpdate}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
        Salvar Configurações de Links
      </Button>
    </div>
  );
};

interface PromotionalTabProps {
  promotionalSettings: PromotionalSettings;
  setPromotionalSettings: (settings: PromotionalSettings) => void;
}

export const PromotionalTab = ({ promotionalSettings, setPromotionalSettings }: PromotionalTabProps) => {
  const handleInputChange = (field: keyof PromotionalSettings, value: string | boolean | number) => {
    setPromotionalSettings({
      ...promotionalSettings,
      [field]: value
    });
  };

  const handlePromotionsUpdate = (promotions: any[]) => {
    setPromotionalSettings({
      ...promotionalSettings,
      promotions: promotions
    });
  };

  const handleSave = () => {
    saveLandingConfig('promotional', promotionalSettings);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Promocionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="showFreeTrial"
              checked={promotionalSettings.showFreeTrial}
              onCheckedChange={(checked) => handleInputChange('showFreeTrial', checked)}
            />
            <Label htmlFor="showFreeTrial">Mostrar Teste Grátis</Label>
          </div>
          {promotionalSettings.showFreeTrial && (
            <div>
              <Label htmlFor="freeTrialDays">Dias de Teste Grátis</Label>
              <Input
                id="freeTrialDays"
                type="number"
                min={0}
                value={promotionalSettings.freeTrialDays}
                onChange={(e) => handleInputChange('freeTrialDays', Number(e.target.value))}
              />
            </div>
          )}
          <div>
            <Label htmlFor="trialText">Texto do Teste Grátis</Label>
            <Input
              id="trialText"
              value={promotionalSettings.trialText}
              onChange={(e) => handleInputChange('trialText', e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showAnnualDiscount"
              checked={promotionalSettings.showAnnualDiscount}
              onCheckedChange={(checked) => handleInputChange('showAnnualDiscount', checked)}
            />
            <Label htmlFor="showAnnualDiscount">Mostrar Desconto Anual</Label>
          </div>
          {promotionalSettings.showAnnualDiscount && (
            <>
              <div>
                <Label htmlFor="annualDiscountPercentage">Percentual de Desconto Anual</Label>
                <Input
                  id="annualDiscountPercentage"
                  type="number"
                  min={0}
                  max={100}
                  value={promotionalSettings.annualDiscountPercentage}
                  onChange={(e) => handleInputChange('annualDiscountPercentage', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="discountBadgeText">Texto do Badge de Desconto</Label>
                <Input
                  id="discountBadgeText"
                  value={promotionalSettings.discountBadgeText}
                  onChange={(e) => handleInputChange('discountBadgeText', e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Promoções</CardTitle>
          <CardDescription>
            Adicione, edite ou remova promoções específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PromotionManager
            promotions={promotionalSettings.promotions || []}
            onUpdate={handlePromotionsUpdate}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Salvar Configurações Promocionais
        </Button>
      </div>
    </div>
  );
};
