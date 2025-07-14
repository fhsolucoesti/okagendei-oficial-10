
import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';

// Import models
import UserModel from './User';
import CompanyModel from './Company';
import ServiceModel from './Service';
import ProfessionalModel from './Professional';
import AppointmentModel from './Appointment';
import ClientModel from './Client';
import PlanModel from './Plan';
import NotificationModel from './Notification';
import CommissionModel from './Commission';
import ExpenseModel from './Expense';
import InvoiceModel from './Invoice';
import WorkingHourModel from './WorkingHour';

// Initialize models
const User = UserModel(sequelize);
const Company = CompanyModel(sequelize);
const Service = ServiceModel(sequelize);
const Professional = ProfessionalModel(sequelize);
const Appointment = AppointmentModel(sequelize);
const Client = ClientModel(sequelize);
const Plan = PlanModel(sequelize);
const Notification = NotificationModel(sequelize);
const Commission = CommissionModel(sequelize);
const Expense = ExpenseModel(sequelize);
const Invoice = InvoiceModel(sequelize);
const WorkingHour = WorkingHourModel(sequelize);

// Define associations
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(User, { foreignKey: 'companyId', as: 'users' });

Company.hasMany(Service, { foreignKey: 'companyId', as: 'services' });
Service.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Company.hasMany(Professional, { foreignKey: 'companyId', as: 'professionals' });
Professional.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Professional.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Professional, { foreignKey: 'userId', as: 'professional' });

Company.hasMany(Appointment, { foreignKey: 'companyId', as: 'appointments' });
Appointment.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Professional.hasMany(Appointment, { foreignKey: 'professionalId', as: 'appointments' });
Appointment.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

Company.hasMany(Client, { foreignKey: 'companyId', as: 'clients' });
Client.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Professional.hasMany(Commission, { foreignKey: 'professionalId', as: 'commissions' });
Commission.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

Appointment.hasOne(Commission, { foreignKey: 'appointmentId', as: 'commission' });
Commission.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

Company.hasMany(Expense, { foreignKey: 'companyId', as: 'expenses' });
Expense.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Company.hasMany(Invoice, { foreignKey: 'companyId', as: 'invoices' });
Invoice.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Professional.hasMany(WorkingHour, { foreignKey: 'professionalId', as: 'workingHours' });
WorkingHour.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

export {
  sequelize,
  User,
  Company,
  Service,
  Professional,
  Appointment,
  Client,
  Plan,
  Notification,
  Commission,
  Expense,
  Invoice,
  WorkingHour
};
