const db = require('../models/index');
const CRUDService = require('../services/CRUDService')
const jsonwebtoken = require('jsonwebtoken');
const loginRegisterService = require('../services/loginRegisterService')
class RegisterController {

    register = async (req, res, next) => {
        const dataForm = req.body
        try {
            if(!dataForm.email || !dataForm.password) {
                return res.status(200).json({
                    EM: 'Thiếu email hoặc password',
                    EC: 'ERR_MISSING_FIELD',
                    DT: ''
                })
            }
            //service create user
            let data = await loginRegisterService.registerNewUser(dataForm)
            return res.status(200).json({
                EM: data.EM, //err message
                EC: data.EC, //err code
                DT: '' // data
            })
        }catch(err){
            console.log("loi dang ky phần contronller: ", err)
        }
    }
 }

module.exports = new RegisterController