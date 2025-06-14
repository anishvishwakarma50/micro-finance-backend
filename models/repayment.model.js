const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Repayment extends Model {
    static associate(models) {
      Repayment.belongsTo(models.Loan, {
        foreignKey: 'loanId',
        onDelete: 'CASCADE',
      });
    }
  }

  Repayment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      loanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paidAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paidDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Repayment',
      tableName: 'repayments',
    }
  );

  return Repayment;
};
