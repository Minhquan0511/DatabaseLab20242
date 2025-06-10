const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/vehicles');
const authenticateToken = require('../middleware/auth');

router.get('/vehicles', authenticateToken, vehicleController.getVehicles);
router.get('/vehicles/:LicensePlate', authenticateToken, vehicleController.getVehicle);
router.post('/vehicles', authenticateToken, vehicleController.createVehicle);
router.put('/vehicles/:LicensePlate', authenticateToken, vehicleController.updateVehicle);
router.delete('/vehicles/:LicensePlate', authenticateToken, vehicleController.deleteVehicle);

module.exports = router;