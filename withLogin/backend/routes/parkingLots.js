const express = require('express');
const router = express.Router();
const parkingLotController = require('../controller/parkingLots');
const authenticateToken = require('../middleware/auth');

router.get('/parking-lots', authenticateToken, parkingLotController.getParkingLots);
router.get('/parking-lots/:ParkID', authenticateToken, parkingLotController.getParkingLot);
router.post('/parking-lots', authenticateToken, parkingLotController.createParkingLot);
router.put('/parking-lots/:ParkID', authenticateToken, parkingLotController.updateParkingLot);
router.delete('/parking-lots/:ParkID', authenticateToken, parkingLotController.deleteParkingLot);

module.exports = router;