
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Eye } from 'lucide-react';
import { SignupSettings } from '@/types/landingConfig';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SignupTabProps {
  signupSettings: SignupSettings;
  setSignupSettings: (settings: SignupSettings) => void;
}

const SignupTab = ({ signupSettings, setSignupSettings }: SignupTabProps) => {
  const [isTermsPreviewOpen, setIsTermsPreviewOpen] = useState(false);

  const updateSettings = (updates: Partial<SignupSettings>) => {
    setSignupSettings({ ...signupSettings, ...updates });
  };

  const updateTerms = (updates: Partial<SignupSettings['termsOfUse']>) => {
    setSignupSettings({
      ...signupSettings,
      termsOfUse: { ...signupSettings.termsOfUse, ...updates }
    });
  };

  const addBenefit = () => {
    const newBenefits = [...signupSettings.benefits, 'Novo benefício'];
    updateSettings({ benefits: newBenefits });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...signupSettings.benefits];
    newBenefits[index] = value;
    updateSettings({ benefits: newBenefits });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = signupSettings.benefits.filter((_, i) => i !== index);
    updateSettings({ benefits: newBenefits });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Tela de Cadastro</CardTitle>
          <CardDescription>
            Personalize o conteúdo que aparece na tela de cadastro dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Título e Subtítulo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signup-title">Título Principal</Label>
              <Input
                id="signup-title"
                value={signupSettings.title}
                onChange={(e) => updateSettings({ title: e.target.value })}
                placeholder="Começar Teste Grátis"
              />
            </div>
            <div>
              <Label htmlFor="signup-subtitle">Subtítulo</Label>
              <Input
                id="signup-subtitle"
                value={signupSettings.subtitle}
                onChange={(e) => updateSettings({ subtitle: e.target.value })}
                placeholder="Experimente todos os recursos..."
              />
            </div>
          </div>

          {/* Configurações do Teste Grátis */}
          <Separator />
          <h3 className="text-lg font-semibold">Teste Grátis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trial-days">Dias de Teste Grátis</Label>
              <Input
                id="trial-days"
                type="number"
                value={signupSettings.trialDays}
                onChange={(e) => updateSettings({ trialDays: parseInt(e.target.value) || 7 })}
                min="1"
                max="30"
              />
            </div>
            <div>
              <Label htmlFor="trial-badge">Texto do Badge</Label>
              <Input
                id="trial-badge"
                value={signupSettings.trialBadgeText}
                onChange={(e) => updateSettings({ trialBadgeText: e.target.value })}
                placeholder="🆓 Teste Grátis por 7 Dias"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="trial-description">Descrição do Teste</Label>
            <Textarea
              id="trial-description"
              value={signupSettings.trialDescription}
              onChange={(e) => updateSettings({ trialDescription: e.target.value })}
              placeholder="Experimente todos os recursos sem pagar nada..."
              rows={2}
            />
          </div>

          {/* Benefícios */}
          <Separator />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label htmlFor="benefits-title">Título dos Benefícios</Label>
                <Input
                  id="benefits-title"
                  value={signupSettings.benefitsTitle}
                  onChange={(e) => updateSettings({ benefitsTitle: e.target.value })}
                  placeholder="Teste Sem Riscos"
                  className="mt-1"
                />
              </div>
              <Button onClick={addBenefit} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Benefício
              </Button>
            </div>

            <div className="space-y-2">
              {signupSettings.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Benefício do teste grátis"
                  />
                  <Button
                    onClick={() => removeBenefit(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Informações de Cobrança */}
          <Separator />
          <h3 className="text-lg font-semibold">Informações de Cobrança</h3>
          
          <div>
            <Label htmlFor="billing-title">Título</Label>
            <Input
              id="billing-title"
              value={signupSettings.billingInfoTitle}
              onChange={(e) => updateSettings({ billingInfoTitle: e.target.value })}
              placeholder="Informação sobre Cobrança"
            />
          </div>

          <div>
            <Label htmlFor="billing-description">Descrição</Label>
            <Textarea
              id="billing-description"
              value={signupSettings.billingInfoDescription}
              onChange={(e) => updateSettings({ billingInfoDescription: e.target.value })}
              placeholder="Não será cobrado nada durante o período de teste..."
              rows={3}
            />
          </div>

          {/* Botão de Submit */}
          <div>
            <Label htmlFor="submit-button">Texto do Botão</Label>
            <Input
              id="submit-button"
              value={signupSettings.submitButtonText}
              onChange={(e) => updateSettings({ submitButtonText: e.target.value })}
              placeholder="Começar Teste Grátis de 7 Dias"
            />
          </div>
        </CardContent>
      </Card>

      {/* Termos de Uso */}
      <Card>
        <CardHeader>
          <CardTitle>Termos de Uso</CardTitle>
          <CardDescription>
            Configure se os usuários devem aceitar termos de uso durante o cadastro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="terms-enabled"
              checked={signupSettings.termsOfUse.enabled}
              onCheckedChange={(checked) => updateTerms({ enabled: checked })}
            />
            <Label htmlFor="terms-enabled">Exigir aceitação dos termos de uso</Label>
          </div>

          {signupSettings.termsOfUse.enabled && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="terms-title">Título dos Termos</Label>
                <Input
                  id="terms-title"
                  value={signupSettings.termsOfUse.title}
                  onChange={(e) => updateTerms({ title: e.target.value })}
                  placeholder="Termos de Uso"
                />
              </div>

              <div>
                <Label htmlFor="terms-checkbox">Texto do Checkbox</Label>
                <Input
                  id="terms-checkbox"
                  value={signupSettings.termsOfUse.checkboxText}
                  onChange={(e) => updateTerms({ checkboxText: e.target.value })}
                  placeholder="Aceito os termos de uso"
                />
              </div>

              <div>
                <Label htmlFor="terms-link">Texto do Link</Label>
                <Input
                  id="terms-link"
                  value={signupSettings.termsOfUse.linkText}
                  onChange={(e) => updateTerms({ linkText: e.target.value })}
                  placeholder="Ver termos completos"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="terms-content">Conteúdo dos Termos</Label>
                  <Dialog open={isTermsPreviewOpen} onOpenChange={setIsTermsPreviewOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{signupSettings.termsOfUse.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-wrap text-sm">
                        {signupSettings.termsOfUse.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Textarea
                  id="terms-content"
                  value={signupSettings.termsOfUse.content}
                  onChange={(e) => updateTerms({ content: e.target.value })}
                  placeholder="Digite aqui o conteúdo completo dos termos de uso..."
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupTab;
