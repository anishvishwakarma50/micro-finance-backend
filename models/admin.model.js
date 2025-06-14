const { DataTypes, Model } = require('sequelize');

class Admin extends Model {
  static associate(models) {
    Admin.hasMany(models.Customer, {
      foreignKey: 'adminId',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = (sequelize) => {
  Admin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [10, 15],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'agent'),
        allowNull: false,
      },
      acode: {
        type: DataTypes.STRING(8),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Admin',
      tableName: 'admins',
      hooks: {
        beforeCreate: async (admin) => {
          const bcrypt = require('bcryptjs');
          admin.password = await bcrypt.hash(admin.password, 10);

          // Automatically generate acode if role is 'admin'
          if (admin.role === 'admin') {
            admin.acode = generateAcode();
          }
        },
      },
    }
  );

  return Admin;
};

// Helper function to generate 8-character alphanumeric code
function generateAcode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase(); // 8 characters
}
