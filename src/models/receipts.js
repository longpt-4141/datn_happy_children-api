'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class receipts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      receipts.belongsTo(models.reports, {foreignKey: "reportId"})
    }
  }
  receipts.init({
    reportId: DataTypes.INTEGER,
    receipt_name: DataTypes.STRING,
    pay_date: DataTypes.DATE,
    tax: DataTypes.INTEGER,
    pay_money: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'receipts',
  });
  return receipts;
};