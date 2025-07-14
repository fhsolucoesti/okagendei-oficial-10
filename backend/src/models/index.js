
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos
const User = require('./User');
const Company = require('./Company');
const Service = require('./Service');
const Professional = require('./Professional');
const Appointment = require('./Appointment');
const Client = require('./Client');
const Plan = require('./Plan');
const Notification = require('./Notification');
const Commission = require('./Commission');
const Expense = require('./Expense');
const Invoice = require('./Invoice');
const WorkingHour = require('./WorkingHour');

// Inicializar modelos
const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Company: Company(sequelize, Sequelize.DataTypes),
  Service: Service(sequelize, Sequelize.DataTypes),
  Professional: Professional(sequelize, Sequelize.DataTypes),
  Appointment: Appointment(sequelize, Sequelize.DataTypes),
  Client: Client(sequelize, Sequelize.DataTypes),
  Plan: Plan(sequelize, Sequelize.DataTypes),
  Notification: Notification(sequelize, Sequelize.DataTypes),
  Commission: Commission(sequelize, Sequelize.DataTypes),
  Expense: Expense(sequelize, Sequelize.DataTypes),
  Invoice: Invoice(sequelize, Sequelize.DataTypes),
  WorkingHour: WorkingHour(sequelize, Sequelize.DataTypes)
};

// Associações
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  ...models,
  sequelize
};
