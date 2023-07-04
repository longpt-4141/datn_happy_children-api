'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item_transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      item_transactions.belongsTo(models.funds, {foreignKey: 'fundId'})
    }
  }
  item_transactions.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    description: DataTypes.STRING,
    fundId : DataTypes.INTEGER,
    status: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
    note_reject: {
      type : DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'item_transactions',
  });
  return item_transactions;
};