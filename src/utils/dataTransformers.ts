// Transformers para converter dados do Supabase para os tipos da aplicação
import type { 
  Company, 
  Service, 
  Professional, 
  Appointment, 
  Client, 
  Expense,
  Plan,
  Notification
} from '@/types';

// Company transformer
export const transformCompanyFromDB = (dbCompany: any): Company => ({
  id: dbCompany.id,
  name: dbCompany.name,
  email: dbCompany.email,
  phone: dbCompany.phone,
  address: dbCompany.address,
  plan: dbCompany.plan,
  status: dbCompany.status,
  employees: dbCompany.employees,
  monthlyRevenue: Number(dbCompany.monthly_revenue || 0),
  trialEndsAt: dbCompany.trial_ends_at || null,
  createdAt: dbCompany.created_at,
  customUrl: dbCompany.custom_url,
  logo: dbCompany.logo,
  nextPayment: dbCompany.next_payment,
  overdueDays: dbCompany.overdue_days,
  whatsappNumber: dbCompany.whatsapp_number
});

// Service transformer
export const transformServiceFromDB = (dbService: any): Service => ({
  id: dbService.id,
  companyId: dbService.company_id,
  name: dbService.name,
  description: dbService.description,
  price: Number(dbService.price),
  duration: dbService.duration,
  isActive: dbService.is_active,
  imageUrl: dbService.image_url
});

// Professional transformer
export const transformProfessionalFromDB = (dbProfessional: any): Professional => ({
  id: dbProfessional.id,
  companyId: dbProfessional.company_id,
  userId: dbProfessional.user_id,
  name: dbProfessional.name,
  email: dbProfessional.email,
  phone: dbProfessional.phone,
  specialties: Array.isArray(dbProfessional.specialties) ? dbProfessional.specialties : [],
  commission: Number(dbProfessional.commission || 0),
  isActive: dbProfessional.is_active,
  imageUrl: dbProfessional.image_url
});

// Appointment transformer
export const transformAppointmentFromDB = (dbAppointment: any): Appointment => ({
  id: dbAppointment.id,
  companyId: dbAppointment.company_id,
  professionalId: dbAppointment.professional_id,
  serviceId: dbAppointment.service_id,
  clientName: dbAppointment.client_name,
  clientPhone: dbAppointment.client_phone,
  clientBirthDate: dbAppointment.client_birth_date,
  date: dbAppointment.date,
  time: dbAppointment.time,
  duration: dbAppointment.duration,
  price: Number(dbAppointment.price),
  status: dbAppointment.status,
  notes: dbAppointment.notes,
  createdAt: dbAppointment.created_at
});

// Client transformer
export const transformClientFromDB = (dbClient: any): Client => ({
  id: dbClient.id,
  companyId: dbClient.company_id,
  name: dbClient.name,
  phone: dbClient.phone,
  email: dbClient.email,
  birthDate: dbClient.birth_date,
  totalAppointments: dbClient.total_appointments || 0,
  lastAppointment: dbClient.last_appointment
});

// Expense transformer
export const transformExpenseFromDB = (dbExpense: any): Expense => ({
  id: dbExpense.id,
  companyId: dbExpense.company_id,
  description: dbExpense.description,
  amount: Number(dbExpense.amount),
  category: dbExpense.category,
  date: dbExpense.date,
  createdAt: dbExpense.created_at
});

// Plan transformer
export const transformPlanFromDB = (dbPlan: any): Plan => ({
  id: dbPlan.id,
  name: dbPlan.name,
  maxEmployees: dbPlan.max_employees === 'unlimited' ? 'unlimited' : Number(dbPlan.max_employees),
  monthlyPrice: Number(dbPlan.monthly_price),
  yearlyPrice: Number(dbPlan.yearly_price),
  features: Array.isArray(dbPlan.features) ? dbPlan.features : [],
  isPopular: dbPlan.is_popular,
  isActive: dbPlan.is_active
});

// Reverse transformers para enviar dados para o Supabase
export const transformCompanyToDB = (company: Partial<Company>) => ({
  name: company.name,
  email: company.email,
  phone: company.phone,
  address: company.address,
  plan: company.plan,
  status: company.status,
  employees: company.employees,
  monthly_revenue: company.monthlyRevenue,
  trial_ends_at: company.trialEndsAt,
  custom_url: company.customUrl,
  logo: company.logo,
  next_payment: company.nextPayment,
  overdue_days: company.overdueDays,
  whatsapp_number: company.whatsappNumber
});

export const transformServiceToDB = (service: Partial<Service>) => ({
  company_id: service.companyId,
  name: service.name,
  description: service.description,
  price: service.price,
  duration: service.duration,
  is_active: service.isActive,
  image_url: service.imageUrl
});

export const transformProfessionalToDB = (professional: Partial<Professional>) => ({
  company_id: professional.companyId,
  user_id: professional.userId,
  name: professional.name,
  email: professional.email,
  phone: professional.phone,
  specialties: professional.specialties,
  commission: professional.commission,
  is_active: professional.isActive,
  image_url: professional.imageUrl
});

export const transformAppointmentToDB = (appointment: Partial<Appointment>) => ({
  company_id: appointment.companyId,
  professional_id: appointment.professionalId,
  service_id: appointment.serviceId,
  client_name: appointment.clientName,
  client_phone: appointment.clientPhone,
  client_birth_date: appointment.clientBirthDate,
  date: appointment.date,
  time: appointment.time,
  duration: appointment.duration,
  price: appointment.price,
  status: appointment.status,
  notes: appointment.notes
});

export const transformExpenseToDB = (expense: Partial<Expense>) => ({
  company_id: expense.companyId,
  description: expense.description,
  amount: expense.amount,
  category: expense.category,
  date: expense.date
});

export const transformPlanToDB = (plan: Partial<Plan>) => ({
  name: plan.name,
  max_employees: String(plan.maxEmployees),
  monthly_price: plan.monthlyPrice,
  yearly_price: plan.yearlyPrice,
  features: plan.features,
  is_popular: plan.isPopular,
  is_active: plan.isActive
});

// Notification transformer
export const transformNotificationFromDB = (dbNotification: any): Notification => ({
  id: dbNotification.id,
  type: dbNotification.type,
  title: dbNotification.title,
  message: dbNotification.message,
  companyId: dbNotification.company_id,
  isRead: dbNotification.is_read,
  priority: dbNotification.priority,
  createdAt: dbNotification.created_at
});

export const transformNotificationToDB = (notification: Partial<Notification>) => ({
  type: notification.type,
  title: notification.title,
  message: notification.message,
  company_id: notification.companyId,
  is_read: notification.isRead,
  priority: notification.priority
});