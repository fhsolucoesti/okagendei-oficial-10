-- Adicionar funcionalidade de controle de alteração de senha

-- Adicionar trigger para validar alteração de senha
CREATE OR REPLACE FUNCTION public.validate_must_change_password()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o campo must_change_password foi alterado, registrar um log
  IF OLD.must_change_password IS DISTINCT FROM NEW.must_change_password THEN
    INSERT INTO public.notifications (company_id, type, title, message, priority)
    VALUES (
      NEW.company_id,
      'system',
      CASE 
        WHEN NEW.must_change_password THEN 'Alteração de senha obrigatória'
        ELSE 'Obrigatoriedade de alteração removida'
      END,
      CASE 
        WHEN NEW.must_change_password THEN 'Usuário ' || NEW.name || ' deve alterar a senha no próximo login'
        ELSE 'Usuário ' || NEW.name || ' não precisa mais alterar a senha obrigatoriamente'
      END,
      'medium'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Criar trigger para o campo must_change_password
CREATE TRIGGER on_must_change_password_update
  AFTER UPDATE OF must_change_password ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_must_change_password();

-- Adicionar comentários explicativos
COMMENT ON COLUMN public.profiles.must_change_password IS 'Indica se o usuário deve alterar a senha no próximo login';
COMMENT ON FUNCTION public.validate_must_change_password() IS 'Função que registra notificações quando a obrigatoriedade de alteração de senha é modificada';