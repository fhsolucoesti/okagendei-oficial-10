
const { sequelize } = require('../models');

async function runMigrations() {
  try {
    console.log('🔄 Executando migrações...');
    
    // Sincronizar modelos com o banco
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Migrações executadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  }
}

runMigrations();
