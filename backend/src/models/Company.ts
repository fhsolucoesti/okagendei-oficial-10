
import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
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
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false,
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
    nextPayment: {
      type: DataTypes.DATE,
      allowNull: true
    },
    overdueDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'companies',
    timestamps: true
  });

  return Company;
};
