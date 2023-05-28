'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      requests.belongsTo(models.centers, { 
        foreignKey: "centerId"
      })

      requests.hasMany(models.reports, { foreignKey: "requestId", sourceKey:"id" })
    }
  }
  requests.init({
    centerId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    total_money: DataTypes.DECIMAL,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    note_reject: DataTypes.STRING,
    note_agree: DataTypes.STRING,
    estimated_budget_file: DataTypes.BLOB('long'),
    estimated_budget_url: DataTypes.STRING,
    type_request: DataTypes.INTEGER, 
    money_transfer_confirm: {
      type: DataTypes.INTEGER,
      defaultValue: -1
    },
    report_confirm: {
      type: DataTypes.INTEGER,
      defaultValue: -1 // 
      /* 
      -1 : chưa báo cáo
      0  : đang chờ
      1  : đã báo cáo
      */
    },
    report_folder_url: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'requests',
  });
  return requests;
};