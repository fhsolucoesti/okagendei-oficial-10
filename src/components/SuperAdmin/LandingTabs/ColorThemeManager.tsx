
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Palette, RefreshCw, Download, Upload } from 'lucide-react';
import { ColorTheme } from '@/types/landingConfig';

interface ColorThemeManagerProps {
  colorTheme: ColorTheme;
  customStyles: any;
  onUpdateColorTheme: (theme: ColorTheme) => void;
  onUpdateCustomStyles: (styles: any) => void;
}

const ColorThemeManager = ({ 
  colorTheme, 
  customStyles, 
  onUpdateColorTheme, 
  onUpdateCustomStyles 
}: ColorThemeManagerProps) => {
  const [activeTab, setActiveTab] = useState('basic');

  const presetThemes = {
    default: {
      primary: 'hsl(222.2, 47.4%, 11.2%)',
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
      ring: 'hsl(222.2, 84%, 4.9%)'
    },
    blue: {
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
    },
    green: {
      primary: 'hsl(142.1, 76.2%, 36.3%)',
      primaryForeground: 'hsl(355.7, 100%, 97.3%)',
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
      ring: 'hsl(142.1, 76.2%, 36.3%)'
    }
  };

  const handleColorChange = (colorKey: keyof ColorTheme, value: string) => {
    onUpdateColorTheme({
      ...colorTheme,
      [colorKey]: value
    });
  };

  const handleCustomStyleChange = (styleKey: string, value: string, nested?: string) => {
    if (nested) {
      onUpdateCustomStyles({
        ...customStyles,
        [styleKey]: {
          ...customStyles[styleKey],
          [nested]: value
        }
      });
    } else {
      onUpdateCustomStyles({
        ...customStyles,
        [styleKey]: value
      });
    }
  };

  const applyPresetTheme = (presetName: keyof typeof presetThemes) => {
    onUpdateColorTheme(presetThemes[presetName]);
  };

  const exportTheme = () => {
    const themeData = {
      colorTheme,
      customStyles
    };
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tema-landing-page.json';
    a.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          if (themeData.colorTheme) onUpdateColorTheme(themeData.colorTheme);
          if (themeData.customStyles) onUpdateCustomStyles(themeData.customStyles);
        } catch (error) {
          console.error('Erro ao importar tema:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <h4 className="font-semibold">Configuração de Cores</h4>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportTheme}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={importTheme}
            className="hidden"
            id="import-theme"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-theme')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Cores Básicas</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
          <TabsTrigger value="presets">Temas Prontos</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary">Cor Primária</Label>
              <div className="flex space-x-2">
                <Input
                  id="primary"
                  type="color"
                  value={colorTheme.primary.match(/#[0-9a-fA-F]{6}/) ? colorTheme.primary : '#1e40af'}
                  onChange={(e) => handleColorChange('primary', `hsl(${e.target.value})`)}
                  className="w-16"
                />
                <Input
                  value={colorTheme.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="hsl(221.2, 83.2%, 53.3%)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary">Cor Secundária</Label>
              <div className="flex space-x-2">
                <Input
                  id="secondary"
                  type="color"
                  value={colorTheme.secondary.match(/#[0-9a-fA-F]{6}/) ? colorTheme.secondary : '#f1f5f9'}
                  onChange={(e) => handleColorChange('secondary', `hsl(${e.target.value})`)}
                  className="w-16"
                />
                <Input
                  value={colorTheme.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  placeholder="hsl(210, 40%, 96.1%)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="background">Cor de Fundo</Label>
              <div className="flex space-x-2">
                <Input
                  id="background"
                  type="color"
                  value={colorTheme.background.match(/#[0-9a-fA-F]{6}/) ? colorTheme.background : '#ffffff'}
                  onChange={(e) => handleColorChange('background', `hsl(${e.target.value})`)}
                  className="w-16"
                />
                <Input
                  value={colorTheme.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  placeholder="hsl(0, 0%, 100%)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="foreground">Cor do Texto</Label>
              <div className="flex space-x-2">
                <Input
                  id="foreground"
                  type="color"
                  value={colorTheme.foreground.match(/#[0-9a-fA-F]{6}/) ? colorTheme.foreground : '#0f172a'}
                  onChange={(e) => handleColorChange('foreground', `hsl(${e.target.value})`)}
                  className="w-16"
                />
                <Input
                  value={colorTheme.foreground}
                  onChange={(e) => handleColorChange('foreground', e.target.value)}
                  placeholder="hsl(222.2, 84%, 4.9%)"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-4">
            <h5 className="font-medium">Estilos Personalizados do Hero</h5>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heroBackground">Fundo do Hero</Label>
                <Input
                  id="heroBackground"
                  value={customStyles.heroBackground}
                  onChange={(e) => handleCustomStyleChange('heroBackground', e.target.value)}
                  placeholder="Ex: bg-gradient-to-br from-blue-50 to-indigo-100"
                />
              </div>

              <div>
                <Label htmlFor="titleGradient">Gradiente do Título</Label>
                <Input
                  id="titleGradient"
                  value={customStyles.titleGradient}
                  onChange={(e) => handleCustomStyleChange('titleGradient', e.target.value)}
                  placeholder="Ex: bg-gradient-to-r from-blue-600 to-purple-600"
                />
              </div>

              <div>
                <Label htmlFor="ctaGradient">Gradiente do Botão CTA</Label>
                <Input
                  id="ctaGradient"
                  value={customStyles.ctaGradient}
                  onChange={(e) => handleCustomStyleChange('ctaGradient', e.target.value)}
                  placeholder="Ex: bg-gradient-to-r from-blue-600 to-indigo-600"
                />
              </div>

              <div>
                <Label htmlFor="cardBackground">Fundo dos Cards</Label>
                <Input
                  id="cardBackground"
                  value={customStyles.cardBackground}
                  onChange={(e) => handleCustomStyleChange('cardBackground', e.target.value)}
                  placeholder="Ex: bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <Separator />

            <h5 className="font-medium">Cores dos Badges</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="badgeBackground">Fundo do Badge</Label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={customStyles.badgeColors?.background || '#dcfce7'}
                    onChange={(e) => handleCustomStyleChange('badgeColors', e.target.value, 'background')}
                    className="w-16"
                  />
                  <Input
                    value={customStyles.badgeColors?.background || ''}
                    onChange={(e) => handleCustomStyleChange('badgeColors', e.target.value, 'background')}
                    placeholder="#dcfce7"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="badgeText">Texto do Badge</Label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={customStyles.badgeColors?.text || '#166534'}
                    onChange={(e) => handleCustomStyleChange('badgeColors', e.target.value, 'text')}
                    className="w-16"
                  />
                  <Input
                    value={customStyles.badgeColors?.text || ''}
                    onChange={(e) => handleCustomStyleChange('badgeColors', e.target.value, 'text')}
                    placeholder="#166534"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(presetThemes).map(([name, theme]) => (
              <Card key={name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm capitalize">{name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-1 mb-3">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => applyPresetTheme(name as keyof typeof presetThemes)}
                  >
                    Aplicar Tema
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorThemeManager;
