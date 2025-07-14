
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Company } from '@/types';

interface CustomUrlFormProps {
  company: Company;
  companies: Company[];
  onUpdateUrl: (companyId: string, data: Partial<Company>) => void;
}

const CustomUrlForm = ({ company, companies, onUpdateUrl }: CustomUrlFormProps) => {
  const [customUrl, setCustomUrl] = useState(company?.customUrl || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateUrl = async () => {
    if (!customUrl.trim()) {
      toast.error('Digite uma URL personalizada');
      return;
    }

    const sanitizedUrl = customUrl
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (!sanitizedUrl) {
      toast.error('URL inválida. Use apenas letras, números e hífens');
      return;
    }

    const urlExists = companies.some(c => 
      c.id !== company?.id && 
      c.customUrl === sanitizedUrl
    );

    if (urlExists) {
      toast.error('Esta URL já está sendo usada por outra empresa');
      return;
    }

    setIsUpdating(true);
    
    try {
      if (company) {
        onUpdateUrl(company.id, { customUrl: sanitizedUrl });
        setCustomUrl(sanitizedUrl);
        toast.success('URL personalizada atualizada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar URL:', error);
      toast.error('Erro ao atualizar URL personalizada');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalizar URL</CardTitle>
        <CardDescription>
          Crie uma URL personalizada para facilitar o compartilhamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customUrl">URL Personalizada</Label>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500 px-3 py-2 bg-gray-100 rounded-l border">
                /agendar/
              </span>
              <Input
                id="customUrl"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="minha-empresa"
                className="rounded-l-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use apenas letras minúsculas, números e hífens
            </p>
          </div>
          
          <Button
            onClick={handleUpdateUrl}
            disabled={isUpdating || !customUrl.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isUpdating ? 'Atualizando...' : 'Atualizar URL'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomUrlForm;
