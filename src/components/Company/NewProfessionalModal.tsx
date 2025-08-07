import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Loader2 } from 'lucide-react';

interface NewProfessionalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  currentCount: number;
  planLimit: number;
  onSuccess: () => void;
}

export const NewProfessionalModal = ({
  isOpen,
  onOpenChange,
  companyId,
  currentCount,
  planLimit,
  onSuccess
}: NewProfessionalModalProps) => {
  const [formData, setFormData] = useState({
    profName: '',
    profEmail: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.profName || !formData.profEmail) {
      toast.error('Preencha todos os campos');
      return;
    }

    // Check plan limit
    if (currentCount >= planLimit) {
      toast.error(`Limite do plano atingido. Máximo: ${planLimit} profissionais`);
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to create professional
      const { data, error } = await supabase.functions.invoke('create-professional', {
        body: {
          profName: formData.profName,
          profEmail: formData.profEmail,
          companyId: companyId
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Profissional criado com sucesso!', {
          description: `Senha temporária: ${data.temporaryPassword}`
        });
        
        // Reset form
        setFormData({ profName: '', profEmail: '' });
        onOpenChange(false);
        onSuccess();
      } else {
        throw new Error(data.error || 'Erro ao criar profissional');
      }

    } catch (error: any) {
      console.error('Erro ao criar profissional:', error);
      toast.error(error.message || 'Erro ao criar profissional');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Novo Profissional
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="profName">Nome do Profissional *</Label>
            <Input
              id="profName"
              value={formData.profName}
              onChange={(e) => setFormData({ ...formData, profName: e.target.value })}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="profEmail">Email do Profissional *</Label>
            <Input
              id="profEmail"
              type="email"
              value={formData.profEmail}
              onChange={(e) => setFormData({ ...formData, profEmail: e.target.value })}
              placeholder="Digite o email"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Limite do plano:</strong> {currentCount}/{planLimit} profissionais
            </p>
            <p className="text-xs text-blue-600 mt-1">
              O profissional receberá uma senha temporária por email
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || currentCount >= planLimit}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};