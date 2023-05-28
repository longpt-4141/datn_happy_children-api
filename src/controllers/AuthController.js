const db = require('../models/index');
const bcrypt = require('bcryptjs');
const {checkEmailExist} = require('../services/loginRegisterService')
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

class AuthController {
    checkAccount = async (req, res) => {
        console.log('>>> check user', req.user)
        db.users.findOne({
            where : {
                id : req.user.id
            },
            attributes : ['avatar']
        }).then((user) => {
            console.log('>>> user avatar', user.avatar)
            res.status(200).send({
                EM: 'Tài khoản hợp lệ',
                EC: 'ACCOUNT_VALID',
                DT: {
                    ...req.user,
                    accessToken: req.token,
                    avatar : user.avatar
                }
            })
        })
    }
 }

module.exports = new AuthController