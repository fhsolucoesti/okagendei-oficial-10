# Documentação Técnica - Estrutura do Banco de Dados OKAgendei

## Visão Geral
Sistema de agendamento com múltiplos perfis: Super Admin, Empresa e Profissional.

## Tabelas e Estrutura

### 1. **users** - Usuários do Sistema
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| name | VARCHAR | ✅ | Nome do usuário |
| email | VARCHAR | ✅ | Email único |
| password | VARCHAR | ✅ | Senha hash |
| role | ENUM | ✅ | super_admin, company_admin, professional |
| companyId | UUID | ❌ | FK para companies |
| avatar | VARCHAR | ❌ | URL do avatar |
| mustChangePassword | BOOLEAN | ❌ | Default: false |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: companyId → companies(id)

---

### 2. **companies** - Empresas
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| name | VARCHAR | ✅ | Nome da empresa |
| email | VARCHAR | ✅ | Email da empresa |
| phone | VARCHAR | ✅ | Telefone |
| address | VARCHAR | ✅ | Endereço |
| plan | VARCHAR | ✅ | Plano contratado (default: basic) |
| status | ENUM | ✅ | active, trial, suspended, cancelled |
| employees | INTEGER | ❌ | Número de funcionários (default: 1) |
| monthlyRevenue | DECIMAL(10,2) | ❌ | Faturamento mensal (default: 0) |
| trialEndsAt | DATE | ❌ | Data fim do trial |
| customUrl | VARCHAR | ❌ | URL personalizada (unique) |
| logo | VARCHAR | ❌ | URL do logo |
| nextPayment | DATE | ❌ | Próximo pagamento |
| overdueDays | INTEGER | ❌ | Dias em atraso (default: 0) |
| whatsappNumber | VARCHAR | ❌ | Número WhatsApp |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- UNIQUE: customUrl

---

### 3. **plans** - Planos de Assinatura
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| name | VARCHAR | ✅ | Nome do plano |
| maxEmployees | VARCHAR | ✅ | Máximo de funcionários |
| monthlyPrice | DECIMAL(10,2) | ✅ | Preço mensal |
| yearlyPrice | DECIMAL(10,2) | ✅ | Preço anual |
| features | JSON | ❌ | Lista de recursos (default: []) |
| isPopular | BOOLEAN | ❌ | Plano popular (default: false) |
| isActive | BOOLEAN | ❌ | Plano ativo (default: true) |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id

---

### 4. **professionals** - Profissionais
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| name | VARCHAR | ✅ | Nome do profissional |
| email | VARCHAR | ✅ | Email |
| phone | VARCHAR | ❌ | Telefone |
| specialties | JSON | ❌ | Especialidades (default: []) |
| commission | DECIMAL(5,2) | ❌ | % de comissão (default: 0) |
| isActive | BOOLEAN | ❌ | Ativo (default: true) |
| imageUrl | VARCHAR | ❌ | URL da foto |
| userId | UUID | ✅ | FK para users |
| companyId | UUID | ✅ | FK para companies |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: userId → users(id)
- FK: companyId → companies(id)

---

### 5. **services** - Serviços
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| name | VARCHAR | ✅ | Nome do serviço |
| description | TEXT | ❌ | Descrição |
| price | DECIMAL(10,2) | ✅ | Preço |
| duration | INTEGER | ✅ | Duração em minutos |
| isActive | BOOLEAN | ❌ | Ativo (default: true) |
| imageUrl | VARCHAR | ❌ | URL da imagem |
| companyId | UUID | ✅ | FK para companies |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: companyId → companies(id)

---

### 6. **clients** - Clientes
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| name | VARCHAR | ✅ | Nome do cliente |
| phone | VARCHAR | ✅ | Telefone |
| email | VARCHAR | ❌ | Email |
| birthDate | DATE | ❌ | Data nascimento |
| totalAppointments | INTEGER | ❌ | Total agendamentos (default: 0) |
| lastAppointment | DATE | ❌ | Último agendamento |
| companyId | UUID | ✅ | FK para companies |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: companyId → companies(id)

---

### 7. **appointments** - Agendamentos
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| clientName | VARCHAR | ✅ | Nome do cliente |
| clientPhone | VARCHAR | ✅ | Telefone do cliente |
| clientBirthDate | DATE | ❌ | Data nascimento cliente |
| date | DATE | ✅ | Data do agendamento |
| time | TIME | ✅ | Horário |
| duration | INTEGER | ✅ | Duração em minutos |
| price | DECIMAL(10,2) | ✅ | Valor cobrado |
| status | ENUM | ✅ | scheduled, completed, cancelled, no_show |
| notes | TEXT | ❌ | Observações |
| companyId | UUID | ✅ | FK para companies |
| professionalId | UUID | ✅ | FK para professionals |
| serviceId | UUID | ✅ | FK para services |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: companyId → companies(id)
- FK: professionalId → professionals(id)
- FK: serviceId → services(id)

