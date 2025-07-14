
const { User, Company, Plan, Service, Professional } = require('../models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Executando seeds...');

    // Criar planos
    const plans = await Plan.bulkCreate([
      {
        name: 'Básico',
        maxEmployees: '5',
        monthlyPrice: 49.90,
        yearlyPrice: 499.90,
        features: ['Até 5 funcionários', 'Agendamentos ilimitados', 'Relatórios básicos'],
        isPopular: false
      },
      {
        name: 'Profissional',
        maxEmployees: '15',
        monthlyPrice: 99.90,
        yearlyPrice: 999.90,
        features: ['Até 15 funcionários', 'Agendamentos ilimitados', 'Relatórios avançados', 'Suporte prioritário'],
        isPopular: true
      },
      {
        name: 'Empresarial',
        maxEmployees: 'Ilimitado',
        monthlyPrice: 199.90,
        yearlyPrice: 1999.90,
        features: ['Funcionários ilimitados', 'Agendamentos ilimitados', 'Relatórios completos', 'Suporte 24/7', 'API personalizada'],
        isPopular: false
      }
    ]);

    // Criar usuário super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@okagendei.com',
      password: 'admin123',
      role: 'super_admin'
    });

    // Criar empresa de exemplo
    const company = await Company.create({
      name: 'Salão Beleza & Estilo',
      email: 'contato@belezaestilo.com',
      phone: '(11) 9999-9999',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      plan: 'Profissional',
      status: 'active',
      customUrl: 'beleza-estilo',
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Criar admin da empresa
    const companyAdmin = await User.create({
      name: 'Maria Silva',
      email: 'maria@belezaestilo.com',
      password: 'maria123',
      role: 'company_admin',
      companyId: company.id
    });

    // Criar profissional
    const professionalUser = await User.create({
      name: 'João Santos',
      email: 'joao@belezaestilo.com',
      password: 'joao123',
      role: 'professional',
      companyId: company.id
    });

    const professional = await Professional.create({
      name: 'João Santos',
      email: 'joao@belezaestilo.com',
      phone: '(11) 8888-8888',
      specialties: ['Corte Masculino', 'Barba'],
      commission: 30,
      userId: professionalUser.id,
      companyId: company.id
    });

    // Criar serviços
    await Service.bulkCreate([
      {
        name: 'Corte Masculino',
        description: 'Corte de cabelo masculino tradicional',
        price: 25.00,
        duration: 30,
        companyId: company.id
      },
      {
        name: 'Corte Feminino',
        description: 'Corte de cabelo feminino',
        price: 35.00,
        duration: 45,
        companyId: company.id
      },
      {
        name: 'Barba',
        description: 'Corte e aparação de barba',
        price: 15.00,
        duration: 20,
        companyId: company.id
      },
      {
        name: 'Escova',
        description: 'Escova e modelagem',
        price: 20.00,
        duration: 30,
        companyId: company.id
      }
    ]);

    console.log('✅ Seeds executados com sucesso!');
    console.log('\n📋 Usuários criados:');
    console.log('Super Admin: admin@okagendei.com / admin123');
    console.log('Admin Empresa: maria@belezaestilo.com / maria123');
    console.log('Profissional: joao@belezaestilo.com / joao123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
    process.exit(1);
  }
}

seedDatabase();
