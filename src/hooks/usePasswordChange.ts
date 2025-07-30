import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PasswordChangeData {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export function usePasswordChange() {
  const [loading, setLoading] = useState(false);

  const changePassword = async (data: PasswordChangeData) => {
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('As senhas não coincidem');
    }

    if (data.newPassword.length < 6) {
      throw new Error('A nova senha deve ter pelo menos 6 caracteres');
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;

      toast.success('Senha alterada com sucesso!');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast.error(error.message || 'Erro ao alterar senha');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast.success('Email de recuperação enviado!');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      toast.error(error.message || 'Erro ao enviar email de recuperação');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markMustChangePassword = async (userId: string, mustChange: boolean) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ must_change_password: mustChange })
        .eq('id', userId);

      if (error) throw error;

      toast.success(
        mustChange 
          ? 'Usuário obrigado a alterar senha no próximo login'
          : 'Obrigatoriedade de alteração de senha removida'
      );
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar flag de alteração de senha:', error);
      toast.error(error.message || 'Erro ao atualizar configuração');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    changePassword,
    resetPassword,
    markMustChangePassword
  };
}