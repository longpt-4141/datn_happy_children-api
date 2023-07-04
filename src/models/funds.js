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
    end_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'funds',
  });
  return funds;
};