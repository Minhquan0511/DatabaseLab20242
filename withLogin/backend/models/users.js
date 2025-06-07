// backend/models/User.js
const pool = require('../utils/database'); // Đảm bảo đường dẫn đúng đến file database.js của bạn
const bcrypt = require('bcrypt');

class User {
  // Tìm người dùng theo Email
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Users WHERE Email = ?', [email]);
    return rows[0]; // Trả về hàng đầu tiên (người dùng) nếu tìm thấy
  }

  // Tạo người dùng mới
  static async create({ email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu
    const [result] = await pool.query(
      'INSERT INTO Users (Email, Password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    // Sau khi insert, lấy lại thông tin người dùng bao gồm UserID và Email để trả về
    const [newUser] = await pool.query('SELECT UserID, Email FROM Users WHERE UserID = ?', [result.insertId]);
    return newUser[0];
  }

  // So sánh mật khẩu gốc với mật khẩu đã mã hóa
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;