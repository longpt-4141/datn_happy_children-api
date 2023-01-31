const db = require('../models/index');
class LoginController {
    index = (req, res, next) => {
        res.render('pages/login')
    }
 }

module.exports = new LoginController