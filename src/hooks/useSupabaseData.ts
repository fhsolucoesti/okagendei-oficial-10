import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Company, 
  Plan, 
  Service, 
  Professional, 
  Appointment, 
  Client, 
  Commission, 
  Expense, 
  Notification, 
  Invoice 
} from '@/types';

export const useSupabaseData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch plans (public)
  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      
      const mappedPlans: Plan[] = data?.map(plan => ({
        id: plan.id,
        name: plan.name,
        maxEmployees: plan.max_employees === 'unlimited' ? 'unlimited' : parseInt(plan.max_employees),
        monthlyPrice: Number(plan.monthly_price),
        yearlyPrice: Number(plan.yearly_price),
        features: Array.isArray(plan.features) ? plan.features as string[] : [],
        isPopular: plan.is_popular,
        isActive: plan.is_active
      })) || [];
      
      setPlans(mappedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  // Fetch companies (for current user)
  const fetchCompanies = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) throw error;
      
      const mappedCompanies: Company[] = data?.map(company => ({
        id: company.id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        plan: company.plan,
        status: company.status as 'trial' | 'active' | 'suspended' | 'cancelled',
        employees: company.employees,
        monthlyRevenue: Number(company.monthly_revenue),
        trialEndsAt: company.trial_ends_at,
        createdAt: company.created_at,
        customUrl: company.custom_url,
        whatsappNumber: company.whatsapp_number
      })) || [];
      
      setCompanies(mappedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Fetch services for a company
  const fetchServices = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      const mappedServices: Service[] = data?.map(service => ({
        id: service.id,
        companyId: service.company_id,
        name: service.name,
        description: service.description,
        price: Number(service.price),
        duration: service.duration,
        imageUrl: service.image_url,
        isActive: service.is_active
      })) || [];
      
      setServices(mappedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Create company
  const createCompany = async (companyData: Omit<Company, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          email: companyData.email,
          phone: companyData.phone,
          address: companyData.address,
          plan: companyData.plan,
          status: companyData.status,
          employees: companyData.employees,
          monthly_revenue: companyData.monthlyRevenue,
          custom_url: companyData.customUrl,
          whatsapp_number: companyData.whatsappNumber
        })
        .select()
        .single();

      if (error) throw error;

      const newCompany: Company = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        plan: data.plan,
        status: data.status,
        employees: data.employees,
        monthlyRevenue: Number(data.monthly_revenue),
        trialEndsAt: data.trial_ends_at,
        createdAt: data.created_at,
        customUrl: data.custom_url,
        whatsappNumber: data.whatsapp_number
      };

      setCompanies(prev => [...prev, newCompany]);
      return newCompany;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  };

  // Clear all local data
  const clearAllData = () => {
    setCompanies([]);
    setServices([]);
    setProfessionals([]);
    setAppointments([]);
    setClients([]);
    setCommissions([]);
    setExpenses([]);
    setNotifications([]);
    setInvoices([]);
  };

  // Initialize data
  const initializeData = async () => {
    setLoading(true);
    try {
      await fetchPlans();
      await fetchCompanies();
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    // Data
    companies,
    plans,
    services,
    professionals,
    appointments,
    clients,
    commissions,
    expenses,
    notifications,
    invoices,
    loading,

    // Methods
    fetchPlans,
    fetchCompanies,
    fetchServices,
    createCompany,
    clearAllData,
    initializeData
  };
};