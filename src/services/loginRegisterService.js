const db = require('../models/index');
const CRUDService = require('./CRUDService')
const checkEmailExist = async (userEmail) => {
    let user = await db.users.findOne({
        where: {email: userEmail}
    })
    if(user){
        return true;
    }
    return false;
}


const registerNewUser = async (rawUserData) => {
        let data = await CRUDService.createNewUser(rawUserData)
        return {
            EM: data.EM,
            EC: data.EC,
        }
}


module.exports = {
    registerNewUser,
    checkEmailExist
};