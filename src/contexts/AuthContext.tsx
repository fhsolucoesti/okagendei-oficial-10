
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Company } from '@/types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  companyId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  createCompanyUser: (userData: {
    companyName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
    planId: string;
    billingType: 'monthly' | 'annual';
  }) => Promise<boolean>;
  isAuthenticated: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Configurar auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setIsLoading(true);

        if (session?.user) {
          // Buscar dados do perfil do usuário
          const { data: profile } = await supabase
            .from('profiles')
            .select(`
              *,
              companies (*)
            `)
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const userData: User = {
              id: profile.id,
              name: profile.name,
              email: session.user.email || '',
              role: profile.role,
              companyId: profile.company_id,
              mustChangePassword: profile.must_change_password || false
            };
            setUser(userData);
            setCompanyId(profile.company_id);

            // Redirecionar se estiver na página de login
            if (location.pathname === '/login') {
              const getRedirectPath = (role: string) => {
                switch (role) {
                  case 'super_admin':
                    return '/admin';
                  case 'company_admin':
                    return '/empresa';
                  case 'professional':
                    return '/profissional';
                  default:
                    return '/';
                }
              };
              const redirectPath = getRedirectPath(userData.role);
              console.log('🔄 Redirecionando usuário:', {
                email: userData.email,
                role: userData.role,
                redirectPath,
                currentPath: window.location.pathname
              });
              navigate(redirectPath, { replace: true });
            }
          }
        } else {
          setUser(null);
          setCompanyId(null);
        }
        setIsLoading(false);
      }
    );

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error.message);
        setIsLoading(false);
        return false;
      }

      // O auth state listener já cuidará de definir o usuário
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return false;
    }
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
    setIsLoading(true);
    
    try {
      // Step 1: Create user account
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.ownerName,
            company_name: userData.companyName,
            phone: userData.phone
          }
        }
      });

      if (signupError || !signupData.user) {
        console.error('Erro ao criar usuário:', signupError?.message);
        setIsLoading(false);
        return false;
      }

      // Step 2: Create company
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: userData.companyName,
          email: userData.email,
          phone: userData.phone,
          address: '—',
          plan: userData.planId,
          status: 'trial',
          trial_ends_at: trialEndDate.toISOString()
        })
        .select()
        .single();

      if (companyError || !newCompany) {
        console.error('Erro ao criar empresa:', companyError?.message);
        setIsLoading(false);
        return false;
      }

      // Step 3: Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: userData.ownerName,
          role: 'company_admin',
          company_id: newCompany.id
        })
        .eq('id', signupData.user.id);

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError.message);
        setIsLoading(false);
        return false;
      }

      // Step 4: Set context
      setCompanyId(newCompany.id);
      
      console.log('✅ Empresa criada com sucesso:', {
        userId: signupData.user.id,
        companyId: newCompany.id,
        companyName: userData.companyName
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erro ao criar empresa e usuário:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setCompanyId(null);
    navigate('/login');
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    if (user && user.id === id) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            must_change_password: userData.mustChangePassword
          })
          .eq('id', id);

        if (!error) {
          const updatedUser = { ...user, ...userData };
          setUser(updatedUser);
        }
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
      }
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      companyId,
      login,
      logout,
      updateUser,
      createCompanyUser,
      isAuthenticated,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
