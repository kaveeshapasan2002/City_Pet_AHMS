const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = asyncHandler(async (req, res) => {
  const { boardingType, checkIn, checkOut, specialNotes, additionalServices, userName, userEmail } = req.body;

  // Validate required fields
  if (!boardingType || !checkIn || !checkOut) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create booking
  const booking = await Booking.create({
    boardingType,
    checkIn,
    checkOut,
    specialNotes,
    additionalServices,
    status: 'pending'
  });

  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(400);
    throw new Error('Invalid booking data');
  }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public (in a real app, this would typically be protected)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({});
  res.status(200).json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Public
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  res.status(200).json(booking);
});

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById
};