import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, TrendingUp, Building, UserPlus, Crown } from 'lucide-react';
import { planLimit, getPlanDisplayName } from '@/lib/planHelpers';
import { NewProfessionalModal } from '@/components/Company/NewProfessionalModal';
import { Company, Professional, Appointment } from '@/types';
import { toast } from 'sonner';

const CompanyDashboard = () => {
  const { user, companyId, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Route guard
  useEffect(() => {
    if (!isLoading && user?.role !== 'company_admin') {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Load company data
  useEffect(() => {
    if (companyId && user?.role === 'company_admin') {
      loadCompanyData();
    }
  }, [companyId, user]);

  const loadCompanyData = async () => {
    if (!companyId) return;

    setDataLoading(true);
    try {
      // Load company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) throw companyError;
      
      // Map database fields to interface
      const mappedCompany: Company = {
        id: companyData.id,
        name: companyData.name,
        email: companyData.email,
        phone: companyData.phone,
        address: companyData.address,
        plan: companyData.plan,
        status: companyData.status,
        employees: companyData.employees,
        monthlyRevenue: Number(companyData.monthly_revenue) || 0,
        trialEndsAt: companyData.trial_ends_at,
        createdAt: companyData.created_at,
        customUrl: companyData.custom_url,
        logo: companyData.logo,
        nextPayment: companyData.next_payment,
        overdueDays: companyData.overdue_days,
        whatsappNumber: companyData.whatsapp_number
      };
      
      setCompany(mappedCompany);

      // Load professionals
      const { data: professionalsData, error: profError } = await supabase
        .from('professionals')
        .select('*')
        .eq('company_id', companyId);

      if (profError) throw profError;
      
      // Map database fields to interface
      const mappedProfessionals: Professional[] = (professionalsData || []).map(prof => ({
        id: prof.id,
        name: prof.name,
        email: prof.email,
        phone: prof.phone,
        specialties: Array.isArray(prof.specialties) ? prof.specialties.map(s => String(s)) : [],
        commission: Number(prof.commission) || 0,
        isActive: prof.is_active,
        imageUrl: prof.image_url,
        userId: prof.user_id,
        companyId: prof.company_id
      }));
      
      setProfessionals(mappedProfessionals);

      // Load appointments for today
      const today = new Date().toISOString().split('T')[0];
      const { data: appointmentsData, error: appointError } = await supabase
        .from('appointments')
        .select('*')
        .eq('company_id', companyId)
        .eq('date', today);

      if (appointError) throw appointError;
      
      // Map database fields to interface
      const mappedAppointments: Appointment[] = (appointmentsData || []).map(apt => ({
        id: apt.id,
        clientName: apt.client_name,
        clientPhone: apt.client_phone,
        clientBirthDate: apt.client_birth_date,
        date: apt.date,
        time: apt.time,
        duration: apt.duration,
        price: Number(apt.price) || 0,
        status: apt.status,
        notes: apt.notes,
        companyId: apt.company_id,
        professionalId: apt.professional_id,
        serviceId: apt.service_id,
        createdAt: apt.created_at
      }));
      
      setAppointments(mappedAppointments);

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados da empresa');
    } finally {
      setDataLoading(false);
    }
  };

  const handleNewProfessional = () => {
    const currentCount = professionals.length;
    const limit = planLimit(company?.plan || 'basico');
    
    if (currentCount >= limit) {
      toast.error(`Limite do plano atingido. Máximo: ${limit} profissionais`);
      return;
    }
    
    setIsModalOpen(true);
  };

  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Empresa não encontrada</p>
        </div>
      </div>
    );
  }

  const professionalsCount = professionals.length;
  const professionalsLimit = planLimit(company.plan);
  const todayAppointments = appointments.length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo, {company.name}!
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {getPlanDisplayName(company.plan)}
                </Badge>
                <Badge 
                  variant={company.status === 'trial' ? 'destructive' : 'default'}
                >
                  {company.status === 'trial' ? 'Período de Teste' : 'Ativo'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {professionalsCount}/{professionalsLimit}
              </div>
              <p className="text-xs text-muted-foreground">
                Limite do plano {getPlanDisplayName(company.plan)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {completedAppointments} concluídos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {company.monthlyRevenue?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {company.status === 'trial' ? 'Teste' : 'Ativo'}
              </div>
              <p className="text-xs text-muted-foreground">
                {company.trialEndsAt && company.status === 'trial' 
                  ? `Expira em ${new Date(company.trialEndsAt).toLocaleDateString()}`
                  : 'Status da conta'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Professionals Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Equipe de Profissionais</span>
                <Button 
                  onClick={handleNewProfessional}
                  disabled={professionalsCount >= professionalsLimit}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Profissional
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {professionals.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Nenhum profissional cadastrado ainda
                  </p>
                  <Button 
                    onClick={handleNewProfessional}
                    variant="outline"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Profissional
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {professionals.map((prof) => (
                    <div 
                      key={prof.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{prof.name}</p>
                        <p className="text-sm text-muted-foreground">{prof.email}</p>
                      </div>
                      <Badge variant={prof.isActive ? 'default' : 'secondary'}>
                        {prof.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  ))}
                  
                  {professionalsCount < professionalsLimit && (
                    <Button 
                      onClick={handleNewProfessional}
                      variant="outline" 
                      className="w-full"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Adicionar Profissional
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/empresa/agendamentos')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Ver Agendamentos
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/empresa/servicos')}
              >
                <Building className="h-4 w-4 mr-2" />
                Gerenciar Serviços
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/empresa/financeiro')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Relatório Financeiro
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/empresa/configuracoes')}
              >
                <Building className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Professional Modal */}
      <NewProfessionalModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        companyId={companyId || ''}
        currentCount={professionalsCount}
        planLimit={professionalsLimit}
        onSuccess={loadCompanyData}
      />
    </div>
  );
};

export default CompanyDashboard;