
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Zap } from 'lucide-react';
import { CtaSection } from '@/types/landingConfig';
import { saveCtaConfig } from '@/utils/landingConfigStorage';

interface CtaTabProps {
  ctaSection: CtaSection;
  setCtaSection: (section: CtaSection) => void;
}

const CtaTab = ({ ctaSection, setCtaSection }: CtaTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Seção Call-to-Action</span>
        </CardTitle>
        <CardDescription>
          Configure a seção final de chamada para ação da landing page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Exibir Seção</p>
            <p className="text-sm text-gray-600">Habilita ou desabilita a exibição desta seção</p>
          </div>
          <Switch
            checked={ctaSection.enabled}
            onCheckedChange={(checked) => 
              setCtaSection({...ctaSection, enabled: checked})
            }
          />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ctaTitle">Título Principal</Label>
            <Textarea
              id="ctaTitle"
              value={ctaSection.title}
              onChange={(e) => setCtaSection({...ctaSection, title: e.target.value})}
              rows={2}
              placeholder="Ex: Pronto para revolucionar seus agendamentos?"
            />
          </div>
          
          <div>
            <Label htmlFor="ctaSubtitle">Subtítulo</Label>
            <Textarea
              id="ctaSubtitle"
              value={ctaSection.subtitle}
              onChange={(e) => setCtaSection({...ctaSection, subtitle: e.target.value})}
              rows={2}
              placeholder="Ex: Comece seu teste gratuito hoje mesmo e veja a diferença"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ctaButtonText">Texto do Botão</Label>
            <Input
              id="ctaButtonText"
              value={ctaSection.buttonText}
              onChange={(e) => setCtaSection({...ctaSection, buttonText: e.target.value})}
              placeholder="Ex: Começar Teste Grátis"
            />
          </div>
          
          <div>
            <Label htmlFor="ctaButtonAction">Ação do Botão</Label>
            <select
              id="ctaButtonAction"
              value={ctaSection.buttonAction}
              onChange={(e) => setCtaSection({...ctaSection, buttonAction: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="plans">Ir para Planos</option>
              <option value="signup">Abrir Cadastro</option>
              <option value="contact">Ir para Contato</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ctaBackgroundColor">Cor de Fundo</Label>
            <select
              id="ctaBackgroundColor"
              value={ctaSection.backgroundColor}
              onChange={(e) => setCtaSection({...ctaSection, backgroundColor: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="blue">Azul</option>
              <option value="indigo">Índigo</option>
              <option value="purple">Roxo</option>
              <option value="green">Verde</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mostrar Ícone no Botão</p>
              <p className="text-sm text-gray-600">Exibe seta no botão</p>
            </div>
            <Switch
              checked={ctaSection.showIcon}
              onCheckedChange={(checked) => 
                setCtaSection({...ctaSection, showIcon: checked})
              }
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Preview</h4>
          <div className={`p-6 rounded-lg text-center text-white bg-gradient-to-br ${
            ctaSection.backgroundColor === 'blue' ? 'from-blue-600 to-indigo-700' :
            ctaSection.backgroundColor === 'indigo' ? 'from-indigo-600 to-purple-700' :
            ctaSection.backgroundColor === 'purple' ? 'from-purple-600 to-pink-700' :
            'from-green-600 to-emerald-700'
          }`}>
            <h3 className="text-2xl font-bold mb-2">{ctaSection.title}</h3>
            <p className="text-lg mb-4 opacity-90">{ctaSection.subtitle}</p>
            <div className="inline-flex items-center px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold">
              {ctaSection.buttonText}
              {ctaSection.showIcon && <span className="ml-2">→</span>}
            </div>
          </div>
        </div>

        <Button onClick={() => saveCtaConfig(ctaSection)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Salvar Seção Call-to-Action
        </Button>
      </CardContent>
    </Card>
  );
};

export default CtaTab;
