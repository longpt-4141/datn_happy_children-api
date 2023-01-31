const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('happy_children', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        // useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true,
        timezone: "+07:00"
      },
      timezone: "+07:00", //for writing to database
      operatorsAliases: false
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