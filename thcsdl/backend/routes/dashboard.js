// filepath: backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboard');

router.get('/stats', dashboardController.getStats);

module.exports = router;