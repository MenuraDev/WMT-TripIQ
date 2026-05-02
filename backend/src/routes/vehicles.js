const express = require('express');
const Vehicle = require('../models/Vehicle');
const { protectDriver } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/vehicles
// @desc    Add a new vehicle
// @access  Private (Driver only)
router.post('/', protectDriver, async (req, res) => {
  try {
    const { type, capacity, pricePerKm, condition } = req.body;

    if (!type || !capacity || !pricePerKm || !condition) {
      return res.status(400).json({ success: false, message: 'Please provide all vehicle details' });
    }

    const vehicle = await Vehicle.create({
      driverId: req.driver._id,
      type,
      capacity,
      pricePerKm,
      condition,
    });

    res.status(201).json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/vehicles/me
// @desc    Get all vehicles for the logged in driver
// @access  Private (Driver only)
router.get('/me', protectDriver, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ driverId: req.driver._id }).sort({ createdAt: -1 });
    res.json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
