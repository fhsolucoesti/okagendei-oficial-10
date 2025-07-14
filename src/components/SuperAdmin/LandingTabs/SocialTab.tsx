
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveLandingConfig } from '@/utils/landingConfigStorage';
import SocialNetworkManager from './SocialNetworkManager';
import { SocialLinks } from '@/types/landingConfig';

interface SocialTabProps {
  socialLinks: SocialLinks;
  setSocialLinks: (links: SocialLinks) => void;
}

const SocialTab = ({ socialLinks, setSocialLinks }: SocialTabProps) => {
  const handleSave = () => {
    saveLandingConfig('social', socialLinks);
  };

  const handleSocialNetworksUpdate = (networks: any[]) => {
    setSocialLinks({
      ...socialLinks,
      socialNetworks: networks
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Redes Sociais</CardTitle>
          <CardDescription>
            Adicione, edite ou remova redes sociais que aparecerão no rodapé da landing page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SocialNetworkManager
            socialNetworks={socialLinks.socialNetworks || []}
            onUpdate={handleSocialNetworksUpdate}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
        Salvar Configurações de Redes Sociais
      </Button>
    </div>
  );
};

export default SocialTab;
