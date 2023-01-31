const bcrypt = require('bcryptjs');
const db = require('../models/index');
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                username: data.username,
                email: data.email,
                password : hashPasswordFromBcrypt,
                // address: data.address,
                // gender : data.gender === 1 ? true : false,
                roleId : 3,
                // phoneNumber: data.phoneNumber,
            })
            resolve()
        } catch (error) {
            reject(error);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    createNewUser: createNewUser
}