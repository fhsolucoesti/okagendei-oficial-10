
module.exports = (sequelize, DataTypes) => {
  const Professional = sequelize.define('Professional', {
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
      allowNull: true
    },
    specialties: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    commission: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id'
      }
    }
  }, {
    tableName: 'professionals',
    timestamps: true
  });

  Professional.associate = (models) => {
    Professional.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Professional.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    Professional.hasMany(models.Appointment, { foreignKey: 'professionalId', as: 'appointments' });
    Professional.hasMany(models.Commission, { foreignKey: 'professionalId', as: 'commissions' });
    Professional.hasMany(models.WorkingHour, { foreignKey: 'professionalId', as: 'workingHours' });
  };

  return Professional;
};
