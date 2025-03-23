// routes/boarding.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/boarding/book - Create a new booking
router.post('/book', authMiddleware, async (req, res) => {
  try {
    // Make sure user is a pet owner
    if (req.user.role !== 'Pet Owner') {
      return res.status(403).json({ message: 'Only pet owners can create bookings' });
    }
    
    // Get user ID from JWT token (provided by your auth middleware)
    const userId = req.user.id;
    
    // Get booking data from request body
    const { 
      petId, // ID of the pet from your animal records
      boardingType, 
      checkIn, 
      checkOut, 
      additionalServices, 
      specialNotes 
    } = req.body;
    
    // Validate required fields
    if (!boardingType || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create new booking
    const booking = new Booking({
      owner: userId,
      pet: petId, // Link to pet if you have pet records
      boardingType,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      additionalServices: additionalServices || '',
      specialNotes: specialNotes || '',
      status: 'pending' // Initial status
    });
    
    await booking.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully',
      booking
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/boarding/bookings - Get user's bookings
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    // Make sure user is a pet owner
    if (req.user.role !== 'Pet Owner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Find all bookings for this user
    const bookings = await Booking.find({ owner: req.user.id })
      .sort({ createdAt: -1 }); // Newest first
    
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;