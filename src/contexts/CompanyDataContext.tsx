import React, { createContext, useContext, ReactNode } from 'react';
import { useCompanyData } from '@/hooks/useCompanyData';
import type { 
  Company, 
  Service, 
  Professional, 
  Appointment, 
  Client, 
  Expense 
} from '@/types';

interface CompanyDataContextType {
  // Data
  company: Company | null;
  services: Service[];
  professionals: Professional[];
  appointments: Appointment[];
  clients: Client[];
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  
  // Operations
  loadCompanyData: (companyId: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<Service>;
  updateService: (id: string, updates: Partial<Service>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  addProfessional: (professional: Omit<Professional, 'id'>) => Promise<Professional>;
  updateProfessional: (id: string, updates: Partial<Professional>) => Promise<Professional>;
  deleteProfessional: (id: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<Appointment>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<Expense>;
}

const CompanyDataContext = createContext<CompanyDataContextType | undefined>(undefined);

export const useCompanyDataContext = () => {
  const context = useContext(CompanyDataContext);
  if (!context) {
    throw new Error('useCompanyDataContext must be used within a CompanyDataProvider');
  }
  return context;
};

interface CompanyDataProviderProps {
  children: ReactNode;
}

export const CompanyDataProvider = ({ children }: CompanyDataProviderProps) => {
  const companyData = useCompanyData();

  return (
    <CompanyDataContext.Provider value={companyData}>
      {children}
    </CompanyDataContext.Provider>
  );
};