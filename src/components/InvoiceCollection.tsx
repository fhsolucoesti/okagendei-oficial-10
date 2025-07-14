
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Mail, MessageSquare, Send, Phone, MapPin } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Company } from '@/types';
import { toast } from 'sonner';

interface InvoiceCollectionProps {
  overdueCompanies: Company[];
}

const InvoiceCollection = ({ overdueCompanies }: InvoiceCollectionProps) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const emailTemplates = {
    formal: `Prezado(a) {name},

Esperamos que esteja bem. Gostaríamos de lembrá-lo(a) sobre o pagamento em atraso da sua assinatura do OKAgendei.

Detalhes da fatura:
- Empresa: {name}
- Plano: {plan}
- Vencimento: {dueDate}
- Dias em atraso: {overdueDays}

Para regularizar sua situação e manter todos os serviços ativos, por favor efetue o pagamento o quanto antes.

Em caso de dúvidas, entre em contato conosco.

Atenciosamente,
Equipe OKAgendei`,

    friendly: `Olá {name}! 😊

Tudo bem por aí? Estamos entrando em contato para lembrar sobre o pagamento da sua assinatura do OKAgendei.

📋 Informações da fatura:
• Empresa: {name}
• Plano: {plan}
• Vencimento: {dueDate}
• Dias em atraso: {overdueDays}

Sabemos que às vezes essas coisas passam despercebidas, então aqui está o lembrete! 

Para manter sua conta ativa e continuar aproveitando todos os recursos, é só efetuar o pagamento.

Qualquer dúvida, estamos aqui para ajudar! 💪

Abraços,
Time OKAgendei`,

    urgent: `URGENTE - {name}

Sua assinatura do OKAgendei está com {overdueDays} dias de atraso e corre risco de suspensão.

⚠️ AÇÃO NECESSÁRIA IMEDIATA:
- Empresa: {name}
- Plano: {plan}
- Vencimento: {dueDate}
- Status: CRÍTICO

Para evitar a interrupção dos serviços, efetue o pagamento HOJE.

Não deixe que seus clientes sejam prejudicados!

Equipe OKAgendei`
  };

  const whatsappTemplates = {
    formal: `*OKAgendei - Cobrança*

Olá {name}!

Sua fatura está em atraso há {overdueDays} dias.

📄 *Detalhes:*
• Plano: {plan}
• Vencimento: {dueDate}

Por favor, regularize o pagamento para manter os serviços ativos.

Dúvidas? Entre em contato conosco.`,

    friendly: `Oi {name}! 👋

Passando aqui para lembrar da sua faturinha do OKAgendei! 😅

📋 *Info:*
• Plano: {plan}
• Venceu em: {dueDate}
• Atraso: {overdueDays} dias

Que tal acertar hoje mesmo? Assim você fica tranquilo(a)! 😊

Qualquer coisa, é só chamar! 💬`,

    urgent: `🚨 *URGENTE - OKAgendei*

{name}, sua conta está em risco!

⚠️ *ATENÇÃO:*
• {overdueDays} dias em atraso
• Plano: {plan}
• Risco de suspensão

*PAGUE HOJE* para evitar interrupção!

Não deixe seus clientes na mão! 😰`
  };

  const fillTemplate = (template: string, company: Company) => {
    return template
      .replace(/{name}/g, company.name)
      .replace(/{plan}/g, company.plan)
      .replace(/{dueDate}/g, company.nextPayment ? new Date(company.nextPayment).toLocaleDateString('pt-BR') : 'Data não informada')
      .replace(/{overdueDays}/g, company.overdueDays?.toString() || '0');
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setMessageTemplate('formal');
    setCustomMessage('');
    setIsDialogOpen(true);
  };

  const handleTemplateChange = (template: string) => {
    setMessageTemplate(template);
    if (selectedCompany) {
      const templates = window.location.hash.includes('email') ? emailTemplates : whatsappTemplates;
      setCustomMessage(fillTemplate(templates[template as keyof typeof templates], selectedCompany));
    }
  };

  const sendEmail = async () => {
    if (!selectedCompany || !customMessage.trim()) {
      toast.error('Selecione uma empresa e escreva a mensagem');
      return;
    }

    // Simular envio de email
    toast.success(`Email de cobrança enviado para ${selectedCompany.name}!`);
    setIsDialogOpen(false);
  };

  const sendWhatsApp = async () => {
    if (!selectedCompany || !customMessage.trim()) {
      toast.error('Selecione uma empresa e escreva a mensagem');
      return;
    }

    // Gerar link do WhatsApp
    const phone = selectedCompany.phone.replace(/\D/g, '');
    const message = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/55${phone}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success(`WhatsApp aberto para ${selectedCompany.name}!`);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Faturas em Atraso
          </CardTitle>
          <CardDescription className="text-red-600">
            {overdueCompanies.length} empresas com pagamento em atraso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overdueCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{company.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="destructive">{company.overdueDays} dias em atraso</Badge>
                      <Badge variant="outline">{company.plan}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{company.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{company.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompanySelect(company)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Cobrar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Cobrança */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enviar Cobrança</DialogTitle>
            <DialogDescription>
              Empresa: {selectedCompany?.name} - {selectedCompany?.overdueDays} dias em atraso
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div>
                <Label htmlFor="emailTemplate">Template de Email</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={messageTemplate === 'formal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTemplateChange('formal')}
                  >
                    Formal
                  </Button>
                  <Button
                    variant={messageTemplate === 'friendly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTemplateChange('friendly')}
                  >
                    Amigável
                  </Button>
                  <Button
                    variant={messageTemplate === 'urgent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTemplateChange('urgent')}
                  >
                    Urgente
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="emailMessage">Mensagem do Email</Label>
                <Textarea
                  id="emailMessage"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={12}
                  placeholder="Escreva sua mensagem de cobrança..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={sendEmail} className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-4">
              <div>
                <Label htmlFor="whatsappTemplate">Template de WhatsApp</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={messageTemplate === 'formal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTemplateChange('formal')}
                  >
                    Formal
                  </Button>
                  <Button
                    variant={messageTemplate === 'friendly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTemplateChange('friendly')}
                  >
                    Amigável
                  </Button>
                  <Button
                    variant={messageTemplate === 'urgent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTemplateChange('urgent')}
                  >
                    Urgente
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="whatsappMessage">Mensagem do WhatsApp</Label>
                <Textarea
                  id="whatsappMessage"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={10}
                  placeholder="Escreva sua mensagem de cobrança..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={sendWhatsApp} className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceCollection;
