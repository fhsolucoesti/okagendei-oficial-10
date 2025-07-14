import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, QrCode, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Plan } from '@/types';
import { useMercadoPago, formatCurrency, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/hooks/useMercadoPago';

interface MercadoPagoPixProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  onSuccess?: (paymentId: string) => void;
}

interface PixPaymentData {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  qrCode: string;
  qrCodeBase64: string;
  pixKey: string;
  amount: number;
  expiresAt: Date;
  paymentId: string;
}

const MercadoPagoPix = ({ open, onOpenChange, plan, onSuccess }: MercadoPagoPixProps) => {
  const [paymentData, setPaymentData] = useState<PixPaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutos
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // Simular criação do PIX (na implementação real, seria uma chamada à API do Mercado Pago)
  const createPixPayment = async () => {
    setIsLoading(true);
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dados simulados do PIX
      const pixData = {
        id: Date.now().toString(),
        status: 'pending' as const,
        qrCode: '00020101021243650016COM.MERCADOLIVRE02013063638f1264-5292-4004-8166-c3c52550d70c5204000053039865802BR5925OKAGENDEI SISTEMA DE AGEN6014RIO DE JANEIRO62070503***63041D3D',
        amount: plan.monthlyPrice,
        pixKey: '00020101021243650016COM.MERCADOLIVRE02013063638f1264-5292-4004-8166-c3c52550d70c5204000053039865802BR5925OKAGENDEI SISTEMA DE AGEN6014RIO DE JANEIRO62070503***63041D3D',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        paymentId: `pix_${Date.now()}`
      };
      
      // Gerar QR Code
      const qrCodeBase64 = await QRCode.toDataURL(pixData.qrCode);
      
      setPaymentData({
        ...pixData,
        qrCodeBase64
      });
      
      toast.success('PIX gerado com sucesso!');
      startPaymentCheck(pixData.paymentId);
      
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      toast.error('Erro ao gerar PIX. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simular verificação de pagamento
  const startPaymentCheck = (paymentId: string) => {
    const interval = setInterval(() => {
      // Simular aprovação aleatória após alguns segundos
      const shouldApprove = Math.random() > 0.9; // 10% de chance a cada verificação
      
      if (shouldApprove) {
        setPaymentData(prev => prev ? { ...prev, status: 'approved' } : null);
        clearInterval(interval);
        toast.success('Pagamento aprovado!');
        onSuccess?.(paymentId);
      }
    }, 3000);

    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  };

  // Verificar pagamento manualmente
  const checkPayment = async () => {
    if (!paymentData) return;
    
    setIsCheckingPayment(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular verificação
      const isApproved = Math.random() > 0.7; // 30% de chance
      
      if (isApproved) {
        setPaymentData(prev => prev ? { ...prev, status: 'approved' } : null);
        toast.success('Pagamento aprovado!');
        onSuccess?.(paymentData.paymentId);
      } else {
        toast.info('Pagamento ainda não identificado. Aguarde ou tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao verificar pagamento.');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  // Copiar PIX para clipboard
  const copyPixKey = () => {
    if (paymentData?.pixKey) {
      navigator.clipboard.writeText(paymentData.pixKey);
      toast.success('PIX copiado para a área de transferência!');
    }
  };

  // Countdown timer
  useEffect(() => {
    if (paymentData && paymentData.status === 'pending') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setPaymentData(prev => prev ? { ...prev, status: 'expired' } : null);
            clearInterval(timer);
            toast.error('PIX expirado. Gere um novo PIX para continuar.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentData]);

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusBadge = () => {
    if (!paymentData) return null;

    switch (paymentData.status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Aguardando Pagamento
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-700 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pagamento Aprovado
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="text-red-700 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            PIX Expirado
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Pagamento via PIX
          </DialogTitle>
          <DialogDescription>
            Escaneie o QR Code ou copie o código PIX para efetuar o pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Plano */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>
                Valor a ser pago: {formatPrice(plan.monthlyPrice)}
              </CardDescription>
            </CardHeader>
          </Card>

          {!paymentData ? (
            /* Gerar PIX */
            <div className="text-center space-y-4">
              <Button 
                onClick={createPixPayment}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando PIX...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar PIX
                  </>
                )}
              </Button>
            </div>
          ) : (
            /* Mostrar PIX */
            <div className="space-y-4">
              {/* Status */}
              <div className="flex justify-between items-center">
                {getStatusBadge()}
                {paymentData.status === 'pending' && (
                  <div className="text-sm text-gray-600">
                    Expira em: {formatTime(countdown)}
                  </div>
                )}
              </div>

              {paymentData.status === 'approved' ? (
                /* Pagamento Aprovado */
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Pagamento Aprovado!
                    </h3>
                    <p className="text-green-700 text-sm">
                      Seu plano foi ativado com sucesso. 
                      Você será redirecionado em instantes.
                    </p>
                  </CardContent>
                </Card>
              ) : paymentData.status === 'expired' ? (
                /* PIX Expirado */
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6 text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      PIX Expirado
                    </h3>
                    <p className="text-red-700 text-sm mb-4">
                      O tempo para pagamento expirou. Gere um novo PIX.
                    </p>
                    <Button onClick={createPixPayment} variant="outline">
                      Gerar Novo PIX
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* PIX Pendente */
                <>
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                      <img 
                        src={paymentData.qrCodeBase64} 
                        alt="QR Code PIX" 
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Escaneie o QR Code com seu banco ou app de pagamento
                    </p>
                  </div>

                  {/* Código PIX */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Código PIX</CardTitle>
                      <CardDescription className="text-xs">
                        Ou copie o código para usar no seu banco
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={paymentData.pixKey}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-xs font-mono"
                        />
                        <Button
                          size="sm"
                          onClick={copyPixKey}
                          variant="outline"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Verificar Pagamento */}
                  <Button
                    onClick={checkPayment}
                    disabled={isCheckingPayment}
                    variant="outline"
                    className="w-full"
                  >
                    {isCheckingPayment ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      'Verificar Pagamento'
                    )}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Informações */}
          <div className="text-xs text-gray-500 text-center">
            <p>O PIX é válido por 15 minutos</p>
            <p>Após o pagamento, a ativação é imediata</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MercadoPagoPix;