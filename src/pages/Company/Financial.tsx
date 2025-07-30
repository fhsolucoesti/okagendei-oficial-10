
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Plus, TrendingUp, TrendingDown, Calendar, Receipt, Minus, AlertTriangle } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import ReportsExporter from '@/components/ReportsExporter';
import InvoiceCollection from '@/components/InvoiceCollection';
import { toast } from 'sonner';

const CompanyFinancial = () => {
  const { appointments, professionals, expenses, addExpense, company } = useCompanyDataContext();
  const { user } = useAuth();
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const companyAppointments = appointments.filter(a => a.companyId === user?.companyId);
  const companyProfessionals = professionals.filter(p => p.companyId === user?.companyId);
  const companyExpenses = expenses.filter(e => e.companyId === user?.companyId);

  // Filtrar por mês/ano selecionado
  const monthlyAppointments = companyAppointments.filter(a => {
    const appointmentDate = new Date(a.date);
    return appointmentDate.getMonth() === selectedMonth && 
           appointmentDate.getFullYear() === selectedYear &&
           a.status === 'completed';
  });

  const monthlyExpenses = companyExpenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === selectedMonth && 
           expenseDate.getFullYear() === selectedYear;
  });

  // Removendo lógica de faturas em atraso que dependia de companies e invoices globais
  // Esta funcionalidade será reimplementada quando necessário

  // Cálculos financeiros
  const totalRevenue = monthlyAppointments.reduce((sum, a) => sum + a.price, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const totalCommissions = monthlyAppointments.reduce((sum, appointment) => {
    const professional = companyProfessionals.find(p => p.id === appointment.professionalId);
    const commission = appointment.price * (professional?.commission || 50) / 100;
    return sum + commission;
  }, 0);

  const netProfit = totalRevenue - totalExpenses - totalCommissions;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      ...expenseData,
      companyId: user?.companyId || ''
    });
    toast.success('Despesa adicionada com sucesso!');
    setIsExpenseDialogOpen(false);
    setExpenseData({
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Financeiro" subtitle="Controle financeiro da sua empresa" />
      
      <main className="p-6">
        {/* Filtros e Exportação */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ReportsExporter />
        </div>

        {/* Faturas em atraso - funcionalidade removida temporariamente */}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Faturamento
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-200">
                {monthlyAppointments.length} serviços realizados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-100">
                Despesas
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-red-200">
                {monthlyExpenses.length} lançamentos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Comissões
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-orange-200">
                Para {companyProfessionals.length} profissionais
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'} text-white border-0`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Lucro Líquido
              </CardTitle>
              {netProfit >= 0 ? (
                <TrendingUp className="h-4 w-4 text-blue-200" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-200" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-blue-200">
                {netProfit >= 0 ? 'Resultado positivo' : 'Resultado negativo'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Despesas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Despesas do Mês</CardTitle>
                  <CardDescription>Controle seus gastos mensais</CardDescription>
                </div>
                <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Despesa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Nova Despesa</DialogTitle>
                      <DialogDescription>
                        Registre uma nova despesa da empresa
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                          id="description"
                          value={expenseData.description}
                          onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                          placeholder="Ex: Aluguel, Produtos, etc"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Valor (R$)</Label>
                        <Input
                          id="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={expenseData.amount}
                          onChange={(e) => setExpenseData({...expenseData, amount: Number(e.target.value)})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Input
                          id="category"
                          value={expenseData.category}
                          onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                          placeholder="Ex: Aluguel, Marketing, Produtos"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={expenseData.date}
                          onChange={(e) => setExpenseData({...expenseData, date: e.target.value})}
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                          Adicionar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {monthlyExpenses.length > 0 ? (
                <div className="space-y-4">
                  {monthlyExpenses.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                          <Minus className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{expense.description}</p>
                          <p className="text-sm text-gray-500">{expense.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhuma despesa registrada este mês</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comissões por Profissional */}
          <Card>
            <CardHeader>
              <CardTitle>Comissões por Profissional</CardTitle>
              <CardDescription>Comissões a pagar no mês selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              {companyProfessionals.length > 0 ? (
                <div className="space-y-4">
                  {companyProfessionals.map((professional) => {
                    const professionalAppointments = monthlyAppointments.filter(a => a.professionalId === professional.id);
                    const commission = professionalAppointments.reduce((sum, a) => sum + (a.price * professional.commission / 100), 0);
                    
                    return (
                      <div key={professional.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{professional.name}</p>
                            <p className="text-sm text-gray-500">{professional.commission}% • {professionalAppointments.length} serviços</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">
                            R$ {commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhum profissional cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CompanyFinancial;
