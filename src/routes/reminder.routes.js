const express = require('express');
const router = express.Router();
const NotificationsController = require('../controllers/NotificationsController')

router.post('/confirmed-request', NotificationsController.getAllCenterReminders);
router.post('/admin', NotificationsController.getAllAdminReminders);

module.exports = router;