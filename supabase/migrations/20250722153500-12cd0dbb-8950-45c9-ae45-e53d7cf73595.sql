
-- ========================================
-- CORREÇÕES CRÍTICAS DE SEGURANÇA
-- ========================================

-- 1. Ativar RLS em todas as tabelas (já estava ativo, mas vamos garantir)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes que podem estar com problemas
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Company members can view company data" ON public.companies;
DROP POLICY IF EXISTS "Company members can manage services" ON public.services;
DROP POLICY IF EXISTS "Company members can manage professionals" ON public.professionals;
DROP POLICY IF EXISTS "Professional can manage own working hours" ON public.working_hours;
DROP POLICY IF EXISTS "Company members can manage appointments" ON public.appointments;
DROP POLICY IF EXISTS "Company members can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Professional can view own commissions" ON public.commissions;
DROP POLICY IF EXISTS "Company members can manage expenses" ON public.expenses;
DROP POLICY IF EXISTS "Company members can view invoices" ON public.invoices;
DROP POLICY IF EXISTS "Company members can view notifications" ON public.notifications;
DROP POLICY IF EXISTS "Plans are publicly readable" ON public.plans;

-- 3. Criar função segura para verificar se usuário pertence à empresa
CREATE OR REPLACE FUNCTION public.user_belongs_to_company(company_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid() 
    AND company_id = company_uuid
  );
$$;

-- 4. Criar função segura para obter role do usuário
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.users 
  WHERE id = auth.uid();
$$;

-- 5. Criar função segura para verificar se é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  );
$$;

-- 6. Recriar políticas RLS funcionais e seguras

-- Políticas para users
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admin can view all users" ON public.users
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Super admin can manage all users" ON public.users
  FOR ALL USING (public.is_super_admin());

-- Políticas para companies
CREATE POLICY "Company members can view company data" ON public.companies
  FOR SELECT USING (public.user_belongs_to_company(id) OR public.is_super_admin());

CREATE POLICY "Company admin can update company data" ON public.companies
  FOR UPDATE USING (
    (public.user_belongs_to_company(id) AND public.get_user_role() = 'company_admin') 
    OR public.is_super_admin()
  );

CREATE POLICY "Super admin can manage all companies" ON public.companies
  FOR ALL USING (public.is_super_admin());

-- Políticas para services
CREATE POLICY "Company members can view services" ON public.services
  FOR SELECT USING (public.user_belongs_to_company(company_id) OR public.is_super_admin());

CREATE POLICY "Company admin can manage services" ON public.services
  FOR ALL USING (
    (public.user_belongs_to_company(company_id) AND public.get_user_role() IN ('company_admin')) 
    OR public.is_super_admin()
  );

-- Políticas para professionals
CREATE POLICY "Company members can view professionals" ON public.professionals
  FOR SELECT USING (public.user_belongs_to_company(company_id) OR public.is_super_admin());

CREATE POLICY "Company admin can manage professionals" ON public.professionals
  FOR ALL USING (
    (public.user_belongs_to_company(company_id) AND public.get_user_role() = 'company_admin') 
    OR public.is_super_admin()
  );

CREATE POLICY "Professional can view own data" ON public.professionals
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Professional can update own data" ON public.professionals
  FOR UPDATE USING (user_id = auth.uid());

-- Políticas para working_hours
CREATE POLICY "Professional can manage own working hours" ON public.working_hours
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professionals p 
      WHERE p.id = working_hours.professional_id 
      AND p.user_id = auth.uid()
    ) 
    OR public.is_super_admin()
  );

CREATE POLICY "Company admin can view working hours" ON public.working_hours
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professionals p 
      WHERE p.id = working_hours.professional_id 
      AND public.user_belongs_to_company(p.company_id)
    ) 
    OR public.is_super_admin()
  );

-- Políticas para appointments
CREATE POLICY "Company members can view appointments" ON public.appointments
  FOR SELECT USING (public.user_belongs_to_company(company_id) OR public.is_super_admin());

CREATE POLICY "Company admin can manage appointments" ON public.appointments
  FOR ALL USING (
    (public.user_belongs_to_company(company_id) AND public.get_user_role() = 'company_admin') 
    OR public.is_super_admin()
  );

