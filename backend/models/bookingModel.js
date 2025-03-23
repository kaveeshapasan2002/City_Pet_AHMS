const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    boardingType: {
      type: String,
      required: [true, 'Please select a boarding type'],
      enum: ['standard', 'deluxe', 'premium']
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide a check-in date']
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide a check-out date']
    },
    specialNotes: {
      type: String,
      default: ''
    },
    additionalServices: {
      type: String,
      enum: ['', 'grooming', 'relaxation', 'exercise']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Validate that check-out date is after check-in date
bookingSchema.pre('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    const error = new Error('Check-out date must be after check-in date');
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);