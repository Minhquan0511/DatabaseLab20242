const Customer = require('../models/customers');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomer = async (req, res) => {
  const { CustomerID } = req.params;
  try {
    const customer = await Customer.findById(CustomerID);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCustomer = async (req, res) => {
  const { FirstName, LastName, PhoneNumber, Address } = req.body;
  if (!FirstName || !LastName || !PhoneNumber || !Address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newCustomer = await Customer.create({ FirstName, LastName, PhoneNumber, Address });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCustomer = async (req, res) => {
  const { CustomerID } = req.params;
  const { FirstName, LastName, PhoneNumber, Address } = req.body;
  if (!FirstName || !LastName || !PhoneNumber || !Address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedCustomer = await Customer.update(CustomerID, { FirstName, LastName, PhoneNumber, Address });
    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { CustomerID } = req.params;
  try {
    await Customer.delete(CustomerID);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};