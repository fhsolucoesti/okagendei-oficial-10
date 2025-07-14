
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail, MessageSquare } from 'lucide-react';

interface CompanyCredentialsProps {
  formData: {
    username: string;
    password: string;
    email: string;
  };
  sendCredentials: boolean;
  sendMethod: 'email' | 'whatsapp';
  onFormDataChange: (data: any) => void;
  onSendCredentialsChange: (value: boolean) => void;
  onSendMethodChange: (method: 'email' | 'whatsapp') => void;
  onGeneratePassword: () => void;
}

const CompanyCredentials = ({
  formData,
  sendCredentials,
  sendMethod,
  onFormDataChange,
  onSendCredentialsChange,
  onSendMethodChange,
  onGeneratePassword
}: CompanyCredentialsProps) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-900">Credenciais de Acesso</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username">Usuário</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => onFormDataChange({ ...formData, username: e.target.value })}
            placeholder={formData.email || 'Email será usado'}
          />
          <p className="text-xs text-gray-500 mt-1">
            Deixe vazio para usar o email
          </p>
        </div>
        
        <div>
          <Label htmlFor="password">Senha</Label>
          <div className="flex space-x-2">
            <Input
              id="password"
              type="text"
              value={formData.password}
              onChange={(e) => onFormDataChange({ ...formData, password: e.target.value })}
              required
            />
            <Button type="button" variant="outline" onClick={onGeneratePassword}>
              Gerar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Switch
            id="sendCredentials"
            checked={sendCredentials}
            onCheckedChange={onSendCredentialsChange}
          />
          <Label htmlFor="sendCredentials">Enviar credenciais automaticamente</Label>
        </div>

        {sendCredentials && (
          <div>
            <Label>Método de Envio</Label>
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="email"
                  name="sendMethod"
                  value="email"
                  checked={sendMethod === 'email'}
                  onChange={(e) => onSendMethodChange(e.target.value as 'email' | 'whatsapp')}
                />
                <Label htmlFor="email" className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="whatsapp"
                  name="sendMethod"
                  value="whatsapp"
                  checked={sendMethod === 'whatsapp'}
                  onChange={(e) => onSendMethodChange(e.target.value as 'email' | 'whatsapp')}
                />
                <Label htmlFor="whatsapp" className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCredentials;
