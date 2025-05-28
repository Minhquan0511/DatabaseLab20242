const express = require('express');
const router = express.Router();
const userController = require('../controller/users');

router.post('/auth/login', userController.login);
router.post('/users', userController.createUser);

module.exports = router;