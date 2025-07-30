import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCog, Shield, AlertTriangle, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePasswordChange } from '@/hooks/usePasswordChange';
import { ChangePasswordDialog } from '@/components/Auth/ChangePasswordDialog';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  role: string;
  company_id: string | null;
  must_change_password: boolean;
  created_at: string;
}

interface UserPasswordManagementProps {
  companyId?: string;
  showAllUsers?: boolean;
}

export function UserPasswordManagement({ companyId, showAllUsers = false }: UserPasswordManagementProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { markMustChangePassword, loading: actionLoading } = usePasswordChange();

  useEffect(() => {
    fetchProfiles();
  }, [companyId, showAllUsers]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Se não for para mostrar todos os usuários e há um companyId, filtrar pela empresa
      if (!showAllUsers && companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMustChangePassword = async (userId: string, mustChange: boolean) => {
    try {
      await markMustChangePassword(userId, mustChange);
      // Atualizar a lista local
      setProfiles(profiles.map(profile => 
        profile.id === userId 
          ? { ...profile, must_change_password: mustChange }
          : profile
      ));
    } catch (error) {
      console.error('Erro ao atualizar obrigatoriedade de senha:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'company_admin':
        return 'bg-blue-100 text-blue-800';
      case 'professional':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'company_admin':
        return 'Admin Empresa';
      case 'professional':
        return 'Profissional';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          Gerenciamento de Senhas
        </CardTitle>
        <CardDescription>
          {showAllUsers 
            ? 'Gerencie senhas de todos os usuários do sistema'
            : 'Gerencie senhas dos usuários da sua empresa'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {profiles.length === 0 ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Nenhum usuário encontrado.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{profile.name}</h4>
                    <Badge className={getRoleBadgeColor(profile.role)}>
                      {getRoleText(profile.role)}
                    </Badge>
                    {profile.must_change_password && (
                      <Badge className="bg-orange-100 text-orange-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Deve alterar senha
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {profile.id}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">
                      Forçar alteração:
                    </label>
                    <Switch
                      checked={profile.must_change_password}
                      onCheckedChange={(checked) => 
                        handleToggleMustChangePassword(profile.id, checked)
                      }
                      disabled={actionLoading}
                    />
                  </div>

                  <ChangePasswordDialog
                    trigger={
                      <Button variant="outline" size="sm">
                        <KeyRound className="h-4 w-4 mr-2" />
                        Resetar Senha
                      </Button>
                    }
                    userId={profile.id}
                    isForCurrentUser={false}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}