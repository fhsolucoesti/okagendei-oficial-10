
module.exports = (sequelize, DataTypes) => {
  const Commission = sequelize.define('Commission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid'),
      defaultValue: 'pending'
    },
    professionalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Professionals',
        key: 'id'
      }
    },
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Appointments',
        key: 'id'
      }
    }
  }, {
    tableName: 'commissions',
    timestamps: true
  });

  Commission.associate = (models) => {
    Commission.belongsTo(models.Professional, { foreignKey: 'professionalId', as: 'professional' });
    Commission.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
  };

  return Commission;
};
