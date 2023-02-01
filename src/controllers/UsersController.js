const db = require('../models/index');

class UsersController {
    index = (req, res, next) => {
        db.users.findAll()
            .then((users) => {
                res.send(users)
            })
            .catch((err) => {
                console.error('loi lay cac user :' ,err)
            })
    }
 }

module.exports = new UsersController