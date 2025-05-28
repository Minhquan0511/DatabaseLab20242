const Vehicle = require('../models/vehicles');

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVehicle = async (req, res) => {
  const { LicensePlate } = req.params;
  try {
    const vehicle = await Vehicle.findById(LicensePlate);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createVehicle = async (req, res) => {
  const { LicensePlate, CustomerID, Type, Brand, Color } = req.body;
  if (!LicensePlate || !CustomerID || !Type || !Brand || !Color) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newVehicle = await Vehicle.create({ LicensePlate, CustomerID, Type, Brand, Color });
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateVehicle = async (req, res) => {
  const { LicensePlate } = req.params;
  const { CustomerID, Type, Brand, Color } = req.body;
  if (!CustomerID || !Type || !Brand || !Color) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedVehicle = await Vehicle.update(LicensePlate, { CustomerID, Type, Brand, Color });
    res.json(updatedVehicle);
  } catch (error) {
    console.error(error);
    if (error.message === 'Vehicle not found') {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteVehicle = async (req, res) => {
  const { LicensePlate } = req.params;
  try {
    await Vehicle.delete(LicensePlate);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Vehicle not found') {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};