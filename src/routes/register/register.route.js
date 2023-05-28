const express = require('express');
const router = express.Router();
const {verifySignUp} = require('../../middleware/index')

const registerController = require('../../controllers/RegisterController')


router.post('/', verifySignUp.checkDuplicateEmail ,registerController.register);

module.exports = router