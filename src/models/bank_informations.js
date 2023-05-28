'use strict';
const {
  Model
} = require('sequelize');
const centers = require('./centers');
module.exports = (sequelize, DataTypes) => {
  class bank_informations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bank_informations.belongsTo(models.centers, {
        // as: "centers",
        foreignKey: 'centerId'
      })
    }
  }
  bank_informations.init({
    centerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    account_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bank_informations',
  });
  return bank_informations;
};