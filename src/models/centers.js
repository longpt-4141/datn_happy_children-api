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
    }
  }
  centers.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    established_date: {
      type: DataTypes.DATE,
      // get() {
      //     // 1. WITHOUT moment
      //     // const date = new Date(`${this.dataValues.created_at}`);
      //     // return `${date.toISOString().split('T')[0]} ${date.toLocaleTimeString([], {month: '2-digit', timeStyle: 'medium', hour12: false})}`;
          
      //     // 2. WITHOUT moment (another solution)
      //     // const parts = date.toISOString().split('T');
      //     // return `${parts[0]} ${parts[1].substring(0, 8)}`;
          
      //     // 3. WITH moment
      //     return moment(this.getDataValue('established_date')).format('DD/MM/YYYY'); // 'D MMM YYYY, LT'
      // },
      // set(value) {
      //   this.setDataValue('established_date', moment(value).format('DD/MM/YYYY'));
      // }
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