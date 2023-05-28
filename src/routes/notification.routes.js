const express = require('express');
const router = express.Router();
const NotificationsController = require('../controllers/NotificationsController')

// router.get('/:id', ReportsController.getSpecificReport)
router.put('/:id/update', NotificationsController.readNotification)
// router.put('/:id/accept-or-reject', ReportsController.acceptOrRejectReport)
// router.delete('/:id/delete', ReportsController.deleteReport)
// router.post('/add', ReportsController.createNewReport)
router.post('/', NotificationsController.getAllNotifications);

module.exports = router;