import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Upload, Palette, Type } from 'lucide-react';
import { HeroSection, ColorTheme } from '@/types/landingConfig';
import { saveHeroConfig } from '@/utils/landingConfigStorage';
import { toast } from 'sonner';
import HeroElementManager from './HeroElementManager';
import ColorThemeManager from './ColorThemeManager';
import NavigationManager from './NavigationManager';
import HighlightItemManager from './HighlightItemManager';

interface HeroTabProps {
  heroSection: HeroSection;
  setHeroSection: (section: HeroSection) => void;
}

const defaultColorTheme: ColorTheme = {
  primary: 'hsl(221.2, 83.2%, 53.3%)',
  primaryForeground: 'hsl(210, 40%, 98%)',
  secondary: 'hsl(210, 40%, 96.1%)',
  secondaryForeground: 'hsl(222.2, 47.4%, 11.2%)',
  accent: 'hsl(210, 40%, 96.1%)',
  accentForeground: 'hsl(222.2, 47.4%, 11.2%)',
  background: 'hsl(0, 0%, 100%)',
  foreground: 'hsl(222.2, 84%, 4.9%)',
  muted: 'hsl(210, 40%, 96.1%)',
  mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
  destructive: 'hsl(0, 84.2%, 60.2%)',
  destructiveForeground: 'hsl(210, 40%, 98%)',
  border: 'hsl(214.3, 31.8%, 91.4%)',
  input: 'hsl(214.3, 31.8%, 91.4%)',
  ring: 'hsl(221.2, 83.2%, 53.3%)'
};

const defaultCustomStyles = {
  heroBackground: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
  titleGradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
  ctaGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
  cardBackground: 'bg-white/80 backdrop-blur-sm',
  badgeColors: {
    background: '#dcfce7',
    text: '#166534'
  }
};

const buttonColorOptions = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-600 hover:bg-blue-700' },
  { value: 'green', label: 'Verde', class: 'bg-green-600 hover:bg-green-700' },
  { value: 'purple', label: 'Roxo', class: 'bg-purple-600 hover:bg-purple-700' },
  { value: 'red', label: 'Vermelho', class: 'bg-red-600 hover:bg-red-700' },
  { value: 'orange', label: 'Laranja', class: 'bg-orange-600 hover:bg-orange-700' },
  { value: 'indigo', label: 'Índigo', class: 'bg-indigo-600 hover:bg-indigo-700' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-600 hover:bg-pink-700' },
  { value: 'gray', label: 'Cinza', class: 'bg-gray-600 hover:bg-gray-700' }
];

const HeroTab = ({ heroSection, setHeroSection }: HeroTabProps) => {
  const handleImageUpload = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setHeroSection({ ...heroSection, [field]: imageUrl });
        toast.success('Imagem carregada com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateElements = (elements: any[]) => {
    setHeroSection({
      ...heroSection,
      elements: elements
    });
  };

  const handleUpdateColorTheme = (colorTheme: ColorTheme) => {
    setHeroSection({
      ...heroSection,
      colorTheme: colorTheme
    });
  };

  const handleUpdateCustomStyles = (customStyles: any) => {
    setHeroSection({
      ...heroSection,
      customStyles: customStyles
    });
  };

  const handleUpdateNavigation = (navigationSettings: any) => {
    setHeroSection({
      ...heroSection,
      navigationSettings: navigationSettings
    });
  };

  const handleUpdateHighlightItems = (highlightItems: any[]) => {
    setHeroSection({
      ...heroSection,
      highlightItems: highlightItems
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Seção Principal (Hero)</span>
        </CardTitle>
        <CardDescription>
          Configure o conteúdo, elementos e cores da seção principal da landing page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="navigation">Navegação</TabsTrigger>
            <TabsTrigger value="highlights">Destaques</TabsTrigger>
            <TabsTrigger value="elements">Elementos</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heroTitle">Título Principal</Label>
                <Textarea
                  id="heroTitle"
                  value={heroSection.title}
                  onChange={(e) => setHeroSection({...heroSection, title: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="heroSubtitle">Subtítulo</Label>
                <Textarea
                  id="heroSubtitle"
                  value={heroSection.subtitle}
                  onChange={(e) => setHeroSection({...heroSection, subtitle: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ctaText">Texto do Botão Principal</Label>
                <Input
                  id="ctaText"
                  value={heroSection.ctaText}
                  onChange={(e) => setHeroSection({...heroSection, ctaText: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="ctaButtonColor">Cor do Botão Principal</Label>
                <Select 
                  value={heroSection.ctaButtonColor} 
                  onValueChange={(value: any) => setHeroSection({...heroSection, ctaButtonColor: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {buttonColorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded ${option.class}`}></div>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="trialText">Texto da Oferta de Teste</Label>
              <Input
                id="trialText"
                value={heroSection.trialText}
                onChange={(e) => setHeroSection({...heroSection, trialText: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="trialDescription">Descrição do Teste Grátis</Label>
              <Textarea
                id="trialDescription"
                value={heroSection.trialDescription}
                onChange={(e) => setHeroSection({...heroSection, trialDescription: e.target.value})}
                placeholder="Experimente todos os recursos sem pagar nada. Cancele quando quiser."
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mostrar Badge de Teste Grátis</p>
                <p className="text-sm text-gray-600">Exibe o selo promocional na seção principal</p>
              </div>
              <Switch
                checked={heroSection.showTrialBadge}
                onCheckedChange={(checked) => 
                  setHeroSection({...heroSection, showTrialBadge: checked})
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="navigation">
            <NavigationManager
              navigationSettings={heroSection.navigationSettings || {
                items: [],
                showLoginButton: true,
                showSignupButton: true,
                loginButtonText: 'Entrar',
                signupButtonText: 'Começar Grátis'
              }}
              onUpdate={handleUpdateNavigation}
            />
          </TabsContent>

          <TabsContent value="highlights">
            <HighlightItemManager
              items={heroSection.highlightItems || []}
              onUpdate={handleUpdateHighlightItems}
            />
          </TabsContent>

          <TabsContent value="elements">
            <HeroElementManager
              elements={heroSection.elements || []}
              onUpdate={handleUpdateElements}
            />
          </TabsContent>

          <TabsContent value="colors">
            <ColorThemeManager
              colorTheme={heroSection.colorTheme || defaultColorTheme}
              customStyles={heroSection.customStyles || defaultCustomStyles}
              onUpdateColorTheme={handleUpdateColorTheme}
              onUpdateCustomStyles={handleUpdateCustomStyles}
            />
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logoUpload">Logo da Empresa</Label>
                <div className="mt-2">
                  <input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('logoImage', e)}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logoUpload')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Carregar Logo
                  </Button>
                  {heroSection.logoImage && (
                    <div className="mt-2">
                      <img 
                        src={heroSection.logoImage} 
                        alt="Logo preview" 
                        className="w-20 h-20 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="backgroundUpload">Imagem de Fundo</Label>
                <div className="mt-2">
                  <input
                    id="backgroundUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('backgroundImage', e)}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('backgroundUpload')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Carregar Fundo
                  </Button>
                  {heroSection.backgroundImage && (
                    <div className="mt-2">
                      <img 
                        src={heroSection.backgroundImage} 
                        alt="Background preview" 
                        className="w-32 h-20 object-cover border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <Button 
          onClick={() => saveHeroConfig(heroSection)} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full"
        >
          <Palette className="h-4 w-4 mr-2" />
          Salvar Configurações do Hero
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeroTab;
