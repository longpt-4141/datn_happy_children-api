const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const LoginController = require('../controllers/LoginController');

router.put('/')
router.post('/', AuthController.checkAccount);
router.put('/', LoginController.changePassword)
module.exports = router