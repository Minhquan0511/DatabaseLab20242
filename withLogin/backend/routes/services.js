const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services');
const authenticateToken = require('../middleware/auth');

router.get('/services', authenticateToken, serviceController.getServices);
router.get('/services/:ServiceID', authenticateToken, serviceController.getService);
router.post('/services', authenticateToken, serviceController.createService);
router.put('/services/:ServiceID', authenticateToken, serviceController.updateService);
router.delete('/services/:ServiceID', authenticateToken, serviceController.deleteService);

module.exports = router;