const db = require('../models/index');

class UsersController {
    index = (req, res, next) => {
        db.User.findAll()
            .  then((users) => {
                res.json({users})
            })
            .catch((err) => {
                console.error('loi lay cac user :' ,err)
            })
    }
 }

module.exports = new UsersController