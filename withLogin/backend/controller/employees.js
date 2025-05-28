const Employee = require('../models/employees');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getEmployee = async (req, res) => {
  const { EmployeeID } = req.params;
  try {
    const employee = await Employee.findById(EmployeeID);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createEmployee = async (req, res) => {
  const { FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate } = req.body;
  if (!FirstName || !LastName || !PhoneNumber || !Salary || !JobTitle || !BirthDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newEmployee = await Employee.create({ FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  const { EmployeeID } = req.params;
  const { FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate } = req.body;
  if (!FirstName || !LastName || !PhoneNumber || !Salary || !JobTitle || !BirthDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedEmployee = await Employee.update(EmployeeID, { FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate });
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    if (error.message === 'Employee not found') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { EmployeeID } = req.params;
  try {
    await Employee.delete(EmployeeID);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Employee not found') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};