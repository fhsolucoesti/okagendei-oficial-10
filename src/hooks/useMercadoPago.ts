import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface MercadoPagoConfig {
  accessToken: string;
  publicKey: string;
  sandboxMode?: boolean;
}

export interface PixPayment {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  amount: number;
  currency: string;
  qrCode: string;
  qrCodeBase64: string;
  paymentId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface PaymentPreference {
  title: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
  description?: string;
}

interface UseMercadoPagoReturn {
  createPixPayment: (preference: PaymentPreference) => Promise<PixPayment>;
  checkPaymentStatus: (paymentId: string) => Promise<'pending' | 'approved' | 'rejected' | 'expired'>;
  isLoading: boolean;
  error: string | null;
}

// Configuração simulada - Na implementação real, viria de variáveis de ambiente
const MERCADO_PAGO_CONFIG: MercadoPagoConfig = {
  accessToken: 'TEST-ACCESS-TOKEN', // Substitua pelo seu token real
  publicKey: 'TEST-PUBLIC-KEY', // Substitua pela sua chave pública real
  sandboxMode: true
};

export const useMercadoPago = (): UseMercadoPagoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPixPayment = useCallback(async (preference: PaymentPreference): Promise<PixPayment> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular criação de pagamento PIX
      // Na implementação real, esta seria uma chamada à API do Mercado Pago
      const mockPayment: PixPayment = {
        id: `pix_${Date.now()}`,
        paymentId: `mp_${Date.now()}`,
        status: 'pending',
        amount: preference.unit_price,
        currency: preference.currency_id,
        qrCode: '00020101021243650016COM.MERCADOLIVRE02013063638f1264-5292-4004-8166-c3c52550d70c5204000053039865802BR5925OKAGENDEI SISTEMA DE AGEN6014RIO DE JANEIRO62070503***63041D3D',
        qrCodeBase64: '', // Será gerado pelo componente
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        createdAt: new Date()
      };

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));

      return mockPayment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pagamento PIX';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (paymentId: string): Promise<'pending' | 'approved' | 'rejected' | 'expired'> => {
    try {
      // Simular verificação de status
      // Na implementação real, esta seria uma chamada à API do Mercado Pago
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular diferentes status baseado no ID
      const random = Math.random();
      if (random > 0.8) return 'approved';
      if (random > 0.6) return 'rejected';
      if (random > 0.4) return 'expired';
      return 'pending';
    } catch (err) {
      console.error('Erro ao verificar status do pagamento:', err);
      return 'pending';
    }
  }, []);

  return {
    createPixPayment,
    checkPaymentStatus,
    isLoading,
    error
  };
};

// Hook para configurar o Mercado Pago SDK (quando usar a biblioteca oficial)
export const useMercadoPagoSDK = () => {
  const [isSDKReady, setIsSDKReady] = useState(false);

  useEffect(() => {
    // Carregar SDK do Mercado Pago
    const loadMercadoPagoSDK = async () => {
      try {
        // Na implementação real, você carregaria o SDK do Mercado Pago
        // const mp = new MercadoPago(MERCADO_PAGO_CONFIG.publicKey, {
        //   locale: 'pt-BR'
        // });
        
        setIsSDKReady(true);
      } catch (error) {
        console.error('Erro ao carregar SDK do Mercado Pago:', error);
        toast.error('Erro ao inicializar sistema de pagamento');
      }
    };

    loadMercadoPagoSDK();
  }, []);

  return { isSDKReady };
};

// Utilidades para formatação
export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatPixKey = (pixKey: string): string => {
  if (pixKey.length <= 20) return pixKey;
  return `${pixKey.substring(0, 20)}...${pixKey.substring(pixKey.length - 20)}`;
};

// Constantes úteis
export const PAYMENT_STATUS_LABELS = {
  pending: 'Aguardando Pagamento',
  approved: 'Pagamento Aprovado',
  rejected: 'Pagamento Rejeitado',
  expired: 'Pagamento Expirado',
  cancelled: 'Pagamento Cancelado'
};

export const PAYMENT_STATUS_COLORS = {
  pending: 'text-yellow-700 border-yellow-300',
  approved: 'text-green-700 border-green-300',
  rejected: 'text-red-700 border-red-300',
  expired: 'text-gray-700 border-gray-300',
  cancelled: 'text-gray-700 border-gray-300'
};