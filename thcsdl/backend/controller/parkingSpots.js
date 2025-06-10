const ParkingSpot = require('../models/parkingSpots');

exports.getParkingSpots = async (req, res) => {
  try {
    const parkingSpots = await ParkingSpot.findAll();
    res.json(parkingSpots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getParkingSpot = async (req, res) => {
  const { ParkingSpotID } = req.params;
  try {
    const parkingSpot = await ParkingSpot.findById(ParkingSpotID);
    if (!parkingSpot) {
      return res.status(404).json({ error: 'Parking spot not found' });
    }
    res.json(parkingSpot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createParkingSpot = async (req, res) => {
  const { SpotType, Status, ParkID, LicensePlate, StartTime, EndTime } = req.body;
  if (!SpotType || !Status || !ParkID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newParkingSpot = await ParkingSpot.create({ SpotType, Status, ParkID, LicensePlate, StartTime, EndTime });
    res.status(201).json(newParkingSpot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateParkingSpot = async (req, res) => {
  const { ParkingSpotID } = req.params;
  const { SpotType, Status, ParkID, LicensePlate, StartTime, EndTime } = req.body;
  if (!SpotType || !Status || !ParkID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedParkingSpot = await ParkingSpot.update(ParkingSpotID, { SpotType, Status, ParkID, LicensePlate, StartTime, EndTime });
    res.json(updatedParkingSpot);
  } catch (error) {
    console.error(error);
    if (error.message === 'Parking spot not found') {
      return res.status(404).json({ error: 'Parking spot not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteParkingSpot = async (req, res) => {
  const { ParkingSpotID } = req.params;
  try {
    await ParkingSpot.delete(ParkingSpotID);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Parking spot not found') {
      return res.status(404).json({ error: 'Parking spot not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};