
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Phone } from 'lucide-react';
import { CompanyInfo } from '@/types/landingConfig';
import { saveCompanyConfig } from '@/utils/landingConfigStorage';

interface CompanyTabProps {
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
}

const CompanyTab = ({ companyInfo, setCompanyInfo }: CompanyTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>Informações da Empresa</span>
        </CardTitle>
        <CardDescription>
          Configure as informações de contato e redes sociais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              value={companyInfo.companyName}
              onChange={(e) => setCompanyInfo({...companyInfo, companyName: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="email">E-mail de Contato</Label>
            <Input
              id="email"
              type="email"
              value={companyInfo.email}
              onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={companyInfo.phone}
              onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={companyInfo.whatsapp}
              onChange={(e) => setCompanyInfo({...companyInfo, whatsapp: e.target.value})}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={companyInfo.address}
            onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
            placeholder="São Paulo, SP"
          />
        </div>

        <Separator />
        <p className="font-medium">Redes Sociais</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={companyInfo.facebook}
              onChange={(e) => setCompanyInfo({...companyInfo, facebook: e.target.value})}
              placeholder="https://facebook.com/suaempresa"
            />
          </div>
          
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={companyInfo.instagram}
              onChange={(e) => setCompanyInfo({...companyInfo, instagram: e.target.value})}
              placeholder="https://instagram.com/suaempresa"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={companyInfo.linkedin}
              onChange={(e) => setCompanyInfo({...companyInfo, linkedin: e.target.value})}
              placeholder="https://linkedin.com/company/suaempresa"
            />
          </div>
          
          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              value={companyInfo.youtube}
              onChange={(e) => setCompanyInfo({...companyInfo, youtube: e.target.value})}
              placeholder="https://youtube.com/suaempresa"
            />
          </div>
        </div>

        <Button onClick={() => saveCompanyConfig(companyInfo)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Salvar Informações da Empresa
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompanyTab;
