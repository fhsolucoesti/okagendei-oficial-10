import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Company } from '@/types';
import { companyApi } from '@/services/api';
import { transformCompanyFromDB } from '@/utils/dataTransformers';
import { toast } from 'sonner';

interface SuperAdminContextType {
  companies: Company[];
  loading: boolean;
  error: string | null;
  loadCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, 'id'>) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<Company>;
  deleteCompany: (id: string) => Promise<void>;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
};

interface SuperAdminProviderProps {
  children: ReactNode;
}

export const SuperAdminProvider = ({ children }: SuperAdminProviderProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyApi.getAll();
      setCompanies((data || []).map(transformCompanyFromDB));
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Erro ao carregar empresas');
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (companyData: Omit<Company, 'id'>) => {
    try {
      const dbCompany = await companyApi.create(companyData);
      const newCompany = transformCompanyFromDB(dbCompany);
      setCompanies(prev => [...prev, newCompany]);
      toast.success('Empresa criada com sucesso');
      return newCompany;
    } catch (err) {
      console.error('Error adding company:', err);
      toast.error('Erro ao criar empresa');
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const dbCompany = await companyApi.update(id, updates);
      const updatedCompany = transformCompanyFromDB(dbCompany);
      setCompanies(prev => prev.map(company => 
        company.id === id ? updatedCompany : company
      ));
      toast.success('Empresa atualizada com sucesso');
      return updatedCompany;
    } catch (err) {
      console.error('Error updating company:', err);
      toast.error('Erro ao atualizar empresa');
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await companyApi.delete(id);
      setCompanies(prev => prev.filter(company => company.id !== id));
      toast.success('Empresa removida com sucesso');
    } catch (err) {
      console.error('Error deleting company:', err);
      toast.error('Erro ao remover empresa');
      throw err;
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <SuperAdminContext.Provider value={{
      companies,
      loading,
      error,
      loadCompanies,
      addCompany,
      updateCompany,
      deleteCompany
    }}>
      {children}
    </SuperAdminContext.Provider>
  );
};