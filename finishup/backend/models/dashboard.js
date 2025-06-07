const pool = require('../utils/database');

class Dashboard {
  static async getStats() {
    const [[{ totalCustomers }]] = await pool.query('SELECT COUNT(*) AS totalCustomers FROM Customers');
    const [[{ totalVehicles }]] = await pool.query('SELECT COUNT(*) AS totalVehicles FROM Vehicles');
    const [[{ occupiedSpots }]] = await pool.query('SELECT COUNT(*) AS occupiedSpots FROM ParkingSpot WHERE Status = "Occupied"');
    const [[{ totalSpots }]] = await pool.query('SELECT COUNT(*) AS totalSpots FROM ParkingSpot');
    // Lấy tổng doanh thu từ ServicePrice của các ticket
    const [[{ totalRevenue }]] = await pool.query(`
      SELECT IFNULL(SUM(s.ServicePrice),0) AS totalRevenue
      FROM Tickets t
      JOIN Services s ON t.ServiceID = s.ServiceID
      WHERE DATE(t.IssuedTime) = CURDATE()
    `);
    const [[{ activeEmployees }]] = await pool.query('SELECT COUNT(*) AS activeEmployees FROM Employees');
    const [[{ todayTickets }]] = await pool.query('SELECT COUNT(*) AS todayTickets FROM Tickets WHERE DATE(IssuedTime) = CURDATE()');

    const [recentActivityRows] = await pool.query(
      `SELECT t.TicketID AS id, 'Issued ticket' AS action, c.FirstName AS customer, t.LicensePlate AS license, s.ServiceName AS service, t.IssuedTime AS time
       FROM Tickets t
       LEFT JOIN Vehicles v ON t.LicensePlate = v.LicensePlate
       LEFT JOIN Customers c ON v.CustomerID = c.CustomerID
       LEFT JOIN Services s ON t.ServiceID = s.ServiceID
       ORDER BY t.IssuedTime DESC
       LIMIT 5`
    );

    const recentActivity = recentActivityRows.map(row => ({
      ...row,
      time: row.time ? new Date(row.time).toLocaleString() : "",
    }));

    return {
      totalCustomers,
      totalVehicles,
      occupiedSpots,
      totalSpots,
      totalRevenue,
      activeEmployees,
      todayTickets,
      recentActivity,
    };
  }
}

module.exports = Dashboard;