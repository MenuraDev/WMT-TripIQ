const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getDriverBookings, 
  getTravelerBookings, 
  updateBookingStatus,
  cancelBooking 
} = require('../controllers/bookingController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Traveler routes
router.post('/', requireRole('traveler'), createBooking);
router.get('/my-bookings', requireRole('traveler'), getTravelerBookings);
router.put('/:id/cancel', requireRole('traveler'), cancelBooking);

// Driver routes
router.get('/requests', requireRole('driver'), getDriverBookings);
router.put('/:id/status', requireRole('driver'), updateBookingStatus);

module.exports = router;
