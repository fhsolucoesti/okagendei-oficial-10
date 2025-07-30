-- Corrigir campos NULL na tabela auth.users que estão causando erro de login
UPDATE auth.users 
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  recovery_token = COALESCE(recovery_token, '')
WHERE email = 'fernandohsales@outlook.com';