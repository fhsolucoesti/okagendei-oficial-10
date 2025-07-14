
import { useState, useEffect } from 'react';
import QRCodeLib from 'qrcode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  url: string;
  companyName: string;
}

const QRCodeGenerator = ({ url, companyName }: QRCodeGeneratorProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCodeLib.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code');
    }
  };

  useEffect(() => {
    if (isOpen && !qrCodeUrl) {
      generateQRCode();
    }
  }, [isOpen]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `qrcode-${companyName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = qrCodeUrl;
      link.click();
      toast.success('QR Code baixado com sucesso!');
    }
  };

  const copyQRCode = async () => {
    if (qrCodeUrl) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast.success('QR Code copiado para a área de transferência!');
      } catch (error) {
        toast.error('Erro ao copiar QR Code');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="h-4 w-4 mr-2" />
          Gerar QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code - {companyName}</DialogTitle>
          <DialogDescription>
            Compartilhe este QR Code para que seus clientes possam acessar sua página de agendamentos
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {qrCodeUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto" />
              </div>
              <div className="flex space-x-2">
                <Button onClick={downloadQRCode} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
                <Button onClick={copyQRCode} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">Gerando QR Code...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;
