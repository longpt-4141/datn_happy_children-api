const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/NewsController')

router.get('/topic-and-funds', NewsController.getAllTopicAndFunds)
router.put('/:id/edit', NewsController.updateArticle)
router.put('/:id/confirm-article', NewsController.confirmArticle)
router.delete('/:id/delete-article', NewsController.deleteArticle)
router.get('/:id', NewsController.getSpecificArticle)
router.post('/add', NewsController.createNewArticle)
router.get('/', NewsController.getAllArticles);

module.exports = router;