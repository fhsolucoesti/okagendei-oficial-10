
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Edit, Trash2, Eye } from 'lucide-react';
import { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

const CompanyCard = ({ company, onEdit, onDelete }: CompanyCardProps) => {
  const getStatusBadge = (status: Company['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'trial':
        return <Badge className="bg-yellow-100 text-yellow-800">Teste</Badge>;
      case 'suspended':
        return <Badge variant="secondary">Suspenso</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Básico':
        return 'bg-blue-100 text-blue-800';
      case 'Profissional':
        return 'bg-purple-100 text-purple-800';
      case 'Empresarial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-lg">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">{company.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(company.status)}
                <Badge className={getPlanColor(company.plan)}>{company.plan}</Badge>
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(company)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => onDelete(company.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Email:</strong> {company.email}</p>
          <p><strong>Telefone:</strong> {company.phone}</p>
          <p><strong>Funcionários:</strong> {company.employees}</p>
          <p><strong>Faturamento:</strong> R$ {(company.monthlyRevenue || 0).toLocaleString('pt-BR')}</p>
          <p><strong>Cadastro:</strong> {new Date(company.createdAt).toLocaleDateString('pt-BR')}</p>
          {company.trialEndsAt && (
            <p><strong>Teste expira:</strong> {new Date(company.trialEndsAt).toLocaleDateString('pt-BR')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
