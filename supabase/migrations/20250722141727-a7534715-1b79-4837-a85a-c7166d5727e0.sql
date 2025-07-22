
-- Primeiro, vamos criar os usuários de demonstração no Supabase Auth
-- e sincronizar com a tabela public.users existente

-- Inserir usuários na tabela auth.users (simulando o que seria feito via API)
-- Nota: Na prática, isso seria feito via Supabase Admin API, mas para demonstração:

-- Limpar dados de teste antigos se existirem
DELETE FROM auth.users WHERE email IN ('admin@okagendei.com', 'empresa@teste.com', 'profissional@teste.com');

-- Inserir usuários de demonstração na tabela auth.users
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
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
-- Super Admin
(
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'admin@okagendei.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
),
-- Company Admin
(
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000002',
  'authenticated',
  'authenticated',
  'empresa@teste.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
),
-- Professional
(
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000003',
  'authenticated',
  'authenticated',
  'profissional@teste.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
);

-- Agora sincronizar com a tabela public.users
-- Primeiro, limpar registros antigos
DELETE FROM public.users WHERE email IN ('admin@okagendei.com', 'empresa@teste.com', 'profissional@teste.com');

-- Criar empresa de exemplo primeiro
INSERT INTO public.companies (
  id,
  name,
  email,
  phone,
  address,
  plan,
  status,
  employees,
  monthly_revenue
) VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'Empresa Teste',
  'empresa@teste.com',
  '(11) 99999-9999',
  'Rua Teste, 123',
  'basic',
  'active',
  1,
  0
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- Inserir usuários na tabela public.users sincronizados com auth.users
INSERT INTO public.users (
  id,
  name,
  email,
  password,
  role,
  company_id,
  must_change_password,
  avatar
) VALUES 
-- Super Admin
(
  'a0000000-0000-0000-0000-000000000001',
  'Admin Geral',
  'admin@okagendei.com',
  'supabase_managed',
  'super_admin',
  null,
  false,
  null
),
-- Company Admin
(
  'a0000000-0000-0000-0000-000000000002',
  'Admin Empresa',
  'empresa@teste.com',
  'supabase_managed',
  'company_admin',
  'c0000000-0000-0000-0000-000000000001',
  false,
  null
),
-- Professional
(
  'a0000000-0000-0000-0000-000000000003',
  'Profissional Teste',
  'profissional@teste.com',
  'supabase_managed',
  'professional',
  'c0000000-0000-0000-0000-000000000001',
  false,
  null
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  company_id = EXCLUDED.company_id;
