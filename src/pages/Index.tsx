
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, DollarSign, Calendar, TrendingUp, Bell, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CompanyList from '@/components/CompanyList';
import PlanManagement from '@/components/PlanManagement';
import FinancialOverview from '@/components/FinancialOverview';
import Notifications from '@/components/Notifications';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id: number;
  name: string;
  plan: string;
  status: 'active' | 'trial' | 'inactive';
  employees: number;
  monthlyRevenue: number;
  trialEndsAt: string | null;
  createdAt: string;
}

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar empresas
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      // Carregar total de usuários
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (companiesData) {
        const transformedCompanies: Company[] = companiesData.map(company => ({
          id: parseInt(company.id.substring(0, 8), 16) || Math.floor(Math.random() * 1000),
          name: company.name,
          plan: company.plan,
          status: company.status as 'active' | 'trial' | 'inactive',
          employees: company.employees || 1,
          monthlyRevenue: Number(company.monthly_revenue) || 0,
          trialEndsAt: company.trial_ends_at,
          createdAt: company.created_at
        }));
        setCompanies(transformedCompanies);
      }

      setTotalUsers(usersCount || 0);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const trialCompanies = companies.filter(c => c.status === 'trial').length;
  const totalRevenue = companies.reduce((sum, company) => sum + company.monthlyRevenue, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  OKAgendei
                </h1>
                <p className="text-sm text-slate-600">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
                <Badge variant="destructive" className="ml-2">3</Badge>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total de Empresas
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompanies}</div>
              <p className="text-xs text-blue-200">
                {activeCompanies} ativas, {trialCompanies} em teste
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Faturamento Mensal
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalRevenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-green-200">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Usuários Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-purple-200">
                Usuários cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Taxa de Crescimento
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {companies.length > 0 ? `+${companies.length}` : '0'}
              </div>
              <p className="text-xs text-orange-200">
                Empresas cadastradas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Gestão de Empresas</h2>
                <p className="text-slate-600">Gerencie todas as empresas cadastradas na plataforma</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input placeholder="Buscar empresas..." className="pl-10 w-64" />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Empresa
                </Button>
              </div>
            </div>
            <CompanyList companies={companies} />
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Gestão de Planos</h2>
              <p className="text-slate-600">Configure os planos disponíveis para as empresas</p>
            </div>
            <PlanManagement />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Visão Financeira</h2>
              <p className="text-slate-600">Acompanhe o desempenho financeiro da plataforma</p>
            </div>
            <FinancialOverview />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Central de Notificações</h2>
              <p className="text-slate-600">Gerencie notificações e alertas do sistema</p>
            </div>
            <Notifications />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
