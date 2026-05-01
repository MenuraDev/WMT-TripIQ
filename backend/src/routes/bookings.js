const express = require('express');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings (Create Booking)
router.post('/', protect, async (req, res) => {
  try {
    const {
      numberOfDays,
      startDate,
      numberOfPeople,
      selectedAreas,
      comboName,
      pricePerPersonPerDay,
      totalPrice
    } = req.body;

    if (!numberOfDays || !startDate || !numberOfPeople || !selectedAreas || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      numberOfDays,
      startDate,
      numberOfPeople,
      selectedAreas,
      comboName: comboName || null,
      pricePerPersonPerDay,
      totalPrice,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create booking' });
  }
});

// PUT /api/bookings/:id (Update Booking)
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/bookings/:id (Hard Delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/bookings/:id/cancel (Keep for backward compatibility)
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;