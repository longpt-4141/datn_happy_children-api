'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      reports.belongsTo(models.requests, {foreignKey: "requestId"})
      reports.hasMany(models.receipts, {foreignKey: "reportId",sourceKey: "id"})
    }
  }
  reports.init({
    requestId: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    payment_file_url: DataTypes.STRING,
    note_reject: DataTypes.STRING,
    total_pay_money: DataTypes.INTEGER,
    expire_at : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'reports',
  });
  return reports;
};