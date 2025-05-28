const pool = require('../utils/database');

class ParkingLot {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM ParkingLot');
    return rows;
  }

  static async findById(ParkID) {
    const [rows] = await pool.query('SELECT * FROM ParkingLot WHERE ParkID = ?', [ParkID]);
    return rows[0];
  }

  static async create({ ParkName, Address, TotalSpots }) {
    const [result] = await pool.query(
      'INSERT INTO ParkingLot (ParkName, Address, TotalSpots) VALUES (?, ?, ?)',
      [ParkName, Address, TotalSpots]
    );
    const [newParkingLot] = await pool.query('SELECT * FROM ParkingLot WHERE ParkID = ?', [result.insertId]);
    return newParkingLot[0];
  }

  static async update(ParkID, { ParkName, Address, TotalSpots }) {
    const [result] = await pool.query(
      'UPDATE ParkingLot SET ParkName = ?, Address = ?, TotalSpots = ? WHERE ParkID = ?',
      [ParkName, Address, TotalSpots, ParkID]
    );
    if (result.affectedRows === 0) {
      throw new Error('Parking lot not found');
    }
    const [updatedParkingLot] = await pool.query('SELECT * FROM ParkingLot WHERE ParkID = ?', [ParkID]);
    return updatedParkingLot[0];
  }

  static async delete(ParkID) {
    const [result] = await pool.query('DELETE FROM ParkingLot WHERE ParkID = ?', [ParkID]);
    if (result.affectedRows === 0) {
      throw new Error('Parking lot not found');
    }
  }
}

module.exports = ParkingLot;