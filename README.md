
# OKAgendei - Sistema de Agendamento Completo

Um sistema completo de agendamento online desenvolvido com React, TypeScript, Supabase e Node.js. Ideal para salões de beleza, clínicas, consultórios e outros negócios que precisam gerenciar agendamentos.

## 🚀 Funcionalidades Principais

### Para Empresas
- **Dashboard Completo**: Visão geral de agendamentos, receitas e estatísticas
- **Gestão de Agendamentos**: Criar, editar, cancelar e acompanhar agendamentos
- **Cadastro de Serviços**: Gerenciar serviços oferecidos com preços e duração
- **Gestão de Profissionais**: Cadastrar profissionais e definir especialidades
- **Controle Financeiro**: Acompanhar receitas, despesas e comissões
- **Link Público**: Página personalizada para clientes agendarem online
- **WhatsApp Integration**: Envio automático de confirmações
- **Relatórios**: Exportação de dados e relatórios detalhados

### Para Profissionais
- **Agenda Pessoal**: Visualizar horários e compromissos
- **Controle de Comissões**: Acompanhar ganhos e comissões
- **Histórico de Atendimentos**: Registro completo de serviços prestados
- **Configurações de Horário**: Definir disponibilidade e horários de trabalho

### Para Super Administradores
- **Gestão de Empresas**: Controlar todas as empresas cadastradas
- **Gestão de Planos**: Criar e gerenciar planos de assinatura
- **Cupons de Desconto**: Sistema completo de cupons promocionais
- **Configurações da Plataforma**: Personalizar marca e configurações gerais
- **Configurações da Landing Page**: Editor completo da página inicial

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/UI** para componentes
- **React Router** para navegação
- **TanStack Query** para gerenciamento de estado
- **React Hook Form** para formulários
- **Zod** para validação

### Backend
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** banco de dados
- **Row Level Security (RLS)** para segurança
- **Edge Functions** para lógica customizada
- **Autenticação JWT** nativa do Supabase

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git instalado

## 🔧 Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/okagendei.git
cd okagendei
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e um novo projeto
3. Anote a URL do projeto e a chave anônima

#### 3.2 Configure as Variáveis de Ambiente
O projeto já está configurado para usar as credenciais do Supabase diretamente no código. Não são necessárias variáveis de ambiente adicionais.

### 4. Execute as Migrações do Banco

As migrações serão executadas automaticamente quando você iniciar o projeto pela primeira vez.