---

### 8. **working_hours** - Horários de Trabalho
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| dayOfWeek | INTEGER | ✅ | Dia da semana (0-6) |
| startTime | TIME | ✅ | Horário início |
| endTime | TIME | ✅ | Horário fim |
| isAvailable | BOOLEAN | ❌ | Disponível (default: true) |
| professionalId | UUID | ✅ | FK para professionals |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: professionalId → professionals(id)

---

### 9. **commissions** - Comissões
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| amount | DECIMAL(10,2) | ✅ | Valor da comissão |
| date | DATE | ✅ | Data |
| status | ENUM | ✅ | pending, paid |
| professionalId | UUID | ✅ | FK para professionals |
| appointmentId | UUID | ✅ | FK para appointments |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: professionalId → professionals(id)
- FK: appointmentId → appointments(id)

---

### 10. **expenses** - Despesas
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| description | VARCHAR | ✅ | Descrição |
| amount | DECIMAL(10,2) | ✅ | Valor |
| category | VARCHAR | ✅ | Categoria |
| date | DATE | ✅ | Data |
| companyId | UUID | ✅ | FK para companies |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: companyId → companies(id)

---

### 11. **invoices** - Faturas
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| amount | DECIMAL(10,2) | ✅ | Valor |
| dueDate | DATE | ✅ | Data vencimento |
| status | ENUM | ✅ | pending, paid, overdue |
| description | TEXT | ✅ | Descrição |
| companyId | UUID | ✅ | FK para companies |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: companyId → companies(id)

---

### 12. **notifications** - Notificações
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✅ | Chave primária |
| type | ENUM | ✅ | appointment, payment, system, company_registered, payment_overdue |
| title | VARCHAR | ✅ | Título |
| message | TEXT | ✅ | Mensagem |
| isRead | BOOLEAN | ❌ | Lida (default: false) |
| priority | ENUM | ❌ | low, medium, high (default: medium) |
| companyId | UUID | ❌ | FK para companies |
| createdAt | TIMESTAMP | ✅ | Data criação |
| updatedAt | TIMESTAMP | ✅ | Data atualização |

**Chaves:**
- PK: id
- FK: companyId → companies(id)

---

## Relacionamentos

### 1:N (Um para Muitos)
- **companies** → **users** (Uma empresa tem muitos usuários)
- **companies** → **professionals** (Uma empresa tem muitos profissionais)
- **companies** → **services** (Uma empresa tem muitos serviços)
- **companies** → **clients** (Uma empresa tem muitos clientes)
- **companies** → **appointments** (Uma empresa tem muitos agendamentos)
- **companies** → **expenses** (Uma empresa tem muitas despesas)
- **companies** → **invoices** (Uma empresa tem muitas faturas)
- **companies** → **notifications** (Uma empresa tem muitas notificações)
- **professionals** → **appointments** (Um profissional tem muitos agendamentos)
- **professionals** → **working_hours** (Um profissional tem muitos horários)
- **professionals** → **commissions** (Um profissional tem muitas comissões)
- **services** → **appointments** (Um serviço tem muitos agendamentos)
- **appointments** → **commissions** (Um agendamento tem muitas comissões)

### 1:1 (Um para Um)
- **users** ← → **professionals** (Um usuário pode ter um profissional)

## Índices Recomendados
```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(companyId);
CREATE INDEX idx_professionals_company_id ON professionals(companyId);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_professional_id ON appointments(professionalId);
CREATE INDEX idx_appointments_company_id ON appointments(companyId);
CREATE INDEX idx_services_company_id ON services(companyId);
CREATE INDEX idx_clients_company_id ON clients(companyId);
CREATE INDEX idx_working_hours_professional_id ON working_hours(professionalId);
CREATE INDEX idx_commissions_professional_id ON commissions(professionalId);
CREATE INDEX idx_expenses_company_id ON expenses(companyId);
CREATE INDEX idx_invoices_company_id ON invoices(companyId);
CREATE INDEX idx_notifications_company_id ON notifications(companyId);
```

## Observações Técnicas
1. Todos os IDs são UUID para melhor distribuição e segurança
2. Timestamps automáticos em todas as tabelas
3. Soft delete não implementado (usar isActive quando necessário)
4. JSON usado para arrays (features, specialties)
5. ENUMs para status controlados
6. Decimal(10,2) para valores monetários
7. Validações de email implementadas no modelo