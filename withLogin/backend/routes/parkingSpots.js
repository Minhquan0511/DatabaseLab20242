const express = require('express');
const router = express.Router();
const parkingSpotController = require('../controller/parkingSpots');
const authenticateToken = require('../middleware/auth');

router.get('/parking-spots', authenticateToken, parkingSpotController.getParkingSpots);
router.get('/parking-spots/:ParkingSpotID', authenticateToken, parkingSpotController.getParkingSpot);
router.post('/parking-spots', authenticateToken, parkingSpotController.createParkingSpot);
router.put('/parking-spots/:ParkingSpotID', authenticateToken, parkingSpotController.updateParkingSpot);
router.delete('/parking-spots/:ParkingSpotID', authenticateToken, parkingSpotController.deleteParkingSpot);

module.exports = router;