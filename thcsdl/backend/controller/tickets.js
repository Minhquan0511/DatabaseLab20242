const Ticket = require('../models/tickets');
const ParkingSpot = require('../models/parkingSpots');
const Vehicle = require('../models/vehicles');

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTicket = async (req, res) => {
  const { TicketID } = req.params;
  try {
    const ticket = await Ticket.findById(TicketID);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createTicket = async (req, res) => {
  const { LicensePlate, IssuedTime, ExpiredTime, ServiceID, ParkingSpotID } = req.body;
  if (!LicensePlate || !IssuedTime || !ExpiredTime || !ServiceID || !ParkingSpotID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const vehicle = await Vehicle.findByLicensePlate(LicensePlate);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    const spot = await ParkingSpot.findById(ParkingSpotID);
    if (!spot || spot.Status !== 'Available') {
      return res.status(400).json({ error: 'Selected parking spot is not available' });
    }

    const newTicket = await Ticket.create({
      LicensePlate,
      IssuedTime,
      ExpiredTime,
      ServiceID,
      ParkingSpotID
    });

    // Update parking spot status
    await ParkingSpot.update(ParkingSpotID, {
      Status: 'Occupied',
      LicensePlate,
      StartTime: IssuedTime,
      EndTime: ExpiredTime
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateTicket = async (req, res) => {
  const { TicketID } = req.params;
  const { LicensePlate, IssuedTime, ExpiredTime, ServiceID } = req.body;
  console.log('Update ticket:', { TicketID, LicensePlate, IssuedTime, ExpiredTime, ServiceID });
  if (!LicensePlate || !IssuedTime || !ExpiredTime || !ServiceID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedTicket = await Ticket.update(TicketID, { LicensePlate, IssuedTime, ExpiredTime, ServiceID });
    res.json(updatedTicket);
  } catch (error) {
    console.error(error);
    if (error.message === 'Ticket not found') {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteTicket = async (req, res) => {
  const { TicketID } = req.params;
  try {
    await Ticket.delete(TicketID);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Ticket not found') {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};