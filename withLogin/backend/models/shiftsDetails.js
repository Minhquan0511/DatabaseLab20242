const pool = require('../utils/database');

class ShiftsDetail {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM ShiftsDetails');
    return rows;
  }

  static async findById(EmployeeID, ShiftID) {
    const [rows] = await pool.query(
      'SELECT * FROM ShiftsDetails WHERE EmployeeID = ? AND ShiftID = ?',
      [EmployeeID, ShiftID]
    );
    return rows[0];
  }

  static async create({ EmployeeID, ShiftID }) {
    const [result] = await pool.query(
      'INSERT INTO ShiftsDetails (EmployeeID, ShiftID) VALUES (?, ?)',
      [EmployeeID, ShiftID]
    );
    const [newShiftsDetail] = await pool.query(
      'SELECT * FROM ShiftsDetails WHERE EmployeeID = ? AND ShiftID = ?',
      [EmployeeID, ShiftID]
    );
    return newShiftsDetail[0];
  }

  static async delete(EmployeeID, ShiftID) {
    const [result] = await pool.query(
      'DELETE FROM ShiftsDetails WHERE EmployeeID = ? AND ShiftID = ?',
      [EmployeeID, ShiftID]
    );
    if (result.affectedRows === 0) {
      throw new Error('Shifts detail not found');
    }
  }
}

module.exports = ShiftsDetail;