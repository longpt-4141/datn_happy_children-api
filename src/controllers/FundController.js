const db = require('../models/index');
const { Op } = require("sequelize");
const io = require('../index').io;
// const {createNewCenterService} = require('../services/CRUDService')
class FundController {
    getAllFunds = (req, res) => {
        db.funds.findAll({
            order: [
                ['status', 'ASC'],
                ['updatedAt', 'DESC']
                // tạo gần nhất thì xếp đầu
            ],
        })
            .then((funds) => {
                console.log(">>> get all funds success: " , funds)
                res.status(200).send(funds)
            })
            .catch((err) => {
                console.log(">>> get all funds failed: " , err)
            })
    }

    getSpecificFund =  (req, res) => {
        console.log("get specific funds: " , req.params)
        const fundId = req.params.id;
        db.funds.findOne({
            where : {
                id : fundId
            }
        })
        .then((fund) => {
            console.log("get specific funds success: " , fund)
            res.status(200).send(fund)
        })
        .catch((err) => {
            console.log("get specific funds failed: " , err)
        })
    }

    createNewFund = (req, res) => {
        console.log(">>> get fund data", req.body);
        const fundData = req.body
        db.funds.create(fundData)
            .then((createdFund) => {
                console.log(">>> create new fund data", createdFund)
                res.status(200).send({
                    EM: 'Tạo bài viết thành công, hãy kiểm tra lại kết quả nhé',
                    EC: 'SUCCESS_CREATE_NEW_FUND',
                    DT : createdFund
                })
            })
            .catch(err => {
                console.log(">>> ERROR create new fund data ", err)
            })
    }

    editFund = (req, res) => {
        console.log(">>> edit fund", req.body, req.params)
        const fundData = req.body;
        const adr = req.params.id
        db.funds.update(
            {
                ...fundData
            },
            {
                where : {
                    id : adr
                }
            }
        )
        .then(() => {
            console.log(">>> update fund success")
            res.status(200).send({
                EM: 'Cập nhật quỹ thành công!',
                EC: 'SUCCESS_EDIT_FUND',
            })
        })
        .catch(err => {
            console.log(">>> ERROR update",err)
        })
    }

    deleteFund = (req, res) => {
        console.log("deleteFund",req.params)
        const adr = req.params.id
        db.funds.destroy({
            where : {
                id : adr
            }
        })
        .then(() => {
            res.status(200).send({
                EM: 'Xác nhận xóa quỹ thành công!',
                EC: 'SUCCESS_DELETE_FUND',
            })
        })
        .catch((err) => {
            console.log("deleteFund error", err)
        })
    }
}


module.exports = new FundController