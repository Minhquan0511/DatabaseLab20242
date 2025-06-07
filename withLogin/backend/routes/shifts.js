const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shifts');
const authenticateToken = require('../middleware/auth');

router.get('/shifts', authenticateToken, shiftController.getShifts);
router.get('/shifts/:ShiftID', authenticateToken, shiftController.getShift);
router.post('/shifts', authenticateToken, shiftController.createShift);
router.put('/shifts/:ShiftID', authenticateToken, shiftController.updateShift);
router.delete('/shifts/:ShiftID', authenticateToken, shiftController.deleteShift);

module.exports = router;