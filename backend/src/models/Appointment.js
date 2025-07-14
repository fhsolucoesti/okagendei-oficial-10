
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientPhone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientBirthDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
      defaultValue: 'scheduled'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id'
      }
    },
    professionalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Professionals',
        key: 'id'
      }
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Services',
        key: 'id'
      }
    }
  }, {
    tableName: 'appointments',
    timestamps: true
  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    Appointment.belongsTo(models.Professional, { foreignKey: 'professionalId', as: 'professional' });
    Appointment.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
    Appointment.hasMany(models.Commission, { foreignKey: 'appointmentId', as: 'commissions' });
  };

  return Appointment;
};
