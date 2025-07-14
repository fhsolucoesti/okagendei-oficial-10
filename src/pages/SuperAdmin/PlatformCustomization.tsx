import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Upload, Palette, Monitor, Image, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Layout/Header';

interface PlatformConfig {
  logo: string;
  platformName: string;
  primaryColor: string;
  backgroundType: 'color' | 'image';
  backgroundColor: string;
  backgroundImage: string;
  // Configurações para o menu
  menuLogo: string;
  menuPlatformName: string;
  menuTextColor: string;
  // Configurações para o botão Entrar
  loginButtonText: string;
  loginButtonBackgroundColor: string;
  loginButtonTextColor: string;
}

const PlatformCustomization = () => {
  const [config, setConfig] = useState<PlatformConfig>({
    logo: '',
    platformName: 'OKAgendei',
    primaryColor: '#2563eb',
    backgroundType: 'color',
    backgroundColor: '#f8fafc',
    backgroundImage: '',
    menuLogo: '',
    menuPlatformName: 'OKAgendei',
    menuTextColor: '#1f2937',
    loginButtonText: 'Entrar',
    loginButtonBackgroundColor: '#ffffff',
    loginButtonTextColor: '#374151'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');
  const [menuLogoPreview, setMenuLogoPreview] = useState<string>('');

  // Carregar configurações existentes
  useEffect(() => {
    const savedConfig = localStorage.getItem('platformConfig');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig({
        ...config,
        ...parsed,
        loginButtonText: parsed.loginButtonText || 'Entrar',
        loginButtonBackgroundColor: parsed.loginButtonBackgroundColor || '#ffffff',
        loginButtonTextColor: parsed.loginButtonTextColor || '#374151'
      });
      setLogoPreview(parsed.logo);
      setBackgroundPreview(parsed.backgroundImage);
      setMenuLogoPreview(parsed.menuLogo || '');
    }
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setConfig(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMenuLogoPreview(result);
        setConfig(prev => ({ ...prev, menuLogo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundPreview(result);
        setConfig(prev => ({ 
          ...prev, 
          backgroundImage: result,
          backgroundType: 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Salvar no localStorage (simular backend)
      localStorage.setItem('platformConfig', JSON.stringify(config));
      
      // Emitir evento para que os componentes se atualizem
      window.dispatchEvent(new CustomEvent('platformConfigUpdated', { detail: config }));
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    // Abrir preview da tela de login em nova aba
    const previewWindow = window.open('/login', '_blank');
    if (previewWindow) {
      toast.success('Preview aberto em nova aba');
    }
  };

  const handleReset = () => {
    const defaultConfig: PlatformConfig = {
      logo: '',
      platformName: 'OKAgendei',
      primaryColor: '#2563eb',
      backgroundType: 'color',
      backgroundColor: '#f8fafc',
      backgroundImage: '',
      menuLogo: '',
      menuPlatformName: 'OKAgendei',
      menuTextColor: '#1f2937',
      loginButtonText: 'Entrar',
      loginButtonBackgroundColor: '#ffffff',
      loginButtonTextColor: '#374151'
    };
    setConfig(defaultConfig);
    setLogoPreview('');
    setBackgroundPreview('');
    setMenuLogoPreview('');
    localStorage.removeItem('platformConfig');
    
    // Emitir evento para que os componentes se atualizem
    window.dispatchEvent(new CustomEvent('platformConfigUpdated', { detail: defaultConfig }));
    
    toast.success('Configurações restauradas para o padrão');
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Personalização da Plataforma" subtitle="Customize a aparência da tela de login e menus" />
      
      <main className="p-6 space-y-6">
        {/* Seção: Menu/Sidebar da Plataforma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Personalização do Menu</span>
            </CardTitle>
            <CardDescription>
              Configure o logo e nome exibidos no menu lateral e cabeçalhos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="menuLogo">Logo do Menu</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        id="menuLogo"
                        type="file"
                        accept="image/*"
                        onChange={handleMenuLogoUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => document.getElementById('menuLogo')?.click()}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">A imagem será redimensionada automaticamente</p>
                </div>

                <div>
                  <Label htmlFor="menuPlatformName">Nome no Menu</Label>
                  <Input
                    id="menuPlatformName"
                    value={config.menuPlatformName}
                    onChange={(e) => setConfig(prev => ({ ...prev, menuPlatformName: e.target.value }))}
                    placeholder="Nome da sua plataforma"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="menuTextColor">Cor do Texto do Menu</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <Input
                      id="menuTextColor"
                      type="color"
                      value={config.menuTextColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, menuTextColor: e.target.value }))}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={config.menuTextColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, menuTextColor: e.target.value }))}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <div className="flex items-center space-x-3 mb-2">
                    {menuLogoPreview ? (
                      <img src={menuLogoPreview} alt="Preview do logo do menu" className="h-8 w-auto object-contain" />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Image className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <h1 
                      className="text-lg font-bold"
                      style={{ color: config.menuTextColor }}
                    >
                      {config.menuPlatformName}
                    </h1>
                  </div>
                  <p className="text-sm text-gray-500">Preview do Menu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Seção: Botão Entrar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Personalização do Botão Entrar</span>
            </CardTitle>
            <CardDescription>
              Configure o texto e cores do botão de login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="loginButtonText">Texto do Botão</Label>
                  <Input
                    id="loginButtonText"
                    value={config.loginButtonText}
                    onChange={(e) => setConfig(prev => ({ ...prev, loginButtonText: e.target.value }))}
                    placeholder="Entrar"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="loginButtonBackgroundColor">Cor de Fundo do Botão</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <Input
                      id="loginButtonBackgroundColor"
                      type="color"
                      value={config.loginButtonBackgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, loginButtonBackgroundColor: e.target.value }))}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={config.loginButtonBackgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, loginButtonBackgroundColor: e.target.value }))}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="loginButtonTextColor">Cor do Texto do Botão</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <Input
                      id="loginButtonTextColor"
                      type="color"
                      value={config.loginButtonTextColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, loginButtonTextColor: e.target.value }))}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={config.loginButtonTextColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, loginButtonTextColor: e.target.value }))}
                      placeholder="#374151"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <Button
                    variant="outline"
                    style={{
                      backgroundColor: config.loginButtonBackgroundColor,
                      color: config.loginButtonTextColor,
                      borderColor: config.loginButtonBackgroundColor
                    }}
                    className="hover:opacity-90"
                  >
                    {config.loginButtonText}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">Preview do Botão</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Seção: Logo e Nome */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Logo e Nome da Tela de Login</span>
            </CardTitle>
            <CardDescription>
              Configure o logotipo e nome exibidos na tela de login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo">Logotipo</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => document.getElementById('logo')?.click()}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="platformName">Nome da Plataforma</Label>
                  <Input
                    id="platformName"
                    value={config.platformName}
                    onChange={(e) => setConfig(prev => ({ ...prev, platformName: e.target.value }))}
                    placeholder="Nome da sua plataforma"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview do logo" className="max-w-32 max-h-32 mx-auto" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <p className="mt-2 text-lg font-semibold text-gray-900">{config.platformName}</p>
                  <p className="text-sm text-gray-500">Preview do Logo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção: Cores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Cores</span>
            </CardTitle>
            <CardDescription>
              Defina a cor principal da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="primaryColor">Cor Principal</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="space-y-2">
                  <div 
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    style={{ backgroundColor: config.primaryColor }}
                  ></div>
                  <p className="text-sm text-center text-gray-500">Preview da Cor</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção: Fundo da Tela */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Fundo da Tela de Login</span>
            </CardTitle>
            <CardDescription>
              Configure o plano de fundo da tela de login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex space-x-4">
              <Button
                variant={config.backgroundType === 'color' ? 'default' : 'outline'}
                onClick={() => setConfig(prev => ({ ...prev, backgroundType: 'color' }))}
              >
                Cor Sólida
              </Button>
              <Button
                variant={config.backgroundType === 'image' ? 'default' : 'outline'}
                onClick={() => setConfig(prev => ({ ...prev, backgroundType: 'image' }))}
              >
                Imagem
              </Button>
            </div>

            {config.backgroundType === 'color' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={config.backgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#f8fafc"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div 
                    className="w-32 h-20 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: config.backgroundColor }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="backgroundImage">Imagem de Fundo</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <Input
                      id="backgroundImage"
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="cursor-pointer"
                    />
                    <Button variant="outline" size="icon" onClick={() => document.getElementById('backgroundImage')?.click()}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                    {backgroundPreview ? (
                      <img src={backgroundPreview} alt="Preview do fundo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Botões de Ação */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformCustomization;
