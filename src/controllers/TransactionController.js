const db = require('../models/index');
const { Op } = require("sequelize");
// const io = require('../index').io;
// const {createNewCenterService} = require('../services/CRUDService')
class TransactionController {
    sendTransaction = (req, res) => {
        console.log(req.body)
    }
 }


module.exports = new TransactionController