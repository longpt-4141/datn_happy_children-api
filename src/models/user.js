'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.belongsTo(models.roles, {foreignKey: 'roleId'})
      users.hasOne(models.centers,{
        foreignKey: 'userId',
        sourceKey:'id'
      })
    }
  }
  users.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: DataTypes.STRING,
    avatar: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};