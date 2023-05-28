const express = require('express');
const router = express.Router();
const uploadService = require('../../services/file-upload')
const centersController = require('../../controllers/CentersController')


router.delete('/:id/delete', centersController.deleteSpecificCenter)
router.get('/:id', centersController.getSpecificCenter)
router.put('/:id', centersController.editCenter)
router.post('/add', centersController.createNewCenter)
router.post('/', centersController.getAllCenter);


module.exports = router