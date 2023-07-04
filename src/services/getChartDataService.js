const db = require('../models/index');
const { getMonthDateRange } = require('../utils/getStartEndDate');
const { Op } = require("sequelize");

let getChartDataPerMonth = async () => {
    let chartData = [];
    for (let i = 1; i < 13; i++) {
        console.log(i)
        const getDate = getMonthDateRange(2023,i)   
        const result = await db.transactions.sum('exact_amount', 
            { 
                where: 
                    { 
                        fundId : {
                            [Op.eq]: null
                        },
                        createdAt: 
                        { 
                            [Op.gte]: getDate.start, 
                            [Op.lte]: getDate.end, 
                        } 
                    } 
            }
        )
        if(result) {
            chartData.push(result)
        } else {
            chartData.push(0)
        }
    }
    return chartData
}

let getFundChartDataPerMonth = async () => {
    let chartData = [];
    for (let i = 1; i < 13; i++) {
        console.log(i)
        const getDate = getMonthDateRange(2023,i)   
        const result = await db.transactions.sum('exact_amount', 
            { 
                where: 
                    { 
                        fundId : {
                            [Op.not]: null
                        },
                        createdAt: 
                        { 
                            [Op.gte]: getDate.start, 
                            [Op.lte]: getDate.end, 
                        } 
                    } 
            }
        )
        if(result) {
            chartData.push(result)
        } else {
            chartData.push(0)
        }
    }
    return chartData
}

module.exports = { 
    getChartDataPerMonth : getChartDataPerMonth,
    getFundChartDataPerMonth : getFundChartDataPerMonth
}