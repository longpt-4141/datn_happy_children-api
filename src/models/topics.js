'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class topics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      topics.hasMany(models.news, {foreignKey: "topicId", sourceKey: 'id'})
    }
  }
  topics.init({
    name: DataTypes.STRING,
    isSuggest: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
  }, {
    sequelize,
    modelName: 'topics',
  });
  return topics;
};