import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  Plan, 
  Coupon, 
  Notification 
} from '@/types';
import { plansApi, notificationsApi } from '@/services/api';
import { 
  transformPlanFromDB, 
  transformNotificationFromDB,
  transformPlanToDB,
  transformNotificationToDB 
} from '@/utils/dataTransformers';
import { toast } from 'sonner';

interface DataContextType {
  // Global plans data
  plans: Plan[];
  setPlans: (plans: Plan[]) => void;
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, data: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  loadPlans: () => Promise<void>;
  
  // Global coupons data
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  
  // Global notifications data
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  loadNotifications: () => Promise<void>;
  
  // Loading states
  loading: boolean;
  error: string | null;
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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load plans from Supabase
  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plansApi.getAll();
      setPlans((data || []).map(transformPlanFromDB));
    } catch (err) {
      console.error('Error loading plans:', err);
      setError('Erro ao carregar planos');
      toast.error('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  // Load notifications from Supabase
  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getAll();
      setNotifications((data || []).map(transformNotificationFromDB));
    } catch (err) {
      console.error('Error loading notifications:', err);
      toast.error('Erro ao carregar notificações');
    }
  };

  // Initialize data on mount
  useEffect(() => {
    loadPlans();
    loadNotifications();
  }, []);

  // Plan CRUD methods using Supabase
  const addPlan = async (planData: Omit<Plan, 'id'>) => {
    try {
      const dbPlan = await plansApi.create(planData);
      const newPlan = transformPlanFromDB(dbPlan);
      setPlans(prev => [...prev, newPlan]);
      toast.success('Plano adicionado com sucesso');
      return newPlan;
    } catch (err) {
      console.error('Error adding plan:', err);
      toast.error('Erro ao adicionar plano');
      throw err;
    }
  };

  const updatePlan = async (id: string, data: Partial<Plan>) => {
    try {
      const dbPlan = await plansApi.update(id, data);
      const updatedPlan = transformPlanFromDB(dbPlan);
      setPlans(prev => prev.map(plan => 
        plan.id === id ? updatedPlan : plan
      ));
      toast.success('Plano atualizado com sucesso');
      return updatedPlan;
    } catch (err) {
      console.error('Error updating plan:', err);
      toast.error('Erro ao atualizar plano');
      throw err;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await plansApi.delete(id);
      setPlans(prev => prev.filter(plan => plan.id !== id));
      toast.success('Plano removido com sucesso');
    } catch (err) {
      console.error('Error deleting plan:', err);
      toast.error('Erro ao remover plano');
      throw err;
    }
  };

  // Coupon CRUD methods (local state for now)
  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon = {
      ...couponData,
      id: Date.now().toString()
    };
    setCoupons(prev => [...prev, newCoupon]);
    toast.success('Cupom adicionado com sucesso');
  };

  const updateCoupon = (id: string, data: Partial<Coupon>) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === id ? { ...coupon, ...data } : coupon
    ));
    toast.success('Cupom atualizado com sucesso');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== id));
    toast.success('Cupom removido com sucesso');
  };

  // Notification methods using Supabase
  const addNotification = (notificationData: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notificationData,
      id: Date.now().toString()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  return (
    <DataContext.Provider value={{
      plans,
      setPlans,
      addPlan,
      updatePlan,
      deletePlan,
      loadPlans,
      coupons,
      setCoupons,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      notifications,
      setNotifications,
      addNotification,
      markNotificationAsRead,
      loadNotifications,
      loading,
      error
    }}>
      {children}
    </DataContext.Provider>
  );
};
