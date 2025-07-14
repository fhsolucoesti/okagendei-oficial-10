
module.exports = (sequelize, DataTypes) => {
  const WorkingHour = sequelize.define('WorkingHour', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 6
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    professionalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Professionals',
        key: 'id'
      }
    }
  }, {
    tableName: 'working_hours',
    timestamps: true
  });

  WorkingHour.associate = (models) => {
    WorkingHour.belongsTo(models.Professional, { foreignKey: 'professionalId', as: 'professional' });
  };

  return WorkingHour;
};
