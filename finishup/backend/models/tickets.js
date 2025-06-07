const pool = require('../utils/database');

function toMySQLDateTime(isoString) {
  const date = new Date(isoString);
  const pad = n => n < 10 ? '0' + n : n;
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

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
    const issuedTimeMySQL = toMySQLDateTime(IssuedTime);
    const expiredTimeMySQL = toMySQLDateTime(ExpiredTime);

    // Lấy giá dịch vụ
    const [serviceRows] = await pool.query('SELECT ServicePrice FROM Services WHERE ServiceID = ?', [ServiceID]);
    const Amount = serviceRows[0]?.ServicePrice || 0;

    const [result] = await pool.query(
      'INSERT INTO Tickets (LicensePlate, IssuedTime, ExpiredTime, ServiceID) VALUES (?, ?, ?, ?)',
      [LicensePlate, issuedTimeMySQL, expiredTimeMySQL, ServiceID]
    );
    const [newTicket] = await pool.query('SELECT * FROM Tickets WHERE TicketID = ?', [result.insertId]);
    return newTicket[0];
  }

  static async update(TicketID, { LicensePlate, IssuedTime, ExpiredTime, ServiceID }) {
    const issuedTimeMySQL = toMySQLDateTime(IssuedTime);
    const expiredTimeMySQL = toMySQLDateTime(ExpiredTime);
    const [result] = await pool.query(
      'UPDATE Tickets SET LicensePlate = ?, IssuedTime = ?, ExpiredTime = ?, ServiceID = ? WHERE TicketID = ?',
      [LicensePlate, issuedTimeMySQL, expiredTimeMySQL, ServiceID, TicketID]
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