CREATE POLICY "Professional can view own appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professionals p 
      WHERE p.id = appointments.professional_id 
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Professional can update own appointments" ON public.appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.professionals p 
      WHERE p.id = appointments.professional_id 
      AND p.user_id = auth.uid()
    )
  );

-- Políticas para clients
CREATE POLICY "Company members can manage clients" ON public.clients
  FOR ALL USING (public.user_belongs_to_company(company_id) OR public.is_super_admin());

-- Políticas para commissions
CREATE POLICY "Professional can view own commissions" ON public.commissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professionals p 
      WHERE p.id = commissions.professional_id 
      AND p.user_id = auth.uid()
    ) 
    OR public.is_super_admin()
  );

CREATE POLICY "Company admin can view commissions" ON public.commissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professionals p 
      WHERE p.id = commissions.professional_id 
      AND public.user_belongs_to_company(p.company_id)
    ) 
    OR public.is_super_admin()
  );

CREATE POLICY "Company admin can manage commissions" ON public.commissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professionals p 
      WHERE p.id = commissions.professional_id 
      AND public.user_belongs_to_company(p.company_id) 
      AND public.get_user_role() = 'company_admin'
    ) 
    OR public.is_super_admin()
  );

-- Políticas para expenses
CREATE POLICY "Company members can view expenses" ON public.expenses
  FOR SELECT USING (public.user_belongs_to_company(company_id) OR public.is_super_admin());

CREATE POLICY "Company admin can manage expenses" ON public.expenses
  FOR ALL USING (
    (public.user_belongs_to_company(company_id) AND public.get_user_role() = 'company_admin') 
    OR public.is_super_admin()
  );

-- Políticas para invoices
CREATE POLICY "Company members can view invoices" ON public.invoices
  FOR SELECT USING (public.user_belongs_to_company(company_id) OR public.is_super_admin());

CREATE POLICY "Super admin can manage invoices" ON public.invoices
  FOR ALL USING (public.is_super_admin());

-- Políticas para notifications
CREATE POLICY "Company members can view notifications" ON public.notifications
  FOR SELECT USING (
    company_id IS NULL 
    OR public.user_belongs_to_company(company_id) 
    OR public.is_super_admin()
  );

CREATE POLICY "Company admin can manage notifications" ON public.notifications
  FOR ALL USING (
    (company_id IS NOT NULL AND public.user_belongs_to_company(company_id) AND public.get_user_role() = 'company_admin') 
    OR public.is_super_admin()
  );

CREATE POLICY "Super admin can manage system notifications" ON public.notifications
  FOR ALL USING (public.is_super_admin());

-- Políticas para plans (públicos para leitura)
CREATE POLICY "Plans are publicly readable" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "Super admin can manage plans" ON public.plans
  FOR ALL USING (public.is_super_admin());

-- ========================================
-- SINCRONIZAÇÃO AUTH.USERS ↔ PUBLIC.USERS
-- ========================================

-- 7. Função para sincronizar usuário do auth com public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    name,
    email,
    password,
    role,
    company_id,
    must_change_password
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'supabase_managed',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'professional'),
    (NEW.raw_user_meta_data->>'company_id')::uuid,
    COALESCE((NEW.raw_user_meta_data->>'must_change_password')::boolean, false)
  );
  RETURN NEW;
END;
$$;

-- 8. Trigger para criar usuário automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- TABELAS AUXILIARES E CONFIGURAÇÕES
-- ========================================

-- 9. Tabela de configurações globais do sistema
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings are readable" ON public.system_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Super admin can manage system settings" ON public.system_settings
  FOR ALL USING (public.is_super_admin());

-- 10. Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR NOT NULL,
  table_name VARCHAR NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admin can view all audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_super_admin());

