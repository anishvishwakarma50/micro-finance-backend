// customer.model.js
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.Admin, {
        foreignKey: 'adminId',
        onDelete: 'CASCADE',
      });
    }
  }

  Customer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false, // keep this
      references: {
        model: 'admins',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
  });

  return Customer;
};
