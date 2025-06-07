const pool = require('../utils/database');

class ServiceRegistration {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM ServiceRegistration');
    return rows;
  }

  static async findById(ServiceID, LicensePlate) {
    const [rows] = await pool.query(
      'SELECT * FROM ServiceRegistration WHERE ServiceID = ? AND LicensePlate = ?',
      [ServiceID, LicensePlate]
    );
    return rows[0];
  }

  static async create({ ServiceID, LicensePlate }) {
    const [result] = await pool.query(
      'INSERT INTO ServiceRegistration (ServiceID, LicensePlate) VALUES (?, ?)',
      [ServiceID, LicensePlate]
    );
    const [newRegistration] = await pool.query(
      'SELECT * FROM ServiceRegistration WHERE ServiceID = ? AND LicensePlate = ?',
      [ServiceID, LicensePlate]
    );
    return newRegistration[0];
  }

  static async delete(ServiceID, LicensePlate) {
    const [result] = await pool.query(
      'DELETE FROM ServiceRegistration WHERE ServiceID = ? AND LicensePlate = ?',
      [ServiceID, LicensePlate]
    );
    if (result.affectedRows === 0) {
      throw new Error('Service registration not found');
    }
  }
}

module.exports = ServiceRegistration;