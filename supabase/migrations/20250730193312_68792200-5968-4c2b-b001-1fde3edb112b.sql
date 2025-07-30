-- Verificar e criar super-admin
-- Primeiro, verificar se o usuário já existe na tabela profiles
DO $$
BEGIN
  -- Se o usuário não existe na tabela profiles, criar
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'fernandohsales@outlook.com')) THEN
    INSERT INTO profiles (id, name, role, company_id)
    SELECT 
      id,
      COALESCE(raw_user_meta_data->>'name', 'Fernando Sales'),
      'super_admin'::user_role,
      NULL
    FROM auth.users 
    WHERE email = 'fernandohsales@outlook.com';
  ELSE
    -- Se já existe, apenas atualizar o role para super_admin
    UPDATE profiles 
    SET role = 'super_admin'::user_role,
        company_id = NULL
    WHERE id = (SELECT id FROM auth.users WHERE email = 'fernandohsales@outlook.com');
  END IF;

  -- Garantir que o usuário está confirmado e ativo
  UPDATE auth.users
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
  WHERE email = 'fernandohsales@outlook.com';
END $$;