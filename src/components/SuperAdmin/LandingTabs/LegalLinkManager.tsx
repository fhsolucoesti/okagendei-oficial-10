
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, FileText } from 'lucide-react';
import { LegalLink } from '@/types/landingConfig';

interface LegalLinkManagerProps {
  legalLinks: LegalLink[];
  onUpdate: (links: LegalLink[]) => void;
}

const LegalLinkManager = ({ legalLinks, onUpdate }: LegalLinkManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LegalLink | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    isActive: true
  });

  const handleAdd = () => {
    setEditingLink(null);
    setFormData({ name: '', url: '', isActive: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (link: LegalLink) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      url: link.url,
      isActive: link.isActive
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.url) return;

    const newLink: LegalLink = {
      id: editingLink?.id || Date.now().toString(),
      name: formData.name,
      url: formData.url,
      isActive: formData.isActive
    };

    let updatedLinks: LegalLink[];
    if (editingLink) {
      updatedLinks = legalLinks.map(link => 
        link.id === editingLink.id ? newLink : link
      );
    } else {
      updatedLinks = [...legalLinks, newLink];
    }

    onUpdate(updatedLinks);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedLinks = legalLinks.filter(link => link.id !== id);
    onUpdate(updatedLinks);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const updatedLinks = legalLinks.map(link =>
      link.id === id ? { ...link, isActive } : link
    );
    onUpdate(updatedLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Links Legais</h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLink ? 'Editar Link Legal' : 'Adicionar Link Legal'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Link</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Política de Privacidade, Termos de Uso..."
                />
              </div>
              
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="/politica-privacidade ou https://..."
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
                {editingLink ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {legalLinks.map((link) => (
          <Card key={link.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <div>
                  <p className="font-medium">{link.name}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">{link.url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={link.isActive}
                  onCheckedChange={(checked) => handleToggleActive(link.id, checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(link)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(link.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {legalLinks.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Nenhum link legal adicionado ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default LegalLinkManager;
