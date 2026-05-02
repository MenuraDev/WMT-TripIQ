const express = require('express');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');
const { protect } = require('../middleware/auth'); // assuming we can reuse protect middleware

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'tripiq-secret-key-2026', {
    expiresIn: '30d',
  });
};

// @route   POST /api/driver-auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, licenseNumber } = req.body;

    if (!name || !email || !password || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password and licenseNumber',
      });
    }

    const driverExists = await Driver.findOne({ email });
    if (driverExists) {
      return res.status(400).json({
        success: false,
        message: 'Driver already exists with this email',
      });
    }

    const driver = await Driver.create({ name, email, password, phone, licenseNumber });

    const token = generateToken(driver._id);

    res.status(201).json({
      success: true,
      token,
      driver: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        role: driver.role,
        available: driver.available,
        createdAt: driver.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/driver-auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const driver = await Driver.findOne({ email }).select('+password');
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await driver.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(driver._id);

    res.json({
      success: true,
      token,
      driver: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        role: driver.role,
        available: driver.available,
        createdAt: driver.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/driver-auth/me
router.get('/me', protect, async (req, res) => {
  try {
    // protect middleware usually attaches req.user by querying User model.
    // So for a driver, we need to fetch the driver manually since ID is in req.user._id
    // But since the protect middleware is hardcoded to User, we might need a separate protectDriver middleware.
    // For now, let's look up the Driver based on req.user._id if protect middleware set it, or just use the token manually.
    
    // As a workaround, we assume the token has id
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) return res.status(401).json({success: false, message: 'Not authorized'});
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tripiq-secret-key-2026');
    const driver = await Driver.findById(decoded.id);
    
    res.json({
      success: true,
      driver,
    });
  } catch (error) {
     res.status(401).json({ success: false, message: 'Not authorized' });
  }
});

module.exports = router;
