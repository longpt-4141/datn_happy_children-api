const express = require('express');
const router = express.Router();
const {getRoleByToken} = require('../middleware/index')
const ReportsController = require('../controllers/ReportsController')

router.get('/:id', ReportsController.getSpecificReport)
router.put('/:id/update', ReportsController.editReport)
router.put('/:id/accept-or-reject', ReportsController.acceptOrRejectReport)
router.delete('/:id/delete', ReportsController.deleteReport)
router.post('/add', ReportsController.createNewReport)
router.post('/', getRoleByToken.getCurrentRole, ReportsController.getAllReports);

module.exports = router;