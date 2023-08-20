const db = require('../models/index');
const { Op } = require("sequelize");
const {createNewCenterService} = require('../services/CRUDService')
class CentersController {
    getAllCenter = (req, res, next) => {
        const paramsValue = req.query;
        console.log({paramsValue});
        // var condition = paramsValue ? { title: { [Op.like]: `%${title}%` } } : null;
        let condition = Object.keys(paramsValue).length > 0 ? {
            [Op.or]: [
                {
                    name: { [Op.like]: `%${paramsValue.query}%` }
                },
                {
                    address: { [Op.like]: `%${paramsValue.query}%` }
                }
            ]
        } : null;
        // if (Object.keys(paramsValue).length > 0) {
            db.centers.findAll({
                where : condition ,
                order: [
                    ['createdAt', 'DESC'], // tạo gần nhất thì xếp đầu
                ],
                include: {
                    all: true,
                    nested: true
                }
            })
                .then((centers) => {
                    res.send(centers)
                    console.log('cookies', req.cookies)
                })
                .catch((err) => {
                    console.error('loi lay cac user :' ,err)
                })
    }

    getSpecificCenter = (req, res) => {
        const adr = req.params.id
        db.centers.findOne({
            where: {
                id : adr
            },
            include: {
                all: true,
                nested: true
            }
        }).then((center) => {
            res.send(center)
            console.log("get ok")
        })
    }

    createNewCenter = async (req, res) => {
        const formData = req.body;
        console.log(formData)
        const dataResponse = await createNewCenterService(formData)
        res.status(200).json({
            EM: dataResponse.EM, //err message
            EC: dataResponse.EC, //err code
        })
    }

    editCenter = async (req, res, next) => {
        const formData = req.body;
        const adr = req.params.id
        console.log(formData)
        let editData = {}
        for (const property in formData) {
            // console.log(formData[property])
            if(formData[property] !== '' && property !== 'id') {
                editData[property] = formData[property]
            }
        }
        console.log({editData})
        db.centers.update(editData, {
                where: {
                    id: adr
                }
            }).then(() => {
                console.log(">>>> Success update center data")
                res.status(200).json({
                    EM: "Bạn đã cập nhật thông tin thành công, vui lòng kiểm tra lại", //err message
                    EC: "SUCCESS_UPDATE_CENTER", //err code
                })
            }) 
    }

    deleteSpecificCenter = (req, res) => {
        const adr = req.params.id;
        db.centers.destroy({
            where: {
                id: adr
            }
        }).then(() => {
            db.bank_informations.destroy({
                where: {
                    centerId: adr
                }
            }).then(() => {
                res.status(200).json({
                    EM: 'Bạn đã xóa thành công, vui lòng tải lại trang để kiểm tra', //err message
                    EC: 'DELETE_CENTER_SUCCESS', //err code
                })
            }).catch(err => console.log(err));
        }).catch(err => console.log(err))
    }


 }

module.exports = new CentersController