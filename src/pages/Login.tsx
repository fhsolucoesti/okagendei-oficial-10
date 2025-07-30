
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PlatformConfig {
  logo: string;
  platformName: string;
  primaryColor: string;
  backgroundType: 'color' | 'image';
  backgroundColor: string;
  backgroundImage: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<PlatformConfig>({
    logo: '',
    platformName: 'OKAgendei',
    primaryColor: '#2563eb',
    backgroundType: 'color',
    backgroundColor: '#f8fafc',
    backgroundImage: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Carregar configurações de personalização
  useEffect(() => {
    const savedConfig = localStorage.getItem('platformConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Login realizado com sucesso!');
        // O redirecionamento será feito automaticamente pelo useEffect no AuthContext
        // ou podemos buscar o usuário atual e redirecionar baseado no role
      } else {
        toast.error('Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundStyle = config.backgroundType === 'image' && config.backgroundImage
    ? {
        backgroundImage: `url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        backgroundColor: config.backgroundColor
      };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={backgroundStyle}
    >
      {/* Overlay para melhorar legibilidade quando há imagem de fundo */}
      {config.backgroundType === 'image' && config.backgroundImage && (
        <div className="absolute inset-0 bg-black/20"></div>
      )}
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          {config.logo ? (
            // Logo personalizada - exibir sem fundo
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <img src={config.logo} alt="Logo" className="max-w-16 max-h-16 object-contain" />
            </div>
          ) : (
            // Logo padrão com fundo azul
            <div className="bg-gradient-to-r text-white p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                 style={{ 
                   background: `linear-gradient(to right, ${config.primaryColor}, ${config.primaryColor}dd)`
                 }}>
              <Calendar className="h-8 w-8" />
            </div>
          )}
          <h1 className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                background: `linear-gradient(to right, ${config.primaryColor}, ${config.primaryColor}cc)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            {config.platformName}
          </h1>
          <p className="text-gray-600 mt-2">Sistema de Agendamentos</p>
        </div>

        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full text-white"
                style={{
                  background: `linear-gradient(to right, ${config.primaryColor}, ${config.primaryColor}dd)`,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
