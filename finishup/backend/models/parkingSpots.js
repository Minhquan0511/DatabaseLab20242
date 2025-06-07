const pool = require('../utils/database');

class ParkingSpot {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM ParkingSpot');
    return rows;
  }

  static async findById(ParkingSpotID) {
    const [rows] = await pool.query('SELECT * FROM ParkingSpot WHERE ParkingSpotID = ?', [ParkingSpotID]);
    return rows[0];
  }

  static async create({ SpotType, Status, ParkID, LicensePlate, StartTime, EndTime }) {
    const [result] = await pool.query(
      'INSERT INTO ParkingSpot (SpotType, Status, ParkID, LicensePlate, StartTime, EndTime) VALUES (?, ?, ?, ?, ?, ?)',
      [SpotType, Status, ParkID, LicensePlate, StartTime, EndTime]
    );
    const [newParkingSpot] = await pool.query('SELECT * FROM ParkingSpot WHERE ParkingSpotID = ?', [result.insertId]);
    return newParkingSpot[0];
  }

  static async update(ParkingSpotID, { SpotType, Status, ParkID, LicensePlate, StartTime, EndTime }) {
    const [result] = await pool.query(
      'UPDATE ParkingSpot SET SpotType = ?, Status = ?, ParkID = ?, LicensePlate = ?, StartTime = ?, EndTime = ? WHERE ParkingSpotID = ?',
      [SpotType, Status, ParkID, LicensePlate, StartTime, EndTime, ParkingSpotID]
    );
    if (result.affectedRows === 0) {
      throw new Error('Parking spot not found');
    }
    const [updatedParkingSpot] = await pool.query('SELECT * FROM ParkingSpot WHERE ParkingSpotID = ?', [ParkingSpotID]);
    return updatedParkingSpot[0];
  }

  static async delete(ParkingSpotID) {
    const [result] = await pool.query('DELETE FROM ParkingSpot WHERE ParkingSpotID = ?', [ParkingSpotID]);
    if (result.affectedRows === 0) {
      throw new Error('Parking spot not found');
    }
  }
}

module.exports = ParkingSpot;