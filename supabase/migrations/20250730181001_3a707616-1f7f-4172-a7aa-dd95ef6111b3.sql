-- Limpar dados de demonstração
DELETE FROM public.appointments WHERE company_id IN (
  SELECT id FROM public.companies WHERE email LIKE '%belezaestilo%' OR email LIKE '%demo%'
);

DELETE FROM public.services WHERE company_id IN (
  SELECT id FROM public.companies WHERE email LIKE '%belezaestilo%' OR email LIKE '%demo%'
);

DELETE FROM public.professionals WHERE company_id IN (
  SELECT id FROM public.companies WHERE email LIKE '%belezaestilo%' OR email LIKE '%demo%'
);

DELETE FROM public.companies WHERE email LIKE '%belezaestilo%' OR email LIKE '%demo%';

DELETE FROM public.profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email IN (
    'admin@okagendei.com',
    'maria@belezaestilo.com', 
    'joao@belezaestilo.com'
  )
);

-- Criar empresa para o usuário
INSERT INTO public.companies (
  id,
  name,
  email,
  phone,
  address,
  plan,
  status,
  employees,
  monthly_revenue,
  trial_ends_at
) VALUES (
  gen_random_uuid(),
  'Minha Empresa',
  'fernandohsales@outlook.com',
  '(11) 99999-9999',
  'Endereço da empresa',
  'basic',
  'trial',
  1,
  0,
  NOW() + INTERVAL '30 days'
);

-- Função para criar o usuário após signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  company_id_var UUID;
BEGIN
  -- Buscar a empresa pelo email
  SELECT id INTO company_id_var 
  FROM public.companies 
  WHERE email = NEW.email;

  -- Criar perfil do usuário
  INSERT INTO public.profiles (id, name, role, company_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN company_id_var IS NOT NULL THEN 'company_admin'::user_role
      ELSE 'professional'::user_role 
    END,
    company_id_var
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar trigger para usar a nova função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();