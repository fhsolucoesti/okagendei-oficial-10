import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clock, CheckCircle, XCircle, Eye, Send, Building2, User, Phone, Mail, Plus, FileImage, Settings, AlertTriangle, Star } from 'lucide-react';
import { Ticket, TicketResponse, Company } from '@/types';
import { toast } from '@/hooks/use-toast';

const SuperAdminServiceCenter = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newResponse, setNewResponse] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    type: 'problem' as const,
    priority: 'medium' as const,
    companyId: ''
  });

  useEffect(() => {
    // Carregar empresas - dados limpos
    setCompanies([]);

    // Carregar tickets - dados limpos  
    setTickets([]);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
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

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description || !newTicket.companyId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const selectedCompany = companies.find(c => c.id === newTicket.companyId);
    
    const ticket: Ticket = {
      id: Date.now().toString(),
      title: newTicket.title,
      description: newTicket.description,
      type: newTicket.type,
      priority: newTicket.priority,
      status: 'new',
      companyId: newTicket.companyId,
      company: selectedCompany ? {
        name: selectedCompany.name,
        email: selectedCompany.email,
        phone: selectedCompany.phone,
        responsibleName: 'Responsável'
      } : undefined,
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin'
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ title: '', description: '', type: 'problem', priority: 'medium', companyId: '' });
    setIsCreateModalOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Chamado criado com sucesso!",
    });
  };

  const getTicketCounts = () => {
    return {
      all: tickets.length,
      new: tickets.filter(t => t.status === 'new').length,
      in_analysis: tickets.filter(t => t.status === 'in_analysis').length,
      responded: tickets.filter(t => t.status === 'responded').length,
      closed: tickets.filter(t => t.status === 'closed').length
    };
  };

  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  });

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

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setIsViewModalOpen(true);
  };

  const counts = getTicketCounts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Central de Serviço - Suporte</h1>
        <div className="flex gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Chamado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Chamado</DialogTitle>
                <DialogDescription>
                  Criar um chamado em nome de uma empresa
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company">Empresa *</Label>
                  <Select value={newTicket.companyId} onValueChange={(value) => setNewTicket({ ...newTicket, companyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    placeholder="Digite o título do chamado"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select value={newTicket.type} onValueChange={(value: any) => setNewTicket({ ...newTicket, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="problem">Problema</SelectItem>
                      <SelectItem value="suggestion">Sugestão</SelectItem>
                      <SelectItem value="compliment">Elogio</SelectItem>
                      <SelectItem value="contact">Contato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Prioridade *</Label>
                  <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket({ ...newTicket, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Descreva detalhadamente o chamado"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateTicket}>
                    Criar Chamado
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
                        {getPriorityIcon(ticket.priority)}
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {getPriorityLabel(ticket.priority)}
                        </Badge>
                        {ticket.status === 'new' && (
                          <Badge className="bg-red-100 text-red-800">Não Lido</Badge>
                        )}
                        {ticket.createdBy === 'admin' && (
                          <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
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
                  <h4 className="font-medium mb-2">Status e Prioridade:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(selectedTicket.type)}
                      <Badge variant="outline">{getTypeLabel(selectedTicket.type)}</Badge>
                      <Badge className={getStatusColor(selectedTicket.status)}>
                        {getStatusLabel(selectedTicket.status)}
                      </Badge>
                      {getPriorityIcon(selectedTicket.priority)}
                      <Badge className={getPriorityColor(selectedTicket.priority)}>
                        {getPriorityLabel(selectedTicket.priority)}
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

              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Anexos:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTicket.attachments.map((attachment) => (
                      <div key={attachment.id} className="border rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <FileImage className="w-4 h-4 text-gray-500" />
                          <span className="text-sm truncate">{attachment.filename}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(attachment.url, '_blank')}
                            className="h-6 w-6"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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