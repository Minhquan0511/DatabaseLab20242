const pool = require('../utils/database');

class Dashboard {
  static async getStats() {
    // Total customers
    const [[{ totalCustomers }]] = await pool.query('SELECT COUNT(*) AS totalCustomers FROM Customers');
    // Total vehicles
    const [[{ totalVehicles }]] = await pool.query('SELECT COUNT(*) AS totalVehicles FROM Vehicles');
    // Occupied spots
    const [[{ occupiedSpots }]] = await pool.query('SELECT COUNT(*) AS occupiedSpots FROM ParkingSpot WHERE Status = "Occupied"');
    // Total spots
    const [[{ totalSpots }]] = await pool.query('SELECT COUNT(*) AS totalSpots FROM ParkingSpot');
    // Today's revenue: sum of service prices for tickets issued today
    const [[{ totalRevenue }]] = await pool.query(`
      SELECT IFNULL(SUM(s.ServicePrice),0) AS totalRevenue
      FROM Tickets t
      JOIN Services s ON t.ServiceID = s.ServiceID
      WHERE DATE(t.IssuedTime) = CURDATE()
    `);
    // Active employees
    const [[{ activeEmployees }]] = await pool.query('SELECT COUNT(*) AS activeEmployees FROM Employees');
    // Tickets issued today
    const [[{ todayTickets }]] = await pool.query('SELECT COUNT(*) AS todayTickets FROM Tickets WHERE DATE(IssuedTime) = CURDATE()');

    // Recent activity
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
      totalCustomers: Number(totalCustomers),
      totalVehicles: Number(totalVehicles),
      occupiedSpots: Number(occupiedSpots),
      totalSpots: Number(totalSpots),
      totalRevenue: Number(totalRevenue), // This is today's revenue
      activeEmployees: Number(activeEmployees),
      todayTickets: Number(todayTickets),
      recentActivity,
    };
  }
}

module.exports = Dashboard;