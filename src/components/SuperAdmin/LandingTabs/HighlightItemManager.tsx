
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Plus, Trash2, GripVertical, Star, Gift, Shield, Users, Zap, Heart } from 'lucide-react';
import { HighlightItem } from '@/types/landingConfig';

interface HighlightItemManagerProps {
  items: HighlightItem[];
  onUpdate: (items: HighlightItem[]) => void;
}

const iconOptions = [
  { value: 'check', label: 'Check', component: Check },
  { value: 'star', label: 'Estrela', component: Star },
  { value: 'gift', label: 'Presente', component: Gift },
  { value: 'shield', label: 'Escudo', component: Shield },
  { value: 'users', label: 'Usuários', component: Users },
  { value: 'zap', label: 'Raio', component: Zap },
  { value: 'heart', label: 'Coração', component: Heart }
];

const HighlightItemManager = ({ items, onUpdate }: HighlightItemManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HighlightItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    icon: 'check'
  });

  const handleAddItem = () => {
    if (!formData.title.trim()) return;

    const newItem: HighlightItem = {
      id: Date.now().toString(),
      title: formData.title,
      icon: formData.icon,
      isActive: true,
      order: items.length
    };

    onUpdate([...items, newItem]);
    setFormData({ title: '', icon: 'check' });
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (item: HighlightItem) => {
    if (!formData.title.trim()) return;

    const updatedItems = items.map(i => 
      i.id === item.id 
        ? { ...i, title: formData.title, icon: formData.icon }
        : i
    );

    onUpdate(updatedItems);
    setEditingItem(null);
    setFormData({ title: '', icon: 'check' });
  };

  const handleToggleItem = (itemId: string) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, isActive: !item.isActive } : item
    );
    onUpdate(updatedItems);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    onUpdate(updatedItems);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    
    // Atualizar ordem
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index
    }));

    onUpdate(reorderedItems);
  };

  const openEditDialog = (item: HighlightItem) => {
    setEditingItem(item);
    setFormData({ title: item.title, icon: item.icon });
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.component : Check;
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Itens de Destaque</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Item de Destaque</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="itemTitle">Título</Label>
                  <Input
                    id="itemTitle"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Sem taxa de setup"
                  />
                </div>
                <div>
                  <Label htmlFor="itemIcon">Ícone</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.component;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddItem}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedItems.map((item, index) => {
            const IconComponent = getIconComponent(item.icon);
            return (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                <IconComponent className="h-4 w-4 text-green-500" />
                <span className="flex-1 font-medium">{item.title}</span>
                
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? 'Ativo' : 'Inativo'}
                </Badge>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={() => handleToggleItem(item.id)}
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(item)}
                  >
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum item de destaque configurado</p>
              <p className="text-sm">Clique em "Adicionar Item" para começar</p>
            </div>
          )}
        </div>

        {/* Dialog de Edição */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Item de Destaque</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Título</Label>
                <Input
                  id="editTitle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Sem taxa de setup"
                />
              </div>
              <div>
                <Label htmlFor="editIcon">Ícone</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => {
                      const IconComponent = option.component;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => editingItem && handleEditItem(editingItem)}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default HighlightItemManager;
