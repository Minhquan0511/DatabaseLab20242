const pool = require('../utils/database');
const bcrypt = require('bcrypt');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Users WHERE Email = ?', [email]);
    return rows[0];
  }

  static async create({ email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO Users (Email, Password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    const [newUser] = await pool.query('SELECT UserID, Email FROM Users WHERE UserID = ?', [result.insertId]);
    return newUser[0];
  }
}

module.exports = User;