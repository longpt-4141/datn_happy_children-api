const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const LoginController = require('../controllers/LoginController');
const UsersController = require('../controllers/UsersController');

router.put('/change-avatar', UsersController.changeUserAvatar)
module.exports = router