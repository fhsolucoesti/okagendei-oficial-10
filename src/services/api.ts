import { supabase } from '@/integrations/supabase/client';
import type { 
  Company, 
  Service, 
  Professional, 
  Appointment, 
  Client, 
  Plan, 
  Commission, 
  Expense, 
  Notification 
} from '@/types';

// Company API
export const companyApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async create(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Company>) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Services API
export const servicesApi = {
  async getByCompany(companyId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data;
  },

  async create(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('services')
      .insert({
        ...service,
        company_id: service.companyId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Service>) {
    const { data, error } = await supabase
      .from('services')
      .update({
        ...updates,
        company_id: updates.companyId
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Professionals API
export const professionalsApi = {
  async getByCompany(companyId: string) {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data;
  },

  async create(professional: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('professionals')
      .insert({
        ...professional,
        company_id: professional.companyId,
        user_id: professional.userId,
        image_url: professional.imageUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Professional>) {
    const { data, error } = await supabase
      .from('professionals')
      .update({
        ...updates,
        company_id: updates.companyId,
        user_id: updates.userId,
        image_url: updates.imageUrl
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Appointments API
export const appointmentsApi = {
  async getByCompany(companyId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data;
  },

  async create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        ...appointment,
        company_id: appointment.companyId,
        professional_id: appointment.professionalId,
        service_id: appointment.serviceId,
        client_name: appointment.clientName,
        client_phone: appointment.clientPhone,
        client_birth_date: appointment.clientBirthDate
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...updates,
        company_id: updates.companyId,
        professional_id: updates.professionalId,
        service_id: updates.serviceId,
        client_name: updates.clientName,
        client_phone: updates.clientPhone,
        client_birth_date: updates.clientBirthDate
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Clients API
export const clientsApi = {
  async getByCompany(companyId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data;
  },

  async create(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...client,
        company_id: client.companyId,
        birth_date: client.birthDate,
        total_appointments: client.totalAppointments,
        last_appointment: client.lastAppointment
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        company_id: updates.companyId,
        birth_date: updates.birthDate,
        total_appointments: updates.totalAppointments,
        last_appointment: updates.lastAppointment
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Plans API
export const plansApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  },

  async create(plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('plans')
      .insert({
        name: plan.name,
        max_employees: String(plan.maxEmployees),
        monthly_price: plan.monthlyPrice,
        yearly_price: plan.yearlyPrice,
        features: plan.features,
        is_popular: plan.isPopular,
        is_active: plan.isActive
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Plan>) {
    const { data, error } = await supabase
      .from('plans')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.maxEmployees && { max_employees: String(updates.maxEmployees) }),
        ...(updates.monthlyPrice && { monthly_price: updates.monthlyPrice }),
        ...(updates.yearlyPrice && { yearly_price: updates.yearlyPrice }),
        ...(updates.features && { features: updates.features }),
        ...(updates.isPopular !== undefined && { is_popular: updates.isPopular }),
        ...(updates.isActive !== undefined && { is_active: updates.isActive })
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Expenses API
export const expensesApi = {
  async getByCompany(companyId: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data;
  },

  async create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        company_id: expense.companyId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Notifications API
export const notificationsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
  }
};