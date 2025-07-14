
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Company } from '@/types';
import CompanyCredentials from './CompanyCredentials';

interface CompanyFormProps {
  editingCompany: Company | null;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    plan: Company['plan'];
    status: Company['status'];
    username: string;
    password: string;
  };
  sendCredentials: boolean;
  sendMethod: 'email' | 'whatsapp';
  onFormDataChange: (data: any) => void;
  onSendCredentialsChange: (value: boolean) => void;
  onSendMethodChange: (method: 'email' | 'whatsapp') => void;
  onGeneratePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const CompanyForm = ({
  editingCompany,
  formData,
  sendCredentials,
  sendMethod,
  onFormDataChange,
  onSendCredentialsChange,
  onSendMethodChange,
  onGeneratePassword,
  onSubmit,
  onCancel
}: CompanyFormProps) => {
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
        </DialogTitle>
        <DialogDescription>
          {editingCompany ? 'Edite os dados da empresa' : 'Cadastre uma nova empresa na plataforma'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="plan">Plano</Label>
            <Select value={formData.plan} onValueChange={(value: Company['plan']) => onFormDataChange({ ...formData, plan: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Básico">Básico</SelectItem>
                <SelectItem value="Profissional">Profissional</SelectItem>
                <SelectItem value="Empresarial">Empresarial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Company['status']) => onFormDataChange({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trial">Teste</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!editingCompany && (
          <CompanyCredentials
            formData={formData}
            sendCredentials={sendCredentials}
            sendMethod={sendMethod}
            onFormDataChange={onFormDataChange}
            onSendCredentialsChange={onSendCredentialsChange}
            onSendMethodChange={onSendMethodChange}
            onGeneratePassword={onGeneratePassword}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            {editingCompany ? 'Atualizar' : 'Criar Empresa'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CompanyForm;
