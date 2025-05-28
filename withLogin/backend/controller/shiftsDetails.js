const ShiftsDetail = require('../models/shiftsDetails');

exports.getShiftsDetails = async (req, res) => {
  try {
    const shiftsDetails = await ShiftsDetail.findAll();
    res.json(shiftsDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getShiftsDetail = async (req, res) => {
  const { EmployeeID, ShiftID } = req.params;
  try {
    const shiftsDetail = await ShiftsDetail.findById(EmployeeID, ShiftID);
    if (!shiftsDetail) {
      return res.status(404).json({ error: 'Shifts detail not found' });
    }
    res.json(shiftsDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createShiftsDetail = async (req, res) => {
  const { EmployeeID, ShiftID } = req.body;
  if (!EmployeeID || !ShiftID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newShiftsDetail = await ShiftsDetail.create({ EmployeeID, ShiftID });
    res.status(201).json(newShiftsDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteShiftsDetail = async (req, res) => {
  const { EmployeeID, ShiftID } = req.params;
  try {
    await ShiftsDetail.delete(EmployeeID, ShiftID);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Shifts detail not found') {
      return res.status(404).json({ error: 'Shifts detail not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};