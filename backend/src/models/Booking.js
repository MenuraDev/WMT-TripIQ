const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Old fields (optional for backward compatibility)
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: false,
    },
    numberOfTravelers: {
      type: Number,
      required: false,
      default: 1,
    },

    // New fields for Book Trip feature
    numberOfDays: {
      type: Number,
      required: false,
    },
    startDate: {
      type: String,
      required: false,
    },
    numberOfPeople: {
      type: Number,
      required: false,
    },
    selectedAreas: {
      type: [String],
      required: false,
    },
    comboName: {
      type: String,
      required: false,
    },
    pricePerPersonPerDay: {
      type: Number,
      required: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);