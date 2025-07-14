
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, Zap } from 'lucide-react';
import { Feature } from '@/types/landingConfig';

interface FeatureManagerProps {
  features: Feature[];
  onUpdate: (features: Feature[]) => void;
}

const availableIcons = [
  { value: 'calendar', label: 'Calendário', icon: '📅' },
  { value: 'users', label: 'Usuários', icon: '👥' },
  { value: 'chart', label: 'Gráficos', icon: '📊' },
  { value: 'smartphone', label: 'Smartphone', icon: '📱' },
  { value: 'shield', label: 'Escudo', icon: '🛡️' },
  { value: 'zap', label: 'Raio', icon: '⚡' },
  { value: 'clock', label: 'Relógio', icon: '🕐' },
  { value: 'star', label: 'Estrela', icon: '⭐' },
  { value: 'heart', label: 'Coração', icon: '❤️' },
  { value: 'check', label: 'Check', icon: '✅' }
];

const FeatureManager = ({ features, onUpdate }: FeatureManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    isActive: true
  });

  const handleAdd = () => {
    setEditingFeature(null);
    setFormData({ title: '', description: '', icon: '', isActive: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      isActive: feature.isActive
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.icon) return;

    const newFeature: Feature = {
      id: editingFeature?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      isActive: formData.isActive
    };

    let updatedFeatures: Feature[];
    if (editingFeature) {
      updatedFeatures = features.map(feature => 
        feature.id === editingFeature.id ? newFeature : feature
      );
    } else {
      updatedFeatures = [...features, newFeature];
    }

    onUpdate(updatedFeatures);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedFeatures = features.filter(feature => feature.id !== id);
    onUpdate(updatedFeatures);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const updatedFeatures = features.map(feature =>
      feature.id === id ? { ...feature, isActive } : feature
    );
    onUpdate(updatedFeatures);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Recursos da Plataforma</h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Recurso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFeature ? 'Editar Recurso' : 'Adicionar Recurso'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Recurso</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Agendamento Online"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o recurso..."
                />
              </div>
              
              <div>
                <Label htmlFor="icon">Ícone</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center space-x-2">
                          <span>{icon.icon}</span>
                          <span>{icon.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label>Ativo</Label>
              </div>
              
              <Button onClick={handleSave} className="w-full">
                {editingFeature ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {features.map((feature) => (
          <Card key={feature.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {availableIcons.find(icon => icon.value === feature.icon)?.icon || '⚡'}
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[300px]">{feature.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={feature.isActive}
                  onCheckedChange={(checked) => handleToggleActive(feature.id, checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(feature)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(feature.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {features.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Nenhum recurso adicionado ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeatureManager;