### 5. Inicie o Projeto
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:8080`

## 🗃️ Estrutura do Banco de Dados

O sistema possui as seguintes tabelas principais:

### Tabelas de Usuários e Empresas
- **profiles**: Perfis dos usuários com roles
- **companies**: Dados das empresas cadastradas
- **users**: Informações básicas dos usuários

### Tabelas de Agendamento
- **appointments**: Agendamentos realizados
- **services**: Serviços oferecidos pelas empresas
- **professionals**: Profissionais cadastrados
- **clients**: Clientes das empresas
- **working_hours**: Horários de trabalho dos profissionais

### Tabelas Financeiras
- **commissions**: Comissões dos profissionais
- **expenses**: Despesas das empresas
- **invoices**: Faturas e cobranças
- **plans**: Planos de assinatura
- **coupons**: Cupons de desconto

### Tabelas do Sistema
- **notifications**: Notificações do sistema
- **platform_settings**: Configurações da plataforma

## 👥 Tipos de Usuário

### Super Admin
- Acesso total ao sistema
- Gerencia todas as empresas
- Configura planos e cupons
- Personaliza a plataforma

### Company Admin
- Gerencia sua empresa
- Cadastra profissionais e serviços
- Acompanha financeiro
- Configura link público

### Professional
- Acessa sua agenda
- Visualiza comissões
- Gerencia horários de trabalho

## 🔐 Autenticação e Segurança

O sistema utiliza:
- **JWT Tokens** para autenticação
- **Row Level Security (RLS)** no banco
- **Políticas de segurança** por role
- **Validação de dados** em todas as operações

## 📱 Funcionalidades Detalhadas

### Sistema de Agendamento
- Calendário interativo
- Bloqueio de horários
- Confirmação automática via WhatsApp
- Reagendamento e cancelamento
- Histórico completo

### Gestão Financeira
- Controle de receitas e despesas
- Cálculo automático de comissões
- Relatórios financeiros
- Exportação de dados

### Link Público Personalizado
- Página de agendamento para clientes
- URL personalizada por empresa
- Design responsivo
- Integração com WhatsApp

### Sistema de Notificações
- Notificações em tempo real
- Lembretes de agendamento
- Alertas de pagamento
- Notificações por email

## 🎨 Personalização da Landing Page

O super admin pode personalizar:
- Cores e tema
- Textos e conteúdo
- Depoimentos de clientes
- Recursos destacados
- Informações de contato
- Redes sociais
- Planos e preços
- Promoções ativas

## 📊 Relatórios e Exportação

- Relatórios de agendamentos
- Relatórios financeiros
- Exportação em PDF/Excel
- Estatísticas detalhadas
- Gráficos interativos

## 🔌 Integrações

### WhatsApp
- Envio de confirmações
- Lembretes automáticos
- Suporte via WhatsApp

### Pagamentos (Futuro)
- Integration com gateways de pagamento
- Cobrança automática
- Controle de inadimplência

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes React
│   ├── Auth/            # Componentes de autenticação
│   ├── Company/         # Componentes da empresa
│   ├── Landing/         # Componentes da landing page
│   ├── Layout/          # Layout e navegação
│   ├── Services/        # Gestão de serviços
│   ├── SuperAdmin/      # Painel super admin
│   └── ui/              # Componentes base (shadcn)
├── contexts/            # Contexts do React
├── hooks/               # Custom hooks
├── integrations/        # Integrações (Supabase)
├── pages/               # Páginas da aplicação
├── types/               # Definições de tipos
└── utils/               # Utilitários

backend/
├── src/
│   ├── config/          # Configurações
│   ├── middleware/      # Middlewares
│   ├── models/          # Modelos do banco
│   ├── routes/          # Rotas da API
│   └── types/           # Tipos TypeScript

supabase/
├── functions/           # Edge Functions
└── config.toml         # Configuração do Supabase
```

## 🚀 Deploy

### Deploy no Lovable (Recomendado)
1. Conecte seu projeto ao GitHub
2. Use o botão "Publish" no Lovable
3. Configure domínio personalizado (plano pago)

### Deploy Manual
O projeto pode ser deployado em qualquer serviço que suporte React:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

### Configuração de Produção
1. Configure as variáveis de ambiente do Supabase
2. Execute o build: `npm run build`
3. Faça upload da pasta `dist/`

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro de Conexão com Banco**
- Verifique as credenciais do Supabase
- Confirme que o projeto Supabase está ativo

**Erro de Autenticação**
- Verifique se o RLS está configurado
- Confirme as políticas de segurança

**Problemas de Build**
- Execute `npm install` novamente
- Verifique a versão do Node.js
- Limpe o cache: `npm run dev -- --force`

### Logs e Debug
- Console do navegador para erros frontend
- Supabase Dashboard → Logs para backend
- Edge Functions logs no Supabase

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] App mobile nativo
- [ ] Integração com calendários externos
- [ ] Sistema de fidelidade
- [ ] Marketplace de profissionais
- [ ] IA para otimização de horários
- [ ] Sistema de reviews
- [ ] Multi-idiomas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: suporte@okagendei.com
- **WhatsApp**: (11) 99999-9999
- **Discord**: [Comunidade OKAgendei](https://discord.gg/okagendei)
- **Documentação**: [docs.okagendei.com](https://docs.okagendei.com)

## 🙏 Agradecimentos

- Equipe Supabase pelo backend incrível
- Shadcn pela biblioteca de componentes
- Comunidade React pelo ecossistema
- Todos os contribuidores do projeto

---

**OKAgendei** - Transformando a gestão de agendamentos no Brasil 🇧🇷

*Desenvolvido com ❤️ para pequenos e médios negócios*
