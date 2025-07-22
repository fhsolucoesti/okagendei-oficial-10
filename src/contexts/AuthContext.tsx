
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface AuthContextType {
  user: any | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: {
    name: string;
    role?: 'company_admin' | 'professional';
    companyName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  authError: string | null;
  forceLogout: () => void;
  // Legacy methods for compatibility
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (id: string, userData: any) => void;
  createCompanyUser: (userData: {
    companyName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
    planId: string;
    billingType: 'monthly' | 'annual';
  }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  console.log('🔄 AuthProvider rendering...');
  
  let supabaseAuth;
  try {
    supabaseAuth = useSupabaseAuth();
    console.log('✅ useSupabaseAuth successful:', !!supabaseAuth);
  } catch (error) {
    console.error('❌ Error in useSupabaseAuth:', error);
    // Provide a fallback auth state
    supabaseAuth = {
      user: null,
      loading: false,
      authError: 'Auth not available',
      signIn: async () => ({ success: false, error: 'Auth not available' }),
      signUp: async () => ({ success: false, error: 'Auth not available' }),
      signOut: async () => {},
      forceLogout: async () => {},
      isAuthenticated: false
    };
  }

  // Legacy compatibility methods
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔄 Legacy login method called for:', email);
    const result = await supabaseAuth.signIn(email, password);
    console.log('🔄 Legacy login result:', result.success);
    return result.success;
  };

  const createCompanyUser = async (userData: {
    companyName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
    planId: string;
    billingType: 'monthly' | 'annual';
  }): Promise<boolean> => {
    const result = await supabaseAuth.signUp(userData.email, userData.password, {
      name: userData.ownerName,
      role: 'company_admin',
      companyName: userData.companyName
    });
    return result.success;
  };

  const logout = () => {
    supabaseAuth.signOut();
  };

  const updateUser = (id: string, userData: any) => {
    console.log('User updates will be handled through Supabase:', id, userData);
  };

  return (
    <AuthContext.Provider value={{
      // Use Supabase auth
      user: supabaseAuth.user,
      signIn: supabaseAuth.signIn,
      signUp: supabaseAuth.signUp,
      signOut: supabaseAuth.signOut,
      isAuthenticated: supabaseAuth.isAuthenticated,
      loading: supabaseAuth.loading,
      authError: supabaseAuth.authError,
      forceLogout: supabaseAuth.forceLogout,
      
      // Legacy compatibility
      login,
      logout,
      updateUser,
      createCompanyUser,
      isLoading: supabaseAuth.loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
