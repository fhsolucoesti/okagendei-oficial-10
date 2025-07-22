
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
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Initial session check:', session ? 'Session found' : 'No session');
        
        if (session?.user) {
          await handleAuthUser(session.user);
        } else {
          console.log('❌ No user in session, setting loading to false');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
        
        if (event === 'SIGNED_IN' && session?.user) {
          await handleAuthUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (supabaseUser: User) => {
    try {
      console.log('🔄 Handling auth user:', supabaseUser.email);
      
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

      console.log('✅ User authenticated successfully:', { email: authUser.email, role: authUser.role });
      setUser(authUser);
      
      // Only redirect if not already on a dashboard page
      const currentPath = window.location.pathname;
      const isDashboardPage = currentPath.startsWith('/admin') || 
                             currentPath.startsWith('/empresa') || 
                             currentPath.startsWith('/profissional');
      
      if (!isDashboardPage) {
        console.log('🚀 Redirecting from login to dashboard...');
        redirectUser(authUser.role);
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
        throw error;
      }

      console.log('✅ SignIn successful:', data.user?.email);
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
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
