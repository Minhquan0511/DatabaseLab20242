const Service = require('../models/services');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

exports.getService = async (req, res) => {
  const { ServiceID } = req.params;
  try {
    const service = await Service.findById(ServiceID);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createService = async (req, res) => {
  const { ServiceName, ServicePrice, VehicleType } = req.body;
  if (!ServiceName || !ServicePrice || !VehicleType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newService = await Service.create({ ServiceName, ServicePrice, VehicleType });
    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateService = async (req, res) => {
  const { ServiceID } = req.params;
  const { ServiceName, ServicePrice, VehicleType } = req.body;
  if (!ServiceName || !ServicePrice || !VehicleType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedService = await Service.update(ServiceID, { ServiceName, ServicePrice, VehicleType });
    res.json(updatedService);
  } catch (error) {
    console.error(error);
    if (error.message === 'Service not found') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteService = async (req, res) => {
  const { ServiceID } = req.params;
  try {
    await Service.delete(ServiceID);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Service not found') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};