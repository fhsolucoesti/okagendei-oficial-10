import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FooterSection } from '@/types/landingConfig';
import { saveLandingConfig } from '@/utils/landingConfigStorage';

interface FooterTabProps {
  footerSection: FooterSection;
  setFooterSection: (section: FooterSection) => void;
}

const FooterTab = ({ footerSection, setFooterSection }: FooterTabProps) => {
  const handleInputChange = (field: keyof FooterSection, value: string | boolean) => {
    setFooterSection({
      ...footerSection,
      [field]: value
    });
  };

  const handleNestedTextChange = (section: 'featuresLinks' | 'companyLinks' | 'supportLinks', field: string, value: string) => {
    const currentSection = footerSection[section] as Record<string, any>;
    setFooterSection({
      ...footerSection,
      [section]: {
        ...currentSection,
        [field]: value
      }
    });
  };

  const handleNestedBooleanChange = (section: 'featuresLinks' | 'companyLinks' | 'supportLinks', field: string, value: boolean) => {
    const currentSection = footerSection[section] as Record<string, any>;
    setFooterSection({
      ...footerSection,
      [section]: {
        ...currentSection,
        [field]: value
      }
    });
  };

  const handleSave = () => {
    saveLandingConfig('footer', footerSection);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Controle do Rodapé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="footerEnabled"
              checked={footerSection.enabled}
              onCheckedChange={(checked) => handleInputChange('enabled', checked)}
            />
            <Label htmlFor="footerEnabled">Ativar rodapé da landing page</Label>
          </div>
        </CardContent>
      </Card>

      {footerSection.enabled && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais do Rodapé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Descrição da Empresa</Label>
                <Textarea
                  id="description"
                  value={footerSection.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrição que aparece abaixo do logo"
                />
              </div>

              <div>
                <Label htmlFor="copyrightText">Texto de Copyright</Label>
                <Input
                  id="copyrightText"
                  value={footerSection.copyrightText}
                  onChange={(e) => handleInputChange('copyrightText', e.target.value)}
                  placeholder="© 2024 {companyName}. Todos os direitos reservados."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seção Recursos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showFeaturesSection"
                  checked={footerSection.showFeaturesSection}
                  onCheckedChange={(checked) => handleInputChange('showFeaturesSection', checked)}
                />
                <Label htmlFor="showFeaturesSection">Mostrar seção de recursos</Label>
              </div>

              {footerSection.showFeaturesSection && (
                <>
                  <div>
                    <Label htmlFor="featuresTitle">Título da Seção</Label>
                    <Input
                      id="featuresTitle"
                      value={footerSection.featuresTitle}
                      onChange={(e) => handleInputChange('featuresTitle', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="appointments">Agendamentos</Label>
                        <Input
                          id="appointments"
                          value={footerSection.featuresLinks.appointments}
                          onChange={(e) => handleNestedTextChange('featuresLinks', 'appointments', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showAppointments"
                          checked={footerSection.featuresLinks.showAppointments}
                          onCheckedChange={(checked) => handleNestedBooleanChange('featuresLinks', 'showAppointments', checked)}
                        />
                        <Label htmlFor="showAppointments">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="clients">Clientes</Label>
                        <Input
                          id="clients"
                          value={footerSection.featuresLinks.clients}
                          onChange={(e) => handleNestedTextChange('featuresLinks', 'clients', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showClients"
                          checked={footerSection.featuresLinks.showClients}
                          onCheckedChange={(checked) => handleNestedBooleanChange('featuresLinks', 'showClients', checked)}
                        />
                        <Label htmlFor="showClients">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="reports">Relatórios</Label>
                        <Input
                          id="reports"
                          value={footerSection.featuresLinks.reports}
                          onChange={(e) => handleNestedTextChange('featuresLinks', 'reports', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showReports"
                          checked={footerSection.featuresLinks.showReports}
                          onCheckedChange={(checked) => handleNestedBooleanChange('featuresLinks', 'showReports', checked)}
                        />
                        <Label htmlFor="showReports">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="mobile">App Mobile</Label>
                        <Input
                          id="mobile"
                          value={footerSection.featuresLinks.mobile}
                          onChange={(e) => handleNestedTextChange('featuresLinks', 'mobile', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showMobile"
                          checked={footerSection.featuresLinks.showMobile}
                          onCheckedChange={(checked) => handleNestedBooleanChange('featuresLinks', 'showMobile', checked)}
                        />
                        <Label htmlFor="showMobile">Mostrar</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seção Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showCompanySection"
                  checked={footerSection.showCompanySection}
                  onCheckedChange={(checked) => handleInputChange('showCompanySection', checked)}
                />
                <Label htmlFor="showCompanySection">Mostrar seção da empresa</Label>
              </div>

              {footerSection.showCompanySection && (
                <>
                  <div>
                    <Label htmlFor="companyTitle">Título da Seção</Label>
                    <Input
                      id="companyTitle"
                      value={footerSection.companyTitle}
                      onChange={(e) => handleInputChange('companyTitle', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="testimonials">Depoimentos</Label>
                        <Input
                          id="testimonials"
                          value={footerSection.companyLinks.testimonials}
                          onChange={(e) => handleNestedTextChange('companyLinks', 'testimonials', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showTestimonials"
                          checked={footerSection.companyLinks.showTestimonials}
                          onCheckedChange={(checked) => handleNestedBooleanChange('companyLinks', 'showTestimonials', checked)}
                        />
                        <Label htmlFor="showTestimonials">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="contact">Contato</Label>
                        <Input
                          id="contact"
                          value={footerSection.companyLinks.contact}
                          onChange={(e) => handleNestedTextChange('companyLinks', 'contact', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showContact"
                          checked={footerSection.companyLinks.showContact}
                          onCheckedChange={(checked) => handleNestedBooleanChange('companyLinks', 'showContact', checked)}
                        />
                        <Label htmlFor="showContact">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="privacy">Política de Privacidade</Label>
                        <Input
                          id="privacy"
                          value={footerSection.companyLinks.privacy}
                          onChange={(e) => handleNestedTextChange('companyLinks', 'privacy', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showPrivacy"
                          checked={footerSection.companyLinks.showPrivacy}
                          onCheckedChange={(checked) => handleNestedBooleanChange('companyLinks', 'showPrivacy', checked)}
                        />
                        <Label htmlFor="showPrivacy">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="terms">Termos de Uso</Label>
                        <Input
                          id="terms"
                          value={footerSection.companyLinks.terms}
                          onChange={(e) => handleNestedTextChange('companyLinks', 'terms', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showTerms"
                          checked={footerSection.companyLinks.showTerms}
                          onCheckedChange={(checked) => handleNestedBooleanChange('companyLinks', 'showTerms', checked)}
                        />
                        <Label htmlFor="showTerms">Mostrar</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seção Suporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showSupportSection"
                  checked={footerSection.showSupportSection}
                  onCheckedChange={(checked) => handleInputChange('showSupportSection', checked)}
                />
                <Label htmlFor="showSupportSection">Mostrar seção de suporte</Label>
              </div>

              {footerSection.showSupportSection && (
                <>
                  <div>
                    <Label htmlFor="supportTitle">Título da Seção</Label>
                    <Input
                      id="supportTitle"
                      value={footerSection.supportTitle}
                      onChange={(e) => handleInputChange('supportTitle', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="help">Central de Ajuda</Label>
                        <Input
                          id="help"
                          value={footerSection.supportLinks.help}
                          onChange={(e) => handleNestedTextChange('supportLinks', 'help', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showHelp"
                          checked={footerSection.supportLinks.showHelp}
                          onCheckedChange={(checked) => handleNestedBooleanChange('supportLinks', 'showHelp', checked)}
                        />
                        <Label htmlFor="showHelp">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="login">Acessar Conta</Label>
                        <Input
                          id="login"
                          value={footerSection.supportLinks.login}
                          onChange={(e) => handleNestedTextChange('supportLinks', 'login', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showLogin"
                          checked={footerSection.supportLinks.showLogin}
                          onCheckedChange={(checked) => handleNestedBooleanChange('supportLinks', 'showLogin', checked)}
                        />
                        <Label htmlFor="showLogin">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="training">Treinamentos</Label>
                        <Input
                          id="training"
                          value={footerSection.supportLinks.training}
                          onChange={(e) => handleNestedTextChange('supportLinks', 'training', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showTraining"
                          checked={footerSection.supportLinks.showTraining}
                          onCheckedChange={(checked) => handleNestedBooleanChange('supportLinks', 'showTraining', checked)}
                        />
                        <Label htmlFor="showTraining">Mostrar</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor="getStarted">Começar Agora</Label>
                        <Input
                          id="getStarted"
                          value={footerSection.supportLinks.getStarted}
                          onChange={(e) => handleNestedTextChange('supportLinks', 'getStarted', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showGetStarted"
                          checked={footerSection.supportLinks.showGetStarted}
                          onCheckedChange={(checked) => handleNestedBooleanChange('supportLinks', 'showGetStarted', checked)}
                        />
                        <Label htmlFor="showGetStarted">Mostrar</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seção Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showSocialSection"
                  checked={footerSection.showSocialSection}
                  onCheckedChange={(checked) => handleInputChange('showSocialSection', checked)}
                />
                <Label htmlFor="showSocialSection">Mostrar seção de redes sociais</Label>
              </div>

              {footerSection.showSocialSection && (
                <div>
                  <Label htmlFor="socialTitle">Título da Seção</Label>
                  <Input
                    id="socialTitle"
                    value={footerSection.socialTitle}
                    onChange={(e) => handleInputChange('socialTitle', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Salvar Configurações do Rodapé
        </Button>
      </div>
    </div>
  );
};

export default FooterTab;
