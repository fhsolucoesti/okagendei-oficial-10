-- Corrigir recursão infinita - remover apenas políticas específicas e recriar sem recursão

-- Remover políticas que estão causando recursão
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;

-- Criar função security definer para evitar recursão
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recriar política usando função
CREATE POLICY "Super admins can view all profiles" 
ON profiles FOR ALL 
USING (public.get_current_user_role() = 'super_admin');

-- Simplificar políticas para evitar recursão
DROP POLICY IF EXISTS "Company admins can view own company" ON companies;
CREATE POLICY "Company admins can view own company" 
ON companies FOR SELECT 
USING (
  id IN (
    SELECT company_id FROM profiles 
    WHERE profiles.id = auth.uid()
  )
);