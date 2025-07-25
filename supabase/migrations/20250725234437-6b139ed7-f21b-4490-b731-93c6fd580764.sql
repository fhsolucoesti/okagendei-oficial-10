-- Create enum types
CREATE TYPE user_role AS ENUM ('super_admin', 'company_admin', 'professional');
CREATE TYPE company_status AS ENUM ('active', 'trial', 'suspended', 'cancelled');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue');
CREATE TYPE commission_status AS ENUM ('pending', 'paid');
CREATE TYPE notification_type AS ENUM ('appointment', 'payment', 'system', 'company_registered', 'payment_overdue');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  role user_role NOT NULL DEFAULT 'professional',
  company_id UUID,
  must_change_password BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  max_employees TEXT NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  yearly_price DECIMAL(10,2) NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'basic',
  status company_status DEFAULT 'trial',
  employees INTEGER DEFAULT 1,
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  trial_ends_at TIMESTAMPTZ,
  custom_url TEXT UNIQUE,
  logo TEXT,
  next_payment TIMESTAMPTZ,
  overdue_days INTEGER DEFAULT 0,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create professionals table
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialties JSONB DEFAULT '[]'::jsonb,
  commission DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create working_hours table
CREATE TABLE public.working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  birth_date DATE,
  total_appointments INTEGER DEFAULT 0,
  last_appointment TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_birth_date DATE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create commissions table
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  status commission_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status invoice_status DEFAULT 'pending',
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  priority notification_priority DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expire_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create landing_config table
CREATE TABLE public.landing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for profiles.company_id
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_professionals_company_id ON public.professionals(company_id);
CREATE INDEX idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX idx_services_company_id ON public.services(company_id);
CREATE INDEX idx_appointments_company_id ON public.appointments(company_id);
CREATE INDEX idx_appointments_professional_id ON public.appointments(professional_id);
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_clients_company_id ON public.clients(company_id);
CREATE INDEX idx_working_hours_professional_id ON public.working_hours(professional_id);
CREATE INDEX idx_commissions_professional_id ON public.commissions(professional_id);
CREATE INDEX idx_expenses_company_id ON public.expenses(company_id);
CREATE INDEX idx_invoices_company_id ON public.invoices(company_id);
CREATE INDEX idx_notifications_company_id ON public.notifications(company_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Create RLS policies for companies
CREATE POLICY "Company admins can view own company" ON public.companies FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = companies.id)
);
CREATE POLICY "Super admins can view all companies" ON public.companies FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "Company admins can update own company" ON public.companies FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = companies.id AND role IN ('company_admin', 'super_admin'))
);

-- Create RLS policies for plans
CREATE POLICY "Anyone can view active plans" ON public.plans FOR SELECT USING (is_active = true);
CREATE POLICY "Super admins can manage plans" ON public.plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Create RLS policies for services
CREATE POLICY "Company members can view company services" ON public.services FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = services.company_id)
);
CREATE POLICY "Company admins can manage company services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = services.company_id AND role IN ('company_admin', 'super_admin'))
);

-- Create RLS policies for professionals
CREATE POLICY "Company members can view company professionals" ON public.professionals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = professionals.company_id)
);
CREATE POLICY "Company admins can manage professionals" ON public.professionals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = professionals.company_id AND role IN ('company_admin', 'super_admin'))
);

-- Create RLS policies for working_hours
CREATE POLICY "Professionals can view own working hours" ON public.working_hours FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.professionals p JOIN public.profiles pr ON p.user_id = pr.id 
          WHERE pr.id = auth.uid() AND p.id = working_hours.professional_id)
);
CREATE POLICY "Company members can view working hours" ON public.working_hours FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.professionals p JOIN public.profiles pr ON p.company_id = pr.company_id 
          WHERE pr.id = auth.uid() AND p.id = working_hours.professional_id)
);
CREATE POLICY "Professionals can manage own working hours" ON public.working_hours FOR ALL USING (
  EXISTS (SELECT 1 FROM public.professionals p JOIN public.profiles pr ON p.user_id = pr.id 
          WHERE pr.id = auth.uid() AND p.id = working_hours.professional_id)
);

