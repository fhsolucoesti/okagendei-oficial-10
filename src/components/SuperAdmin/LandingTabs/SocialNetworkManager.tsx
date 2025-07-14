
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Globe, Mail, Phone } from 'lucide-react';
import { SocialNetwork } from '@/types/landingConfig';

const availableIcons = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Telefone', icon: Phone },
];

interface SocialNetworkManagerProps {
  socialNetworks: SocialNetwork[];
  onUpdate: (networks: SocialNetwork[]) => void;
}

const SocialNetworkManager = ({ socialNetworks, onUpdate }: SocialNetworkManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<SocialNetwork | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    isActive: true
  });

  const handleAdd = () => {
    setEditingNetwork(null);
    setFormData({ name: '', url: '', icon: '', isActive: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (network: SocialNetwork) => {
    setEditingNetwork(network);
    setFormData({
      name: network.name,
      url: network.url,
      icon: network.icon,
      isActive: network.isActive
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.url || !formData.icon) return;

    const newNetwork: SocialNetwork = {
      id: editingNetwork?.id || Date.now().toString(),
      name: formData.name,
      url: formData.url,
      icon: formData.icon,
      isActive: formData.isActive
    };

    let updatedNetworks: SocialNetwork[];
    if (editingNetwork) {
      updatedNetworks = socialNetworks.map(network => 
        network.id === editingNetwork.id ? newNetwork : network
      );
    } else {
      updatedNetworks = [...socialNetworks, newNetwork];
    }

    onUpdate(updatedNetworks);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedNetworks = socialNetworks.filter(network => network.id !== id);
    onUpdate(updatedNetworks);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const updatedNetworks = socialNetworks.map(network =>
      network.id === id ? { ...network, isActive } : network
    );
    onUpdate(updatedNetworks);
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find(icon => icon.value === iconName);
    return iconData ? iconData.icon : Globe;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Redes Sociais</h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Rede Social
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingNetwork ? 'Editar Rede Social' : 'Adicionar Rede Social'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Rede Social</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Facebook, Instagram..."
                />
              </div>
              
              <div>
                <Label htmlFor="icon">Ícone</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((iconOption) => {
                      const IconComponent = iconOption.icon;
                      return (
                        <SelectItem key={iconOption.value} value={iconOption.value}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{iconOption.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label>Ativo</Label>
              </div>
              
              <Button onClick={handleSave} className="w-full">
                {editingNetwork ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {socialNetworks.map((network) => {
          const IconComponent = getIconComponent(network.icon);
          return (
            <Card key={network.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{network.name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">{network.url}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={network.isActive}
                    onCheckedChange={(checked) => handleToggleActive(network.id, checked)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(network)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(network.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        
        {socialNetworks.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Nenhuma rede social adicionada ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default SocialNetworkManager;
