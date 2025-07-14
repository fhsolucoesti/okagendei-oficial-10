
# OKAgendei Backend - Node.js

Sistema de agendamentos completo em Node.js com PostgreSQL.

## 🚀 Tecnologias

- **Node.js** + **Express**
- **PostgreSQL** (banco de dados)
- **Sequelize** (ORM)
- **JWT** (autenticação)
- **Bcrypt** (criptografia)
- **Joi** (validação)

## 📋 Pré-requisitos

- Node.js 16+ instalado
- PostgreSQL 12+ instalado
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=okagendei
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta_jwt_muito_forte
JWT_EXPIRES_IN=24h

PORT=3001
NODE_ENV=development
```

4. **Crie o banco de dados**
```sql
CREATE DATABASE okagendei;
```

5. **Execute as migrações**
```bash
npm run migrate
```

6. **Execute os seeds (dados iniciais)**
```bash
npm run seed
```

## 🏃‍♂️ Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor estará disponível em `http://localhost:3001`

## 📚 Documentação da API

### Autenticação

#### POST /api/auth/register
Registrar novo usuário/empresa
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "password": "123456",
  "role": "company_admin",
  "companyName": "Salão Beleza"
}
```

#### POST /api/auth/login
Fazer login
```json
{
  "email": "joao@empresa.com",
  "password": "123456"
}
```

#### GET /api/auth/profile
Obter perfil do usuário (requer token)

### Empresas

#### GET /api/companies
Listar todas as empresas (Super Admin)

#### GET /api/companies/:id
Obter empresa específica

#### POST /api/companies
Criar nova empresa

#### PUT /api/companies/:id
Atualizar empresa

#### DELETE /api/companies/:id
Deletar empresa

### Serviços

#### GET /api/services
Listar serviços da empresa

#### POST /api/services
Criar novo serviço

#### PUT /api/services/:id
Atualizar serviço

#### DELETE /api/services/:id
Deletar serviço

### Profissionais

#### GET /api/professionals
Listar profissionais da empresa

#### POST /api/professionals
Criar novo profissional

#### PUT /api/professionals/:id
Atualizar profissional

#### DELETE /api/professionals/:id
Deletar profissional

### Agendamentos

#### GET /api/appointments
Listar agendamentos

#### POST /api/appointments
Criar novo agendamento

#### PUT /api/appointments/:id
Atualizar agendamento

#### DELETE /api/appointments/:id
Cancelar agendamento

### Clientes

#### GET /api/clients
Listar clientes

#### POST /api/clients
Criar novo cliente

#### PUT /api/clients/:id
Atualizar cliente

### Planos

#### GET /api/plans
Listar planos disponíveis

#### POST /api/plans
Criar novo plano (Super Admin)

#### PUT /api/plans/:id
Atualizar plano (Super Admin)

### Notificações

#### GET /api/notifications
Listar notificações

#### PUT /api/notifications/:id/read
Marcar notificação como lida

### Dashboard

#### GET /api/dashboard/stats
Estatísticas do dashboard

## 🔒 Autenticação

O sistema usa JWT para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu-token-jwt>
```

## 👥 Roles de Usuário

- **super_admin**: Acesso total ao sistema
- **company_admin**: Gerencia sua empresa
- **professional**: Acesso limitado às suas informações

## 📝 Estrutura do Banco

O sistema possui as seguintes tabelas:

- **users**: Usuários do sistema
- **companies**: Empresas cadastradas
- **services**: Serviços oferecidos
- **professionals**: Profissionais das empresas
- **appointments**: Agendamentos
- **clients**: Clientes
- **plans**: Planos de assinatura
- **notifications**: Notificações
- **commissions**: Comissões dos profissionais
- **expenses**: Despesas das empresas
- **invoices**: Faturas
- **working_hours**: Horários de trabalho

## 🔧 Scripts Disponíveis

- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia o servidor em desenvolvimento
- `npm run migrate`: Executa migrações do banco
- `npm run seed`: Executa seeds (dados iniciais)

## 📦 Deploy

1. **Configure as variáveis de ambiente em produção**
2. **Execute as migrações**
3. **Inicie o servidor**

```bash
NODE_ENV=production npm start
```

## 🐳 Docker (Opcional)

Você pode usar Docker para executar o sistema:

```bash
# Construir imagem
docker build -t okagendei-backend .

# Executar container
docker run -p 3001:3001 okagendei-backend
```

## 🆘 Suporte

Se você encontrar problemas:

1. Verifique se o PostgreSQL está rodando
2. Confirme as configurações do `.env`
3. Execute as migrações: `npm run migrate`
4. Verifique os logs do servidor

## 📄 Licença

Este projeto está sob a licença MIT.
