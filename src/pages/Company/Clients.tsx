
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Search, Phone, Mail, Calendar, TrendingUp } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';

const CompanyClients = () => {
  const { clients, appointments } = useCompanyDataContext();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const companyClients = clients.filter(c => c.companyId === user?.companyId);
  const companyAppointments = appointments.filter(a => a.companyId === user?.companyId);

  const clientsWithStats = companyClients.map(client => {
    const clientAppointments = companyAppointments.filter(a => a.clientPhone === client.phone);
    const completedAppointments = clientAppointments.filter(a => a.status === 'completed');
    const totalSpent = completedAppointments.reduce((sum, a) => sum + a.price, 0);
    const lastAppointment = clientAppointments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    return {
      ...client,
      actualAppointments: clientAppointments.length,
      completedAppointments: completedAppointments.length,
      totalSpent,
      lastVisit: lastAppointment?.date || null
    };
  });

  const filteredClients = clientsWithStats
    .filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'appointments':
          return b.actualAppointments - a.actualAppointments;
        case 'spent':
          return b.totalSpent - a.totalSpent;
        case 'recent':
          return (b.lastVisit || '').localeCompare(a.lastVisit || '');
        default:
          return 0;
      }
    });

  const stats = {
    total: companyClients.length,
    thisMonth: companyClients.filter(c => {
      const clientDate = new Date(c.birthDate);
      const thisMonth = new Date().getMonth();
      return clientDate.getMonth() === thisMonth;
    }).length,
    returning: clientsWithStats.filter(c => c.actualAppointments > 1).length,
    totalSpent: clientsWithStats.reduce((sum, c) => sum + c.totalSpent, 0)
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Clientes" subtitle="Gerencie seus clientes e histórico de atendimentos" />
      
      <main className="p-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Clientes Recorrentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.returning}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Faturamento Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {stats.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                R$ {stats.total > 0 
                  ? (stats.totalSpent / stats.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                  : '0,00'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="appointments">Mais Agendamentos</SelectItem>
              <SelectItem value="spent">Maior Gasto</SelectItem>
              <SelectItem value="recent">Visita Recente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-2 rounded-lg">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {client.actualAppointments > 5 && (
                        <Badge className="bg-gold-100 text-gold-800">VIP</Badge>
                      )}
                      {client.actualAppointments > 1 && (
                        <Badge className="bg-blue-100 text-blue-800">Recorrente</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <Phone className="h-3 w-3 mr-2" />
                      {client.phone}
                    </p>
                    {client.email && (
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        {client.email}
                      </p>
                    )}
                    <p className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      Nascimento: {new Date(client.birthDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-blue-600">{client.actualAppointments}</p>
                        <p className="text-xs text-gray-500">Agendamentos</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">
                          R$ {client.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500">Total Gasto</p>
                      </div>
                    </div>
                  </div>
                  
                  {client.lastVisit && (
                    <div className="text-center pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        Última visita: {new Date(client.lastVisit).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyClients;
