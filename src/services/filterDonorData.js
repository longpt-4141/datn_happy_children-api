// const db = require('../models/index');
const { getMonthDateRange } = require('../utils/getStartEndDate');
const { Op } = require("sequelize");

let getTimeCondition = (time) => {
    if(time === 'today') {
        const today = new Date()
        condition = {
            [Op.eq] : today
        }
    } else  {
        const getDate = getMonthDateRange(2023,parseInt(time))  
        condition =  { 
            [Op.gte]: getDate.start, 
            [Op.lte]: getDate.end, 
        } 
    } 
    return condition
}

module.exports = { 
    getTimeCondition : getTimeCondition,
}