-- Criar dados de teste para barbearia fictícia (Barbearia Central)

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

-- Criar serviços da barbearia
INSERT INTO public.services (id, name, description, duration, price, company_id, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Corte Masculino', 'Corte tradicional masculino com acabamento profissional', 45, 35.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true),
('22222222-2222-2222-2222-222222222222', 'Barba Completa', 'Aparar e modelar barba com navalha e acabamento', 30, 25.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true),
('33333333-3333-3333-3333-333333333333', 'Corte + Barba', 'Combo completo: corte masculino + barba', 60, 50.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true),
('44444444-4444-4444-4444-444444444444', 'Lavagem + Corte', 'Lavagem, corte e finalização', 50, 40.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true),
('55555555-5555-5555-5555-555555555555', 'Relaxamento', 'Massagem no couro cabeludo com produtos naturais', 20, 15.00, 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', true);

-- Criar clientes da barbearia
INSERT INTO public.clients (id, company_id, name, email, phone, birth_date, total_appointments, last_appointment) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Ricardo Oliveira', 'ricardo.oliveira@email.com', '(11) 91234-5678', '1985-03-15', 8, '2024-01-20'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Carlos Mendoza', 'carlos.mendoza@email.com', '(11) 92345-6789', '1990-07-22', 5, '2024-01-18'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'André Costa', 'andre.costa@email.com', '(11) 93456-7890', '1988-11-08', 12, '2024-01-22'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Miguel Santos', 'miguel.santos@email.com', '(11) 94567-8901', '1992-05-13', 3, '2024-01-19'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Roberto Silva', 'roberto.silva@email.com', '(11) 95678-9012', '1987-09-25', 6, '2024-01-21');

-- Criar despesas da empresa
INSERT INTO public.expenses (id, company_id, description, amount, category, date) VALUES
('e1111111-1111-1111-1111-111111111111', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Aluguel da loja', 2500.00, 'Fixo', '2024-01-01'),
('e2222222-2222-2222-2222-222222222222', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Produtos para cabelo e barba', 450.00, 'Material', '2024-01-05'),
('e3333333-3333-3333-3333-333333333333', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Energia elétrica', 180.00, 'Conta', '2024-01-10'),
('e4444444-4444-4444-4444-444444444444', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Internet e telefone', 120.00, 'Conta', '2024-01-12'),
('e5555555-5555-5555-5555-555555555555', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'Manutenção de equipamentos', 300.00, 'Manutenção', '2024-01-15');

-- Criar notificações para a empresa
INSERT INTO public.notifications (id, company_id, type, title, message, priority, is_read) VALUES
('n1111111-1111-1111-1111-111111111111', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'appointment', 'Novo agendamento', 'Ricardo Oliveira agendou corte + barba para amanhã às 14h', 'high', false),
('n2222222-2222-2222-2222-222222222222', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'payment', 'Pagamento recebido', 'Pagamento de R$ 50,00 do cliente André Costa foi confirmado', 'medium', false),
('n3333333-3333-3333-3333-333333333333', 'bb8f5c2e-3d4a-4b5c-9e1f-2a3b4c5d6e7f', 'system', 'Estoque baixo', 'Produtos para barba estão com estoque baixo (menos de 5 unidades)', 'high', false);