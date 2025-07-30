import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

// Configuração do Mercado Pago - deve ser configurada pelo super admin
const getMercadoPagoConfig = async (): Promise<MercadoPagoConfig | null> => {
  try {
    // Buscar configuração do Mercado Pago no banco (seria implementado quando necessário)
    return null;
  } catch (error) {
    console.error('Erro ao buscar configuração do Mercado Pago:', error);
    return null;
  }
};

export const useMercadoPago = (): UseMercadoPagoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPixPayment = useCallback(async (preference: PaymentPreference): Promise<PixPayment> => {
    setIsLoading(true);
    setError(null);

    try {
      const config = await getMercadoPagoConfig();
      
      if (!config) {
        throw new Error('Configuração do Mercado Pago não encontrada. Configure nas configurações do sistema.');
      }

      // Aqui seria implementada a integração real com Mercado Pago
      // Por enquanto, retorna erro indicando que precisa ser implementado
      throw new Error('Integração com Mercado Pago ainda não configurada. Entre em contato com o suporte.');
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
      const config = await getMercadoPagoConfig();
      
      if (!config) {
        console.error('Configuração do Mercado Pago não encontrada');
        return 'pending';
      }

      // Aqui seria implementada a verificação real com Mercado Pago
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

  // Por enquanto, retorna falso até que a integração seja configurada
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