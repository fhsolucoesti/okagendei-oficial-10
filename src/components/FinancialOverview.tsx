
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, Download, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const FinancialOverview = () => {
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 12500, companies: 15 },
    { month: 'Fev', revenue: 15800, companies: 18 },
    { month: 'Mar', revenue: 18200, companies: 22 },
    { month: 'Abr', revenue: 21500, companies: 25 },
    { month: 'Mai', revenue: 24800, companies: 28 },
    { month: 'Jun', revenue: 26200, companies: 31 },
    { month: 'Jul', revenue: 28500, companies: 34 },
  ];

  const planDistribution = [
    { name: 'Básico', value: 45, color: '#3B82F6' },
    { name: 'Profissional', value: 38, color: '#8B5CF6' },
    { name: 'Empresarial', value: 17, color: '#F59E0B' },
  ];

  const overdueBills = [
    { company: 'Barbearia Central', amount: 109.90, daysOverdue: 5, plan: 'Profissional' },
    { company: 'Studio Nails Express', amount: 59.90, daysOverdue: 12, plan: 'Básico' },
    { company: 'Clínica Beauty Care', amount: 249.90, daysOverdue: 3, plan: 'Empresarial' },
  ];

  const recentPayments = [
    { company: 'Barbearia do João', amount: 109.90, date: '2024-07-01', status: 'paid', plan: 'Profissional' },
    { company: 'Studio Bella Nails', amount: 59.90, date: '2024-07-01', status: 'paid', plan: 'Básico' },
    { company: 'Clínica Renovar', amount: 249.90, date: '2024-06-30', status: 'paid', plan: 'Empresarial' },
    { company: 'Salão Glamour', amount: 109.90, date: '2024-06-29', status: 'paid', plan: 'Profissional' },
  ];

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-green-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 28.500</div>
            <div className="flex items-center space-x-1 text-green-200">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs">+8.7% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">ARR</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 342.000</div>
            <div className="flex items-center space-x-1 text-blue-200">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs">+12.3% vs ano anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">A Receber</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3.240</div>
            <div className="flex items-center space-x-1 text-orange-200">
              <AlertCircle className="h-3 w-3" />
              <span className="text-xs">3 faturas em atraso</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <div className="flex items-center space-x-1 text-purple-200">
              <TrendingDown className="h-3 w-3" />
              <span className="text-xs">-0.5% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="overdue">Em Atraso</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Evolução da Receita</CardTitle>
                  <CardDescription>Receita mensal recorrente e número de empresas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `R$ ${value.toLocaleString('pt-BR')}` : value,
                        name === 'revenue' ? 'Receita' : 'Empresas'
                      ]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                    <Line type="monotone" dataKey="companies" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
              <CardHeader>
                <CardTitle>Distribuição por Planos</CardTitle>
                <CardDescription>Percentual de empresas por plano</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
              <CardHeader>
                <CardTitle>Receita por Plano</CardTitle>
                <CardDescription>Comparativo mensal de receita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { plan: 'Básico', revenue: 8500 },
                      { plan: 'Profissional', revenue: 12500 },
                      { plan: 'Empresarial', revenue: 7500 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="plan" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']} />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-red-700">Faturas em Atraso</CardTitle>
                  <CardDescription>Empresas com pagamentos pendentes</CardDescription>
                </div>
                <Badge variant="destructive">{overdueBills.length} empresas</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueBills.map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{bill.company}</div>
                      <div className="text-sm text-slate-600">{bill.plan}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-700">R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <div className="text-sm text-red-600">{bill.daysOverdue} dias em atraso</div>
                    </div>
                    <Button size="sm" variant="outline" className="ml-4">
                      Cobrar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pagamentos Recentes</CardTitle>
                  <CardDescription>Últimas transações processadas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{payment.company}</div>
                        <div className="text-sm text-slate-600">{payment.plan}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <div className="text-sm text-slate-600">{new Date(payment.date).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialOverview;
