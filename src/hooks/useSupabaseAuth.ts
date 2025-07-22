
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
  const [authError, setAuthError] = useState<string | null>(null);
  
  let navigate;
  try {
    navigate = useNavigate();
    console.log('✅ useNavigate successful');
  } catch (error) {
    console.error('❌ Error with useNavigate:', error);
    navigate = () => console.log('Navigation not available');
  }

  // Clear auth error when setting loading
  const setLoadingWithErrorClear = (isLoading: boolean) => {
    setLoading(isLoading);
    if (!isLoading) {
      setAuthError(null);
    }
  };

  // Get user role from database with enhanced error handling
  const getUserData = async (userId: string, retryCount = 0): Promise<AuthUser | null> => {
    try {
      console.log(`🔍 Fetching user data for ID: ${userId} (attempt ${retryCount + 1})`);
      
      // Check if Supabase client is properly initialized
      if (!supabase) {
        console.error('❌ Supabase client not initialized');
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('role, name, company_id, avatar, must_change_password, email')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Supabase query error:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });

        // If user not found and we haven't retried, try once more
        if (error.code === 'PGRST116' && retryCount < 2) {
          console.log('⚠️ User not found, retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return getUserData(userId, retryCount + 1);
        }

        // If user not found after retries, create a fallback user
        if (error.code === 'PGRST116') {
          console.warn('⚠️ User not found in database, creating fallback user');
          const fallbackUser = await createFallbackUser(userId);
          return fallbackUser;
        }

        return null;
      }

      if (!data) {
        console.error('❌ No user data returned from query');
        return null;
      }

      console.log('✅ User data fetched successfully:', {
        role: data.role,
        name: data.name,
        companyId: data.company_id,
        email: data.email
      });

      return {
        id: userId,
        email: data.email || '',
        name: data.name || 'Usuário',
        role: data.role || 'professional',
        companyId: data.company_id || undefined,
        avatar: data.avatar || undefined,
        mustChangePassword: data.must_change_password || false
      };
    } catch (error) {
      console.error('❌ Exception in getUserData:', error);
      
      // Retry once on network/connection errors
      if (retryCount < 1) {
        console.log('🔄 Retrying getUserData due to exception...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getUserData(userId, retryCount + 1);
      }
      
      return null;
    }
  };

  // Create fallback user when not found in database
  const createFallbackUser = async (userId: string): Promise<AuthUser | null> => {
    try {
      console.log('🔄 Creating fallback user entry for:', userId);
      
      // Get email from Supabase auth user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const email = authUser?.email || 'usuario@sistema.com';
      
      // Try to insert user in database
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          name: 'Usuário Sistema',
          email: email,
          password: 'supabase_managed',
          role: 'professional'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create fallback user:', error);
        // Return a minimal user object even if insert fails
        return {
          id: userId,
          email: email,
          name: 'Usuário Sistema',
          role: 'professional',
          mustChangePassword: false
        };
      }

      console.log('✅ Fallback user created successfully');
      return {
        id: userId,
        email: email,
        name: 'Usuário Sistema',
        role: 'professional',
        mustChangePassword: false
      };
    } catch (error) {
      console.error('❌ Exception creating fallback user:', error);
      return null;
    }
  };

  // Redirect user based on role
  const redirectUser = (userRole: AuthUser['role']) => {
    console.log('🚀 Redirecting user based on role:', userRole);
    
    try {
      const currentPath = window.location.pathname;
      console.log('📍 Current path before redirect:', currentPath);
      
      let targetPath = '/login';
      switch (userRole) {
        case 'super_admin':
          targetPath = '/admin';
          break;
        case 'company_admin':
          targetPath = '/empresa';
          break;
        case 'professional':
          targetPath = '/profissional';
          break;
        default:
          console.warn('⚠️ Unknown role, redirecting to login');
          targetPath = '/login';
      }

      if (currentPath !== targetPath) {
        console.log(`🎯 Redirecting to ${targetPath}`);
        navigate(targetPath, { replace: true });
      } else {
        console.log(`✅ Already on correct path: ${targetPath}`);
      }
    } catch (error) {
      console.error('❌ Navigation error:', error);
      // Fallback para redirecionamento manual
      const targetPath = userRole === 'super_admin' ? '/admin' :
                        userRole === 'company_admin' ? '/empresa' :
                        userRole === 'professional' ? '/profissional' : '/login';
      window.location.href = targetPath;
    }
  };

  // Handle authenticated user with enhanced error handling
  const handleAuthUser = async (supabaseUser: User) => {
    try {
      console.log('🔄 Starting handleAuthUser for:', supabaseUser.email);
      console.log('📍 Current location:', window.location.pathname);
      
      setAuthError(null);
      
      // Get user details from our users table
      const userData = await getUserData(supabaseUser.id);
      
      if (!userData) {
        console.error('❌ Failed to get user data after all retries');
        setAuthError('Erro ao carregar dados do usuário. Tente fazer login novamente.');
        setLoadingWithErrorClear(false);
        return;
      }

      // Complete the user object with email from Supabase
      const authUser: AuthUser = {
        ...userData,
        email: supabaseUser.email || userData.email
      };

      console.log('✅ User authenticated successfully:', { 
        email: authUser.email, 
        role: authUser.role,
        name: authUser.name,
        currentPath: window.location.pathname
      });
      
      // Set user in state
      setUser(authUser);
      
      // Always try to redirect to correct dashboard
      const currentPath = window.location.pathname;
      console.log('🎯 Checking redirection for path:', currentPath);
      
      // Only redirect if on login page, home page, or wrong dashboard
      const shouldRedirect = currentPath === '/login' || 
                           currentPath === '/' || 
                           currentPath === '/home' ||
                           (authUser.role === 'super_admin' && currentPath !== '/admin') ||
                           (authUser.role === 'company_admin' && currentPath !== '/empresa') ||
                           (authUser.role === 'professional' && currentPath !== '/profissional');
      
      if (shouldRedirect) {
        console.log('🚀 Redirection needed for role:', authUser.role);
        redirectUser(authUser.role);
      } else {
        console.log('✅ User already on correct dashboard, no redirect needed');
      }
      
      // IMPORTANT: Always set loading to false after processing
      console.log('✅ Setting loading to false - user processing complete');
      setLoadingWithErrorClear(false);
      
    } catch (error) {
      console.error('❌ Error in handleAuthUser:', error);
      setAuthError('Erro na autenticação. Tente novamente.');
      setLoadingWithErrorClear(false);
    }
  };

  // Force logout function
  const forceLogout = async () => {
    try {
      console.log('🔄 Force logout initiated');
      setLoadingWithErrorClear(true);
      await supabase.auth.signOut();
      setUser(null);
      setAuthError(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('❌ Error in force logout:', error);
      // Fallback: clear local state and redirect
      setUser(null);
      setAuthError(null);
      window.location.href = '/login';
    } finally {
      setLoadingWithErrorClear(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🚀 Initializing auth...');
    
    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      console.warn('⚠️ Auth initialization timeout reached, forcing loading = false');
      setAuthError('Timeout na autenticação. Tente recarregar a página.');
      setLoadingWithErrorClear(false);
    }, 10000); // 10 seconds timeout
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
        
        clearTimeout(safetyTimeout);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ SIGNED_IN event detected, calling handleAuthUser');
          await handleAuthUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUser(null);
          setAuthError(null);
          setLoadingWithErrorClear(false);
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            console.log('🔄 Initial session found, processing user');
            await handleAuthUser(session.user);
          } else {
            console.log('📊 Initial session check: No session');
            setLoadingWithErrorClear(false);
          }
        } else {
          console.log('ℹ️ Other auth event:', event);
          setLoadingWithErrorClear(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const signUp = async (email: string, password: string, userData: {
    name: string;
    role?: 'company_admin' | 'professional';
    companyName?: string;
  }) => {
    try {
      setLoadingWithErrorClear(true);
      console.log('📝 Starting signUp for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('❌ SignUp error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ SignUp successful, creating user record');
        
        // Create user record in our users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: userData.name,
            email: email,
            role: userData.role || 'professional',
            password: 'supabase_managed'
          });

        if (userError) {
          console.error('❌ Error creating user record:', userError);
          throw userError;
        }

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

          if (companyError) {
            console.error('❌ Error creating company:', companyError);
            throw companyError;
          }
        }

        return { success: true, user: data.user };
      }

      return { success: false, error: 'Failed to create user' };
    } catch (error: any) {
      console.error('❌ SignUp failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoadingWithErrorClear(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoadingWithErrorClear(true);
      setAuthError(null);
      console.log('🔐 Starting signIn for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ SignIn error:', error);
        setLoadingWithErrorClear(false);
        throw error;
      }

      console.log('✅ SignIn successful for:', data.user?.email);
      console.log('🔗 Session created:', !!data.session);
      
      // Don't set loading to false here - handleAuthUser will do it
      // after processing the user data
      
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('❌ SignIn failed:', error);
      setAuthError(error.message || 'Erro ao fazer login');
      setLoadingWithErrorClear(false);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setLoadingWithErrorClear(true);
      console.log('👋 Starting signOut');
      
      await supabase.auth.signOut();
      setUser(null);
      setAuthError(null);
      
      try {
        navigate('/login');
      } catch (navError) {
        console.error('❌ Navigation error in signOut:', navError);
        window.location.pathname = '/login';
      }
    } catch (error) {
      console.error('❌ SignOut error:', error);
    } finally {
      setLoadingWithErrorClear(false);
    }
  };

  return {
    user,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    forceLogout,
    isAuthenticated: !!user
  };
};
