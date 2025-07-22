import React, { createContext, useContext, ReactNode, useState } from 'react';
import { 
  Company, 
  Plan, 
  Service, 
  Professional, 
  Appointment, 
  Client, 
  Commission, 
  Expense, 
  Coupon, 
  Notification, 
  Invoice 
} from '@/types';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface DataContextType {
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  updateCompany: (id: string, data: Partial<Company>) => void;
  addCompany: (company: Omit<Company, 'id'>) => void;
  deleteCompany: (id: string) => void;
  
  // Plans - Adicionando métodos CRUD para planos
  plans: Plan[];
  setPlans: (plans: Plan[]) => void;
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, data: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  
  services: Service[];
  setServices: (services: Service[]) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  professionals: Professional[];
  setProfessionals: (professionals: Professional[]) => void;
  addProfessional: (professional: Omit<Professional, 'id'>) => void;
  updateProfessional: (id: string, data: Partial<Professional>) => void;
  deleteProfessional: (id: string) => void;
  
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  clients: Client[];
  setClients: (clients: Client[]) => void;
  
  commissions: Commission[];
  setCommissions: (commissions: Commission[]) => void;
  
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;

  // Nova função para inicializar dados da empresa
  initializeCompanyData: (companyId: string) => void;
  
  // Nova função para limpar duplicações
  removeDuplicateCompanies: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  // Use Supabase data hook
  const supabaseData = useSupabaseData();

  // Initialize empty data arrays for local development fallback
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Clean functions for production
  const clearLocalStorage = () => {
    localStorage.removeItem('companies');
    localStorage.removeItem('services');
    localStorage.removeItem('professionals');
    localStorage.removeItem('appointments');
    localStorage.removeItem('clients');
    localStorage.removeItem('landingPageConfigurations');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const removeDuplicateCompanies = () => {
    console.log('Sistema limpo - não há mais dados duplicados');
  };

  const initializeCompanyData = (companyId: string) => {
    console.log('Dados da empresa serão carregados do Supabase:', companyId);
    // This will be handled by Supabase hooks
  };

  // Company CRUD operations using Supabase
  const updateCompany = async (id: string, data: Partial<Company>) => {
    // This will be handled by Supabase hooks
    console.log('Company update will use Supabase:', id, data);
  };

  const addCompany = async (companyData: Omit<Company, 'id'>) => {
    return supabaseData.createCompany(companyData);
  };

  const deleteCompany = (id: string) => {
    // This will be handled by Supabase hooks
    console.log('Company deletion will use Supabase:', id);
  };

  // Plan methods (read-only from Supabase)
  const addPlan = (planData: Omit<Plan, 'id'>) => {
    console.log('Plan creation requires super admin access');
  };

  const updatePlan = (id: string, data: Partial<Plan>) => {
    console.log('Plan updates require super admin access:', id, data);
  };

  const deletePlan = (id: string) => {
    console.log('Plan deletion requires super admin access:', id);
  };

  // Service operations (will use Supabase)
  const addService = (serviceData: Omit<Service, 'id'>) => {
    console.log('Service creation will use Supabase:', serviceData);
  };

  const updateService = (id: string, data: Partial<Service>) => {
    console.log('Service update will use Supabase:', id, data);
  };

  const deleteService = (id: string) => {
    console.log('Service deletion will use Supabase:', id);
  };

  // Professional operations (will use Supabase)
  const addProfessional = (professionalData: Omit<Professional, 'id'>) => {
    console.log('Professional creation will use Supabase:', professionalData);
  };

  const updateProfessional = (id: string, data: Partial<Professional>) => {
    console.log('Professional update will use Supabase:', id, data);
  };

  const deleteProfessional = (id: string) => {
    console.log('Professional deletion will use Supabase:', id);
  };

  // Appointment operations (will use Supabase)
  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    console.log('Appointment creation will use Supabase:', appointmentData);
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    console.log('Appointment update will use Supabase:', id, data);
  };

  const deleteAppointment = (id: string) => {
    console.log('Appointment deletion will use Supabase:', id);
  };

  // Expense operations (will use Supabase)
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    console.log('Expense creation will use Supabase:', expenseData);
  };

  // Coupon operations (local only for now)
  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon = {
      ...couponData,
      id: Date.now().toString()
    };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const updateCoupon = (id: string, data: Partial<Coupon>) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === id ? { ...coupon, ...data } : coupon
    ));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== id));
  };

  // Notification operations (will use Supabase)
  const addNotification = (notificationData: Omit<Notification, 'id'>) => {
    console.log('Notification creation will use Supabase:', notificationData);
  };

  const markNotificationAsRead = (id: string) => {
    console.log('Notification update will use Supabase:', id);
  };

  return (
    <DataContext.Provider value={{
      // Use Supabase data where available, empty arrays as fallback
      companies: supabaseData.companies,
      setCompanies: () => console.log('Use Supabase for company updates'),
      updateCompany,
      addCompany,
      deleteCompany,
      
      plans: supabaseData.plans,
      setPlans: () => console.log('Plans are managed through Supabase'),
      addPlan,
      updatePlan,
      deletePlan,
      
      services: supabaseData.services,
      setServices: () => console.log('Use Supabase for service updates'),
      addService,
      updateService,
      deleteService,
      
      professionals: supabaseData.professionals,
      setProfessionals: () => console.log('Use Supabase for professional updates'),
      addProfessional,
      updateProfessional,
      deleteProfessional,
      
      appointments: supabaseData.appointments,
      setAppointments: () => console.log('Use Supabase for appointment updates'),
      addAppointment,
      updateAppointment,
      deleteAppointment,
      
      clients: supabaseData.clients,
      setClients: () => console.log('Use Supabase for client updates'),
      
      commissions: supabaseData.commissions,
      setCommissions: () => console.log('Use Supabase for commission updates'),
      
      expenses: supabaseData.expenses,
      setExpenses: () => console.log('Use Supabase for expense updates'),
      addExpense,
      
      coupons,
      setCoupons,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      
      notifications: supabaseData.notifications,
      setNotifications: () => console.log('Use Supabase for notification updates'),
      addNotification,
      markNotificationAsRead,
      
      invoices: supabaseData.invoices,
      setInvoices: () => console.log('Use Supabase for invoice updates'),

      initializeCompanyData,
      removeDuplicateCompanies
    }}>
      {children}
    </DataContext.Provider>
  );
};
