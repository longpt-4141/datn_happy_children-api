'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class centers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      centers.hasMany(models.requests, {
        foreignKey: "centerId", 
        sourceKey: "id"
      })
      centers.belongsTo(models.users, {
        foreignKey: "userId",
      })
      centers.hasMany(models.bank_informations, {
        foreignKey: "centerId", 
        sourceKey: "id",
      })
      centers.hasMany(models.admin_notifications, {
        foreignKey: "centerId", 
        sourceKey: "id",
      })
      centers.hasMany(models.center_notifications, {
        foreignKey: "centerId", 
        sourceKey: "id",
      })
    }
  }
  centers.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    established_date: {
      type: DataTypes.DATE,
    },
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    address: DataTypes.STRING,
    center_email:  DataTypes.STRING,
    phone_number: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'centers',
  });
  return centers;
};