// routes/boardingRoutes.js
const express = require('express');
const router = express.Router();
const Boarding = require('../models/Boarding');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   POST /api/boarding
// @desc    Create a new boarding booking
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { petName, boardingType, checkInDate, checkOutDate, additionalServices, specialNotes } = req.body;
    
    // Calculate price based on boarding type and duration
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Base prices per day
    const pricePerDay = {
      'Standard': 30,
      'Deluxe': 50,
      'Premium': 80
    };
    
    // Additional services prices
    const servicesPrices = {
      'Grooming': 40,
      'Training': 50,
      'Special Diet': 20,
      'Health Check': 35,
      'Playtime': 15
    };
    
    // Calculate total price
    let totalPrice = pricePerDay[boardingType] * days;
    
    // Add price for additional services if selected
    if (additionalServices && servicesPrices[additionalServices]) {
      totalPrice += servicesPrices[additionalServices];
    }
    
    const newBooking = new Boarding({
      user: req.user.id,
      petName,
      boardingType,
      checkInDate,
      checkOutDate,
      additionalServices,
      specialNotes,
      totalPrice
    });
    
    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/boarding
// @desc    Get all boarding bookings for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const bookings = await Boarding.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/boarding/:id
// @desc    Get boarding booking by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const booking = await Boarding.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the logged in user
    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/boarding/:id
// @desc    Update boarding booking
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const booking = await Boarding.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the logged in user
    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Only allow updates if booking is still pending
    if (booking.status !== 'Pending' && req.user.role !== 'Admin') {
      return res.status(400).json({ message: 'Cannot update confirmed bookings' });
    }
    
    const updatedBooking = await Boarding.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/boarding/:id
// @desc    Cancel boarding booking
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Boarding.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the logged in user
    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Only allow cancellation if booking is still pending
    if (booking.status !== 'Pending' && req.user.role !== 'Admin') {
      return res.status(400).json({ message: 'Cannot cancel confirmed bookings' });
    }
    
    booking.status = 'Cancelled';
    await booking.save();
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// In routes/boardingRoutes.js - Add this route

// @route   PUT /api/boarding/:id/status
// @desc    Update booking status (Admin only)
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      
      // Validate status
      const validStatuses = ['Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const booking = await Boarding.findById(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Only admins can change status (you can modify this based on your requirements)
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      booking.status = status;
      await booking.save();
      
      res.json({ message: `Booking status updated to ${status}`, booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });


// Add this to boardingRoutes.js

// @route   GET /api/admin/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/admin/bookings', async (req, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      // Get all bookings and populate with user information
      const bookings = await Boarding.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      
      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });






module.exports = router;