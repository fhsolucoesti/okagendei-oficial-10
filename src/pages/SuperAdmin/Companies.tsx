
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import Header from '@/components/Layout/Header';
import CompanyCard from '@/components/SuperAdmin/CompanyCard';
import CompanyForm from '@/components/SuperAdmin/CompanyForm';
import CompaniesHeader from '@/components/SuperAdmin/CompaniesHeader';
import { Company } from '@/types';
import { toast } from 'sonner';

const Companies = () => {
  const { companies, addCompany, updateCompany, deleteCompany, addNotification } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [sendCredentials, setSendCredentials] = useState(true);
  const [sendMethod, setSendMethod] = useState<'email' | 'whatsapp'>('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    plan: 'Básico' as Company['plan'],
    status: 'trial' as Company['status'],
    username: '',
    password: ''
  });

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCompany) {
      updateCompany(editingCompany.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        plan: formData.plan,
        status: formData.status
      });
      toast.success('Empresa atualizada com sucesso!');
    } else {
      const newCompany = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        plan: formData.plan,
        status: formData.status,
        employees: 0,
        monthlyRevenue: 0,
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        customUrl: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
      
      addCompany(newCompany);
      
      addNotification({
        type: 'company_registered',
        title: 'Nova Empresa Cadastrada',
        message: `${formData.name} se cadastrou e iniciou o período de teste`,
        isRead: false,
        createdAt: new Date().toISOString(),
        priority: 'medium'
      });
      
      if (sendCredentials) {
        await sendCredentialsToCompany(formData);
      }
      
      toast.success('Empresa criada com sucesso!');
    }
    
    resetForm();
  };

  const sendCredentialsToCompany = async (data: any) => {
    const credentialsMessage = `
Bem-vindo ao OKAgendei!

Sua conta foi criada com sucesso. Aqui estão seus dados de acesso:

🏢 Empresa: ${data.name}
👤 Usuário: ${data.username || data.email}
🔐 Senha: ${data.password}
🌐 Link: ${window.location.origin}/login

⚠️ IMPORTANTE: Por segurança, você será obrigado a alterar sua senha no primeiro acesso.

Dúvidas? Entre em contato conosco!

Equipe OKAgendei
    `;

    if (sendMethod === 'email') {
      console.log('Enviando email para:', data.email);
      console.log('Conteúdo:', credentialsMessage);
      toast.success(`Credenciais enviadas por email para ${data.email}`);
    } else {
      const phone = data.phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(credentialsMessage)}`;
      window.open(whatsappUrl, '_blank');
      toast.success(`WhatsApp aberto para enviar credenciais para ${data.name}`);
    }
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingCompany(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      plan: 'Básico',
      status: 'trial',
      username: '',
      password: ''
    });
    setSendCredentials(true);
    setSendMethod('email');
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      plan: company.plan,
      status: company.status,
      username: '',
      password: ''
    });
    setSendCredentials(false);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      deleteCompany(id);
      toast.success('Empresa excluída com sucesso!');
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Gestão de Empresas" subtitle="Gerencie todas as empresas cadastradas na plataforma" />
      
      <main className="p-6">
        <CompaniesHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDialogOpen={isDialogOpen}
          onDialogChange={setIsDialogOpen}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <CompanyForm
            editingCompany={editingCompany}
            formData={formData}
            sendCredentials={sendCredentials}
            sendMethod={sendMethod}
            onFormDataChange={setFormData}
            onSendCredentialsChange={setSendCredentials}
            onSendMethodChange={setSendMethod}
            onGeneratePassword={generatePassword}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Companies;
