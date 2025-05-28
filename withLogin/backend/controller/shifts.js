const Shift = require('../models/shifts');

exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.findAll();
    res.json(shifts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getShift = async (req, res) => {
  const { ShiftID } = req.params;
  try {
    const shift = await Shift.findById(ShiftID);
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }
    res.json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createShift = async (req, res) => {
  const { ShiftName, StartTime, EndTime } = req.body;
  if (!ShiftName || !StartTime || !EndTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newShift = await Shift.create({ ShiftName, StartTime, EndTime });
    res.status(201).json(newShift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateShift = async (req, res) => {
  const { ShiftID } = req.params;
  const { ShiftName, StartTime, EndTime } = req.body;
  if (!ShiftName || !StartTime || !EndTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedShift = await Shift.update(ShiftID, { ShiftName, StartTime, EndTime });
    res.json(updatedShift);
  } catch (error) {
    console.error(error);
    if (error.message === 'Shift not found') {
      return res.status(404).json({ error: 'Shift not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteShift = async (req, res) => {
  const { ShiftID } = req.params;
  try {
    await Shift.delete(ShiftID);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Shift not found') {
      return res.status(404).json({ error: 'Shift not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};