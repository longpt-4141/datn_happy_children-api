const db = require('../models/index');
const ROLES = db.roles;
const USER = db.users;

checkDuplicateEmail = (req, res, next) => {
        USER.findOne({ 
            where: {
                email: req.body.email
            }
        }).then(user => {
            if(user) {
                res.status(200).send({ 
                    EM: 'Email đã tồn tại, vui lòng thử email khác!',
                    EC: "ERR_EMAIL_EXISTED"
                })
                // return;
            }
            else {
                res.status(200).send({ 
                    EM: 'Email hợp lệ',
                    EC: "SUCCESS_EMAIL"
                })
            }
            // next();
    })
    .catch(err => {
        console.log(err)
    })
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
        }
    }
    }
    
    next();
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;