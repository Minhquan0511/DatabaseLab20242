const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employees');
const authenticateToken = require('../middleware/auth');

router.get('/employees', authenticateToken, employeeController.getEmployees);
router.get('/employees/:EmployeeID', authenticateToken, employeeController.getEmployee);
router.post('/employees', authenticateToken, employeeController.createEmployee);
router.put('/employees/:EmployeeID', authenticateToken, employeeController.updateEmployee);
router.delete('/employees/:EmployeeID', authenticateToken, employeeController.deleteEmployee);

module.exports = router;