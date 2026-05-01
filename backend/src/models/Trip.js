const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    },
    description: {
      type: String,
      required: true,
    },
    startDate: Date,
    endDate: Date,
    maxPeople: {
      type: Number,
      default: 20,
    },
    status: {
      type: String,
      enum: ['available', 'full', 'cancelled'],
      default: 'available',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
