const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const { createNotification, createNotificationsForAdmins } = require('../utils/notifications');

// Traveler submits booking request
exports.createBooking = async (req, res) => {
  try {
    const { tripId, vehicleId } = req.body;
    
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (!vehicle.isAvailable) return res.status(400).json({ message: 'Vehicle is not available for booking' });

    const trip = await Trip.findOne({ _id: tripId, user: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (Number(vehicle.capacity) < Number(trip.passengers || 1)) {
      return res.status(400).json({ message: 'Vehicle capacity is too small for this trip' });
    }

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
      return res.status(400).json({ message: 'Trip has invalid booking dates' });
    }

    const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
    const totalAmount = Number(vehicle.pricePerDay || 0) * days;

    const existingBooking = await Booking.findOne({
      trip: tripId,
      traveler: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This trip already has an active vehicle booking request' });
    }

    const booking = await Booking.create({
      trip: tripId,
      vehicle: vehicleId,
      traveler: req.user.id,
      driver: vehicle.driver,
      startDate,
      endDate,
      totalAmount
    });

    trip.status = 'confirmed';
    await trip.save();

    await createNotification({
      recipient: vehicle.driver,
      title: 'New booking request',
      message: `${req.user.name || 'A traveler'} requested your ${vehicle.brand || vehicle.type || 'vehicle'} for ${trip.destinationArea || 'a trip'}.`,
      type: 'booking',
      priority: 'high',
      actionRoute: '/driver/home',
      relatedModel: 'Booking',
      relatedId: booking._id,
      metadata: { bookingStatus: booking.status, destinationArea: trip.destinationArea },
    });

    await createNotificationsForAdmins({
      title: 'Booking request created',
      message: `${req.user.name || 'A traveler'} requested a vehicle for ${trip.destinationArea || 'a trip'}.`,
      type: 'booking',
      actionRoute: '/admin/home',
      relatedModel: 'Booking',
      relatedId: booking._id,
      metadata: { traveler: req.user.id, driver: vehicle.driver },
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Driver gets their booking requests
exports.getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user.id })
      .populate('traveler', 'name avatar')
      .populate('trip')
      .populate('vehicle', 'brand model regNumber type')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Traveler gets their bookings
exports.getTravelerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ traveler: req.user.id })
      .populate('driver', 'name avatar')
      .populate('trip')
      .populate('vehicle')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Driver updates status (accept/reject)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted', 'rejected'
    const allowedStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findOne({ _id: req.params.id, driver: req.user.id })
      .populate('trip', 'destinationArea')
      .populate('vehicle', 'brand model type');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = status;
    await booking.save();

    if (status === 'accepted') {
      await Trip.findByIdAndUpdate(booking.trip._id || booking.trip, { status: 'confirmed' });
    }

    if (status === 'completed') {
      await Trip.findByIdAndUpdate(booking.trip._id || booking.trip, { status: 'completed' });
    }

    const statusMessages = {
      accepted: {
        title: 'Booking accepted',
        message: `${req.user.name || 'Your driver'} accepted your booking for ${booking.trip?.destinationArea || 'your trip'}.`,
        priority: 'high',
      },
      rejected: {
        title: 'Booking declined',
        message: `${req.user.name || 'The driver'} declined your booking for ${booking.trip?.destinationArea || 'your trip'}.`,
        priority: 'normal',
      },
      completed: {
        title: 'Trip completed',
        message: `${req.user.name || 'Your driver'} marked the trip to ${booking.trip?.destinationArea || 'your destination'} as completed.`,
        priority: 'normal',
      },
      cancelled: {
        title: 'Booking cancelled',
        message: `Your booking for ${booking.trip?.destinationArea || 'your trip'} was cancelled.`,
        priority: 'normal',
      },
    };

    const notificationCopy = statusMessages[status];
    if (notificationCopy) {
      await createNotification({
        recipient: booking.traveler,
        ...notificationCopy,
        type: 'booking',
        actionRoute: '/traveler/bookings',
        relatedModel: 'Booking',
        relatedId: booking._id,
        metadata: { bookingStatus: status },
      });
    }

    await createNotificationsForAdmins({
      title: 'Booking status updated',
      message: `${req.user.name || 'A driver'} marked a booking as ${status}.`,
      type: 'booking',
      actionRoute: '/admin/home',
      relatedModel: 'Booking',
      relatedId: booking._id,
      metadata: { bookingStatus: status, traveler: booking.traveler, driver: req.user.id },
    });
    
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Traveler deletes (removes) their own booking — only allowed before payment
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, traveler: req.user.id })
      .populate('trip', 'destinationArea')
      .populate('vehicle', 'brand model type');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Block deletion if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Paid bookings cannot be removed. Contact support for a refund.' });
    }

    // Clean up any associated unpaid/pending payments
    const Payment = require('../models/Payment');
    await Payment.deleteMany({ booking: booking._id, status: { $nin: ['paid'] } });

    // Reset trip status back to 'draft' so the traveler can re-book
    if (booking.trip) {
      const tripId = booking.trip._id || booking.trip;
      await Trip.findByIdAndUpdate(tripId, { status: 'draft' });
    }

    const tripName = booking.trip?.destinationArea || 'a trip';
    const driverId = booking.driver;

    // Delete the booking from the database
    await booking.deleteOne();

    // Notify the driver
    if (driverId) {
      await createNotification({
        recipient: driverId,
        title: 'Booking removed',
        message: `${req.user.name || 'A traveler'} removed their booking for ${tripName}.`,
        type: 'booking',
        priority: 'normal',
        actionRoute: '/driver/home',
        relatedModel: 'Booking',
        relatedId: req.params.id,
        metadata: { action: 'deleted' },
      });
    }

    // Notify admins
    await createNotificationsForAdmins({
      title: 'Booking deleted',
      message: `${req.user.name || 'A traveler'} deleted a booking for ${tripName}.`,
      type: 'booking',
      actionRoute: '/admin/home',
      relatedModel: 'Booking',
      relatedId: req.params.id,
      metadata: { traveler: req.user.id, driver: driverId, action: 'deleted' },
    });

    res.status(200).json({ success: true, message: 'Booking removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
