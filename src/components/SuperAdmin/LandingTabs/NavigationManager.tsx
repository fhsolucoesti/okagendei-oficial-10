
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NavigationItem, NavigationSettings } from '@/types/landingConfig';
import { Plus, Pencil, Trash2, GripVertical, Navigation, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface NavigationManagerProps {
  navigationSettings: NavigationSettings;
  onUpdate: (settings: NavigationSettings) => void;
}

const actionOptions = [
  { value: 'home', label: 'Início' },
  { value: 'features', label: 'Recursos' },
  { value: 'plans', label: 'Planos' },
  { value: 'testimonials', label: 'Depoimentos' },
  { value: 'contact', label: 'Contato' }
];

const NavigationManager = ({ navigationSettings, onUpdate }: NavigationManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<NavigationItem>>({
    name: '',
    action: 'features',
    isActive: true
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.action) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const item: NavigationItem = {
      id: Date.now().toString(),
      name: newItem.name,
      action: newItem.action as any,
      isActive: newItem.isActive || true,
      order: navigationSettings.items.length
    };

    onUpdate({
      ...navigationSettings,
      items: [...navigationSettings.items, item]
    });

    setNewItem({ name: '', action: 'features', isActive: true });
    setIsAddDialogOpen(false);
    toast.success('Item de navegação adicionado com sucesso!');
  };

  const handleEditItem = () => {
    if (!editingItem?.name || !editingItem?.action) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const updatedItems = navigationSettings.items.map(item =>
      item.id === editingItem.id ? editingItem : item
    );

    onUpdate({
      ...navigationSettings,
      items: updatedItems
    });

    setEditingItem(null);
    setIsEditDialogOpen(false);
    toast.success('Item de navegação atualizado com sucesso!');
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = navigationSettings.items.filter(item => item.id !== id);
    onUpdate({
      ...navigationSettings,
      items: updatedItems
    });
    toast.success('Item de navegação removido com sucesso!');
  };

  const handleToggleActive = (id: string) => {
    const updatedItems = navigationSettings.items.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );

    onUpdate({
      ...navigationSettings,
      items: updatedItems
    });
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const items = [...navigationSettings.items];
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);
    
    // Update order
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    onUpdate({
      ...navigationSettings,
      items: updatedItems
    });
  };

  const moveItemUp = (index: number) => {
    if (index > 0) {
      moveItem(index, index - 1);
      toast.success('Item movido para cima!');
    }
  };

  const moveItemDown = (index: number) => {
    if (index < navigationSettings.items.length - 1) {
      moveItem(index, index + 1);
      toast.success('Item movido para baixo!');
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedIndex = navigationSettings.items.findIndex(item => item.id === draggedItem);
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      moveItem(draggedIndex, targetIndex);
      toast.success('Item reordenado com sucesso!');
    }
    setDraggedItem(null);
  };

  const getActionLabel = (action: string) => {
    return actionOptions.find(opt => opt.value === action)?.label || action;
  };

  // Sort items by order for display
  const sortedItems = [...navigationSettings.items].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Navigation className="h-5 w-5" />
          <span>Configuração da Navegação</span>
        </CardTitle>
        <CardDescription>
          Gerencie os itens do menu de navegação da landing page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configurações dos botões */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Texto do Botão de Login</Label>
            <Input
              value={navigationSettings.loginButtonText}
              onChange={(e) => onUpdate({
                ...navigationSettings,
                loginButtonText: e.target.value
              })}
              placeholder="Entrar"
            />
          </div>
          <div className="space-y-2">
            <Label>Texto do Botão de Cadastro</Label>
            <Input
              value={navigationSettings.signupButtonText}
              onChange={(e) => onUpdate({
                ...navigationSettings,
                signupButtonText: e.target.value
              })}
              placeholder="Começar Grátis"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Exibir Botão de Login</p>
            <p className="text-sm text-gray-600">Mostra/oculta o botão de login no cabeçalho</p>
          </div>
          <Switch
            checked={navigationSettings.showLoginButton}
            onCheckedChange={(checked) => onUpdate({
              ...navigationSettings,
              showLoginButton: checked
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Exibir Botão de Cadastro</p>
            <p className="text-sm text-gray-600">Mostra/oculta o botão de cadastro no cabeçalho</p>
          </div>
          <Switch
            checked={navigationSettings.showSignupButton}
            onCheckedChange={(checked) => onUpdate({
              ...navigationSettings,
              showSignupButton: checked
            })}
          />
        </div>

        {/* Lista de itens de navegação */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Itens de Navegação</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Item de Navegação</DialogTitle>
                  <DialogDescription>
                    Configure um novo item para o menu de navegação
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nome do Menu</Label>
                    <Input
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Ex: Recursos"
                    />
                  </div>
                  <div>
                    <Label>Ação ao Clicar</Label>
                    <Select
                      value={newItem.action}
                      onValueChange={(value) => setNewItem({ ...newItem, action: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a ação" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newItem.isActive || true}
                      onCheckedChange={(checked) => setNewItem({ ...newItem, isActive: checked })}
                    />
                    <Label>Ativo</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddItem}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {sortedItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 border rounded-lg bg-white cursor-move transition-all ${
                  draggedItem === item.id ? 'opacity-50 scale-95' : 'hover:shadow-md'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col space-y-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveItemUp(index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveItemDown(index)}
                      disabled={index === sortedItems.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    {item.isActive ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Vai para: {getActionLabel(item.action)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Ordem: {item.order + 1}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleActive(item.id)}
                  >
                    {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingItem(item);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {sortedItems.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhum item de navegação configurado. Clique em "Adicionar Item" para começar.
              </p>
            )}
          </div>
        </div>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Item de Navegação</DialogTitle>
              <DialogDescription>
                Altere as configurações do item de navegação
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <Label>Nome do Menu</Label>
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="Ex: Recursos"
                  />
                </div>
                <div>
                  <Label>Ação ao Clicar</Label>
                  <Select
                    value={editingItem.action}
                    onValueChange={(value) => setEditingItem({ ...editingItem, action: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {actionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.isActive}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, isActive: checked })}
                  />
                  <Label>Ativo</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditItem}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default NavigationManager;