-- 11. Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_professionals_company_id ON public.professionals(company_id);
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_company_id ON public.appointments(company_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON public.appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON public.clients(company_id);
CREATE INDEX IF NOT EXISTS idx_services_company_id ON public.services(company_id);
CREATE INDEX IF NOT EXISTS idx_commissions_professional_id ON public.commissions(professional_id);
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON public.expenses(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON public.invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_company_id ON public.notifications(company_id);
CREATE INDEX IF NOT EXISTS idx_working_hours_professional_id ON public.working_hours(professional_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ========================================
-- STORAGE BUCKETS
-- ========================================

-- 12. Criar buckets para storage
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('company-logos', 'company-logos', true),
  ('user-avatars', 'user-avatars', true),
  ('service-images', 'service-images', true),
  ('professional-images', 'professional-images', true)
ON CONFLICT (id) DO NOTHING;

-- 13. Políticas para storage
CREATE POLICY "Company logos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Company admin can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'company-logos' 
    AND public.get_user_role() IN ('company_admin', 'super_admin')
  );

CREATE POLICY "User avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-avatars');

CREATE POLICY "Service images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Company admin can upload service images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-images' 
    AND public.get_user_role() IN ('company_admin', 'super_admin')
  );

CREATE POLICY "Professional images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'professional-images');

CREATE POLICY "Company admin can upload professional images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'professional-images' 
    AND public.get_user_role() IN ('company_admin', 'super_admin')
  );

-- ========================================
-- FUNÇÕES E TRIGGERS AUXILIARES
-- ========================================

-- 14. Função para atualizar updated_at automaticamente (já existe, mas vamos garantir)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 15. Garantir que triggers de updated_at existam em todas as tabelas
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON public.companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at 
  BEFORE UPDATE ON public.services 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_professionals_updated_at ON public.professionals;
CREATE TRIGGER update_professionals_updated_at 
  BEFORE UPDATE ON public.professionals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at 
  BEFORE UPDATE ON public.appointments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON public.clients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_commissions_updated_at ON public.commissions;
CREATE TRIGGER update_commissions_updated_at 
  BEFORE UPDATE ON public.commissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON public.expenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at 
  BEFORE UPDATE ON public.invoices 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at 
  BEFORE UPDATE ON public.notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_working_hours_updated_at ON public.working_hours;
CREATE TRIGGER update_working_hours_updated_at 
  BEFORE UPDATE ON public.working_hours 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER update_system_settings_updated_at 
  BEFORE UPDATE ON public.system_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SEEDS DE DADOS ESSENCIAIS
-- ========================================

-- 16. Inserir configurações padrão do sistema
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
  ('app_name', '"OK Agendei"', 'Nome da aplicação', true),
  ('app_version', '"1.0.0"', 'Versão da aplicação', true),
  ('maintenance_mode', 'false', 'Modo de manutenção', false),
  ('max_companies', '1000', 'Máximo de empresas permitidas', false),
  ('default_trial_days', '30', 'Dias de trial padrão', false),
  ('support_email', '"suporte@okagendei.com"', 'Email de suporte', true),
  ('whatsapp_number', '"+5511999999999"', 'Número do WhatsApp de suporte', true),
  ('terms_url', '"https://okagendei.com/termos"', 'URL dos termos de uso', true),
  ('privacy_url', '"https://okagendei.com/privacidade"', 'URL da política de privacidade', true)
ON CONFLICT (key) DO NOTHING;

-- 17. Garantir que planos padrão existam com dados corretos
INSERT INTO public.plans (id, name, max_employees, monthly_price, yearly_price, features, is_popular, is_active) VALUES
  (uuid_generate_v4(), 'Básico', '5', 49.90, 499.90, '["Agendamentos ilimitados", "Até 5 funcionários", "Relatórios básicos", "Suporte por email"]', false, true),
  (uuid_generate_v4(), 'Premium', '20', 99.90, 999.90, '["Agendamentos ilimitados", "Até 20 funcionários", "Relatórios avançados", "Suporte prioritário", "Integração WhatsApp"]', true, true),
  (uuid_generate_v4(), 'Enterprise', 'unlimited', 199.90, 1999.90, '["Agendamentos ilimitados", "Funcionários ilimitados", "Relatórios completos", "Suporte 24/7", "API personalizada"]', false, true)
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- HABILITAR REALTIME
-- ========================================

-- 18. Habilitar realtime para tabelas importantes
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Configurar REPLICA IDENTITY para realtime
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.companies REPLICA IDENTITY FULL;
ALTER TABLE public.users REPLICA IDENTITY FULL;
