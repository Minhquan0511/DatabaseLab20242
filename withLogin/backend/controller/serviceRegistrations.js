const ServiceRegistration = require('../models/serviceRegistrations');

exports.getServiceRegistrations = async (req, res) => {
  try {
    const registrations = await ServiceRegistration.findAll();
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getServiceRegistration = async (req, res) => {
  const { ServiceID, LicensePlate } = req.params;
  try {
    const registration = await ServiceRegistration.findById(ServiceID, LicensePlate);
    if (!registration) {
      return res.status(404).json({ error: 'Service registration not found' });
    }
    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createServiceRegistration = async (req, res) => {
  const { ServiceID, LicensePlate } = req.body;
  if (!ServiceID || !LicensePlate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newRegistration = await ServiceRegistration.create({ ServiceID, LicensePlate });
    res.status(201).json(newRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteServiceRegistration = async (req, res) => {
  const { ServiceID, LicensePlate } = req.params;
  try {
    await ServiceRegistration.delete(ServiceID, LicensePlate);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Service registration not found') {
      return res.status(404).json({ error: 'Service registration not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};