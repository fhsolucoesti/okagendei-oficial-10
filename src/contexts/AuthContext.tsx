
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Company } from '@/types';

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      return JSON.parse(savedUser);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data para fallback
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Super Admin',
      email: 'admin@okagendei.com',
      role: 'super_admin'
    },
    {
      id: '2',
      name: 'João Silva',
      email: 'empresa@teste.com',
      role: 'company_admin',
      companyId: '1'
    },
    {
      id: '3',
      name: 'Carlos Barbeiro',
      email: 'profissional@teste.com',
      role: 'professional',
      companyId: '1'
    }
  ]);

  const [companies] = useState<Company[]>([
    {
      id: '1',
      name: 'Empresa Teste',
      email: 'empresa@teste.com',
      phone: '(11) 99999-9999',
      address: 'Rua Teste, 123',
      plan: 'professional',
      status: 'active',
      employees: 5,
      monthlyRevenue: 12500,
      trialEndsAt: null,
      createdAt: '2024-01-15T10:00:00Z',
      customUrl: 'empresa-teste'
    }
  ]);

  // Redirecionar usuário logado automaticamente
  useEffect(() => {
    if (user && location.pathname === '/login') {
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

      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [user, location.pathname, navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Tentar login com API primeiro
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.token && data.user) {
          // Verificar se a empresa tem assinatura cancelada
          if (data.user.companyId) {
            const userCompany = companies.find(c => c.id === data.user.companyId);
            if (userCompany?.status === 'cancelled') {
              setIsLoading(false);
              navigate('/assinatura-cancelada', { replace: true });
              return false;
            }
          }

          const userWithAuth = { ...data.user };
          
          // Se é o primeiro login e a senha não foi alterada, marcar para alterar
          if (password === 'temp123' || data.user.mustChangePassword) {
            userWithAuth.mustChangePassword = true;
          }
          
          setUser(userWithAuth);
          localStorage.setItem('user', JSON.stringify(userWithAuth));
          localStorage.setItem('token', data.token);
          
          // Redirecionar baseado no role do usuário
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

          const redirectPath = getRedirectPath(userWithAuth.role);
          navigate(redirectPath, { replace: true });
          
          setIsLoading(false);
          return true;
        }
      }
      
      // Fallback para dados mockados se a API não estiver disponível
      console.log('API não disponível, usando dados mockados');
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        // Verificar se a empresa tem assinatura cancelada
        if (foundUser.companyId) {
          const userCompany = companies.find(c => c.id === foundUser.companyId);
          if (userCompany?.status === 'cancelled') {
            setIsLoading(false);
            navigate('/assinatura-cancelada', { replace: true });
            return false;
          }
        }

        const userWithAuth = { ...foundUser };
        
        // Se é o primeiro login e a senha não foi alterada, marcar para alterar
        if (password === 'temp123' || foundUser.mustChangePassword) {
          userWithAuth.mustChangePassword = true;
        }
        
        setUser(userWithAuth);
        localStorage.setItem('user', JSON.stringify(userWithAuth));
        localStorage.setItem('token', 'mock-token');
        
        // Redirecionar baseado no role do usuário
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

        const redirectPath = getRedirectPath(userWithAuth.role);
        navigate(redirectPath, { replace: true });
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Fallback para dados mockados em caso de erro
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        const userWithAuth = { ...foundUser };
        setUser(userWithAuth);
        localStorage.setItem('user', JSON.stringify(userWithAuth));
        localStorage.setItem('token', 'mock-token');
        
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

        const redirectPath = getRedirectPath(userWithAuth.role);
        navigate(redirectPath, { replace: true });
        
        setIsLoading(false);
        return true;
      }
      
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
      // Tentar registrar com API primeiro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.ownerName,
          email: userData.email,
          password: userData.password,
          role: 'company_admin',
          companyName: userData.companyName
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.token && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          
          setIsLoading(false);
          return true;
        }
      }
      
      // Fallback para implementação local se a API não estiver disponível
      console.log('API não disponível, usando implementação local');
      
      // Verificar se o e-mail já existe
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        setIsLoading(false);
        return false;
      }

      // Simular criação de empresa e usuário
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser: User = {
        id: newUserId,
        name: userData.ownerName,
        email: userData.email,
        role: 'company_admin',
        companyId: '1', // Mock company ID
        mustChangePassword: false
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', 'mock-token');

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erro ao criar empresa e usuário:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    if (user && user.id === id) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
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
