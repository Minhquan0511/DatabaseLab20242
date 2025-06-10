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

  static async update(ParkingSpotID, { Status, LicensePlate, StartTime, EndTime }) {
    await pool.query(
      'UPDATE ParkingSpot SET Status = ?, LicensePlate = ?, StartTime = ?, EndTime = ? WHERE ParkingSpotID = ?',
      [Status, LicensePlate, StartTime, EndTime, ParkingSpotID]
    );
  }

  static async delete(ParkingSpotID) {
    const [result] = await pool.query('DELETE FROM ParkingSpot WHERE ParkingSpotID = ?', [ParkingSpotID]);
    if (result.affectedRows === 0) {
      throw new Error('Parking spot not found');
    }
  }

  static async findAvailableByType(vehicleType) {
    const [rows] = await pool.query(
      'SELECT * FROM ParkingSpot WHERE SpotType = ? AND Status = "Available" LIMIT 1',
      [vehicleType]
    );
    return rows[0];
  }
}

module.exports = ParkingSpot;