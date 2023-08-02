'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class funds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      funds.hasMany(models.news, {foreignKey: "fundId", sourceKey: 'id'})
      funds.hasMany(models.transactions, {foreignKey: "fundId", sourceKey: 'id'})
      funds.hasMany(models.item_transactions, {foreignKey: "fundId", sourceKey: 'id'})
    }
  }
  funds.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    image_url: DataTypes.STRING,
    sponsor_estimate_amount: DataTypes.STRING,
    received_amount: DataTypes.INTEGER,
    general_pay_amount: DataTypes.STRING,
    report_file_url: DataTypes.STRING,
    status: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    }
  }, {
    sequelize,
    modelName: 'funds',
  });
  return funds;
};