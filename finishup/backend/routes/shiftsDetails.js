const express = require('express');
const router = express.Router();
const shiftsDetailController = require('../controller/shiftsDetails');
const authenticateToken = require('../middleware/auth');

router.get('/shifts-details', authenticateToken, shiftsDetailController.getShiftsDetails);
router.get('/shifts-details/:EmployeeID/:ShiftID', authenticateToken, shiftsDetailController.getShiftsDetail);
router.post('/shifts-details', authenticateToken, shiftsDetailController.createShiftsDetail);
router.delete('/shifts-details/:EmployeeID/:ShiftID', authenticateToken, shiftsDetailController.deleteShiftsDetail);

module.exports = router;