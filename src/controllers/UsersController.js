const db = require('../models/index');

class UsersController {
    index = (req, res, next) => {
        db.centers.findAll({
            include: {
                all: true,
                nested: true
            }
        })
            .then((roles) => {
                res.send(roles)
            })
            .catch((err) => {
                console.error('loi lay cac user :' ,err)
            })
    }
 }

module.exports = new UsersController