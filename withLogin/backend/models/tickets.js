const pool = require('../utils/database');

class Ticket {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Tickets');
    return rows;
  }

  static async findById(TicketID) {
    const [rows] = await pool.query('SELECT * FROM Tickets WHERE TicketID = ?', [TicketID]);
    return rows[0];
  }

  static async create({ LicensePlate, IssuedTime, ExpiredTime, ServiceID }) {
    const [result] = await pool.query(
      'INSERT INTO Tickets (LicensePlate, IssuedTime, ExpiredTime, ServiceID) VALUES (?, ?, ?, ?)',
      [LicensePlate, IssuedTime, ExpiredTime, ServiceID]
    );
    const [newTicket] = await pool.query('SELECT * FROM Tickets WHERE TicketID = ?', [result.insertId]);
    return newTicket[0];
  }

  static async update(TicketID, { LicensePlate, IssuedTime, ExpiredTime, ServiceID }) {
    const [result] = await pool.query(
      'UPDATE Tickets SET LicensePlate = ?, IssuedTime = ?, ExpiredTime = ?, ServiceID = ? WHERE TicketID = ?',
      [LicensePlate, IssuedTime, ExpiredTime, ServiceID, TicketID]
    );
    if (result.affectedRows === 0) {
      throw new Error('Ticket not found');
    }
    const [updatedTicket] = await pool.query('SELECT * FROM Tickets WHERE TicketID = ?', [TicketID]);
    return updatedTicket[0];
  }

  static async delete(TicketID) {
    const [result] = await pool.query('DELETE FROM Tickets WHERE TicketID = ?', [TicketID]);
    if (result.affectedRows === 0) {
      throw new Error('Ticket not found');
    }
  }
}

module.exports = Ticket;