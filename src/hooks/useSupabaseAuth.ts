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
  const navigate = useNavigate();

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

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await handleAuthUser(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await handleAuthUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (supabaseUser: User) => {
    try {
      // Get user details from our users table
      const { data, error } = await supabase
        .from('users')
        .select('role, name, company_id, avatar, must_change_password')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user details:', error);
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

      setUser(authUser);
      redirectUser(authUser.role);
    } catch (error) {
      console.error('Error handling auth user:', error);
    }
  };

  const redirectUser = (role: string) => {
    const currentPath = window.location.pathname;
    
    // Don't redirect if already on the correct path
    switch (role) {
      case 'super_admin':
        if (!currentPath.startsWith('/admin')) navigate('/admin');
        break;
      case 'company_admin':
        if (!currentPath.startsWith('/empresa')) navigate('/empresa');
        break;
      case 'professional':
        if (!currentPath.startsWith('/profissional')) navigate('/profissional');
        break;
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

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
      navigate('/login');
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