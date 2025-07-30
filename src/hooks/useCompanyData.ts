import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  companyApi, 
  servicesApi, 
  professionalsApi, 
  appointmentsApi, 
  clientsApi, 
  expensesApi 
} from '@/services/api';
import {
  transformCompanyFromDB,
  transformServiceFromDB,
  transformProfessionalFromDB,
  transformAppointmentFromDB,
  transformClientFromDB,
  transformExpenseFromDB
} from '@/utils/dataTransformers';
import type { 
  Company, 
  Service, 
  Professional, 
  Appointment, 
  Client, 
  Expense 
} from '@/types';

export const useCompanyData = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.companyId) {
      loadCompanyData(user.companyId);
    }
  }, [user?.companyId]);

  const loadCompanyData = async (companyId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [
        companyData,
        servicesData,
        professionalsData,
        appointmentsData,
        clientsData,
        expensesData
      ] = await Promise.all([
        companyApi.getById(companyId),
        servicesApi.getByCompany(companyId),
        professionalsApi.getByCompany(companyId),
        appointmentsApi.getByCompany(companyId),
        clientsApi.getByCompany(companyId),
        expensesApi.getByCompany(companyId)
      ]);

      setCompany(companyData ? transformCompanyFromDB(companyData) : null);
      setServices((servicesData || []).map(transformServiceFromDB));
      setProfessionals((professionalsData || []).map(transformProfessionalFromDB));
      setAppointments((appointmentsData || []).map(transformAppointmentFromDB));
      setClients((clientsData || []).map(transformClientFromDB));
      setExpenses((expensesData || []).map(transformExpenseFromDB));
    } catch (err) {
      console.error('Error loading company data:', err);
      setError('Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  // Service operations
  const addService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newService = await servicesApi.create(serviceData);
      setServices(prev => [...prev, transformServiceFromDB(newService)]);
      return transformServiceFromDB(newService);
    } catch (err) {
      console.error('Error adding service:', err);
      throw err;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const updatedService = await servicesApi.update(id, updates);
      setServices(prev => prev.map(s => s.id === id ? transformServiceFromDB(updatedService) : s));
      return transformServiceFromDB(updatedService);
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await servicesApi.delete(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  // Professional operations
  const addProfessional = async (professionalData: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProfessional = await professionalsApi.create(professionalData);
      setProfessionals(prev => [...prev, newProfessional]);
      return newProfessional;
    } catch (err) {
      console.error('Error adding professional:', err);
      throw err;
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      const updatedProfessional = await professionalsApi.update(id, updates);
      setProfessionals(prev => prev.map(p => p.id === id ? updatedProfessional : p));
      return updatedProfessional;
    } catch (err) {
      console.error('Error updating professional:', err);
      throw err;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      await professionalsApi.delete(id);
      setProfessionals(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting professional:', err);
      throw err;
    }
  };

  // Appointment operations
  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAppointment = await appointmentsApi.create(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      console.error('Error adding appointment:', err);
      throw err;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const updatedAppointment = await appointmentsApi.update(id, updates);
      setAppointments(prev => prev.map(a => a.id === id ? updatedAppointment : a));
      return updatedAppointment;
    } catch (err) {
      console.error('Error updating appointment:', err);
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await appointmentsApi.delete(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting appointment:', err);
      throw err;
    }
  };

  // Expense operations
  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newExpense = await expensesApi.create(expenseData);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  };

  return {
    // Data
    company,
    services,
    professionals,
    appointments,
    clients,
    expenses,
    loading,
    error,
    
    // Operations
    loadCompanyData,
    addService,
    updateService,
    deleteService,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addExpense
  };
};