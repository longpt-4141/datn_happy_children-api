const bcrypt = require('bcryptjs');
const db = require('../models/index');
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            db.users.create({
                email: data.email,
                password : hashPasswordFromBcrypt,
                username : data.username,
                roleId : 2,
            }).then(user => {
                resolve({
                    EM: 'tạo tài khoản thành công',
                    EC: "REGISTER_SUCCESS",
                    DT: user.id
                })
            }).catch(err => console.log(err))
        } catch (error) {
            reject({
                EM: 'tạo tài khoản thất bại, vui lòng thử lại!',
                EC: "REGISTER_FAILED",
            });
        }
    })
}

const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}

//center part

const checkCenterEmailExist = async (centerEmail) => {
    let center = await db.centers.findOne({
        where: {center_email: centerEmail}
    })
    if(center){
        return true;
    }
    return false;
}

const checkPhoneNumberExist = async (phone) => {
    let center = await db.centers.findOne({
        where: {phone_number: phone}
    })
    if(center){
        return true;
    }
    return false;
}

const registerNewCenterService = async (rawUserData, userId) => {
        db.centers.create({
            name : rawUserData.name,
            established_date: rawUserData.established_date,
            province: rawUserData.province,
            district: rawUserData.district,
            address: rawUserData.address,
            center_email: rawUserData.center_email,
            phone_number: rawUserData.phone_number,
            userId : userId
        }).then((center) => {
            let newBankList = [];
            rawUserData.bank_list.forEach((bank) => {
                newBankList.push({
                    ...bank,
                    centerId: center.id,
                })
            })
            console.log(newBankList)
            db.bank_informations.bulkCreate(newBankList).then((result) => {
                console.log(result);
            }).catch(err => {console.log(err);})
        })
        .catch(err => console.log('Loi tao center moi',err));
        return {
            EM: 'Bạn đã đăng ký tài khoản và thông tin thành công, vui lòng nhập email và mật khẩu cá nhân để đăng nhập hệ thống',
            EC: 'REGISTER_NEW_CENTER_SUCCESS',
        }
    
}

const createNewCenterService = async (rawUserData, userId) => {
    let isEmailExist = await checkCenterEmailExist(rawUserData.center_email).catch(err => console.log('Loi check email',err));
    let isPhoneNumberExist = await checkPhoneNumberExist(rawUserData.phone_number).catch(err => console.log('Loi checkphone',err));
    if(isEmailExist === true) {
        return {
            EM: 'Email đã tồn tại, vui lòng thử email khác!',
            EC: "ERR_EMAIL_EXISTED"
        }
    }
    else if (isPhoneNumberExist === true) {
        return {
            EM: 'Số điện thoại đã tồn tại, vui lòng kiểm tra lại!',
            EC: "ERR_PHONE_EXISTED"
        }
    }
    else{
        db.centers.create({
            name : rawUserData.name,
            established_date: rawUserData.established_date,
            province: rawUserData.province,
            district: rawUserData.district,
            address: rawUserData.address,
            center_email: rawUserData.center_email,
            phone_number: rawUserData.phone_number,
            userId : userId
        }).then((center) => {
            let newBankList = [];
            rawUserData.bank_list.forEach((bank) => {
                newBankList.push({
                    ...bank,
                    centerId: center.id,
                })
            })
            console.log(newBankList)
            db.bank_informations.bulkCreate(newBankList).then((result) => {
                console.log(result);
            }).catch(err => {console.log(err);})
        })
        .catch(err => console.log('Loi tao center moi',err));
        return {
            EM: 'Tạo một trung tâm mới thành công',
            EC: 'CREATE_NEW_CENTER_SUCCESS',
        }
    }
}
module.exports = {
    createNewUser: createNewUser,
    checkCenterEmailExist,
    checkPhoneNumberExist,
    createNewCenterService,
    registerNewCenterService,
    hashUserPassword
}