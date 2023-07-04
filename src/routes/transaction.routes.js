const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController')

router.post('/make-new-donate', TransactionController.sendTransaction)
router.get('/admin-get', TransactionController.getAllNormalTransactions)
router.get('/admin-get-fund-transaction', TransactionController.getAllFundTransactions)
router.get('/admin-get-item-transaction', TransactionController.getAllItemTransactionsForAdmin)
router.get('/get-for-guest', TransactionController.getAllTransactionsForGuest)
router.get('/guest-get-fund-transaction', TransactionController.getAllFundTransactionsForGuest)
router.get('/get-chart-data', TransactionController.getChartData)
router.get('/get-all-funds', TransactionController.getAllFunds)
router.get('/get-all-normal-money', TransactionController.getAllNormalMoney)
router.post('/confirm-donation', TransactionController.confirmDonation)
router.post('/confirm-item-donation', TransactionController.confirmItemDonation)
router.post('/reject-donation', TransactionController.rejectDonation)
router.post('/reject-item-donation', TransactionController.rejectItemDonation)
router.post('/guest-make-item-donation', TransactionController.makeItemDonation)

module.exports = router;