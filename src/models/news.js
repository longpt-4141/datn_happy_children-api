'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class news extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      news.belongsTo(models.funds, {foreignKey: "fundId"})
      news.belongsTo(models.topics, {foreignKey: "topicId"})
    }
  }
  news.init({
    topicId : DataTypes.INTEGER,
    fundId : DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    read_minute: DataTypes.INTEGER,
    word_count: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'news',
  });
  return news;
};