const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers');
const authenticateToken = require('../middleware/auth');

router.get('/customers', authenticateToken, customerController.getCustomers);
router.get('/customers/:CustomerID', authenticateToken, customerController.getCustomer);
router.post('/customers', authenticateToken, customerController.createCustomer);
router.put('/customers/:CustomerID', authenticateToken, customerController.updateCustomer);
router.delete('/customers/:CustomerID', authenticateToken, customerController.deleteCustomer);

module.exports = router;