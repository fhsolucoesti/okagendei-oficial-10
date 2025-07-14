
import Sidebar from './Sidebar';
import CompanyDataSync from '@/components/Company/CompanyDataSync';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <CompanyDataSync />
      <Sidebar />
      <main className="flex-1 w-full min-w-0 overflow-hidden">
        <div className="w-full h-full p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
