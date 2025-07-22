
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'company_admin' | 'professional';
  companyId?: string;
  avatar?: string;
  mustChangePassword?: boolean;
}

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  let navigate;
  try {
    navigate = useNavigate();
    console.log('✅ useNavigate successful');
  } catch (error) {
    console.error('❌ Error with useNavigate:', error);
    navigate = () => console.log('Navigation not available');
  }

  // Get user role from database
  const getUserRole = async (userId: string): Promise<AuthUser['role']> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, name, company_id, avatar, must_change_password')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'professional';
      }

      return data.role || 'professional';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'professional';
    }
  };

  // Redirect user based on role
  const redirectUser = (userRole: AuthUser['role']) => {
    console.log('🔄 Redirecting user based on role:', userRole);
    
    try {
      switch (userRole) {
        case 'super_admin':
          navigate('/admin', { replace: true });
          break;
        case 'company_admin':
          navigate('/empresa', { replace: true });
          break;
        case 'professional':
          navigate('/profissional', { replace: true });
          break;
        default:
          console.warn('⚠️ Unknown role, redirecting to login');
          navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🚀 Initializing auth...');
    
    // Listen for auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
        console.log('📋 Session details:', session ? {
          user: session.user?.email,
          expires: session.expires_at,
          token: !!session.access_token
        } : 'null');
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ SIGNED_IN event detected, calling handleAuthUser');
          await handleAuthUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUser(null);
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          console.log('🔄 Initial session found, calling handleAuthUser');
          await handleAuthUser(session.user);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Initial session check:', session ? 'Session found' : 'No session');
        
        if (session?.user) {
          console.log('🔄 Existing session found, calling handleAuthUser');
          await handleAuthUser(session.user);
        } else {
          console.log('❌ No user in session, setting loading to false');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (supabaseUser: User) => {
    try {
      console.log('🔄 Handling auth user:', supabaseUser.email);
      console.log('📍 Current location:', window.location.pathname);
      
      // Get user details from our users table
      const { data, error } = await supabase
        .from('users')
        .select('role, name, company_id, avatar, must_change_password')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('❌ Error fetching user details:', error);
        return;
      }

      const authUser: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: data?.name || '',
        role: data?.role || 'professional',
        companyId: data?.company_id || undefined,
        avatar: data?.avatar || undefined,
        mustChangePassword: data?.must_change_password || false
      };

      console.log('✅ User authenticated successfully:', { 
        email: authUser.email, 
        role: authUser.role,
        currentPath: window.location.pathname
      });
      
      setUser(authUser);
      
      // Always redirect after login - remove the isDashboardPage check that was preventing redirection
      const currentPath = window.location.pathname;
      console.log('🎯 Checking if redirection is needed from:', currentPath);
      
      if (currentPath === '/login' || currentPath === '/' || currentPath === '/home') {
        console.log('🚀 Redirecting from login/home to dashboard for role:', authUser.role);
        redirectUser(authUser.role);
        
        // Fallback redirecionamento manual após 2 segundos
        setTimeout(() => {
          const stillOnSamePage = window.location.pathname === currentPath;
          if (stillOnSamePage) {
            console.log('⚠️ Auto-redirect failed, forcing manual redirect');
            const targetPath = authUser.role === 'super_admin' ? '/admin' :
                             authUser.role === 'company_admin' ? '/empresa' :
                             '/profissional';
            window.location.href = targetPath;
          }
        }, 2000);
      } else {
        console.log('✅ User already on correct dashboard, no redirect needed');
      }
    } catch (error) {
      console.error('❌ Error handling auth user:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    role?: 'company_admin' | 'professional';
    companyName?: string;
  }) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user record in our users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: userData.name,
            email: email,
            role: userData.role || 'professional',
            password: 'supabase_managed' // Placeholder since Supabase manages passwords
          });

        if (userError) throw userError;

        // If creating a company admin, create the company
        if (userData.role === 'company_admin' && userData.companyName) {
          const { error: companyError } = await supabase
            .from('companies')
            .insert({
              name: userData.companyName,
              email: email,
              phone: '',
              address: '',
              status: 'trial'
            });

          if (companyError) throw companyError;
        }

        return { success: true, user: data.user };
      }

      return { success: false, error: 'Failed to create user' };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Starting signIn process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ SignIn error:', error);
        setLoading(false); // Reset loading on error
        throw error;
      }

      console.log('✅ SignIn successful:', data.user?.email);
      console.log('🔗 Session created:', !!data.session);
      
      // Don't set loading to false here - let onAuthStateChange handle it
      // after the user is properly authenticated and redirected
      
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('Error signing in:', error);
      setLoading(false); // Only reset on error
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      try {
        navigate('/login');
      } catch (navError) {
        console.error('❌ Navigation error in signOut:', navError);
        window.location.pathname = '/login';
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
};
