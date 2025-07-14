
import bcrypt from 'bcryptjs';
import { User, Company, Plan } from '../models';

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar planos
    const plans = await Plan.bulkCreate([
      {
        name: 'Básico',
        maxEmployees: '5',
        monthlyPrice: 49.90,
        yearlyPrice: 499.90,
        features: ['Agendamentos ilimitados', 'Até 5 funcionários', 'Relatórios básicos', 'Suporte por email'],
        isPopular: false,
        isActive: true
      },
      {
        name: 'Premium',
        maxEmployees: '20',
        monthlyPrice: 99.90,
        yearlyPrice: 999.90,
        features: ['Agendamentos ilimitados', 'Até 20 funcionários', 'Relatórios avançados', 'Suporte prioritário', 'Integração WhatsApp'],
        isPopular: true,
        isActive: true
      },
      {
        name: 'Enterprise',
        maxEmployees: 'unlimited',
        monthlyPrice: 199.90,
        yearlyPrice: 1999.90,
        features: ['Agendamentos ilimitados', 'Funcionários ilimitados', 'Relatórios completos', 'Suporte 24/7', 'API personalizada'],
        isPopular: false,
        isActive: true
      }
    ]);

    // Criar empresa de exemplo
    const company = await Company.create({
      name: 'Salão Beleza & Estilo',
      email: 'contato@belezaestilo.com',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      plan: 'premium',
      status: 'active',
      employees: 3,
      monthlyRevenue: 5000.00,
      trialEndsAt: null
    });

    // Criar usuários de exemplo
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const hashedPassword2 = await bcrypt.hash('maria123', 12);
    const hashedPassword3 = await bcrypt.hash('joao123', 12);

    await User.bulkCreate([
      {
        name: 'Admin Sistema',
        email: 'admin@okagendei.com',
        password: hashedPassword,
        role: 'super_admin'
      },
      {
        name: 'Maria Silva',
        email: 'maria@belezaestilo.com',
        password: hashedPassword2,
        role: 'company_admin',
        companyId: company.id
      },
      {
        name: 'João Santos',
        email: 'joao@belezaestilo.com',
        password: hashedPassword3,
        role: 'professional',
        companyId: company.id
      }
    ]);

    console.log('✅ Seed executado com sucesso!');
    console.log('');
    console.log('🔑 Credenciais de acesso:');
    console.log('Super Admin: admin@okagendei.com / admin123');
    console.log('Admin Empresa: maria@belezaestilo.com / maria123');
    console.log('Profissional: joao@belezaestilo.com / joao123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

seedDatabase();
