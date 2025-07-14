import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, Phone, MapPin, Check, ArrowLeft, Scissors } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const BookingPage = () => {
  const { companyUrl } = useParams();
  const { companies, services, professionals, addAppointment } = useData();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    notes: ''
  });

  // Encontrar a empresa pelo URL customizado
  const company = companies.find(c => c.customUrl === companyUrl);
  
  // Debug logs para acompanhar os dados
  console.log('Company URL:', companyUrl);
  console.log('Found company:', company);
  console.log('All companies:', companies);
  console.log('All services:', services);
  console.log('All professionals:', professionals);
  
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Empresa não encontrada</h1>
            <p className="text-gray-600">A empresa que você está procurando não existe ou não está mais ativa.</p>
            <p className="text-sm text-gray-500 mt-2">URL procurada: {companyUrl}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrar serviços e profissionais da empresa - garantindo que só apareçam os ativos
  const companyServices = services.filter(s => {
    const matches = s.companyId === company.id && s.isActive === true;
    if (matches) {
      console.log('Active service found:', s);
    }
    return matches;
  });
  
  const companyProfessionals = professionals.filter(p => {
    const matches = p.companyId === company.id && p.isActive !== false; // aceita undefined ou true
    if (matches) {
      console.log('Active professional found:', p);
    }
    return matches;
  });

  console.log('Filtered company services:', companyServices);
  console.log('Filtered company professionals:', companyProfessionals);

  const generateAvailableSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const availableSlots = generateAvailableSlots();

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleProfessionalSelect = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setStep(3);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedServiceObj = companyServices.find(s => s.id === selectedService);
    if (!selectedServiceObj) return;

    addAppointment({
      companyId: company.id,
      professionalId: selectedProfessional,
      serviceId: selectedService,
      clientName: clientData.name,
      clientPhone: clientData.phone,
      clientBirthDate: clientData.birthDate,
      date: selectedDate,
      time: selectedTime,
      duration: selectedServiceObj.duration,
      price: selectedServiceObj.price,
      status: 'scheduled',
      notes: clientData.notes,
      createdAt: new Date().toISOString()
    });

    setStep(5);
    toast.success('Agendamento realizado com sucesso!');
  };

  const selectedServiceObj = companyServices.find(s => s.id === selectedService);
  const selectedProfessionalObj = companyProfessionals.find(p => p.id === selectedProfessional);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {company.logo ? (
              <Avatar className="w-12 h-12">
                <AvatarImage src={company.logo} alt={company.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <Calendar className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{company.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 text-sm text-gray-600">
          <span className={step >= 1 ? 'text-blue-600 font-medium' : ''}>Serviço</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-blue-600 font-medium' : ''}>Profissional</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-blue-600 font-medium' : ''}>Data e Hora</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-blue-600 font-medium' : ''}>Dados</span>
          <span>→</span>
          <span className={step >= 5 ? 'text-blue-600 font-medium' : ''}>Confirmação</span>
        </div>

        {/* Etapa 1: Seleção de Serviço */}
        {step === 1 && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Escolha o Serviço</CardTitle>
                <CardDescription>
                  Selecione o serviço que deseja agendar
                  {companyServices.length === 0 && (
                    <span className="block text-orange-600 mt-2">
                      Nenhum serviço ativo encontrado para esta empresa.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
            
            {companyServices.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço disponível</h3>
                  <p className="text-gray-600">
                    Esta empresa ainda não possui serviços ativos disponíveis para agendamento.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleServiceSelect(service.id)}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {service.imageUrl ? (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={service.imageUrl} 
                              alt={service.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                      <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                                      </svg>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <Scissors className="h-8 w-8" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{service.name}</h3>
                            <Badge className="bg-green-100 text-green-800 ml-2">
                              R$ {service.price.toFixed(2)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{service.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Etapa 2: Seleção de Profissional */}
        {step === 2 && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Escolha o Profissional</CardTitle>
                <CardDescription>
                  Serviço selecionado: <strong>{selectedServiceObj?.name}</strong> - R$ {selectedServiceObj?.price.toFixed(2)}
                </CardDescription>
              </CardHeader>
            </Card>
            
            {companyProfessionals.length === 0 ? (
              <Card className="mb-6">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum profissional disponível</h3>
                  <p className="text-gray-600">
                    Esta empresa ainda não possui profissionais ativos disponíveis para agendamento.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {companyProfessionals.map((professional) => (
                  <Card key={professional.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProfessionalSelect(professional.id)}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          {professional.imageUrl ? (
                            <AvatarImage 
                              src={professional.imageUrl} 
                              alt={professional.name}
                            />
                          ) : null}
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <User className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{professional.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {professional.specialties && professional.specialties.length > 0 ? (
                              <>Especialidades: {professional.specialties.join(', ')}</>
                            ) : (
                              'Profissional qualificado'
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Serviços
            </Button>
          </div>
        )}

        {/* Etapa 3: Seleção de Data e Hora */}
        {step === 3 && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Escolha Data e Horário</CardTitle>
                <CardDescription>
                  {selectedServiceObj?.name} com {selectedProfessionalObj?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <Label>Horários Disponíveis</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {availableSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleDateTimeSelect(selectedDate, time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Profissionais
            </Button>
          </div>
        )}

        {/* Etapa 4: Dados do Cliente */}
        {step === 4 && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
                <CardDescription>Preencha seus dados para finalizar o agendamento</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={clientData.name}
                      onChange={(e) => setClientData({...clientData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={clientData.phone}
                      onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={clientData.birthDate}
                      onChange={(e) => setClientData({...clientData, birthDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Input
                      id="notes"
                      value={clientData.notes}
                      onChange={(e) => setClientData({...clientData, notes: e.target.value})}
                      placeholder="Alguma observação especial..."
                    />
                  </div>

                  {/* Resumo do Agendamento */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Resumo do Agendamento</h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p><strong>Serviço:</strong> {selectedServiceObj?.name}</p>
                        <p><strong>Profissional:</strong> {selectedProfessionalObj?.name}</p>
                        <p><strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Horário:</strong> {selectedTime}</p>
                        <p><strong>Duração:</strong> {selectedServiceObj?.duration} minutos</p>
                        <p><strong>Valor:</strong> R$ {selectedServiceObj?.price.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex space-x-4">
                    <Button type="button" variant="outline" onClick={() => setStep(3)}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Confirmar Agendamento
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Etapa 5: Confirmação */}
        {step === 5 && (
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Check className="h-8 w-8" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agendamento Confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Seu agendamento foi realizado com sucesso.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
                <h4 className="font-medium text-gray-900 mb-2">Detalhes do Agendamento:</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><strong>Cliente:</strong> {clientData.name}</p>
                  <p><strong>Serviço:</strong> {selectedServiceObj?.name}</p>
                  <p><strong>Profissional:</strong> {selectedProfessionalObj?.name}</p>
                  <p><strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Horário:</strong> {selectedTime}</p>
                  <p><strong>Valor:</strong> R$ {selectedServiceObj?.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {company.whatsappNumber && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const message = `Olá! Acabei de fazer um agendamento:\n\n` +
                        `Cliente: ${clientData.name}\n` +
                        `Serviço: ${selectedServiceObj?.name}\n` +
                        `Profissional: ${selectedProfessionalObj?.name}\n` +
                        `Data: ${new Date(selectedDate).toLocaleDateString('pt-BR')}\n` +
                        `Horário: ${selectedTime}\n` +
                        `Valor: R$ ${selectedServiceObj?.price.toFixed(2)}`;
                      
                      const whatsappUrl = `https://wa.me/55${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Enviar por WhatsApp
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Fazer Outro Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
