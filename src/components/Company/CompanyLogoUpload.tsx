
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Company } from '@/types';

interface CompanyLogoUploadProps {
  company: Company;
  onUpdateLogo: (companyId: string, data: Partial<Company>) => void;
}

const CompanyLogoUpload = ({ company, onUpdateLogo }: CompanyLogoUploadProps) => {
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Formato não suportado. Use PNG, JPG ou SVG.');
        return;
      }

      if (file.size > 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 1MB.');
        return;
      }

      setIsUploadingLogo(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        if (company) {
          onUpdateLogo(company.id, { logo: logoUrl });
          toast.success('Logo atualizado com sucesso!');
        }
        setIsUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo da Empresa</CardTitle>
        <CardDescription>
          Personalize sua página pública com o logo da empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={company?.logo} alt={company?.name} />
              <AvatarFallback className="text-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <Building2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="logo">Fazer Upload do Logo</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="logo"
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('logo')?.click()}
                  disabled={isUploadingLogo}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploadingLogo ? 'Enviando...' : 'Escolher Arquivo'}
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-xs text-gray-500">
                  <strong>Formatos aceitos:</strong> PNG, JPG, SVG
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Tamanho máximo:</strong> 1MB
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Recomendado:</strong> 200x200px (quadrado)
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLogoUpload;
