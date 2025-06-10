const ParkingLot = require('../models/parkingLots');

exports.getParkingLots = async (req, res) => {
  try {
    const parkingLots = await ParkingLot.findAll();
    res.json(parkingLots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getParkingLot = async (req, res) => {
  const { ParkID } = req.params;
  try {
    const parkingLot = await ParkingLot.findById(ParkID);
    if (!parkingLot) {
      return res.status(404).json({ error: 'Parking lot not found' });
    }
    res.json(parkingLot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createParkingLot = async (req, res) => {
  const { ParkName, Address, TotalSpots } = req.body;
  if (!ParkName || !Address || !TotalSpots) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newParkingLot = await ParkingLot.create({ ParkName, Address, TotalSpots });
    res.status(201).json(newParkingLot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateParkingLot = async (req, res) => {
  const { ParkID } = req.params;
  const { ParkName, Address, TotalSpots } = req.body;
  if (!ParkName || !Address || !TotalSpots) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedParkingLot = await ParkingLot.update(ParkID, { ParkName, Address, TotalSpots });
    res.json(updatedParkingLot);
  } catch (error) {
    console.error(error);
    if (error.message === 'Parking lot not found') {
      return res.status(404).json({ error: 'Parking lot not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteParkingLot = async (req, res) => {
  const { ParkID } = req.params;
  try {
    await ParkingLot.delete(ParkID);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Parking lot not found') {
      return res.status(404).json({ error: 'Parking lot not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};