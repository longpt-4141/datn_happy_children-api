'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transactions.belongsTo(models.funds, {foreignKey: 'fundId'})
    }
  }
  transactions.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING, 
    send_amount: DataTypes.STRING,
    message: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    exact_amount: DataTypes.STRING,
    fundId : DataTypes.INTEGER,
    note_reject: {
      type : DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};