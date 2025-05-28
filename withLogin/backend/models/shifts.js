const pool = require('../utils/database');

class Shift {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Shifts');
    return rows;
  }

  static async findById(ShiftID) {
    const [rows] = await pool.query('SELECT * FROM Shifts WHERE ShiftID = ?', [ShiftID]);
    return rows[0];
  }

  static async create({ ShiftName, StartTime, EndTime }) {
    const [result] = await pool.query(
      'INSERT INTO Shifts (ShiftName, StartTime, EndTime) VALUES (?, ?, ?)',
      [ShiftName, StartTime, EndTime]
    );
    const [newShift] = await pool.query('SELECT * FROM Shifts WHERE ShiftID = ?', [result.insertId]);
    return newShift[0];
  }

  static async update(ShiftID, { ShiftName, StartTime, EndTime }) {
    const [result] = await pool.query(
      'UPDATE Shifts SET ShiftName = ?, StartTime = ?, EndTime = ? WHERE ShiftID = ?',
      [ShiftName, StartTime, EndTime, ShiftID]
    );
    if (result.affectedRows === 0) {
      throw new Error('Shift not found');
    }
    const [updatedShift] = await pool.query('SELECT * FROM Shifts WHERE ShiftID = ?', [ShiftID]);
    return updatedShift[0];
  }

  static async delete(ShiftID) {
    const [result] = await pool.query('DELETE FROM Shifts WHERE ShiftID = ?', [ShiftID]);
    if (result.affectedRows === 0) {
      throw new Error('Shift not found');
    }
  }
}

module.exports = Shift;