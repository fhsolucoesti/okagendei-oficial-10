
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, Calendar } from 'lucide-react';
import { useCompanyDataContext } from '@/contexts/CompanyDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ReportsExporter = () => {
  const { appointments, expenses, company, professionals } = useCompanyDataContext();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('financial');
  const [format, setFormat] = useState('excel');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);

  const generateFinancialReport = () => {
    const companyAppointments = appointments.filter(a => 
      a.companyId === user?.companyId && 
      a.status === 'completed' &&
      (!startDate || a.date >= startDate) &&
      (!endDate || a.date <= endDate)
    );
    
    const companyExpenses = expenses.filter(e => 
      e.companyId === user?.companyId &&
      (!startDate || e.date >= startDate) &&
      (!endDate || e.date <= endDate)
    );

    const totalRevenue = companyAppointments.reduce((sum, a) => sum + a.price, 0);
    const totalExpenses = companyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = totalRevenue - totalExpenses;

    return {
      period: `${startDate || 'Início'} até ${endDate || 'Hoje'}`,
      totalRevenue,
      totalExpenses,
      profit,
      appointmentsCount: companyAppointments.length,
      expensesCount: companyExpenses.length,
      appointments: companyAppointments,
      expenses: companyExpenses
    };
  };

  const generateAppointmentsReport = () => {
    const companyAppointments = appointments.filter(a => 
      a.companyId === user?.companyId &&
      (!startDate || a.date >= startDate) &&
      (!endDate || a.date <= endDate)
    );

    const statusCount = {
      scheduled: companyAppointments.filter(a => a.status === 'scheduled').length,
      completed: companyAppointments.filter(a => a.status === 'completed').length,
      cancelled: companyAppointments.filter(a => a.status === 'cancelled').length,
      no_show: companyAppointments.filter(a => a.status === 'no_show').length
    };

    return {
      period: `${startDate || 'Início'} até ${endDate || 'Hoje'}`,
      total: companyAppointments.length,
      statusCount,
      appointments: companyAppointments
    };
  };

  const generateProfessionalsReport = () => {
    const companyProfessionals = professionals.filter(p => p.companyId === user?.companyId);
    const companyAppointments = appointments.filter(a => 
      a.companyId === user?.companyId &&
      a.status === 'completed' &&
      (!startDate || a.date >= startDate) &&
      (!endDate || a.date <= endDate)
    );

    const professionalsData = companyProfessionals.map(prof => {
      const profAppointments = companyAppointments.filter(a => a.professionalId === prof.id);
      const revenue = profAppointments.reduce((sum, a) => sum + a.price, 0);
      const commission = revenue * (prof.commission / 100);
      
      return {
        name: prof.name,
        appointmentsCount: profAppointments.length,
        revenue,
        commission,
        commissionRate: prof.commission
      };
    });

    return {
      period: `${startDate || 'Início'} até ${endDate || 'Hoje'}`,
      professionalsData,
      totalProfessionals: companyProfessionals.length
    };
  };

  const exportToExcel = (data: any, reportName: string) => {
    // Simular exportação para Excel
    const csvContent = convertToCSV(data, reportName);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportName}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = (data: any, reportName: string) => {
    // Simular exportação para PDF (em produção usaria uma biblioteca como jsPDF)
    const htmlContent = convertToHTML(data, reportName);
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${reportName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 30px; }
              .summary { background-color: #f9f9f9; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const convertToCSV = (data: any, reportName: string) => {
    let csv = `Relatório: ${reportName}\n`;
    csv += `Período: ${data.period}\n`;
    csv += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;

    if (reportName === 'Relatório Financeiro') {
      csv += `Resumo Financeiro\n`;
      csv += `Receita Total,R$ ${data.totalRevenue.toFixed(2)}\n`;
      csv += `Despesas Totais,R$ ${data.totalExpenses.toFixed(2)}\n`;
      csv += `Lucro Líquido,R$ ${data.profit.toFixed(2)}\n`;
      csv += `Total de Atendimentos,${data.appointmentsCount}\n`;
      csv += `Total de Despesas,${data.expensesCount}\n\n`;

      if (includeDetails && data.appointments.length > 0) {
        csv += `Detalhes dos Atendimentos\n`;
        csv += `Data,Cliente,Serviço,Valor\n`;
        data.appointments.forEach((apt: any) => {
          csv += `${apt.date},${apt.clientName},Serviço,R$ ${apt.price.toFixed(2)}\n`;
        });
      }
    }

    return csv;
  };

  const convertToHTML = (data: any, reportName: string) => {
    let html = `
      <div class="header">
        <h1>${reportName}</h1>
        <p>Período: ${data.period}</p>
        <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    `;

    if (reportName === 'Relatório Financeiro') {
      html += `
        <div class="summary">
          <h2>Resumo Financeiro</h2>
          <p><strong>Receita Total:</strong> R$ ${data.totalRevenue.toFixed(2)}</p>
          <p><strong>Despesas Totais:</strong> R$ ${data.totalExpenses.toFixed(2)}</p>
          <p><strong>Lucro Líquido:</strong> R$ ${data.profit.toFixed(2)}</p>
          <p><strong>Total de Atendimentos:</strong> ${data.appointmentsCount}</p>
          <p><strong>Total de Despesas:</strong> ${data.expensesCount}</p>
        </div>
      `;

      if (includeDetails && data.appointments.length > 0) {
        html += `
          <h2>Detalhes dos Atendimentos</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        data.appointments.forEach((apt: any) => {
          html += `
            <tr>
              <td>${new Date(apt.date).toLocaleDateString('pt-BR')}</td>
              <td>${apt.clientName}</td>
              <td>Serviço</td>
              <td>R$ ${apt.price.toFixed(2)}</td>
            </tr>
          `;
        });
        
        html += `</tbody></table>`;
      }
    }

    return html;
  };

  const handleExport = () => {
    if (!startDate || !endDate) {
      toast.error('Selecione o período do relatório');
      return;
    }

    let data;
    let reportName;

    switch (reportType) {
      case 'financial':
        data = generateFinancialReport();
        reportName = 'Relatório Financeiro';
        break;
      case 'appointments':
        data = generateAppointmentsReport();
        reportName = 'Relatório de Agendamentos';
        break;
      case 'professionals':
        data = generateProfessionalsReport();
        reportName = 'Relatório de Profissionais';
        break;
      default:
        return;
    }

    if (format === 'excel') {
      exportToExcel(data, reportName);
    } else {
      exportToPDF(data, reportName);
    }

    toast.success(`${reportName} exportado com sucesso!`);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatórios
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Relatórios</DialogTitle>
          <DialogDescription>
            Gere relatórios detalhados em Excel ou PDF
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reportType">Tipo de Relatório</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="appointments">Agendamentos</SelectItem>
                <SelectItem value="professionals">Profissionais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="format">Formato</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (CSV)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeDetails"
              checked={includeDetails}
              onCheckedChange={(checked) => setIncludeDetails(checked === true)}
            />
            <Label htmlFor="includeDetails">Incluir detalhes</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
              <FileText className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsExporter;
