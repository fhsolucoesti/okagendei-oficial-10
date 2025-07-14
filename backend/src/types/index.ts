
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'company_admin' | 'professional';
  companyId?: string;
  avatar?: string;
  mustChangePassword?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  trialEndsAt: Date | null;
  createdAt?: Date;
  customUrl?: string;
  logo?: string;
  nextPayment?: Date;
  overdueDays?: number;
  whatsappNumber?: string;
}

export interface Service {
  id: string;
  companyId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Professional {
  id: string;
  companyId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  commission: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkingHour {
  id: string;
  professionalId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Appointment {
  id: string;
  companyId: string;
  professionalId: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  clientBirthDate: Date;
  date: Date;
  time: string;
  duration: number;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  email?: string;
  birthDate: Date;
  totalAppointments: number;
  lastAppointment: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Plan {
  id: string;
  name: string;
  maxEmployees: number | string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    companyId?: string;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}
