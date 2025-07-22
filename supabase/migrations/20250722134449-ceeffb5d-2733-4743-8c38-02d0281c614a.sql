-- Criar policies RLS básicas para todas as tabelas

-- Policies para users (usuários só veem seus próprios dados)
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Policies para companies (dados da empresa)
CREATE POLICY "Company members can view company data" ON public.companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id::text = auth.uid()::text 
      AND users.company_id = companies.id
    )
  );

-- Policies para services (serviços da empresa)
CREATE POLICY "Company members can manage services" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id::text = auth.uid()::text 
      AND users.company_id = services.company_id
    )
  );

-- Policies para professionals (profissionais da empresa)
CREATE POLICY "Company members can manage professionals" ON public.professionals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id::text = auth.uid()::text 
      AND users.company_id = professionals.company_id
    )
  );

-- Policies para working_hours (horários de trabalho)
CREATE POLICY "Professional can manage own working hours" ON public.working_hours
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      JOIN public.users u ON p.user_id = u.id
      WHERE u.id::text = auth.uid()::text 
      AND p.id = working_hours.professional_id
    )
  );

-- Policies para appointments (agendamentos)
CREATE POLICY "Company members can manage appointments" ON public.appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id::text = auth.uid()::text 
      AND users.company_id = appointments.company_id
    )
  );

-- Policies para clients (clientes)
CREATE POLICY "Company members can manage clients" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id::text = auth.uid()::text 
      AND users.company_id = clients.company_id
    )
  );

-- Policies para commissions (comissões)
CREATE POLICY "Professional can view own commissions" ON public.commissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      JOIN public.users u ON p.user_id = u.id
      WHERE u.id::text = auth.uid()::text 
      AND p.id = commissions.professional_id
    )
  );

-- Policies para expenses (despesas)
CREATE POLICY "Company members can manage expenses" ON public.expenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id::text = auth.uid()::text 
      AND users.company_id = expenses.company_id
    )
  );

-- Policies para invoices (faturas)
CREATE POLICY "Company members can view invoices" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id::text = auth.uid()::text 
      AND users.company_id = invoices.company_id
    )
  );

-- Policies para notifications (notificações)
CREATE POLICY "Company members can view notifications" ON public.notifications
  FOR SELECT USING (
    company_id IS NULL OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id::text = auth.uid()::text 
      AND users.company_id = notifications.company_id
    )
  );

-- Policies para plans (planos são públicos para leitura)
CREATE POLICY "Plans are publicly readable" ON public.plans
  FOR SELECT USING (true);