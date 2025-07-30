
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Plus, Search, Edit, Trash2, Phone, Mail, Upload } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import { Professional } from '@/types';
import { toast } from 'sonner';

const CompanyProfessionals = () => {
  const { professionals, addProfessional, updateProfessional, deleteProfessional } = useCompanyDataContext();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: '',
    commission: 50,
    isActive: true,
    imageUrl: ''
  });

  const companyProfessionals = professionals.filter(p => p.companyId === user?.companyId);
  const filteredProfessionals = companyProfessionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const professionalData = {
      ...formData,
      specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s.length > 0),
      companyId: user?.companyId || '',
      userId: Date.now().toString(), // Simplified user ID generation
      workingHours: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isAvailable: true },
        { dayOfWeek: 0, startTime: '09:00', endTime: '15:00', isAvailable: false }
      ]
    };
    
    if (editingProfessional) {
      updateProfessional(editingProfessional.id, professionalData);
      toast.success('Profissional atualizado com sucesso!');
    } else {
      addProfessional(professionalData);
      toast.success('Profissional cadastrado com sucesso!');
    }
    
    setIsDialogOpen(false);
    setEditingProfessional(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialties: '',
      commission: 50,
      isActive: true,
      imageUrl: ''
    });
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      specialties: professional.specialties.join(', '),
      commission: professional.commission,
      isActive: professional.isActive,
      imageUrl: professional.imageUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      deleteProfessional(id);
      toast.success('Profissional excluído com sucesso!');
    }
  };

  const toggleProfessionalStatus = (id: string, currentStatus: boolean) => {
    updateProfessional(id, { isActive: !currentStatus });
    toast.success(`Profissional ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Profissionais" subtitle="Gerencie os profissionais da sua empresa" />
      
      <main className="p-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Profissionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyProfessionals.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Profissionais Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {companyProfessionals.filter(p => p.isActive).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Comissão Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {companyProfessionals.length > 0 
                  ? (companyProfessionals.reduce((sum, p) => sum + p.commission, 0) / companyProfessionals.length).toFixed(0)
                  : '0'
                }%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Ações */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar profissionais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Profissional
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProfessional ? 'Editar Profissional' : 'Novo Profissional'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do profissional
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="joao@exemplo.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">URL da Foto</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://exemplo.com/foto.jpg"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-full border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="specialties">Especialidades</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties}
                    onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                    placeholder="Corte Masculino, Barba, Coloração"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separe as especialidades por vírgula</p>
                </div>
                <div>
                  <Label htmlFor="commission">Comissão (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.commission}
                    onChange={(e) => setFormData({...formData, commission: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Profissional ativo</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    {editingProfessional ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Profissionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={professional.imageUrl} alt={professional.name} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{professional.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {professional.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                        <Badge variant="outline">{professional.commission}% comissão</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(professional)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(professional.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{professional.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{professional.phone}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Especialidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toggleProfessionalStatus(professional.id, professional.isActive)}
                    >
                      {professional.isActive ? 'Desativar' : 'Ativar'} Profissional
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum profissional encontrado' : 'Nenhum profissional cadastrado ainda'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyProfessionals;
