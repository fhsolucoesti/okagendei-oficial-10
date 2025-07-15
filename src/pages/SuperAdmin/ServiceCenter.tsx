import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clock, CheckCircle, XCircle, Eye, Send, Building2, User, Phone, Mail } from 'lucide-react';
import { Ticket, TicketResponse } from '@/types';
import { toast } from '@/hooks/use-toast';

const SuperAdminServiceCenter = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newResponse, setNewResponse] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Simular dados de tickets
  useEffect(() => {
    setTickets([
      {
        id: '1',
        title: 'Problema com sincronização de agendamentos',
        description: 'Os agendamentos não estão sendo sincronizados corretamente com o WhatsApp.',
        type: 'problem',
        status: 'responded',
        companyId: '1',
        company: {
          name: 'Salão Beleza & Estilo',
          email: 'contato@belezaestilo.com',
          phone: '(11) 99999-9999',
          responsibleName: 'Maria Silva'
        },
        responses: [
          {
            id: '1',
            ticketId: '1',
            message: 'Olá! Recebemos sua solicitação e estamos analisando o problema. Nossa equipe técnica entrará em contato em breve.',
            isFromSupport: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            adminName: 'João Admin'
          }
        ],
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Sugestão de melhoria no relatório financeiro',
        description: 'Seria interessante adicionar gráficos de evolução mensal no relatório financeiro.',
        type: 'suggestion',
        status: 'new',
        companyId: '2',
        company: {
          name: 'Barbearia Moderna',
          email: 'contato@barberiamoderna.com',
          phone: '(11) 88888-8888',
          responsibleName: 'Carlos Santos'
        },
        responses: [],
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Elogio ao atendimento',
        description: 'Gostaria de parabenizar toda a equipe pelo excelente atendimento e suporte prestado.',
        type: 'compliment',
        status: 'in_analysis',
        companyId: '3',
        company: {
          name: 'Clínica Dental Sorriso',
          email: 'contato@dentalsorriso.com',
          phone: '(11) 77777-7777',
          responsibleName: 'Ana Paula'
        },
        responses: [],
        createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_analysis':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Novo';
      case 'in_analysis':
        return 'Em Análise';
      case 'responded':
        return 'Respondido';
      case 'closed':
        return 'Encerrado';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'problem':
        return 'Problema';
      case 'suggestion':
        return 'Sugestão';
      case 'compliment':
        return 'Elogio';
      case 'contact':
        return 'Contato';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'problem':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'suggestion':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'compliment':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'contact':
        return <Phone className="w-4 h-4 text-purple-500" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  });

  const getTicketCounts = () => {
    return {
      all: tickets.length,
      new: tickets.filter(t => t.status === 'new').length,
      in_analysis: tickets.filter(t => t.status === 'in_analysis').length,
      responded: tickets.filter(t => t.status === 'responded').length,
      closed: tickets.filter(t => t.status === 'closed').length
    };
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setIsViewModalOpen(true);
  };

  const handleSendResponse = () => {
    if (!newResponse.trim() || !selectedTicket) return;

    const response: TicketResponse = {
      id: Date.now().toString(),
      ticketId: selectedTicket.id,
      message: newResponse,
      isFromSupport: true,
      createdAt: new Date().toISOString(),
      adminName: 'Admin Suporte'
    };

    const updatedTicket = {
      ...selectedTicket,
      responses: [...selectedTicket.responses, response],
      status: newStatus as any,
      updatedAt: new Date().toISOString()
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setNewResponse('');
    
    toast({
      title: "Sucesso",
      description: "Resposta enviada com sucesso!",
    });
  };

  const handleUpdateStatus = () => {
    if (!selectedTicket || !newStatus) return;

    const updatedTicket = {
      ...selectedTicket,
      status: newStatus as any,
      updatedAt: new Date().toISOString()
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    
    toast({
      title: "Sucesso",
      description: "Status atualizado com sucesso!",
    });
  };

  const counts = getTicketCounts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Central de Serviço - Suporte</h1>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({counts.all})</TabsTrigger>
          <TabsTrigger value="new">Novos ({counts.new})</TabsTrigger>
          <TabsTrigger value="in_analysis">Em Análise ({counts.in_analysis})</TabsTrigger>
          <TabsTrigger value="responded">Respondidos ({counts.responded})</TabsTrigger>
          <TabsTrigger value="closed">Encerrados ({counts.closed})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(ticket.type)}
                        <Badge variant="outline">{getTypeLabel(ticket.type)}</Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusLabel(ticket.status)}
                        </Badge>
                        {ticket.status === 'new' && (
                          <Badge className="bg-red-100 text-red-800">Não Lido</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {ticket.company?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {ticket.company?.responsibleName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm line-clamp-2">{ticket.description}</p>
                  {ticket.responses.length > 0 && (
                    <div className="mt-2 flex items-center text-sm text-green-600">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {ticket.responses.length} resposta(s) enviada(s)
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredTickets.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Nenhum chamado encontrado</h3>
                    <p className="text-sm">Não há chamados com o filtro selecionado.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de visualização e resposta do chamado */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Chamado</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informações da Empresa:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{selectedTicket.company?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedTicket.company?.responsibleName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedTicket.company?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedTicket.company?.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Status do Chamado:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(selectedTicket.type)}
                      <Badge variant="outline">{getTypeLabel(selectedTicket.type)}</Badge>
                      <Badge className={getStatusColor(selectedTicket.status)}>
                        {getStatusLabel(selectedTicket.status)}
                      </Badge>
                    </div>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Atualizar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="in_analysis">Em Análise</SelectItem>
                        <SelectItem value="responded">Respondido</SelectItem>
                        <SelectItem value="closed">Encerrado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleUpdateStatus} size="sm" className="w-full">
                      Atualizar Status
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Título:</h4>
                <p className="text-lg">{selectedTicket.title}</p>
                <p className="text-sm text-gray-600">
                  Criado em {new Date(selectedTicket.createdAt).toLocaleDateString('pt-BR')} às {new Date(selectedTicket.createdAt).toLocaleTimeString('pt-BR')}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Descrição:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedTicket.description}</p>
              </div>

              {selectedTicket.responses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Histórico de Respostas:</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedTicket.responses.map((response) => (
                      <div key={response.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {response.isFromSupport ? `Resposta do Suporte OKAgendei (${response.adminName})` : 'Empresa'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(response.createdAt).toLocaleDateString('pt-BR')} às {new Date(response.createdAt).toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-700">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Enviar Resposta:</h4>
                <div className="space-y-2">
                  <Textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    rows={3}
                  />
                  <Button onClick={handleSendResponse} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Resposta
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminServiceCenter;