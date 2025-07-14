
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, Type, MousePointer, Badge } from 'lucide-react';
import { HeroElement } from '@/types/landingConfig';

interface HeroElementManagerProps {
  elements: HeroElement[];
  onUpdate: (elements: HeroElement[]) => void;
}

const HeroElementManager = ({ elements, onUpdate }: HeroElementManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<HeroElement | null>(null);
  const [formData, setFormData] = useState({
    type: 'title' as HeroElement['type'],
    content: '',
    isActive: true,
    styles: {
      fontSize: '',
      fontWeight: '',
      color: '',
      backgroundColor: ''
    }
  });

  const elementTypes = [
    { value: 'title', label: 'Título Principal', icon: Type },
    { value: 'subtitle', label: 'Subtítulo', icon: Type },
    { value: 'cta', label: 'Botão Principal', icon: MousePointer },
    { value: 'secondary-cta', label: 'Botão Secundário', icon: MousePointer },
    { value: 'feature-badge', label: 'Badge de Recurso', icon: Badge }
  ];

  const handleAdd = () => {
    setEditingElement(null);
    setFormData({ 
      type: 'title',
      content: '', 
      isActive: true,
      styles: { fontSize: '', fontWeight: '', color: '', backgroundColor: '' }
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (element: HeroElement) => {
    setEditingElement(element);
    setFormData({
      type: element.type,
      content: element.content,
      isActive: element.isActive,
      styles: {
        fontSize: element.styles?.fontSize || '',
        fontWeight: element.styles?.fontWeight || '',
        color: element.styles?.color || '',
        backgroundColor: element.styles?.backgroundColor || ''
      }
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.content) return;

    const newElement: HeroElement = {
      id: editingElement?.id || Date.now().toString(),
      type: formData.type,
      content: formData.content,
      isActive: formData.isActive,
      styles: {
        fontSize: formData.styles.fontSize,
        fontWeight: formData.styles.fontWeight,
        color: formData.styles.color,
        backgroundColor: formData.styles.backgroundColor
      }
    };

    let updatedElements: HeroElement[];
    if (editingElement) {
      updatedElements = elements.map(element => 
        element.id === editingElement.id ? newElement : element
      );
    } else {
      updatedElements = [...elements, newElement];
    }

    onUpdate(updatedElements);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedElements = elements.filter(element => element.id !== id);
    onUpdate(updatedElements);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const updatedElements = elements.map(element =>
      element.id === id ? { ...element, isActive } : element
    );
    onUpdate(updatedElements);
  };

  const getElementIcon = (type: string) => {
    const elementType = elementTypes.find(t => t.value === type);
    return elementType?.icon || Type;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Elementos do Hero</h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Elemento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingElement ? 'Editar Elemento' : 'Adicionar Elemento'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Tipo de Elemento</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value as HeroElement['type']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {elementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Digite o conteúdo do elemento..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                  <Input
                    id="fontSize"
                    value={formData.styles.fontSize}
                    onChange={(e) => setFormData({
                      ...formData, 
                      styles: { ...formData.styles, fontSize: e.target.value }
                    })}
                    placeholder="Ex: text-3xl, text-lg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fontWeight">Peso da Fonte</Label>
                  <Select
                    value={formData.styles.fontWeight}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      styles: { ...formData.styles, fontWeight: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="font-light">Leve</SelectItem>
                      <SelectItem value="font-normal">Normal</SelectItem>
                      <SelectItem value="font-medium">Médio</SelectItem>
                      <SelectItem value="font-semibold">Semi-negrito</SelectItem>
                      <SelectItem value="font-bold">Negrito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Cor do Texto</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.styles.color}
                    onChange={(e) => setFormData({
                      ...formData, 
                      styles: { ...formData.styles, color: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formData.styles.backgroundColor}
                    onChange={(e) => setFormData({
                      ...formData, 
                      styles: { ...formData.styles, backgroundColor: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label>Ativo</Label>
              </div>
              
              <Button onClick={handleSave} className="w-full">
                {editingElement ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {elements.map((element) => {
          const IconComponent = getElementIcon(element.type);
          return (
            <Card key={element.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {elementTypes.find(t => t.value === element.type)?.label}
                    </p>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {element.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={element.isActive}
                    onCheckedChange={(checked) => handleToggleActive(element.id, checked)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(element)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(element.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        
        {elements.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Nenhum elemento adicionado ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroElementManager;
