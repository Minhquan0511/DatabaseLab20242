const pool = require('../utils/database');

class Service {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Services');
    return rows;
  }

  static async findById(ServiceID) {
    const [rows] = await pool.query('SELECT * FROM Services WHERE ServiceID = ?', [ServiceID]);
    return rows[0];
  }

  static async create({ ServiceName, ServicePrice, VehicleType }) {
    const [result] = await pool.query(
      'INSERT INTO Services (ServiceName, ServicePrice, VehicleType) VALUES (?, ?, ?)',
      [ServiceName, ServicePrice, VehicleType]
    );
    const [newService] = await pool.query('SELECT * FROM Services WHERE ServiceID = ?', [result.insertId]);
    return newService[0];
  }

  static async update(ServiceID, { ServiceName, ServicePrice, VehicleType }) {
    const [result] = await pool.query(
      'UPDATE Services SET ServiceName = ?, ServicePrice = ?, VehicleType = ? WHERE ServiceID = ?',
      [ServiceName, ServicePrice, VehicleType, ServiceID]
    );
    if (result.affectedRows === 0) {
      throw new Error('Service not found');
    }
    const [updatedService] = await pool.query('SELECT * FROM Services WHERE ServiceID = ?', [ServiceID]);
    return updatedService[0];
  }

  static async delete(ServiceID) {
    const [result] = await pool.query('DELETE FROM Services WHERE ServiceID = ?', [ServiceID]);
    if (result.affectedRows === 0) {
      throw new Error('Service not found');
    }
  }
}

module.exports = Service;