const db = require('../models/index');
const ROLES = db.roles;
const USER = db.users;


getCurrentRole = (req, res, next) => {
    console.log(req.body);
    console.log(req.body.roleId === 2)
    if (+req.body.roleId === 1 || +req.body.roleId === 2) {
        req.role = +req.body.roleId;
        if(req.body.centerId) {
            req.centerId = +req.body.centerId;
        }
        next();
    }
    // next();
};

const getRoleByToken = {
    getCurrentRole
};

module.exports = getRoleByToken;