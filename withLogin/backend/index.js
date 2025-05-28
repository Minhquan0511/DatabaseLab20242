const express = require('express');
const cors = require('cors');
const customersRoutes = require('./routes/customers');
const employeesRoutes = require('./routes/employees');
const parkingLotsRoutes = require('./routes/parkingLots');
const parkingSpotsRoutes = require('./routes/parkingSpots');
const serviceRegistrationsRoutes = require('./routes/serviceRegistrations');
const servicesRoutes = require('./routes/services');
const shiftsRoutes = require('./routes/shifts');
const shiftsDetailsRoutes = require('./routes/shiftsDetails');
const ticketsRoutes = require('./routes/tickets');
const usersRoutes = require('./routes/users');
const vehiclesRoutes = require('./routes/vehicles');
require('dotenv').config();

const app = express();

// CORS configuration for frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
}));

// Parse JSON bodies with strict mode to prevent parsing errors
app.use(express.json({ strict: true }));

// Mount all routes
app.use('/api', customersRoutes);
app.use('/api', employeesRoutes);
app.use('/api', parkingLotsRoutes);
app.use('/api', parkingSpotsRoutes);
app.use('/api', serviceRegistrationsRoutes);
app.use('/api', servicesRoutes);
app.use('/api', shiftsRoutes);
app.use('/api', shiftsDetailsRoutes);
app.use('/api', ticketsRoutes);
app.use('/api', usersRoutes);
app.use('/api', vehiclesRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});