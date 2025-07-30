-- Corrigir recursão infinita nas políticas RLS

-- Primeiro, remover as políticas problemáticas
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Company members can view company notifications" ON notifications;
DROP POLICY IF EXISTS "Company admins can view own company" ON companies;
DROP POLICY IF EXISTS "Company members can view company clients" ON clients;
DROP POLICY IF EXISTS "Company members can view company services" ON services;
DROP POLICY IF EXISTS "Company members can view company professionals" ON professionals;
DROP POLICY IF EXISTS "Company members can view company appointments" ON appointments;
DROP POLICY IF EXISTS "Company members can view company expenses" ON expenses;

-- Recriar políticas sem recursão
-- Política simples para super admins
CREATE POLICY "Super admins can view all profiles" 
ON profiles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
  )
);

-- Políticas para outras tabelas usando auth.uid() diretamente
CREATE POLICY "Company admins can view own company" 
ON companies FOR SELECT 
USING (
  id IN (
    SELECT company_id FROM profiles 
    WHERE profiles.id = auth.uid()
  )
);

CREATE POLICY "Anyone can view active plans" 
ON plans FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view landing config" 
ON landing_config FOR SELECT 
USING (true);

CREATE POLICY "Global notifications visible to all" 
ON notifications FOR SELECT 
USING (company_id IS NULL OR true);