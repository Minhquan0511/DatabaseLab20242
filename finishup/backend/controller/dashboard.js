const Dashboard = require('../models/dashboard');

exports.getStats = async (req, res) => {
  try {
    const stats = await Dashboard.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error); // Thêm dòng này để log lỗi chi tiết
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};