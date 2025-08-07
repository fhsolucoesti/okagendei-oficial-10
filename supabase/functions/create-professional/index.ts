import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { profName, profEmail, companyId, userId } = await req.json();

    console.log('Creating professional:', { profName, profEmail, companyId, userId });

    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();

    // Create user with admin privileges
    const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: profEmail,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        name: profName
      }
    });

    if (userError) {
      console.error('Error creating user:', userError);
      throw userError;
    }

    console.log('User created successfully:', newUser.user?.id);

    // Insert into profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        name: profName,
        role: 'professional',
        company_id: companyId,
        must_change_password: true
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

    // Insert into professionals table
    const { error: professionalError } = await supabaseAdmin
      .from('professionals')
      .insert({
        user_id: newUser.user.id,
        company_id: companyId,
        name: profName,
        email: profEmail,
        commission: 0,
        is_active: true,
        specialties: []
      });

    if (professionalError) {
      console.error('Error creating professional:', professionalError);
      throw professionalError;
    }

    console.log('Professional created successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: newUser.user.id,
        temporaryPassword: randomPassword,
        message: 'Profissional criado com sucesso'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-professional function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});