
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DashboardLayout from '@/components/Layout/DashboardLayout';

// Pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import SuperAdminDashboard from '@/pages/SuperAdmin/Dashboard';
import Companies from '@/pages/SuperAdmin/Companies';
import SuperAdminSettings from '@/pages/SuperAdmin/Settings';
import LandingPageSettings from '@/pages/SuperAdmin/LandingPageSettings';
import PlatformCustomization from '@/pages/SuperAdmin/PlatformCustomization';
import PlanManagement from '@/components/PlanManagement';
import FinancialOverview from '@/components/FinancialOverview';
import Notifications from '@/components/Notifications';
import CompanyDashboard from '@/pages/Company/Dashboard';
import Appointments from '@/pages/Company/Appointments';
import CompanyEmployees from '@/pages/Company/Employees';
import CompanyServices from '@/pages/Company/Services';
import CompanyClients from '@/pages/Company/Clients';
import CompanyFinancial from '@/pages/Company/Financial';
import CompanyPublicLink from '@/pages/Company/PublicLink';
import CompanySubscription from '@/pages/Company/Subscription';
import CompanySettings from '@/pages/Company/Settings';
import ProfessionalDashboard from '@/pages/Professional/Dashboard';
import ProfessionalSchedule from '@/pages/Professional/Schedule';
import ProfessionalCommissions from '@/pages/Professional/Commissions';
import ProfessionalHistory from '@/pages/Professional/History';
import ProfessionalSettings from '@/pages/Professional/Settings';
import BookingPage from '@/pages/Public/BookingPage';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Landing Page como página inicial */}
      <Route path="/home" element={<LandingPage />} />
      
      {/* Rota pública de login */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'super_admin' ? '/admin' : user.role === 'company_admin' ? '/empresa' : '/profissional'} replace /> : <Login />} />
      
      {/* Página pública de agendamento */}
      <Route path="/agendar/:companyUrl" element={<BookingPage />} />
      
      {/* Rotas do Super Admin - corrigidas para coincidir com o Sidebar */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout>
            <SuperAdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/empresas" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout>
            <Companies />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/planos" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout>
            <PlanManagement />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/financeiro" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout>
            <FinancialOverview />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/notificacoes" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout>
            <Notifications />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/landing-page" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout>
            <LandingPageSettings />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/personalizacao" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout>
            <PlatformCustomization />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/configuracoes" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout>
            <SuperAdminSettings />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Rotas da Empresa */}
      <Route path="/empresa" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <CompanyDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/empresa/agendamentos" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <Appointments />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/empresa/funcionarios" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <CompanyEmployees />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/empresa/servicos" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <CompanyServices />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/empresa/clientes" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <CompanyClients />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/empresa/financeiro" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <CompanyFinancial />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/empresa/link-publico" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <CompanyPublicLink />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/empresa/assinatura" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <CompanySubscription />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/empresa/configuracoes" element={
        <ProtectedRoute allowedRoles={['company_admin']}>
          <DashboardLayout>
            <CompanySettings />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Rotas do Profissional */}
      <Route path="/profissional" element={
        <ProtectedRoute allowedRoles={['professional']}>
          <DashboardLayout>
            <ProfessionalDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profissional/agenda" element={
        <ProtectedRoute allowedRoles={['professional']}>
          <DashboardLayout>
            <ProfessionalSchedule />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profissional/comissoes" element={
        <ProtectedRoute allowedRoles={['professional']}>
          <DashboardLayout>
            <ProfessionalCommissions />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profissional/historico" element={
        <ProtectedRoute allowedRoles={['professional']}>
          <DashboardLayout>
            <ProfessionalHistory />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profissional/configuracoes" element={
        <ProtectedRoute allowedRoles={['professional']}>
          <DashboardLayout>
            <ProfessionalSettings />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Redirecionar / para /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Página de não autorizado */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
            <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
            <button 
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800"
            >
              Voltar
            </button>
          </div>
        </div>
      } />
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
