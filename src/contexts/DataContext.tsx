import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  // Função para remover duplicações baseado no email
  const removeDuplicatesFromArray = (companies: Company[]) => {
    const uniqueCompanies = [];
    const seenEmails = new Set();
    
    for (const company of companies) {
      if (!seenEmails.has(company.email)) {
        seenEmails.add(company.email);
        uniqueCompanies.push(company);
      }
    }
    
    return uniqueCompanies;
  };

  // Carregar dados do localStorage se disponíveis, removendo duplicações
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('companies');
    let companiesData = [];
    
    if (saved) {
      try {
        companiesData = JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing companies from localStorage:', error);
        companiesData = [];
      }
    }
    
    // Se não há dados salvos, criar apenas uma empresa de exemplo
    if (companiesData.length === 0) {
      companiesData = [
        {
          id: '1',
          name: 'Empresa Exemplo',
          email: 'empresa@exemplo.com',
          phone: '(11) 99999-9999',
          address: 'Rua Exemplo, 123',
          plan: 'Profissional',
          status: 'active',
          employees: 5,
          monthlyRevenue: 12500,
          trialEndsAt: null,
          createdAt: '2024-01-15T10:00:00Z',
          customUrl: 'empresa-exemplo',
          whatsappNumber: '11999999999'
        }
      ];
    } else {
      // Remover duplicações dos dados existentes
      companiesData = removeDuplicatesFromArray(companiesData);
    }
    
    return companiesData;
  });

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Básico',
      maxEmployees: 2,
      monthlyPrice: 29.90,
      yearlyPrice: 299.00,
      features: ['Agendamentos ilimitados', '1 usuário', 'Suporte por e-mail'],
      isPopular: false,
      isActive: true
    },
    {
      id: '2',
      name: 'Premium',
      maxEmployees: 5,
      monthlyPrice: 59.90,
      yearlyPrice: 599.00,
      features: ['Agendamentos ilimitados', 'Até 5 usuários', 'Suporte prioritário', 'Relatórios personalizados'],
      isPopular: true,
      isActive: true
    },
    {
      id: '3',
      name: 'Empresarial',
      maxEmployees: 'unlimited',
      monthlyPrice: 99.90,
      yearlyPrice: 999.00,
      features: ['Agendamentos ilimitados', 'Usuários ilimitados', 'Suporte VIP', 'Relatórios avançados', 'Integrações API'],
      isPopular: false,
      isActive: true
    }
  ]);

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        companyId: '1',
        name: 'Corte de Cabelo',
        description: 'Corte de cabelo masculino e feminino',
        price: 50.00,
        duration: 30,
        isActive: true
      },
      {
        id: '2',
        companyId: '1',
        name: 'Barba',
        description: 'Barba simples',
        price: 30.00,
        duration: 20,
        isActive: true
      }
    ];
  });

  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    const saved = localStorage.getItem('professionals');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        companyId: '1',
        userId: '3',
        name: 'Carlos Barbeiro',
        email: 'profissional@teste.com',
        phone: '(11) 99999-9999',
        specialties: ['Corte', 'Barba'],
        commission: 0.5,
        isActive: true,
        workingHours: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isAvailable: true }
        ]
      }
    ];
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      companyId: '1',
      professionalId: '1',
      serviceId: '1',
      clientName: 'Cliente Teste',
      clientPhone: '(11) 99999-9999',
      clientBirthDate: '1990-01-01',
      date: '2024-01-20',
      time: '10:00',
      duration: 30,
      price: 50.00,
      status: 'scheduled',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ]);

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      companyId: '1',
      name: 'Cliente Teste',
      phone: '(11) 99999-9999',
      birthDate: '1990-01-01',
      totalAppointments: 1,
      lastAppointment: '2024-01-20'
    }
  ]);

  const [commissions, setCommissions] = useState<Commission[]>([
    {
      id: '1',
      professionalId: '1',
      appointmentId: '1',
      amount: 25.00,
      date: '2024-01-20',
      status: 'pending'
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      companyId: '1',
      description: 'Aluguel',
      amount: 1000.00,
      category: 'Aluguel',
      date: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      companyId: '1',
      code: 'DESCONTO10',
      description: '10% de desconto',
      type: 'percentage',
      value: 10,
      expiresAt: '2024-01-31',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      usedCount: 0
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Novo agendamento',
      message: 'Cliente Teste agendou um novo serviço',
      companyId: '1',
      isRead: false,
      createdAt: '2024-01-15T10:00:00Z',
      priority: 'medium'
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      companyId: '1',
      amount: 59.90,
      dueDate: '2024-01-31',
      status: 'pending',
      description: 'Mensalidade Plano Premium',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ]);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('professionals', JSON.stringify(professionals));
  }, [professionals]);

  // Função para remover duplicações manualmente
  const removeDuplicateCompanies = () => {
    console.log('Removendo empresas duplicadas...');
    const uniqueCompanies = removeDuplicatesFromArray(companies);
    if (uniqueCompanies.length !== companies.length) {
      console.log(`Removidas ${companies.length - uniqueCompanies.length} empresas duplicadas`);
      setCompanies(uniqueCompanies);
    } else {
      console.log('Nenhuma duplicação encontrada');
    }
  };

  const initializeCompanyData = (companyId: string) => {
    console.log('Inicializando dados para empresa:', companyId);
    
    // Verificar se já existem dados para esta empresa
    const hasServices = services.some(s => s.companyId === companyId);
    const hasProfessionals = professionals.some(p => p.companyId === companyId);
    
    if (!hasServices) {
      // Criar serviços padrão
      const defaultServices: Service[] = [
        {
          id: `service_${Date.now()}_1`,
          companyId,
          name: 'Serviço Padrão',
          description: 'Serviço inicial da empresa',
          price: 50.00,
          duration: 60,
          isActive: true,
          imageUrl: undefined
        }
      ];
      
      setServices(prev => [...prev, ...defaultServices]);
      console.log('Serviços padrão criados para empresa:', companyId);
    }
    
    // Não criar profissional automaticamente - será criado quando necessário
    
    console.log('Inicialização de dados concluída para empresa:', companyId);
  };

  const updateCompany = (id: string, data: Partial<Company>) => {
    setCompanies(prev => prev.map(company => 
      company.id === id ? { ...company, ...data } : company
    ));
  };

  const addCompany = (companyData: Omit<Company, 'id'>) => {
    const newCompany = {
      ...companyData,
      id: Date.now().toString()
    };
    setCompanies(prev => [...prev, newCompany]);
    // Inicializar dados básicos para a nova empresa
    setTimeout(() => initializeCompanyData(newCompany.id), 100);
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  // Plan CRUD methods - Implementando corretamente os métodos de planos
  const addPlan = (planData: Omit<Plan, 'id'>) => {
    const newPlan = {
      ...planData,
      id: (Date.now() + Math.random()).toString(),
      isActive: true
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const updatePlan = (id: string, data: Partial<Plan>) => {
    console.log('Updating plan:', id, data);
    setPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, ...data } : plan
    ));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService = {
      ...serviceData,
      id: Date.now().toString()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, ...data } : service
    ));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const addProfessional = (professionalData: Omit<Professional, 'id'>) => {
    const newProfessional = {
      ...professionalData,
      id: Date.now().toString()
    };
    setProfessionals(prev => [...prev, newProfessional]);
  };

  const updateProfessional = (id: string, data: Partial<Professional>) => {
    setProfessionals(prev => prev.map(professional => 
      professional.id === id ? { ...professional, ...data } : professional
    ));
  };

  const deleteProfessional = (id: string) => {
    setProfessionals(prev => prev.filter(professional => professional.id !== id));
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointmentData,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...data } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expenseData,
      id: Date.now().toString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

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

  const addNotification = (notificationData: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notificationData,
      id: Date.now().toString()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  return (
    <DataContext.Provider value={{
      companies,
      setCompanies,
      updateCompany,
      addCompany,
      deleteCompany,
      plans,
      setPlans,
      addPlan,
      updatePlan,
      deletePlan,
      services,
      setServices,
      addService,
      updateService,
      deleteService,
      professionals,
      setProfessionals,
      addProfessional,
      updateProfessional,
      deleteProfessional,
      appointments,
      setAppointments,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      clients,
      setClients,
      commissions,
      setCommissions,
      expenses,
      setExpenses,
      addExpense,
      coupons,
      setCoupons,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      notifications,
      setNotifications,
      addNotification,
      markNotificationAsRead,
      invoices,
      setInvoices,
      initializeCompanyData,
      removeDuplicateCompanies
    }}>
      {children}
    </DataContext.Provider>
  );
};
