const { Sequelize } = require('sequelize');
const {DB_NAME, DB_PASSWORD, DB_PORT, DB_HOST} = require('../config/env.config')
console.log(DB_NAME)
const sequelize = new Sequelize(DB_NAME, 'root', DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: true,
    dialectOptions: {
        // useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true,
        timezone: "+07:00"
      },
      timezone: "+07:00", //for writing to database
      operatorsAliases: false,
      port: DB_PORT
})

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("connect DB Happy Children successfully")
    }
    catch (err) {
        console.error("Unable to connect to DB", err)
    }
}

module.exports = connectDatabase;