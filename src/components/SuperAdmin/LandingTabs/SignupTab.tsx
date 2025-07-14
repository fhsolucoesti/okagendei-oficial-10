
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

      {/* Configurações dos Campos do Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Campos do Formulário</CardTitle>
          <CardDescription>
            Configure os campos que aparecerão no formulário de cadastro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campo Nome da Empresa */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Campo: Nome da Empresa</h4>
              <Switch
                checked={signupSettings.formFields.companyName.visible}
                onCheckedChange={(checked) => updateSettings({
                  formFields: {
                    ...signupSettings.formFields,
                    companyName: { ...signupSettings.formFields.companyName, visible: checked }
                  }
                })}
              />
            </div>
            {signupSettings.formFields.companyName.visible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-label">Label do Campo</Label>
                  <Input
                    id="company-label"
                    value={signupSettings.formFields.companyName.label}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        companyName: { ...signupSettings.formFields.companyName, label: e.target.value }
                      }
                    })}
                    placeholder="Nome da Empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="company-placeholder">Placeholder</Label>
                  <Input
                    id="company-placeholder"
                    value={signupSettings.formFields.companyName.placeholder}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        companyName: { ...signupSettings.formFields.companyName, placeholder: e.target.value }
                      }
                    })}
                    placeholder="Salão Beleza"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={signupSettings.formFields.companyName.required}
                    onCheckedChange={(checked) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        companyName: { ...signupSettings.formFields.companyName, required: checked }
                      }
                    })}
                  />
                  <Label>Campo obrigatório</Label>
                </div>
              </div>
            )}
          </div>

          {/* Campo Nome do Responsável */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Campo: Nome do Responsável</h4>
              <Switch
                checked={signupSettings.formFields.ownerName.visible}
                onCheckedChange={(checked) => updateSettings({
                  formFields: {
                    ...signupSettings.formFields,
                    ownerName: { ...signupSettings.formFields.ownerName, visible: checked }
                  }
                })}
              />
            </div>
            {signupSettings.formFields.ownerName.visible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner-label">Label do Campo</Label>
                  <Input
                    id="owner-label"
                    value={signupSettings.formFields.ownerName.label}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        ownerName: { ...signupSettings.formFields.ownerName, label: e.target.value }
                      }
                    })}
                    placeholder="Nome do Responsável"
                  />
                </div>
                <div>
                  <Label htmlFor="owner-placeholder">Placeholder</Label>
                  <Input
                    id="owner-placeholder"
                    value={signupSettings.formFields.ownerName.placeholder}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        ownerName: { ...signupSettings.formFields.ownerName, placeholder: e.target.value }
                      }
                    })}
                    placeholder="Maria Silva"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={signupSettings.formFields.ownerName.required}
                    onCheckedChange={(checked) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        ownerName: { ...signupSettings.formFields.ownerName, required: checked }
                      }
                    })}
                  />
                  <Label>Campo obrigatório</Label>
                </div>
              </div>
            )}
          </div>

          {/* Campo E-mail */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Campo: E-mail</h4>
              <Switch
                checked={signupSettings.formFields.email.visible}
                onCheckedChange={(checked) => updateSettings({
                  formFields: {
                    ...signupSettings.formFields,
                    email: { ...signupSettings.formFields.email, visible: checked }
                  }
                })}
              />
            </div>
            {signupSettings.formFields.email.visible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-label">Label do Campo</Label>
                  <Input
                    id="email-label"
                    value={signupSettings.formFields.email.label}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        email: { ...signupSettings.formFields.email, label: e.target.value }
                      }
                    })}
                    placeholder="E-mail"
                  />
                </div>
                <div>
                  <Label htmlFor="email-placeholder">Placeholder</Label>
                  <Input
                    id="email-placeholder"
                    value={signupSettings.formFields.email.placeholder}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        email: { ...signupSettings.formFields.email, placeholder: e.target.value }
                      }
                    })}
                    placeholder="contato@salaobeleza.com"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={signupSettings.formFields.email.required}
                    onCheckedChange={(checked) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        email: { ...signupSettings.formFields.email, required: checked }
                      }
                    })}
                  />
                  <Label>Campo obrigatório</Label>
                </div>
              </div>
            )}
          </div>

          {/* Campo Telefone */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Campo: Telefone</h4>
              <Switch
                checked={signupSettings.formFields.phone.visible}
                onCheckedChange={(checked) => updateSettings({
                  formFields: {
                    ...signupSettings.formFields,
                    phone: { ...signupSettings.formFields.phone, visible: checked }
                  }
                })}
              />
            </div>
            {signupSettings.formFields.phone.visible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone-label">Label do Campo</Label>
                  <Input
                    id="phone-label"
                    value={signupSettings.formFields.phone.label}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        phone: { ...signupSettings.formFields.phone, label: e.target.value }
                      }
                    })}
                    placeholder="Telefone"
                  />
                </div>
                <div>
                  <Label htmlFor="phone-placeholder">Placeholder</Label>
                  <Input
                    id="phone-placeholder"
                    value={signupSettings.formFields.phone.placeholder}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        phone: { ...signupSettings.formFields.phone, placeholder: e.target.value }
                      }
                    })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={signupSettings.formFields.phone.required}
                    onCheckedChange={(checked) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        phone: { ...signupSettings.formFields.phone, required: checked }
                      }
                    })}
                  />
                  <Label>Campo obrigatório</Label>
                </div>
              </div>
            )}
          </div>

          {/* Campo Senha */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Campo: Senha</h4>
              <Switch
                checked={signupSettings.formFields.password.visible}
                onCheckedChange={(checked) => updateSettings({
                  formFields: {
                    ...signupSettings.formFields,
                    password: { ...signupSettings.formFields.password, visible: checked }
                  }
                })}
              />
            </div>
            {signupSettings.formFields.password.visible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password-label">Label do Campo</Label>
                  <Input
                    id="password-label"
                    value={signupSettings.formFields.password.label}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        password: { ...signupSettings.formFields.password, label: e.target.value }
                      }
                    })}
                    placeholder="Criar Senha"
                  />
                </div>
                <div>
                  <Label htmlFor="password-placeholder">Placeholder</Label>
                  <Input
                    id="password-placeholder"
                    value={signupSettings.formFields.password.placeholder}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        password: { ...signupSettings.formFields.password, placeholder: e.target.value }
                      }
                    })}
                    placeholder="Digite sua senha"
                  />
                </div>
                <div>
                  <Label htmlFor="password-help">Texto de Ajuda</Label>
                  <Input
                    id="password-help"
                    value={signupSettings.formFields.password.helpText}
                    onChange={(e) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        password: { ...signupSettings.formFields.password, helpText: e.target.value }
                      }
                    })}
                    placeholder="Mínimo de 6 caracteres"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={signupSettings.formFields.password.required}
                    onCheckedChange={(checked) => updateSettings({
                      formFields: {
                        ...signupSettings.formFields,
                        password: { ...signupSettings.formFields.password, required: checked }
                      }
                    })}
                  />
                  <Label>Campo obrigatório</Label>
                </div>
              </div>
            )}
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
