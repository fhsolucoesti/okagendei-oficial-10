-- Criar dados de teste para barbearia fictícia (Barbearia Central)

-- Primeiro, criar a empresa
INSERT INTO public.companies (name, email, phone, address, plan, status, employees, monthly_revenue, whatsapp_number)
VALUES (
  'Barbearia Central',
  'contato@barbeariacentral.com',
  '(11) 98765-4321',
  'Rua das Palmeiras, 456 - Centro, São Paulo/SP',
  'premium',
  'active',
  3,
  8500.00,
  '5511987654321'
);

-- Obter o ID da empresa criada
DO $$
DECLARE
    company_uuid uuid;
BEGIN
    SELECT id INTO company_uuid FROM public.companies WHERE email = 'contato@barbeariacentral.com';
    
    -- Criar serviços da barbearia
    INSERT INTO public.services (name, description, duration, price, company_id, is_active) VALUES
    ('Corte Masculino', 'Corte tradicional masculino com acabamento profissional', 45, 35.00, company_uuid, true),
    ('Barba Completa', 'Aparar e modelar barba com navalha e acabamento', 30, 25.00, company_uuid, true),
    ('Corte + Barba', 'Combo completo: corte masculino + barba', 60, 50.00, company_uuid, true),
    ('Lavagem + Corte', 'Lavagem, corte e finalização', 50, 40.00, company_uuid, true),
    ('Relaxamento', 'Massagem no couro cabeludo com produtos naturais', 20, 15.00, company_uuid, true);

    -- Criar clientes da barbearia
    INSERT INTO public.clients (company_id, name, email, phone, birth_date, total_appointments, last_appointment) VALUES
    (company_uuid, 'Ricardo Oliveira', 'ricardo.oliveira@email.com', '(11) 91234-5678', '1985-03-15', 8, '2024-01-20'),
    (company_uuid, 'Carlos Mendoza', 'carlos.mendoza@email.com', '(11) 92345-6789', '1990-07-22', 5, '2024-01-18'),
    (company_uuid, 'André Costa', 'andre.costa@email.com', '(11) 93456-7890', '1988-11-08', 12, '2024-01-22'),
    (company_uuid, 'Miguel Santos', 'miguel.santos@email.com', '(11) 94567-8901', '1992-05-13', 3, '2024-01-19'),
    (company_uuid, 'Roberto Silva', 'roberto.silva@email.com', '(11) 95678-9012', '1987-09-25', 6, '2024-01-21');

    -- Criar despesas da empresa
    INSERT INTO public.expenses (company_id, description, amount, category, date) VALUES
    (company_uuid, 'Aluguel da loja', 2500.00, 'Fixo', '2024-01-01'),
    (company_uuid, 'Produtos para cabelo e barba', 450.00, 'Material', '2024-01-05'),
    (company_uuid, 'Energia elétrica', 180.00, 'Conta', '2024-01-10'),
    (company_uuid, 'Internet e telefone', 120.00, 'Conta', '2024-01-12'),
    (company_uuid, 'Manutenção de equipamentos', 300.00, 'Manutenção', '2024-01-15');

    -- Criar notificações para a empresa
    INSERT INTO public.notifications (company_id, type, title, message, priority, is_read) VALUES
    (company_uuid, 'appointment', 'Novo agendamento', 'Ricardo Oliveira agendou corte + barba para amanhã às 14h', 'high', false),
    (company_uuid, 'payment', 'Pagamento recebido', 'Pagamento de R$ 50,00 do cliente André Costa foi confirmado', 'medium', false),
    (company_uuid, 'system', 'Estoque baixo', 'Produtos para barba estão com estoque baixo (menos de 5 unidades)', 'high', false);
END $$;