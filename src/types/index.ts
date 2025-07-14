export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'professional';
  companyId?: string;
  avatar?: string;
  mustChangePassword?: boolean;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  employees: number;
  monthlyRevenue: number;
  trialEndsAt: string | null;
  createdAt: string;
  customUrl?: string;
  logo?: string;
  nextPayment?: string;
  overdueDays?: number;
  whatsappNumber?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
  imageUrl?: string;
  companyId: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialties: string[];
  commission: number;
  isActive: boolean;
  imageUrl?: string;
  userId: string;
  companyId: string;
  workingHours?: WorkingHour[];
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientBirthDate?: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  companyId: string;
  professionalId: string;
  serviceId: string;
  professional?: Professional;
  service?: Service;
  createdAt?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  totalAppointments: number;
  lastAppointment?: string;
  companyId: string;
}

export interface Plan {
  id: string;
  name: string;
  maxEmployees: string | number;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'system' | 'company_registered' | 'payment_overdue';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  companyId?: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  professionalId: string;
  appointmentId: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  companyId: string;
  createdAt?: string;
}

export interface Invoice {
  id: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
  companyId: string;
  createdAt?: string;
}

export interface WorkingHour {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  professionalId?: string;
}

export interface Coupon {
  id: string;
  companyId?: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PlatformSettings {
  id: string;
  whatsappNumber: string;
  supportMessage: string;
  platformName: string;
  primaryColor: string;
  logo?: string;
}

export interface LandingConfig {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundImage?: string;
  };
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
  }>;
  plans: Array<{
    id: string;
    name: string;
    price: number;
    features: string[];
    isPopular: boolean;
  }>;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}
