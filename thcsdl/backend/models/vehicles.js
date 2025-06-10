const pool = require('../utils/database');

class Vehicle {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Vehicles');
    return rows;
  }

  static async findById(LicensePlate) {
    const [rows] = await pool.query('SELECT * FROM Vehicles WHERE LicensePlate = ?', [LicensePlate]);
    return rows[0];
  }

  static async create({ LicensePlate, CustomerID, Type, Brand, Color }) {
    const [result] = await pool.query(
      'INSERT INTO Vehicles (LicensePlate, CustomerID, Type, Brand, Color) VALUES (?, ?, ?, ?, ?)',
      [LicensePlate, CustomerID, Type, Brand, Color]
    );
    const [newVehicle] = await pool.query('SELECT * FROM Vehicles WHERE LicensePlate = ?', [LicensePlate]);
    return newVehicle[0];
  }

  static async update(LicensePlate, { CustomerID, Type, Brand, Color }) {
    const [result] = await pool.query(
      'UPDATE Vehicles SET CustomerID = ?, Type = ?, Brand = ?, Color = ? WHERE LicensePlate = ?',
      [CustomerID, Type, Brand, Color, LicensePlate]
    );
    if (result.affectedRows === 0) {
      throw new Error('Vehicle not found');
    }
    const [updatedVehicle] = await pool.query('SELECT * FROM Vehicles WHERE LicensePlate = ?', [LicensePlate]);
    return updatedVehicle[0];
  }

  static async delete(LicensePlate) {
    const [result] = await pool.query('DELETE FROM Vehicles WHERE LicensePlate = ?', [LicensePlate]);
    if (result.affectedRows === 0) {
      throw new Error('Vehicle not found');
    }
  }

  static async findByLicensePlate(licensePlate) {
    const [rows] = await pool.query('SELECT * FROM Vehicles WHERE LicensePlate = ?', [licensePlate]);
    return rows[0];
  }
}

module.exports = Vehicle;