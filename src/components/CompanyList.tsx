
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Building2, Users, DollarSign, MoreHorizontal, Eye, Edit, Trash2, Clock } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  plan: string;
  status: 'active' | 'trial' | 'inactive';
  employees: number;
  monthlyRevenue: number;
  trialEndsAt: string | null;
  createdAt: string;
}

interface CompanyListProps {
  companies: Company[];
}

const CompanyList = ({ companies }: CompanyListProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>;
      case 'trial':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Teste</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
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

  const getDaysLeft = (trialEndsAt: string | null) => {
    if (!trialEndsAt) return null;
    const today = new Date();
    const endDate = new Date(trialEndsAt);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => {
        const daysLeft = getDaysLeft(company.trialEndsAt);
        
        return (
          <Card key={company.id} className="hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-lg">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">{company.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(company.status)}
                      <Badge className={getPlanColor(company.plan)}>{company.plan}</Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {company.status === 'trial' && daysLeft !== null && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Teste expirado'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="h-4 w-4 text-slate-600" />
                      <span className="text-xs font-medium text-slate-600">FUNCIONÁRIOS</span>
                    </div>
                    <div className="text-lg font-semibold text-slate-900">{company.employees}</div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="h-4 w-4 text-slate-600" />
                      <span className="text-xs font-medium text-slate-600">FATURAMENTO</span>
                    </div>
                    <div className="text-lg font-semibold text-slate-900">
                      R$ {company.monthlyRevenue.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Cadastrado em {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <Button size="sm" variant="outline" className="text-xs">
                      Acessar Painel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CompanyList;
