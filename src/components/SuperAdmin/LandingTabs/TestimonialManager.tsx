
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, User, Star } from 'lucide-react';
import { Testimonial } from '@/types/landingConfig';

interface TestimonialManagerProps {
  testimonials: Testimonial[];
  onUpdate: (testimonials: Testimonial[]) => void;
}

const TestimonialManager = ({ testimonials, onUpdate }: TestimonialManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    testimonial: '',
    business: '',
    text: '',
    rating: 5,
    image: '',
    isActive: true
  });

  const handleAdd = () => {
    setEditingTestimonial(null);
    setFormData({ 
      name: '', 
      title: '', 
      testimonial: '', 
      business: '', 
      text: '', 
      rating: 5, 
      image: '', 
      isActive: true 
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      testimonial: testimonial.testimonial,
      business: testimonial.business || '',
      text: testimonial.text || testimonial.testimonial,
      rating: testimonial.rating || 5,
      image: testimonial.image,
      isActive: testimonial.isActive !== false
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.testimonial) return;

    const newTestimonial: Testimonial = {
      id: editingTestimonial?.id || Date.now().toString(),
      name: formData.name,
      title: formData.title || formData.business || '',
      image: formData.image,
      testimonial: formData.testimonial,
      business: formData.business,
      text: formData.text || formData.testimonial,
      rating: formData.rating,
      isActive: formData.isActive
    };

    let updatedTestimonials: Testimonial[];
    if (editingTestimonial) {
      updatedTestimonials = testimonials.map(testimonial => 
        testimonial.id === editingTestimonial.id ? newTestimonial : testimonial
      );
    } else {
      updatedTestimonials = [...testimonials, newTestimonial];
    }

    onUpdate(updatedTestimonials);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    onUpdate(updatedTestimonials);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const updatedTestimonials = testimonials.map(testimonial =>
      testimonial.id === id ? { ...testimonial, isActive } : testimonial
    );
    onUpdate(updatedTestimonials);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Depoimentos de Clientes</h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Editar Depoimento' : 'Adicionar Depoimento'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Cliente</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="business">Negócio/Cargo</Label>
                  <Input
                    id="business"
                    value={formData.business}
                    onChange={(e) => setFormData({...formData, business: e.target.value, title: e.target.value})}
                    placeholder="Ex: Salão de Beleza Elegance"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="testimonial">Depoimento</Label>
                <Textarea
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => setFormData({...formData, testimonial: e.target.value, text: e.target.value})}
                  placeholder="O depoimento do cliente..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Avaliação (1-5 estrelas)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Imagem (URL)</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
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
                {editingTestimonial ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium">{testimonial.name}</p>
                    <span className="text-sm text-muted-foreground">•</span>
                    <p className="text-sm text-muted-foreground">{testimonial.business || testimonial.title}</p>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(testimonial.rating || 5)}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{testimonial.text || testimonial.testimonial}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Switch
                  checked={testimonial.isActive !== false}
                  onCheckedChange={(checked) => handleToggleActive(testimonial.id, checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(testimonial)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(testimonial.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {testimonials.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Nenhum depoimento adicionado ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default TestimonialManager;
