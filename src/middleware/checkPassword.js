
const db = require("../models");
const bcrypt = require('bcryptjs');

checkValidatePassword = (req, res, next) => {
    let password = req.body.password_data.old_password;
    let email = req.body.password_data.email
    db.users.findOne({
        where: {
            email: email
        }
    })
    .then((user) => {
        bcrypt.compare(password, user.password, (err, response) => {
            if (response) {
                console.log('dung')
                req.new_password = req.body.password_data.new_password;
                req.email = user.email;
                next()
            }else {
                console.log('>>> change pass', err)
                res.send({
                    EM: 'Sai mật khẩu, vui lòng nhập mật khẩu chính xác',
                    EC: 'ERR_PASSWORD_WRONG',
                });
            }
        })
    }).catch(err => {
        console.log(err)
    })
}

const checkPassword = {
    checkValidatePassword
};
module.exports = checkPassword;