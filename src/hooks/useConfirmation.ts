import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmationOptions>({});
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((confirmOptions: UseConfirmationOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title: 'Confirmar ação',
        message: 'Tem certeza que deseja continuar?',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        variant: 'default',
        ...confirmOptions
      });
      setResolveCallback(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveCallback?.(true);
    setIsOpen(false);
    setResolveCallback(null);
  }, [resolveCallback]);

  const handleCancel = useCallback(() => {
    resolveCallback?.(false);
    setIsOpen(false);
    setResolveCallback(null);
  }, [resolveCallback]);

  // Quick confirmation for delete actions
  const confirmDelete = useCallback((itemName: string = 'este item'): Promise<boolean> => {
    return confirm({
      title: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir ${itemName}? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive'
    });
  }, [confirm]);

  // Quick confirmation with native browser dialog (fallback)
  const quickConfirm = useCallback((message: string): boolean => {
    return window.confirm(message);
  }, []);

  return {
    isOpen,
    options,
    confirm,
    confirmDelete,
    quickConfirm,
    handleConfirm,
    handleCancel
  };
};