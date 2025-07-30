-- Limpar possíveis dados órfãos primeiro
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Criar função para criar usuário administrador
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT,
  company_email TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  company_id UUID;
BEGIN
  -- Buscar a empresa
  SELECT id INTO company_id FROM companies WHERE email = company_email;
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Empresa não encontrada com email: %', company_email;
  END IF;
  
  -- Criar um UUID fixo para este usuário específico
  user_id := '598b47cd-c179-4594-b4ef-389285704bbe'::UUID;
  
  -- Inserir na tabela auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    json_build_object('name', user_name)
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    updated_at = NOW();
  
  -- Inserir perfil
  INSERT INTO profiles (id, name, role, company_id, must_change_password)
  VALUES (user_id, user_name, 'company_admin', company_id, false)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    company_id = EXCLUDED.company_id;
  
  RETURN user_id;
END;
$$;

-- Criar o usuário administrador
SELECT create_admin_user(
  'fernandohsales@outlook.com',
  'Fernando@2025@',
  'Fernando',
  'fernandohsales@outlook.com'
);