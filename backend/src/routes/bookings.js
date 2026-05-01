const express = require('express');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('tripId')
      .sort({ createdAt: -1 });

    // Map to include trip details
    const formatted = bookings.map((b) => ({
      ...b.toObject(),
      trip: b.tripId,
    }));

    res.json({ success: true, bookings: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/bookings
router.post('/', protect, async (req, res) => {
  try {
    const { tripId, numberOfTravelers = 1, specialRequests } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Trip is not available' });
    }

    const totalPrice = trip.price * numberOfTravelers;

    const booking = await Booking.create({
      userId: req.user._id,
      tripId,
      totalPrice,
      numberOfTravelers,
      specialRequests,
      status: 'pending',
    });

    const populated = await booking.populate('tripId');

    res.status(201).json({
      success: true,
      booking: { ...populated.toObject(), trip: populated.tripId },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

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
