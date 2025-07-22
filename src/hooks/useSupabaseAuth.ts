
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
  const getUserData = async (userId: string): Promise<AuthUser | null> => {
    try {
      console.log('🔍 Fetching user data for ID:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('role, name, company_id, avatar, must_change_password')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching user data:', error);
        return null;
      }

      if (!data) {
        console.error('❌ No user data found for ID:', userId);
        return null;
      }

      console.log('✅ User data fetched successfully:', {
        role: data.role,
        name: data.name,
        companyId: data.company_id
      });

      return {
        id: userId,
        email: '', // Will be filled from Supabase user
        name: data.name || '',
        role: data.role || 'professional',
        companyId: data.company_id || undefined,
        avatar: data.avatar || undefined,
        mustChangePassword: data.must_change_password || false
      };
    } catch (error) {
      console.error('❌ Exception in getUserData:', error);
      return null;
    }
  };

  // Redirect user based on role
  const redirectUser = (userRole: AuthUser['role']) => {
    console.log('🚀 Redirecting user based on role:', userRole);
    
    try {
      const currentPath = window.location.pathname;
      console.log('📍 Current path before redirect:', currentPath);
      
      switch (userRole) {
        case 'super_admin':
          if (currentPath !== '/admin') {
            console.log('🎯 Redirecting to /admin');
            navigate('/admin', { replace: true });
          } else {
            console.log('✅ Already on correct path: /admin');
          }
          break;
        case 'company_admin':
          if (currentPath !== '/empresa') {
            console.log('🎯 Redirecting to /empresa');
            navigate('/empresa', { replace: true });
          } else {
            console.log('✅ Already on correct path: /empresa');
          }
          break;
        case 'professional':
          if (currentPath !== '/profissional') {
            console.log('🎯 Redirecting to /profissional');
            navigate('/profissional', { replace: true });
          } else {
            console.log('✅ Already on correct path: /profissional');
          }
          break;
        default:
          console.warn('⚠️ Unknown role, redirecting to login');
          navigate('/login', { replace: true });
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

  // Handle authenticated user
  const handleAuthUser = async (supabaseUser: User) => {
    try {
      console.log('🔄 Starting handleAuthUser for:', supabaseUser.email);
      console.log('📍 Current location:', window.location.pathname);
      
      // Get user details from our users table
      const userData = await getUserData(supabaseUser.id);
      
      if (!userData) {
        console.error('❌ Failed to get user data, setting loading to false');
        setLoading(false);
        return;
      }

      // Complete the user object with email from Supabase
      const authUser: AuthUser = {
        ...userData,
        email: supabaseUser.email || ''
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
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Error in handleAuthUser:', error);
      setLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🚀 Initializing auth...');
    
    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      console.warn('⚠️ Auth initialization timeout reached, forcing loading = false');
      setLoading(false);
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
          setLoading(false);
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            console.log('🔄 Initial session found, processing user');
            await handleAuthUser(session.user);
          } else {
            console.log('📊 Initial session check: No session');
            setLoading(false);
          }
        } else {
          console.log('ℹ️ Other auth event:', event);
          setLoading(false);
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
      setLoading(true);
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
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Starting signIn for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ SignIn error:', error);
        setLoading(false);
        throw error;
      }

      console.log('✅ SignIn successful for:', data.user?.email);
      console.log('🔗 Session created:', !!data.session);
      
      // Don't set loading to false here - handleAuthUser will do it
      // after processing the user data
      
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('❌ SignIn failed:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('👋 Starting signOut');
      
      await supabase.auth.signOut();
      setUser(null);
      
      try {
        navigate('/login');
      } catch (navError) {
        console.error('❌ Navigation error in signOut:', navError);
        window.location.pathname = '/login';
      }
    } catch (error) {
      console.error('❌ SignOut error:', error);
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
