
-- Criar tipos enum necessários
CREATE TYPE user_role AS ENUM ('super_admin', 'company_admin', 'professional');
CREATE TYPE company_status AS ENUM ('trial', 'active', 'suspended', 'cancelled');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE commission_status AS ENUM ('pending', 'paid');
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE notification_type AS ENUM ('appointment', 'payment', 'system', 'promotion');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Criar extensão para UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  role user_role DEFAULT 'professional',
  company_id UUID,
  avatar VARCHAR,
  must_change_password BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de empresas
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  plan VARCHAR NOT NULL DEFAULT 'basic',
  status company_status DEFAULT 'trial',
  employees INTEGER DEFAULT 1,
  monthly_revenue NUMERIC DEFAULT 0,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  next_payment TIMESTAMP WITH TIME ZONE,
  overdue_days INTEGER DEFAULT 0,
  custom_url VARCHAR UNIQUE,
  logo VARCHAR,
  whatsapp_number VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de planos
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  max_employees VARCHAR NOT NULL,
  monthly_price NUMERIC NOT NULL,
  yearly_price NUMERIC NOT NULL,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de serviços
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  duration INTEGER NOT NULL,
  image_url VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de profissionais
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  specialties JSONB DEFAULT '[]',
  commission NUMERIC DEFAULT 0,
  image_url VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de horários de trabalho
CREATE TABLE public.working_hours (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  service_id UUID NOT NULL,
  client_name VARCHAR NOT NULL,
  client_phone VARCHAR NOT NULL,
  client_birth_date DATE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de clientes
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR,
  birth_date DATE,
  total_appointments INTEGER DEFAULT 0,
  last_appointment DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de comissões
CREATE TABLE public.commissions (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID NOT NULL,
  appointment_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  status commission_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de despesas
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL,
  description VARCHAR NOT NULL,
  amount NUMERIC NOT NULL,
  category VARCHAR NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de faturas
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  status invoice_status DEFAULT 'pending',
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  type notification_type NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  company_id UUID,
  is_read BOOLEAN DEFAULT false,
  priority notification_priority DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar chaves estrangeiras
ALTER TABLE public.users ADD CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE public.services ADD CONSTRAINT fk_services_company FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE public.professionals ADD CONSTRAINT fk_professionals_company FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE public.professionals ADD CONSTRAINT fk_professionals_user FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE public.working_hours ADD CONSTRAINT fk_working_hours_professional FOREIGN KEY (professional_id) REFERENCES public.professionals(id);
ALTER TABLE public.appointments ADD CONSTRAINT fk_appointments_company FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE public.appointments ADD CONSTRAINT fk_appointments_professional FOREIGN KEY (professional_id) REFERENCES public.professionals(id);
ALTER TABLE public.appointments ADD CONSTRAINT fk_appointments_service FOREIGN KEY (service_id) REFERENCES public.services(id);
ALTER TABLE public.clients ADD CONSTRAINT fk_clients_company FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE public.commissions ADD CONSTRAINT fk_commissions_professional FOREIGN KEY (professional_id) REFERENCES public.professionals(id);
ALTER TABLE public.commissions ADD CONSTRAINT fk_commissions_appointment FOREIGN KEY (appointment_id) REFERENCES public.appointments(id);
ALTER TABLE public.expenses ADD CONSTRAINT fk_expenses_company FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE public.invoices ADD CONSTRAINT fk_invoices_company FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE public.notifications ADD CONSTRAINT fk_notifications_company FOREIGN KEY (company_id) REFERENCES public.companies(id);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON public.working_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Inserir planos padrão
INSERT INTO public.plans (name, max_employees, monthly_price, yearly_price, features, is_popular, is_active) VALUES
('Básico', '5', 49.90, 499.90, '["Agendamentos ilimitados", "Até 5 funcionários", "Relatórios básicos", "Suporte por email"]', false, true),
('Premium', '20', 99.90, 999.90, '["Agendamentos ilimitados", "Até 20 funcionários", "Relatórios avançados", "Suporte prioritário", "Integração WhatsApp"]', true, true),
('Enterprise', 'unlimited', 199.90, 1999.90, '["Agendamentos ilimitados", "Funcionários ilimitados", "Relatórios completos", "Suporte 24/7", "API personalizada"]', false, true);
