'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class center_notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      center_notifications.belongsTo(models.centers, { // thông báo từ admin cho trung tâm
        foreignKey: "centerId",
      })
    }
  }
  center_notifications.init({
    type: DataTypes.STRING,
    data: DataTypes.TEXT,
    read_at: DataTypes.DATE,
    centerId : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'center_notifications',
  });
  return center_notifications;
};