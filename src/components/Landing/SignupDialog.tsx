
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Gift, Shield, CreditCard, Eye, EyeOff } from 'lucide-react';
import { Plan } from '@/types';
import { useLandingConfig } from '@/contexts/LandingConfigContext';

interface SignupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: Plan | null;
  isAnnualBilling: boolean;
  signupForm: {
    companyName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
    planId: string;
    billingType: 'monthly' | 'annual';
  };
  setSignupForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  getPlanPrice: (plan: Plan) => number;
}

const SignupDialog = ({ 
  isOpen, 
  onOpenChange, 
  selectedPlan, 
  isAnnualBilling,
  signupForm, 
  setSignupForm, 
  onSubmit,
  getPlanPrice
}: SignupDialogProps) => {
  const { signupSettings } = useLandingConfig();
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se os termos foram aceitos (se habilitado)
    if (signupSettings.termsOfUse.enabled && !acceptedTerms) {
      alert('Você deve aceitar os termos de uso para continuar.');
      return;
    }
    
    onSubmit(e);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {signupSettings.title} - {selectedPlan?.name}
            </DialogTitle>
            {signupSettings.subtitle && (
              <p className="text-sm text-muted-foreground">{signupSettings.subtitle}</p>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Banner de Teste Grátis no Modal */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">{signupSettings.trialBadgeText}</h4>
              </div>
              <p className="text-sm text-green-700 mb-2">
                {signupSettings.trialDescription}
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong>Plano:</strong> {selectedPlan?.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Período:</strong> {isAnnualBilling ? 'Anual' : 'Mensal'}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Teste:</strong> Grátis por {signupSettings.trialDays} dias
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Depois:</strong> R$ {selectedPlan ? getPlanPrice(selectedPlan).toFixed(2) : '0'}/{isAnnualBilling ? 'ano' : 'mês'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {signupSettings.formFields.companyName.visible && (
                <div>
                  <Label htmlFor="company-name">
                    {signupSettings.formFields.companyName.label}
                    {signupSettings.formFields.companyName.required && ' *'}
                  </Label>
                  <Input
                    id="company-name"
                    value={signupForm.companyName}
                    onChange={(e) => setSignupForm({ ...signupForm, companyName: e.target.value })}
                    placeholder={signupSettings.formFields.companyName.placeholder}
                    required={signupSettings.formFields.companyName.required}
                  />
                </div>
              )}
              {signupSettings.formFields.ownerName.visible && (
                <div>
                  <Label htmlFor="owner-name">
                    {signupSettings.formFields.ownerName.label}
                    {signupSettings.formFields.ownerName.required && ' *'}
                  </Label>
                  <Input
                    id="owner-name"
                    value={signupForm.ownerName}
                    onChange={(e) => setSignupForm({ ...signupForm, ownerName: e.target.value })}
                    placeholder={signupSettings.formFields.ownerName.placeholder}
                    required={signupSettings.formFields.ownerName.required}
                  />
                </div>
              )}
            </div>
            
            {signupSettings.formFields.email.visible && (
              <div>
                <Label htmlFor="signup-email">
                  {signupSettings.formFields.email.label}
                  {signupSettings.formFields.email.required && ' *'}
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder={signupSettings.formFields.email.placeholder}
                  required={signupSettings.formFields.email.required}
                />
              </div>
            )}
            
            {signupSettings.formFields.phone.visible && (
              <div>
                <Label htmlFor="signup-phone">
                  {signupSettings.formFields.phone.label}
                  {signupSettings.formFields.phone.required && ' *'}
                </Label>
                <Input
                  id="signup-phone"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  placeholder={signupSettings.formFields.phone.placeholder}
                  required={signupSettings.formFields.phone.required}
                />
              </div>
            )}

            {signupSettings.formFields.password.visible && (
              <div>
                <Label htmlFor="signup-password">
                  {signupSettings.formFields.password.label}
                  {signupSettings.formFields.password.required && ' *'}
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder={signupSettings.formFields.password.placeholder}
                    required={signupSettings.formFields.password.required}
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {signupSettings.formFields.password.helpText}
                </p>
              </div>
            )}

            {/* Termos de Uso */}
            {signupSettings.termsOfUse.enabled && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="accept-terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="accept-terms" className="text-sm cursor-pointer">
                      {signupSettings.termsOfUse.checkboxText}
                    </Label>
                    <br />
                    <button
                      type="button"
                      onClick={() => setShowTermsDialog(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline mt-1"
                    >
                      {signupSettings.termsOfUse.linkText}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">{signupSettings.benefitsTitle}</span>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                {signupSettings.benefits.map((benefit, index) => (
                  <li key={index}>✅ {benefit}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">{signupSettings.billingInfoTitle}</span>
              </div>
              <p className="text-sm text-gray-600">
                {signupSettings.billingInfoDescription.replace(
                  'R$ {valor}',
                  `R$ ${selectedPlan ? getPlanPrice(selectedPlan).toFixed(2) : '0'}`
                )}
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={signupSettings.termsOfUse.enabled && !acceptedTerms}
            >
              {signupSettings.submitButtonText}
              <Gift className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog dos Termos de Uso */}
      {signupSettings.termsOfUse.enabled && (
        <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{signupSettings.termsOfUse.title}</DialogTitle>
            </DialogHeader>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {signupSettings.termsOfUse.content}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowTermsDialog(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SignupDialog;
