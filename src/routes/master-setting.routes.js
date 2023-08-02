const express = require('express');
const FundController = require('../controllers/FundController');
const TopicController = require('../controllers/TopicController');
const router = express.Router();

router.post('/funds/add', FundController.createNewFund )
router.put('/funds/:id/update', FundController.editFund )
router.delete('/funds/:id/delete', FundController.deleteFund )
router.get('/funds/:id', FundController.getSpecificFund )
router.get('/funds', FundController.getAllFunds )

/* topic */

router.post('/topics/add', TopicController.createNewTopic )
router.put('/topics/:id/update', TopicController.editTopic )
router.delete('/topics/:id/delete', TopicController.deleteTopic )
router.get('/topics/:id', TopicController.getSpecificTopic )
router.get('/topics', TopicController.getAllTopics )

module.exports = router;