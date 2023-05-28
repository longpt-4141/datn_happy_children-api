const express = require('express');
const router = express.Router();
const {getRoleByToken} = require('../middleware/index')
const RequestsController = require('../controllers/RequestsController')

router.get('/:id', RequestsController.getSpecificRequest)
router.put('/:id/update', RequestsController.editRequest)
router.put('/:id/update_confirm_money', RequestsController.editMoneyTransferConfirmation)
router.delete('/:id/delete', RequestsController.deleteRequest)
router.post('/add', RequestsController.createNewRequest)
router.post('/', getRoleByToken.getCurrentRole, RequestsController.getAllRequests);

module.exports = router;