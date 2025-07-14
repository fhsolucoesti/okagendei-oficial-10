
module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    maxEmployees: {
      type: DataTypes.STRING,
      allowNull: false
    },
    monthlyPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    yearlyPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'plans',
    timestamps: true
  });

  return Plan;
};
