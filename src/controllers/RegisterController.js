const db = require('../models/index');
// const CRUDService = require('../services/CRUDService')
const {createNewCenterService, registerNewCenterService} = require('../services/CRUDService')

const jsonwebtoken = require('jsonwebtoken');
const loginRegisterService = require('../services/loginRegisterService')
class RegisterController {

    register = async (req, res, next) => {
        const dataForm = req.body.representativeData
        const center_info = req.body.center_info
        const center_email = req.body.center_info.center_email
        const center_phone_number = req.body.center_info.phone_number
        console.log(dataForm)
        try {
            let data = await loginRegisterService.registerNewUser(dataForm, center_email, center_phone_number)
            console.log({data})
            if (
                data.EC === 'REGISTER_SUCCESS'
            ) {
                const userId = data.DT
                const dataResponse = await registerNewCenterService(center_info, userId)
                res.status(200).json({
                    EM: dataResponse.EM, //err message
                    EC: dataResponse.EC, //err code
                })
            }
            else {
                res.status(200).json({
                    EM: data.EM, //err message
                    EC: data.EC, //err code
                })
            }
        }catch(err){
            console.log("loi dang ky phần contronller: ", err)
        }
    }
 }

module.exports = new RegisterController