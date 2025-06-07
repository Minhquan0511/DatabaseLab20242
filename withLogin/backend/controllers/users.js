// backend/controllers/users.js
const User = require('../models/users'); // Đường dẫn chính xác đến models/users.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Hoặc const generateToken = require('../utils/generateToken'); nếu bạn tạo file riêng

// @desc    Đăng nhập người dùng & trả về token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => { // Tên hàm khớp với routes
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Sử dụng hàm comparePassword từ User model của bạn
    const isMatch = await User.comparePassword(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Tạo JWT token
    const token = jwt.sign({ userId: user.UserID, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Hoặc sử dụng hàm generateToken nếu bạn đã tạo file riêng:
    // const token = generateToken(user.UserID);


    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        userID: user.UserID,
        email: user.Email
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Đăng nhập thất bại. Vui lòng thử lại sau.' });
  }
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => { // Tên hàm khớp với routes
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã tồn tại.' });
    }

    const newUser = await User.create({ email, password });
    res.status(201).json({
      message: 'Đăng ký thành công!',
      userID: newUser.UserID,
      email: newUser.Email
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Đăng ký thất bại. Vui lòng thử lại sau.' });
  }
};