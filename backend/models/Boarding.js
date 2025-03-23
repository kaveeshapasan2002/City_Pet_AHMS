// models/Boarding.js
const mongoose = require('mongoose');

const boardingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    },
    petName: {
      type: String,
      required: true
    },
    boardingType: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Premium'],
      required: true
    },
    checkInDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      required: true
    },
    additionalServices: {
      type: String
    },
    specialNotes: {
      type: String
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'],
      default: 'Pending'
    },
    totalPrice: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Boarding', boardingSchema);