const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Loan extends Model {
    static associate(models) {
      Loan.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        onDelete: 'CASCADE',
      });

      Loan.hasMany(models.Repayment, {
        foreignKey: 'loanId',
        onDelete: 'CASCADE',
      });
    }
  }

  Loan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      durationMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      interestRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.ENUM('weekly', 'monthly'),
        allowNull: false,
      },
      numberOfInstallments: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      finalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      amountPaid: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Loan',
      tableName: 'loans',
    }
  );

  return Loan;
};
