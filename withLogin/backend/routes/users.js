const express = require('express');
const router = express.Router(); // Khai báo biến 'router'
const { registerUser, loginUser } = require('../controllers/users'); // Đảm bảo đường dẫn và tên file đúng

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;