'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin_notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      admin_notifications.belongsTo(models.centers, { // trung tâm tạo ra noti để gửi đến admin
        foreignKey: "centerId",
      })
    }
  }
  admin_notifications.init({
    type: DataTypes.STRING,
    data: DataTypes.TEXT,
    read_at: DataTypes.DATE,
    centerId : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'admin_notifications',
  });
  return admin_notifications;
};