-- Create RLS policies for clients
CREATE POLICY "Company members can view company clients" ON public.clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = clients.company_id)
);
CREATE POLICY "Company members can manage clients" ON public.clients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = clients.company_id)
);

-- Create RLS policies for appointments
CREATE POLICY "Company members can view company appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = appointments.company_id)
);
CREATE POLICY "Company members can manage appointments" ON public.appointments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = appointments.company_id)
);

-- Create RLS policies for commissions
CREATE POLICY "Professionals can view own commissions" ON public.commissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.professionals p JOIN public.profiles pr ON p.user_id = pr.id 
          WHERE pr.id = auth.uid() AND p.id = commissions.professional_id)
);
CREATE POLICY "Company admins can view company commissions" ON public.commissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.professionals p JOIN public.profiles pr ON p.company_id = pr.company_id 
          WHERE pr.id = auth.uid() AND p.id = commissions.professional_id AND pr.role IN ('company_admin', 'super_admin'))
);

-- Create RLS policies for expenses
CREATE POLICY "Company members can view company expenses" ON public.expenses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = expenses.company_id)
);
CREATE POLICY "Company admins can manage expenses" ON public.expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = expenses.company_id AND role IN ('company_admin', 'super_admin'))
);

-- Create RLS policies for invoices
CREATE POLICY "Company members can view company invoices" ON public.invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = invoices.company_id)
);
CREATE POLICY "Company admins can manage invoices" ON public.invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = invoices.company_id AND role IN ('company_admin', 'super_admin'))
);

-- Create RLS policies for notifications
CREATE POLICY "Company members can view company notifications" ON public.notifications FOR SELECT USING (
  company_id IS NULL OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = notifications.company_id)
);
CREATE POLICY "Super admins can manage all notifications" ON public.notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Create RLS policies for coupons
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Super admins can manage coupons" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Create RLS policies for landing_config
CREATE POLICY "Anyone can view landing config" ON public.landing_config FOR SELECT USING (true);
CREATE POLICY "Super admins can manage landing config" ON public.landing_config FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON public.working_hours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_landing_config_updated_at BEFORE UPDATE ON public.landing_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'professional'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial plans
INSERT INTO public.plans (name, max_employees, monthly_price, yearly_price, features, is_popular) VALUES
('Básico', '5', 29.90, 299.00, '["Agendamento online", "Gestão de clientes", "Relatórios básicos"]', false),
('Profissional', '15', 59.90, 599.00, '["Agendamento online", "Gestão de clientes", "Relatórios avançados", "WhatsApp integração", "Múltiplos profissionais"]', true),
('Premium', 'Ilimitado', 99.90, 999.00, '["Agendamento online", "Gestão de clientes", "Relatórios avançados", "WhatsApp integração", "Múltiplos profissionais", "API personalizada", "Suporte prioritário"]', false);

-- Insert initial landing config
INSERT INTO public.landing_config (config) VALUES (
  '{
    "hero": {
      "title": "Simplifique seus agendamentos",
      "subtitle": "A plataforma completa para gerenciar seu negócio de beleza e bem-estar"
    },
    "features": [
      {
        "title": "Agendamento Online",
        "description": "Seus clientes podem agendar 24/7"
      },
      {
        "title": "Gestão Completa",
        "description": "Controle clientes, serviços e profissionais"
      },
      {
        "title": "Relatórios Detalhados",
        "description": "Acompanhe o crescimento do seu negócio"
      }
    ],
    "company": {
      "name": "OKAgendei",
      "email": "contato@okagendei.com",
      "phone": "(11) 99999-9999"
    }
  }'::jsonb
);