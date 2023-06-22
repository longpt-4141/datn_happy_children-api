const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController')

router.post('/make-new-donate', TransactionController.sendTransaction)

module.exports = router;