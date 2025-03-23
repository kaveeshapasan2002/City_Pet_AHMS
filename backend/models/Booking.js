// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet' // Reference to your pet model if you have one
  },
  boardingType: {
    type: String,
    enum: ['standard', 'deluxe', 'premium'],
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  additionalServices: {
    type: String,
    enum: ['', 'grooming', 'relaxation', 'exercise']
  },
  specialNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);