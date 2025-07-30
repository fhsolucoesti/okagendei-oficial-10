-- Criar dados de teste para barbearia fictícia do usuário fernandohsales@outlook.com

-- Primeiro, criar a empresa
INSERT INTO public.companies (id, name, email, phone, address, plan, status, employees, monthly_revenue, trial_ends_at, whatsapp_number)
VALUES (
  'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f',
  'Barbearia Central',
  'contato@barbeariacentral.com',
  '(11) 98765-4321',
  'Rua das Palmeiras, 456 - Centro, São Paulo/SP',
  'premium',
  'active',
  3,
  8500.00,
  NULL,
  '5511987654321'
);

-- Atualizar o perfil do usuário para company_admin e linkar com a empresa
UPDATE public.profiles 
SET role = 'company_admin', company_id = 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f'
WHERE id = (SELECT id FROM auth.users WHERE email = 'fernandohsales@outlook.com');

-- Criar serviços da barbearia
INSERT INTO public.services (id, name, description, duration, price, company_id, is_active) VALUES
('s1-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Corte Masculino', 'Corte tradicional masculino com acabamento profissional', 45, 35.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true),
('s2-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Barba Completa', 'Aparar e modelar barba com navalha e acabamento', 30, 25.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true),
('s3-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Corte + Barba', 'Combo completo: corte masculino + barba', 60, 50.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true),
('s4-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Lavagem + Corte', 'Lavagem, corte e finalização', 50, 40.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true),
('s5-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Relaxamento', 'Massagem no couro cabeludo com produtos naturais', 20, 15.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true);

-- Criar um profissional
INSERT INTO public.professionals (id, user_id, company_id, name, email, phone, specialties, commission, is_active) VALUES
('p1-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 
 (SELECT id FROM auth.users WHERE email = 'fernandohsales@outlook.com'),
 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f',
 'Fernando Sales',
 'fernandohsales@outlook.com',
 '(11) 99887-6655',
 '["Cortes masculinos", "Barbas", "Relaxamento"]',
 30.00,
 true);

-- Criar clientes da barbearia
INSERT INTO public.clients (id, company_id, name, email, phone, birth_date, total_appointments, last_appointment) VALUES
('c1-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Ricardo Oliveira', 'ricardo.oliveira@email.com', '(11) 91234-5678', '1985-03-15', 8, '2024-01-20'),
('c2-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Carlos Mendoza', 'carlos.mendoza@email.com', '(11) 92345-6789', '1990-07-22', 5, '2024-01-18'),
('c3-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'André Costa', 'andre.costa@email.com', '(11) 93456-7890', '1988-11-08', 12, '2024-01-22'),
('c4-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Miguel Santos', 'miguel.santos@email.com', '(11) 94567-8901', '1992-05-13', 3, '2024-01-19'),
('c5-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Roberto Silva', 'roberto.silva@email.com', '(11) 95678-9012', '1987-09-25', 6, '2024-01-21');

-- Criar despesas da empresa
INSERT INTO public.expenses (id, company_id, description, amount, category, date) VALUES
('e1-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Aluguel da loja', 2500.00, 'Fixo', '2024-01-01'),
('e2-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Produtos para cabelo e barba', 450.00, 'Material', '2024-01-05'),
('e3-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Energia elétrica', 180.00, 'Conta', '2024-01-10'),
('e4-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Internet e telefone', 120.00, 'Conta', '2024-01-12'),
('e5-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Manutenção de equipamentos', 300.00, 'Manutenção', '2024-01-15');

-- Criar notificações para a empresa
INSERT INTO public.notifications (id, company_id, type, title, message, priority, is_read) VALUES
('n1-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'appointment', 'Novo agendamento', 'Ricardo Oliveira agendou corte + barba para amanhã às 14h', 'high', false),
('n2-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'payment', 'Pagamento recebido', 'Pagamento de R$ 50,00 do cliente André Costa foi confirmado', 'medium', false),
('n3-bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'system', 'Estoque baixo', 'Produtos para barba estão com estoque baixo (menos de 5 unidades)', 'high', false);