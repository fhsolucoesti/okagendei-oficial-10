
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    plan: {
      type: DataTypes.STRING,
      defaultValue: 'basic'
    },
    status: {
      type: DataTypes.ENUM('active', 'trial', 'suspended', 'cancelled'),
      defaultValue: 'trial'
    },
    employees: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    monthlyRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    trialEndsAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nextPayment: {
      type: DataTypes.DATE,
      allowNull: true
    },
    overdueDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'companies',
    timestamps: true
  });

  Company.associate = (models) => {
    Company.hasMany(models.User, { foreignKey: 'companyId', as: 'users' });
    Company.hasMany(models.Service, { foreignKey: 'companyId', as: 'services' });
    Company.hasMany(models.Professional, { foreignKey: 'companyId', as: 'professionals' });
    Company.hasMany(models.Appointment, { foreignKey: 'companyId', as: 'appointments' });
    Company.hasMany(models.Client, { foreignKey: 'companyId', as: 'clients' });
    Company.hasMany(models.Expense, { foreignKey: 'companyId', as: 'expenses' });
    Company.hasMany(models.Invoice, { foreignKey: 'companyId', as: 'invoices' });
  };

  return Company;
};
