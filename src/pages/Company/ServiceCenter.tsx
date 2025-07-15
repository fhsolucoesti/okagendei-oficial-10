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
import { Plus, MessageSquare, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, TicketResponse } from '@/types';
import { toast } from '@/hooks/use-toast';

const ServiceCenter = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    type: 'problem' as const
  });

  // Simular dados de tickets
  useEffect(() => {
    if (user?.companyId) {
      setTickets([
        {
          id: '1',
          title: 'Problema com sincronização de agendamentos',
          description: 'Os agendamentos não estão sendo sincronizados corretamente com o WhatsApp.',
          type: 'problem',
          status: 'responded',
          companyId: user.companyId,
          responses: [
            {
              id: '1',
              ticketId: '1',
              message: 'Olá! Recebemos sua solicitação e estamos analisando o problema. Nossa equipe técnica entrará em contato em breve.',
              isFromSupport: true,
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              adminName: 'Equipe Suporte'
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
          status: 'in_analysis',
          companyId: user.companyId,
          responses: [],
          createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }
  }, [user?.companyId]);

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

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const ticket: Ticket = {
      id: Date.now().toString(),
      title: newTicket.title,
      description: newTicket.description,
      type: newTicket.type,
      status: 'new',
      companyId: user?.companyId || '',
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ title: '', description: '', type: 'problem' });
    setIsCreateModalOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Chamado criado com sucesso! Nossa equipe analisará em breve.",
    });
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Central de Serviço</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Abrir Chamado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Abrir Novo Chamado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Descreva detalhadamente sua solicitação"
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

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{getTypeLabel(ticket.type)}</Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {getStatusLabel(ticket.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Criado em {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                  </p>
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
                  {ticket.responses.length} resposta(s) do suporte
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {tickets.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum chamado encontrado</h3>
                <p className="text-sm">Quando você abrir um chamado, ele aparecerá aqui.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de visualização do chamado */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Chamado</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getTypeLabel(selectedTicket.type)}</Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {getStatusLabel(selectedTicket.status)}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-medium text-lg">{selectedTicket.title}</h3>
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
                  <h4 className="font-medium mb-2">Respostas:</h4>
                  <div className="space-y-3">
                    {selectedTicket.responses.map((response) => (
                      <div key={response.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {response.isFromSupport ? 'Resposta do Suporte OKAgendei' : 'Você'}
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceCenter;