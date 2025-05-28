const express = require('express');
const router = express.Router();
const serviceRegistrationController = require('../controller/serviceRegistrations');
const authenticateToken = require('../middleware/auth');

router.get('/service-registrations', authenticateToken, serviceRegistrationController.getServiceRegistrations);
router.get('/service-registrations/:ServiceID/:LicensePlate', authenticateToken, serviceRegistrationController.getServiceRegistration);
router.post('/service-registrations', authenticateToken, serviceRegistrationController.createServiceRegistration);
router.delete('/service-registrations/:ServiceID/:LicensePlate', authenticateToken, serviceRegistrationController.deleteServiceRegistration);

module.exports = router;