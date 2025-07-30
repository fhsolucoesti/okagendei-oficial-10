-- Criar usuário para fernandohsales@outlook.com

-- Primeiro, vamos inserir o usuário na tabela auth.users
-- Nota: Na prática, isso deve ser feito via signup, mas para resolver o problema vou criar diretamente

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'fernandohsales@outlook.com',
    crypt('Fernando@2025@', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Fernando", "company_name": "Minha Empresa"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Buscar o ID do usuário criado
DO $$
DECLARE
    user_uuid UUID;
    company_uuid UUID;
BEGIN
    -- Buscar o ID do usuário
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'fernandohsales@outlook.com';
    
    -- Buscar o ID da empresa
    SELECT id INTO company_uuid FROM companies WHERE email = 'fernandohsales@outlook.com';
    
    -- Criar perfil do usuário
    INSERT INTO profiles (id, name, role, company_id, must_change_password)
    VALUES (user_uuid, 'Fernando', 'company_admin', company_uuid, false);
END $$;