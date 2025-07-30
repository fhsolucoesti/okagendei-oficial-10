
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Search, Edit, Trash2, UserCheck, Mail, Phone, Upload, Image } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import { Professional } from '@/types';
import { toast } from 'sonner';

const CompanyEmployees = () => {
  const { professionals, addProfessional, updateProfessional, deleteProfessional } = useCompanyDataContext();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    commission: 50,
    imageUrl: ''
  });

  const companyProfessionals = professionals.filter(p => p.companyId === user?.companyId);
  const filteredProfessionals = companyProfessionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProfessional) {
      updateProfessional(editingProfessional.id, formData);
      toast.success('Funcionário atualizado com sucesso!');
    } else {
      addProfessional({
        ...formData,
        companyId: user?.companyId || '',
        userId: Date.now().toString(),
        isActive: true,
        workingHours: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isAvailable: false },
          { dayOfWeek: 0, startTime: '09:00', endTime: '15:00', isAvailable: false }
        ]
      });
      toast.success('Funcionário cadastrado com sucesso!');
    }
    
    setIsDialogOpen(false);
    setEditingProfessional(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialties: [],
      commission: 50,
      imageUrl: ''
    });
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      specialties: professional.specialties,
      commission: professional.commission,
      imageUrl: professional.imageUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      deleteProfessional(id);
      toast.success('Funcionário excluído com sucesso!');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData({ ...formData, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Funcionários" subtitle="Gerencie sua equipe de profissionais" />
      
      <main className="p-6">
        {/* Barra de Ações */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar funcionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProfessional ? 'Editar Funcionário' : 'Novo Funcionário'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do funcionário
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                  <Label htmlFor="specialties">Especialidades</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData, 
                      specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    placeholder="Ex: Corte Masculino, Barba"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separe por vírgula</p>
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
                <div>
                  <Label htmlFor="image">Foto do Profissional</Label>
                  <div className="space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {formData.imageUrl && (
                      <div className="flex items-center space-x-2">
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="h-16 w-16 object-cover rounded-lg border"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setFormData({...formData, imageUrl: ''})}
                        >
                          Remover
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">JPG, PNG ou GIF até 5MB</p>
                  </div>
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

        {/* Lista de Funcionários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={professional.imageUrl} alt={professional.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <Users className="h-6 w-6" />
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
                        <Badge className="bg-blue-100 text-blue-800">
                          {professional.commission}% comissão
                        </Badge>
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
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <Mail className="h-3 w-3 mr-2" />
                    {professional.email}
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-3 w-3 mr-2" />
                    {professional.phone}
                  </p>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Especialidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado ainda'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyEmployees;
